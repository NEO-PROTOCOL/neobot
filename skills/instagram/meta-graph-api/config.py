import os
from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()

ACCESS_TOKEN = os.getenv("FB_ACCESS_TOKEN", "")
