from typing import Tuple
import logging
from difflib import SequenceMatcher
from typing import List, TypeVar, Callable, Optional, Union
import random
import time
import json
from pathlib import Path
from urllib.parse import urlparse
from uuid import uuid4
import typer
from instagram.configs import Config
import re

import instagrapi
from instagrapi import Client
import instagrapi.config
from instagrapi.exceptions import (
    DirectThreadNotFound,
    ClientNotFoundError,
    PhotoNotUpload,
)
import instagrapi.image_util
from instagrapi.types import User, DirectThread, DirectMessage
from instagrapi.extractors import extract_direct_thread, extract_direct_message
from instagrapi.utils import dumps
from instagrapi.mixins.direct import SELECTED_FILTER, BOX

import requests
from requests.exceptions import (
    RequestException,
    Timeout,
    ConnectionError as RequestsConnectionError,
)
from PIL import Image, ImageOps

# Constantes de segurança e limites
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB
MAX_DOWNLOAD_RETRIES = 3
MAX_PAGINATION_ITERATIONS = 1000
VALID_MEDIA_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov"}


def download_media_by_url(
    url: str,
    filename: str = "",
    folder: Union[str, Path] = "",
    timeout: int = 30,
    media_type: str = "photo",
) -> Path:
    """
    Download media (photo/video) using URL with proper extension handling

    Parameters
    ----------
    url: str
        URL for the media
    filename: str, optional
        Base filename for the media (without extension)
    folder: Union[str, Path], optional
        Directory in which to download the media, default is current directory
    timeout: int, optional
        Request timeout in seconds, default is 30
    media_type: str, optional
        Type of media to download, either 'photo', 'image', or 'video'

    Returns
    -------
    Path
        Path to the downloaded file
    """
    # Validação de entrada
    if not url or not isinstance(url, str):
        raise ValueError("URL must be a non-empty string")
    
    url = str(url).strip()
    parsed_url = urlparse(url)
    
    # Validar esquema de URL
    if parsed_url.scheme not in ("http", "https"):
        raise ValueError(f"Invalid URL scheme: {parsed_url.scheme}. Only http/https allowed.")
    
    # Extrair filename com segurança
    path_parts = parsed_url.path.rstrip("/").split("/")
    original_filename = path_parts[-1] if path_parts and path_parts[-1] else "media"
    
    # Sanitizar filename para prevenir path traversal
    original_filename = "".join(c for c in original_filename if c.isprintable() and c not in "/\\")

    # Extract extension from original filename
    if "." in original_filename:
        _, ext = original_filename.rsplit(".", 1)
    else:
        ext = ""

    # Clean the extension and set default based on media type
    ext = ext.lower().split("?")[0].strip()  # Remove any query parameters
    
    # Validar extensão
    if ext and f".{ext}" not in VALID_MEDIA_EXTENSIONS:
        ext = ""
    
    if not ext:
        ext = "mp4" if media_type == "video" else "jpg"

    # Construir filename final com sanitização adicional
    if filename:
        # Sanitizar filename fornecido
        safe_filename = "".join(c for c in filename if c.isprintable() and c not in "/\\<>:\"|?*")
        final_filename = f"{safe_filename}.{ext}"
    else:
        final_filename = f"{original_filename}.{ext}" if not original_filename.endswith(f".{ext}") else original_filename

    # Garantir que folder é um Path object
    folder_path = Path(folder) if folder else Path.cwd()
    folder_path = folder_path.resolve()  # Resolver path absoluto para prevenir path traversal
    
    # Garantir que o folder existe
    try:
        folder_path.mkdir(parents=True, exist_ok=True)
    except (OSError, PermissionError) as e:
        raise ValueError(f"Cannot create or access folder: {folder_path}") from e

    # Path final - usar resolve() para garantir path absoluto e prevenir path traversal
    path = (folder_path / final_filename).resolve()

    # Verificação adicional: garantir que o path final está dentro do folder (prevenir path traversal)
    try:
        path.relative_to(folder_path.resolve())
    except ValueError as exc:
        raise ValueError("Invalid path: path traversal detected") from exc

    # Download com retry e validação de tamanho
    last_exception = None
    for attempt in range(MAX_DOWNLOAD_RETRIES):
        try:
            response = requests.get(url, stream=True, timeout=timeout)
            response.raise_for_status()
            
            # Validar Content-Length antes de baixar
            content_length = response.headers.get("Content-Length")
            if content_length:
                try:
                    size = int(content_length)
                    if size > MAX_FILE_SIZE:
                        raise ValueError(f"File too large: {size} bytes (max: {MAX_FILE_SIZE})")
                except ValueError:
                    pass  # Content-Length inválido, continuar com download
            
            # Download com verificação de tamanho em tempo real
            downloaded_size = 0
            if media_type == "video":
                with open(path, "wb") as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            downloaded_size += len(chunk)
                            if downloaded_size > MAX_FILE_SIZE:
                                path.unlink(missing_ok=True)  # Limpar arquivo parcial
                                raise ValueError(f"File too large: exceeded {MAX_FILE_SIZE} bytes")
                            f.write(chunk)
            else:
                # Para fotos, usar streaming iter_content
                with open(path, "wb") as f:
                    response.raw.decode_content = True
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            downloaded_size += len(chunk)
                            if downloaded_size > MAX_FILE_SIZE:
                                path.unlink(missing_ok=True)  # Limpar arquivo parcial
                                raise ValueError(
                                    f"File too large: exceeded {MAX_FILE_SIZE} bytes"
                                )
                            f.write(chunk)
            
            return path.resolve()
            
        except (Timeout, RequestsConnectionError) as e:
            last_exception = e
            if attempt < MAX_DOWNLOAD_RETRIES - 1:
                time.sleep(0.5 * (attempt + 1))  # Backoff exponencial
                continue
        except RequestException as e:
            path.unlink(missing_ok=True)  # Limpar arquivo parcial em caso de erro
            raise ValueError(f"Failed to download media: {e}") from e
        except Exception as e:
            path.unlink(missing_ok=True)  # Limpar arquivo parcial em caso de erro
            raise ValueError(f"Unexpected error during download: {e}") from e
    
    # Se chegou aqui, todos os retries falharam
    raise ValueError(f"Failed to download media after {MAX_DOWNLOAD_RETRIES} attempts: {last_exception}") from last_exception


