"""
NEØ Protocol — ASI1 Client
==========================
Python client for the ASI1 API (https://api.asi1.ai).

Provides both async (aiohttp) and sync (requests) interfaces.
Can be used standalone or as a bridge for uAgents-based workflows.

API is OpenAI-compatible: /v1/chat/completions

Usage:
    # Async
    from src.neo.asi1_client import call_asi1_async
    response = await call_asi1_async("Hello", api_key="sk_...")

    # Sync
    from src.neo.asi1_client import call_asi1_sync
    response = call_asi1_sync("Hello", api_key="sk_...")

    # CLI
    python src/neo/asi1_client.py "Your message here"

Models:
    asi1-mini     — fast, cost-effective (default)
    asi1-turbo    — balanced performance
    asi1-preview  — most capable, with reasoning field
"""

import os
import sys
import asyncio
from typing import Optional, Dict, Any

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

ASI1_BASE_URL = "https://api.asi1.ai"
ASI1_CHAT_ENDPOINT = "/v1/chat/completions"
ASI1_DEFAULT_MODEL = "asi1-mini"
ASI1_DEFAULT_TEMPERATURE = 0.7
ASI1_DEFAULT_MAX_TOKENS = 2000


def _get_api_key(api_key: Optional[str] = None) -> str:
    key = api_key or os.getenv("ASI1AI_API_KEY") or os.getenv("ASI1_API_KEY")
    if not key:
        raise ValueError(
            "ASI1 API key not found. Set ASI1AI_API_KEY in .env or pass api_key= parameter."
        )
    return key


# ---------------------------------------------------------------------------
# Async client (aiohttp)
# ---------------------------------------------------------------------------

async def call_asi1_async(
    message: str,
    api_key: Optional[str] = None,
    system: Optional[str] = None,
    model: str = ASI1_DEFAULT_MODEL,
    temperature: float = ASI1_DEFAULT_TEMPERATURE,
    max_tokens: int = ASI1_DEFAULT_MAX_TOKENS,
) -> Optional[Dict[str, Any]]:
    """
    Async call to ASI1 API.

    Returns:
        {
            "content": str,
            "reasoning": str | None,
            "model": str,
            "usage": { prompt_tokens, completion_tokens, total_tokens },
            "full_response": dict
        }
    """
    try:
        import aiohttp
    except ImportError:
        raise ImportError("aiohttp required for async calls: pip install aiohttp")

    key = _get_api_key(api_key)
    url = f"{ASI1_BASE_URL}{ASI1_CHAT_ENDPOINT}"

    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": message})

    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    choice = data.get("choices", [{}])[0]
                    msg = choice.get("message", {})
                    return {
                        "content": msg.get("content", ""),
                        "reasoning": msg.get("reasoning"),
                        "model": data.get("model", model),
                        "usage": data.get("usage", {}),
                        "full_response": data,
                    }
                else:
                    error = await resp.text()
                    print(f"[ASI1] Error {resp.status}: {error}", file=sys.stderr)
                    return None
    except Exception as e:
        print(f"[ASI1] Exception: {e}", file=sys.stderr)
        return None


# ---------------------------------------------------------------------------
# Sync client (urllib — zero extra deps)
# ---------------------------------------------------------------------------

def call_asi1_sync(
    message: str,
    api_key: Optional[str] = None,
    system: Optional[str] = None,
    model: str = ASI1_DEFAULT_MODEL,
    temperature: float = ASI1_DEFAULT_TEMPERATURE,
    max_tokens: int = ASI1_DEFAULT_MAX_TOKENS,
) -> Optional[Dict[str, Any]]:
    """
    Sync call to ASI1 API using only stdlib (urllib).
    No external dependencies required.
    """
    import json
    import urllib.request
    import urllib.error

    key = _get_api_key(api_key)
    url = f"{ASI1_BASE_URL}{ASI1_CHAT_ENDPOINT}"

    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": message})

    payload = json.dumps({
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            choice = data.get("choices", [{}])[0]
            msg = choice.get("message", {})
            return {
                "content": msg.get("content", ""),
                "reasoning": msg.get("reasoning"),
                "model": data.get("model", model),
                "usage": data.get("usage", {}),
                "full_response": data,
            }
    except urllib.error.HTTPError as e:
        print(f"[ASI1] HTTP Error {e.code}: {e.read().decode()}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"[ASI1] Exception: {e}", file=sys.stderr)
        return None


# ---------------------------------------------------------------------------
# uAgents helper (optional — requires uagents-core)
# ---------------------------------------------------------------------------

def create_chat_message(text: str, end_session: bool = False):
    """
    Helper to create uAgents ChatMessage from plain text.
    Only usable if uagents-core is installed.
    """
    try:
        from datetime import datetime
        from uuid import uuid4
        from uagents_core.contrib.protocols.chat import (
            ChatMessage, TextContent, EndSessionContent,
        )
        content = [TextContent(type="text", text=text)]
        if end_session:
            content.append(EndSessionContent(type="end-session"))
        return ChatMessage(
            timestamp=datetime.utcnow(),
            msg_id=uuid4(),
            content=content,
        )
    except ImportError:
        raise ImportError("uagents-core required: pip install uagents-core")


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()

    if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h"):
        print("""
NEØ ASI1 Client — CLI

Usage:
  python src/neo/asi1_client.py "<message>" [model] [system_prompt]

Examples:
  python src/neo/asi1_client.py "Explain the NEO Protocol"
  python src/neo/asi1_client.py "Qualifique este lead" asi1-mini "Você é um agente de vendas"
  python src/neo/asi1_client.py "Reason step by step" asi1-preview

Models: asi1-mini (default) | asi1-turbo | asi1-preview

Env: ASI1AI_API_KEY or ASI1_API_KEY
        """)
        sys.exit(0)

    user_message = sys.argv[1]
    model = sys.argv[2] if len(sys.argv) > 2 else ASI1_DEFAULT_MODEL
    system = sys.argv[3] if len(sys.argv) > 3 else None

    print(f"🧠 ASI1 [{model}]")
    print(f"📨 {user_message}\n")

    result = call_asi1_sync(user_message, system=system, model=model)

    if result:
        print("🤖 Response:")
        print(result["content"])
        if result.get("reasoning"):
            print(f"\n💭 Reasoning: {result['reasoning'][:200]}...")
        usage = result.get("usage", {})
        if usage:
            print(f"\n📊 Tokens: {usage.get('total_tokens', '?')} total")
    else:
        print("❌ No response from ASI1 API")
        sys.exit(1)
