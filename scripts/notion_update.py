import json
import urllib.request
import os

token = os.environ.get("NOTION_TOKEN", "PLACEHOLDER")
db_id = os.environ.get("NOTION_DB_ID", "29fb6f21-b534-41c0-8a2a-88dbefedc498")

def notion_request(url, method="GET", data=None):
    headers = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    req = urllib.request.Request(url, headers=headers, method=method)
    if data:
        data = json.dumps(data).encode("utf-8")
    with urllib.request.urlopen(req, data=data) as f:
        return json.loads(f.read().decode("utf-8"))

def main():
    # Search for "FlowCloser Agent"
    query = {
        "filter": {
            "property": "Nome",
            "title": {"contains": "FlowCloser Agent"}
        }
    }
    res = notion_request(f"https://api.notion.com/v1/databases/{db_id}/query", "POST", query)
    
    summary = "[Fênix 2026-02-03] Dia histórico: Ativado o modo Fênix no Neo Agent Full. Migrado System Prompt v2.0. Conectado WhatsApp Soberano. Preparado deploy no Railway."
    
    if res["results"]:
        page_id = res["results"][0]["id"]
        update = {
            "properties": {
                "Status": {"select": {"name": "🟢 Ativo"}},
                "Descrição": {"rich_text": [{"text": {"content": summary}}]}
            }
        }
        notion_request(f"https://api.notion.com/v1/pages/{page_id}", "PATCH", update)
        print(f"✅ Notion: Projeto 'FlowCloser Agent' atualizado.")
    else:
        # Create it if not found
        create = {
            "parent": {"database_id": db_id},
            "properties": {
                "Nome": {"title": [{"text": {"content": "FlowCloser Agent (Fênix)"}}]},
                "Status": {"status": {"name": "🟢 Ativo"}},
                "Descrição": {"rich_text": [{"text": {"content": summary}}]}
            }
        }
        notion_request("https://api.notion.com/v1/pages", "POST", create)
        print("✅ Notion: Novo projeto 'FlowCloser Agent (Fênix)' criado.")

if __name__ == "__main__":
    main()