def setup_logging(name: str):
    """
    Logging is the de-facto standard for debugging in this project.
    This is because you can't simply print to console when running terminal app lol.
    This function sets up logging for the file with the given name.
    """
    # Evitar duplicação: verificar se já existe handler antes de criar
    logger = logging.getLogger(name)
    
    # Se o logger já tem handlers, não adicionar novos
    if logger.handlers:
        return logger
    
    # Configurar formato uma vez
    formatter = logging.Formatter("%(levelname)s: %(message)s")

    # Criar file handler único
    try:
        file_handler = logging.FileHandler("debug.log", encoding="utf-8")
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    except (OSError, PermissionError) as e:
        # Se não conseguir criar arquivo de log, usar stderr como fallback
        import sys
        console_handler = logging.StreamHandler(sys.stderr)
        console_handler.setLevel(logging.DEBUG)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
        logger.warning(f"Could not create debug.log file: {e}. Using stderr instead.")

    logger.setLevel(logging.DEBUG)

    # Desabilitar loggers de dependências (mas preservar estrutura de logging)
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.CRITICAL)

    return logger


def user_info_by_username_private(
    client: Client, username: str, use_cache: bool = True
) -> User:
    """
    Get user object from username

    This is a modified version of the user_info_by_username method from the instagrapi library and only uses private API for faster results.

    Parameters
    ----------
    client: Client
        The instagrapi Client object
    username: str
        User name of an instagram account
    use_cache: bool, optional
        Whether or not to use information from cache, default value is True

    Returns
    -------
    User
        An object of User type
    """
    # Validação de entrada
    if not username or not isinstance(username, str):
        raise ValueError("Username must be a non-empty string")

    # Disable all other loggers (dependencies) so no http errors would be printed to console
    # This must be done again here to ensure all of them are actually disabled at the moment
    # See https://stackoverflow.com/a/36208664
    logging.getLogger().setLevel(logging.CRITICAL)

    username = str(username).strip().lower()
    if not username:
        raise ValueError("Username cannot be empty after normalization")
    
    # Verificar cache com segurança
    if use_cache and username in client._usernames_cache:
        user_pk = client._usernames_cache[username]
        if user_pk in client._users_cache:
            try:
                return client.user_info(user_pk)
            except (KeyError, AttributeError):
                # Cache corrompido, limpar e buscar novamente
                if username in client._usernames_cache:
                    del client._usernames_cache[username]
                if user_pk in client._users_cache:
                    del client._users_cache[user_pk]
    # Buscar usuário
    try:
        user = client.user_info_by_username_v1(username)
        if not user or not hasattr(user, 'pk') or not hasattr(user, 'username'):
            raise ValueError(f"Invalid user object returned for username: {username}")
        
        # Atualizar cache com segurança
        client._users_cache[user.pk] = user
        client._usernames_cache[user.username] = user.pk
        
        return user
    except Exception as e:
        raise ValueError(f"Failed to fetch user info for username '{username}': {e}") from e


