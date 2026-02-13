import requests
from config import ACCESS_TOKEN

BASE_URL = "https://graph.facebook.com/me"

def get_user_info():
    fields = [
        "id",
        "name",
        "first_name",
        "last_name",
        "email",
        "gender",
        "birthday",
        "age_range",
        "link",
        "locale",
        "timezone",
        "updated_time"
    ]
    url = f"{BASE_URL}?fields={','.join(fields)}&access_token={ACCESS_TOKEN}"
    return requests.get(url).json()

def run_scan():
    print("=== INFO DO USUÁRIO ===")
    user = get_user_info()
    for k, v in user.items():
        print(f"{k}: {v}")
        
def get_ad_accounts():
    url = f"https://graph.facebook.com/v22.0/me/adaccounts?access_token={ACCESS_TOKEN}"
    return requests.get(url).json()

def run_scan():
    print("=== CONTAS DE ANÚNCIOS ===")
    print(get_ad_accounts())
       

if __name__ == "__main__":
    if not ACCESS_TOKEN:
        print("❌ Token de acesso não encontrado. Defina no .env")
    else:
        run_scan()