def direct_threads_chunk(
    client: Client,
    amount: int = 20,
    selected_filter: SELECTED_FILTER = "",
    box: BOX = "",
    thread_message_limit: Optional[int] = None,
    cursor: str = None,
) -> Tuple[List[DirectThread], str]:
    """
    Get direct message threads

    Parameters
    ----------
    client: Client
        The instagrapi Client object used to fetch threads
    amount: int, optional
        Minimum number of media to return, default is 20
    selected_filter: str, optional
        Filter to apply to threads (flagged or unread)
    box: str, optional
        Box to gather threads from (primary or general) (business accounts only)
    thread_message_limit: int, optional
        Thread message limit, default is 10
    cursor: str, optional
        Cursor for pagination, default is None

    Returns
    -------
    List[DirectThread]
        A list of objects of DirectThread
    str
        New cursor for pagination
    """
    # Validação de entrada
    if amount < 0:
        raise ValueError("amount must be non-negative")
    
    threads = []
    iterations = 0
    
    while iterations < MAX_PAGINATION_ITERATIONS:
        try:
            threads_chunk, cursor = client.direct_threads_chunk(
                selected_filter, box, thread_message_limit, cursor
            )
            
            if not threads_chunk:
                # Não há mais threads para buscar
                break
            
            for thread in threads_chunk:
                threads.append(thread)

            # Condições de parada
            if not cursor or (amount and len(threads) >= amount):
                break
                
            iterations += 1
            
        except Exception as e:
            # Em caso de erro, retornar o que foi coletado até agora
            logger = logging.getLogger(__name__)
            logger.error(f"Error fetching threads chunk: {e}")
            break
    
    if iterations >= MAX_PAGINATION_ITERATIONS:
        logger = logging.getLogger(__name__)
        logger.warning(f"Pagination stopped after {MAX_PAGINATION_ITERATIONS} iterations")
    
    return (threads, cursor)


def direct_thread_chunk(
    client: Client, thread_id: int, amount: int = 20, cursor: str = None
) -> Tuple[DirectThread, str]:
    """
    Get a chunk of messages in a direct message thread along with the thread's metadata

    This is a modified version of the direct_thread method from the instagrapi library.

    Parameters
    ----------
    client: Client
        The instagrapi Client object used to fetch the thread
    thread_id: int
        Unique identifier of a Direct Message thread

    amount: int, optional
        Minimum number of media to return, default is 20

    cursor: str, optional
        Cursor for pagination, default is None

    Returns
    -------
    Tuple[DirectThread, str]
        A tuple containing the DirectThread object and the cursor for the next chunk of messages
    """
    if not client.user_id:
        raise ValueError("Login required")
    
    if amount < 0:
        raise ValueError("amount must be non-negative")
    
    if not isinstance(thread_id, int) or thread_id <= 0:
        raise ValueError(f"Invalid thread_id: {thread_id}")
    
    params = {
        "visual_message_return_type": "unseen",
        "direction": "older",
        "seq_id": "40065",  # 59663
        "limit": "20",
    }
    items = []
    iterations = 0
    
    while iterations < MAX_PAGINATION_ITERATIONS:
        if cursor:
            params["cursor"] = cursor
        
        try:
            result = client.private_request(
                f"direct_v2/threads/{thread_id}/", params=params
            )
        except ClientNotFoundError as e:
            raise DirectThreadNotFound(e, thread_id=thread_id, **client.last_json) from e
        except Exception as e:
            logger = logging.getLogger(__name__)
            logger.error(f"Error fetching thread chunk for thread_id {thread_id}: {e}")
            raise ValueError(f"Failed to fetch thread chunk: {e}") from e
        
        if "thread" not in result:
            raise ValueError("Invalid response format: missing 'thread' key")
        
        thread = result["thread"]
        
        # Validar estrutura do thread
        if not isinstance(thread, dict):
            raise ValueError(f"Invalid thread format: expected dict, got {type(thread)}")
        
        thread_items = thread.get("items", [])
        if not isinstance(thread_items, list):
            thread_items = []
        
        for item in thread_items:
            items.append(item)
        
        cursor = thread.get("oldest_cursor")
        
        # Condições de parada
        if (
            not cursor
            or not thread.get("has_older", False)
            or (amount and len(items) >= amount)
        ):
            break
        
        iterations += 1
    
    if iterations >= MAX_PAGINATION_ITERATIONS:
        logger = logging.getLogger(__name__)
        logger.warning(f"Pagination stopped after {MAX_PAGINATION_ITERATIONS} iterations")
    
    # We don't want to slice items here because it will break the pagination
    thread["items"] = items
    return (extract_direct_thread(thread), cursor)


def direct_send_media(
    client: Client,
    path: Path,
    user_ids: Optional[List[int]] = None,
    thread_ids: Optional[List[int]] = None,
    content_type: str = "photo",
) -> DirectMessage:
    """
    Send a direct media file of any aspect ratio to list of users or threads

    This is a modified version of the direct_send_file method from the instagrapi library.

    Parameters
    ----------
    client: Client
        The instagrapi Client object used to upload and send media
    path: Path
        Path to file that will be posted on the thread
    user_ids: List[int]
        List of unique identifier of Users id
    thread_ids: List[int]
        List of unique identifier of Direct Message thread id

    content_type: str, optional
        Type of content to send, either 'photo' or 'video', default is 'photo'

    Returns
    -------
    DirectMessage
        An object of DirectMessage
    """
    # Validação de entrada
    if not client.user_id:
        raise ValueError("Login required")
    
    # Normalizar listas vazias (corrigir bug de lista mutável como default)
    user_ids = user_ids if user_ids is not None else []
    thread_ids = thread_ids if thread_ids is not None else []
    
    # Validação: deve ter pelo menos um dos dois, mas não ambos
    if not user_ids and not thread_ids:
        raise ValueError("Must specify either user_ids or thread_ids")
    if user_ids and thread_ids:
        raise ValueError("Cannot specify both user_ids and thread_ids")
    
    # Validar content_type
    if content_type not in ("photo", "video"):
        raise ValueError(f"Invalid content_type: {content_type}. Must be 'photo' or 'video'")
    
    # Validar path
    path = Path(path)
    if not path.exists():
        raise ValueError(f"File does not exist: {path}")
    if not path.is_file():
        raise ValueError(f"Path is not a file: {path}")
    
    # Validar IDs
    try:
        user_ids = [int(uid) for uid in user_ids] if user_ids else []
        thread_ids = [int(tid) for tid in thread_ids] if thread_ids else []
    except (ValueError, TypeError) as e:
        raise ValueError(f"Invalid ID format: {e}") from e
    
    if user_ids and any(uid <= 0 for uid in user_ids):
        raise ValueError("All user_ids must be positive integers")
    if thread_ids and any(tid <= 0 for tid in thread_ids):
        raise ValueError("All thread_ids must be positive integers")
    
    method = f"configure_{content_type}"
    token = client.generate_mutation_token()
    nav_chains = [
        (
            "6xQ:direct_media_picker_photos_fragment:1,5rG:direct_thread:2,"
            "5ME:direct_quick_camera_fragment:3,5ME:direct_quick_camera_fragment:4,"
            "4ju:reel_composer_preview:5,5rG:direct_thread:6,5rG:direct_thread:7,"
            "6xQ:direct_media_picker_photos_fragment:8,5rG:direct_thread:9"
        ),
        (
            "1qT:feed_timeline:1,7Az:direct_inbox:2,7Az:direct_inbox:3,"
            "5rG:direct_thread:4,6xQ:direct_media_picker_photos_fragment:5,"
            "5rG:direct_thread:6,5rG:direct_thread:7,"
            "6xQ:direct_media_picker_photos_fragment:8,5rG:direct_thread:9"
        ),
    ]
    kwargs = {}
    data = {
        "action": "send_item",
        "is_shh_mode": "0",
        "send_attribution": "direct_thread",
        "client_context": token,
        "mutation_token": token,
        "nav_chain": random.choices(nav_chains),
        "offline_threading_id": token,
    }
    if content_type == "video":
        data["video_result"] = ""
        kwargs["to_direct"] = True
    if content_type == "photo":
        data["send_attribution"] = "inbox"
        data["allow_full_aspect_ratio"] = "true"
    if user_ids:
        data["recipient_users"] = dumps([[uid for uid in user_ids]])
    if thread_ids:
        data["thread_ids"] = dumps([tid for tid in thread_ids])
    
    upload_id = str(int(time.time() * 1000))
    
    try:
        match content_type:
            case "photo":
                upload_id = photo_rupload(client, path, upload_id)[0]
            case "video":
                upload_id = client.video_rupload(path, upload_id)[0]
    except Exception as e:
        raise ValueError(f"Failed to upload {content_type}: {e}") from e
    
    data["upload_id"] = upload_id
    
    try:
        result = client.private_request(
            f"direct_v2/threads/broadcast/{method}/",
            data=client.with_default_data(data),
            with_signature=False,
        )
        
        if "payload" not in result:
            raise ValueError("Invalid response format: missing 'payload' key")
        
        return extract_direct_message(result["payload"])
    except Exception as e:
        raise ValueError(f"Failed to send media: {e}") from e


def photo_rupload(
    client: Client,
    path: Path,
    upload_id: str = "",
    to_album: bool = False,
    for_story: bool = False,
) -> tuple:
    """
    Upload photo to Instagram

    Parameters
    ----------
    client: Client
        The instagrapi Client object used to perform the rupload
    path: Path
        Path to the media
    upload_id: str, optional
        Unique upload_id (String). When None, then generate automatically. Example from video.video_configure
    to_album: bool, optional
    for_story: bool, optional
        Useful for resize util only

    Returns
    -------
    tuple
        (Upload ID for the media, width, height)
    """
    # Validação de entrada
    if not isinstance(path, Path):
        raise TypeError(f"Path must be a Path object, got {type(path)}")
    
    if not path.exists():
        raise ValueError(f"File does not exist: {path}")
    
    if not path.is_file():
        raise ValueError(f"Path is not a file: {path}")
    
    # Validar tamanho do arquivo
    file_size = path.stat().st_size
    if file_size > MAX_FILE_SIZE:
        raise ValueError(f"File too large: {file_size} bytes (max: {MAX_FILE_SIZE})")
    
    if file_size == 0:
        raise ValueError(f"File is empty: {path}")
    
    valid_extensions = [".jpg", ".jpeg", ".png", ".webp"]
    if path.suffix.lower() not in valid_extensions:
        raise ValueError(
            "Invalid file format. Only JPG/JPEG/PNG/WEBP files are supported."
        )
    
    image_type = "image/jpeg"
    if path.suffix.lower() == ".png":
        image_type = "image/png"
    elif path.suffix.lower() == ".webp":
        image_type = "image/webp"

    upload_id = upload_id or str(int(time.time() * 1000))
    waterfall_id = str(uuid4())
    # upload_name example: '1576102477530_0_7823256191'
    upload_name = "{upload_id}_0_{rand}".format(
        upload_id=upload_id, rand=random.randint(1000000000, 9999999999)
    )
    # media_type: "2" when from video/igtv/album thumbnail, "1" - upload photo only
    rupload_params = {
        "retry_context": '{"num_step_auto_retry":0,"num_reupload":0,"num_step_manual_retry":0}',
        "media_type": "1",  # "2" if upload_id else "1",
        "xsharing_user_ids": "[]",
        "upload_id": upload_id,
        "image_compression": json.dumps(
            {"lib_name": "moz", "lib_version": "3.1.m", "quality": "80"}
        ),
    }
    if to_album:
        rupload_params["is_sidecar"] = "1"
    if for_story:
        photo_data, _ = instagrapi.image_util.prepare_image(
            str(path),
            max_side=1080,
            aspect_ratios=(9 / 16, 90 / 47),
            max_size=(1080, 1920),
        )  # Story must be 1080x1920
    else:
        photo_data, _ = instagrapi.image_util.prepare_image(
            str(path),
            max_size=(4096, 4096),  # TODO: Allow configurable max size
            aspect_ratios=None,  # Disable cropping
        )
    photo_len = str(len(photo_data))
    headers = {
        "Accept-Encoding": "gzip",
        "X-Instagram-Rupload-Params": json.dumps(rupload_params),
        "X_FB_PHOTO_WATERFALL_ID": waterfall_id,
        "X-Entity-Type": image_type,
        "Offset": "0",
        "X-Entity-Name": upload_name,
        "X-Entity-Length": photo_len,
        "Content-Type": "application/octet-stream",
        "Content-Length": photo_len,
    }
    response = client.private.post(
        "https://{domain}/rupload_igphoto/{name}".format(
            domain=instagrapi.config.API_DOMAIN, name=upload_name
        ),
        data=photo_data,
        headers=headers,
    )
    client.request_log(response)
    if response.status_code != 200:
        client.logger.error(
            "Photo Upload failed with the following response: %s", response
        )
        last_json = client.last_json  # local variable for read in sentry
        raise PhotoNotUpload(response.text, response=response, **last_json)
    
    # Abrir imagem com garantia de fechamento
    try:
        with Image.open(path) as im:
            width, height = im.size
    except Exception as e:
        raise ValueError(f"Failed to read image dimensions: {e}") from e
    
    return upload_id, width, height


T = TypeVar("T")


def fuzzy_match(
    query: str,
    items: List[Union[str, T]],
    n: int = 1,
    cutoff: float = 0.6,
    getter: Optional[Callable[[Union[str, T]], str]] = None,
    key: Callable[[str], str] = lambda x: x.lower(),
    use_partial_ratio: bool = False,
) -> Union[List[Tuple[Union[str, T], float]], Tuple[Union[str, T], float], None]:
    """
    Find the closest matching items using fuzzy string matching.
    This is an implementation of the fuzzywuzzy library without the dependency.
    Uses built-in SequenceMatcher to find similarity ratio between strings.

    Parameters:
    - query: String to match against
    - items: List of strings or objects to search through
    - n: Number of matches to return (if 1, returns single match or None)
    - cutoff: Minimum similarity ratio (0.0 to 1.0) required for matches
    - getter: Function to extract string from object (default: str)
    - key: Function to transform strings before comparison (default: lowercase)
    - use_partial_ratio: Use partial ratio instead of simple ratio (default: False)

    Returns:
    - If n=1: Tuple of (matched item, similarity ratio) or None if no match
    - If n>1: List of tuples (matched item, similarity ratio), sorted by ratio descending
    """
    if not items:
        return [] if n > 1 else None

    matcher = SequenceMatcher(None, key(query))
    matches = []

    for item in items:
        # Get string to match from item
        if getter is None:
            if isinstance(item, str):
                extracted = item
            else:
                extracted = str(item)
        else:
            extracted = getter(item)

        if use_partial_ratio:
            # Find the best matching substring
            s2 = key(extracted)
            matcher.set_seq2(s2)
            blocks = matcher.get_matching_blocks()
            ratios = []
            for _, j, size in blocks:
                if size == 0:
                    continue
                block = s2[j:j + size]
                m = SequenceMatcher(None, key(query), block)
                ratios.append(m.ratio())
            ratio = max(ratios) if ratios else 0
        else:
            matcher.set_seq2(key(extracted))
            ratio = matcher.ratio()

        if ratio >= cutoff:
            matches.append((item, ratio))

    matches.sort(key=lambda x: x[1], reverse=True)
    matches = matches[:n]

    return matches[0] if n == 1 and matches else matches if matches else None


def render_latex_online(latex_expr, output_path="latex_online.png", padding=None, timeout=30):
    """
    Render LaTeX expression and save as image online.
    More flexible and doesn't require LaTeX to be installed on your system.
    """
    # Validação de entrada
    if not latex_expr or not isinstance(latex_expr, str):
        raise ValueError("latex_expr must be a non-empty string")
    
    if not output_path or not isinstance(output_path, str):
        raise ValueError("output_path must be a non-empty string")
    
    # Usar urllib.parse.quote para encoding seguro (não apenas substituir espaços)
    from urllib.parse import quote as url_quote
    encoded_latex = url_quote(latex_expr, safe="")
    url = f"https://latex.codecogs.com/png.latex?\\dpi{{300}}\\bg_white {encoded_latex}"

    # Fetch image from API com timeout
    try:
        response = requests.get(url, timeout=timeout)
        response.raise_for_status()
    except Timeout as e:
        raise ValueError(f"Timeout while fetching LaTeX image: {e}") from e
    except RequestException as e:
        raise ValueError(f"Failed to fetch LaTeX image from API: {e}") from e
    
    # Validar Content-Type
    content_type = response.headers.get("Content-Type", "")
    if not content_type.startswith("image/"):
        raise ValueError(f"Invalid content type received: {content_type}")
    
    # Validar tamanho do conteúdo
    if len(response.content) > MAX_FILE_SIZE:
        raise ValueError(f"Image too large: {len(response.content)} bytes")
    
    # Escrever arquivo
    try:
        with open(output_path, "wb") as f:
            f.write(response.content)
    except (OSError, PermissionError) as e:
        raise ValueError(f"Failed to write output file: {e}") from e

    # Abrir imagem com garantia de fechamento e adicionar padding se necessário
    try:
        with Image.open(output_path) as img:
            if padding is not None:
                if not isinstance(padding, int) or padding < 0:
                    raise ValueError("padding must be a non-negative integer")
                img = ImageOps.expand(img, border=padding, fill="white")
            img.save(output_path)
    except Exception as e:
        # Limpar arquivo parcial em caso de erro
        Path(output_path).unlink(missing_ok=True)
        raise ValueError(f"Failed to process image: {e}") from e

    return output_path


def render_latex_local(latex_expr, output_path="latex_local.png", padding=None):
    """
    Render LaTeX expression and save as image locally.
    NOTE: THIS REQUIRES LATEX TO BE INSTALLED ON YOUR SYSTEM.
    """
    import matplotlib.pyplot as plt

    # Create figure
    fig, ax = plt.subplots(figsize=(4, 2), dpi=300)  # High DPI for better resolution
    ax.text(0.5, 0.5, f"${latex_expr}$", fontsize=20, ha="center", va="center")
    ax.axis("off")
    plt.savefig(output_path, bbox_inches="tight", pad_inches=0.1, dpi=300)

    return output_path


def list_all_scheduled_tasks(filepath: str = None) -> list[dict]:
    """
    List all scheduled tasks for the current user from the JSON file.
    """
    if filepath is None:
        username = Config().get("login.current_username")
        if not username:
            typer.echo(
                "You are not logged in. Please login first.\nSuggested action: `instagram auth login`"
            )
            return []
        filepath = Path(Config().get("advanced.users_dir")) / username / "tasks.json"

    filepath = Path(filepath)
    if not filepath.exists():
        return []

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            # Validar que é uma lista
            if not isinstance(data, list):
                logger = logging.getLogger(__name__)
                logger.warning(
                    "tasks.json contains invalid data (expected list, "
                    "got %s). Returning empty list.", type(data)
                )
                return []
            return data
    except json.JSONDecodeError as e:
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to parse tasks.json: {e}")
        raise ValueError(f"Invalid JSON in tasks file: {e}") from e
    except (OSError, PermissionError) as e:
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to read tasks file: {e}")
        raise ValueError(f"Cannot read tasks file: {e}") from e


def cancel_scheduled_task_by_index(index: int, filepath: str = None) -> str:
    """
    Cancel a scheduled task by index from the JSON file.
    NOTE: This does not need to involve the scheduler itself because
    on scheduler startup it will then load the new JSON tasks.
    """
    if filepath is None:
        username = Config().get("login.current_username")
        if not username:
            typer.echo(
                "You are not logged in. Please login first.\nSuggested action: `instagram auth login`"
            )
            return "You are not logged in. Please login first."
        filepath = Path(Config().get("advanced.users_dir")) / username / "tasks.json"

    filepath = Path(filepath)
    
    # Validar índice
    if not isinstance(index, int):
        raise TypeError(f"index must be an integer, got {type(index)}")
    
    try:
        tasks = list_all_scheduled_tasks(filepath)
    except ValueError as e:
        return f"Failed to load tasks: {e}"

    if index < 0 or index >= len(tasks):
        return "Invalid index. No task was cancelled."

    tasks.pop(index)

    # Escrever com atomicidade: escrever em arquivo temporário primeiro
    temp_filepath = filepath.with_suffix(filepath.suffix + ".tmp")
    try:
        with open(temp_filepath, "w", encoding="utf-8") as f:
            json.dump(tasks, f, indent=4)
        # Renomear atomicamente
        temp_filepath.replace(filepath)
    except (OSError, PermissionError) as e:
        # Limpar arquivo temporário em caso de erro
        temp_filepath.unlink(missing_ok=True)
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to write tasks file: {e}")
        raise ValueError(f"Cannot write tasks file: {e}") from e
    except Exception as e:
        temp_filepath.unlink(missing_ok=True)
        raise ValueError(f"Unexpected error writing tasks file: {e}") from e

    return f"Cancelled task at index {index}."


def extract_links_from_text(text: str) -> List[Tuple[str, str]]:
    """
    Extract URLs or links from a given text string.
    Extracts both complete URLs and partial ones
    e.g. corpolingo.co, www.linkedin.com, https://example.com

    Parameters:
    - text: The input text string to extract URLs from.

    Returns:
    - List of extracted URLs and their expanded versions.
    - Each URL is returned as a tuple (original_url, expanded_url).
    - If no URLs are found, returns an empty list.
    """
    # Source: https://stackoverflow.com/a/50790119
    # URL regex pattern (long regex split across multiple lines for readability)
    url_pattern = (
        r"\b((?:https?://)?(?:(?:www\.)?(?:[\da-z\.-]+)\.(?:[a-z]{2,6})|"
        r"(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}"
        r"(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|"
        r"(?:(?:[0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|"
        r"(?:[0-9a-fA-F]{1,4}:){1,7}:|"
        r"(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|"
        r"(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|"
        r"(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|"
        r"(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|"
        r"(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|"
        r"[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})|"
        r":(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|"
        r"fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|"
        r"::(?:ffff(?::0{1,4}){0,1}:){0,1}"
        r"(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}"
        r"(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])|"
        r"(?:[0-9a-fA-F]{1,4}:){1,4}:"
        r"(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}"
        r"(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))"
        r"(?::[0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|"
        r"65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])?"
        r"(?:/[\w\.-]*)*/?)\b"
    )
    regex = url_pattern

    matches = re.findall(regex, text)

    # Expand partial URLs to proper URLs
    res = []
    for orig_url in matches:
        expanded_url = orig_url
        if not orig_url.startswith("http://") and not orig_url.startswith("https://"):
            expanded_url = "https://" + orig_url
        res.append((orig_url, expanded_url))

    return res
