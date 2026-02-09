# 🚀 NΞØ Sovereign Dev Station: Google Cloud Setup

Este guia contém os passos exatos para configurar uma estação de desenvolvimento remota de alta performance no Google Cloud Platform (GCP). Isso resolve problemas de lentidão local, queda de bateria e limites de recursos do IDE.

## 📋 Pré-requisitos
*   Uma conta Google Cloud ativa com faturamento habilitado (usando seus créditos).
*   Acesso ao [Google Cloud Console](https://console.cloud.google.com/).

---

## 🛠️ Passo 1: Criar a Máquina Virtual (Super VM)

1.  Abra o **Cloud Shell** (ícone de terminal no topo direito do painel do GCP).
2.  Cole e execute o seguinte bloco de comandos para criar a VM:

```bash
# 1. Definir zona (us-east1-b é robusta e barata)
gcloud config set compute/zone us-east1-b

# 2. Criar a instância "neo-dev-station"
# Especificações: 4 vCPUs, 16GB RAM (e2-standard-4), Disco SSD 50GB
gcloud compute instances create neo-dev-station \
    --machine-type=e2-standard-4 \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=50GB \
    --boot-disk-type=pd-ssd \
    --tags=http-server,https-server,dev-station
```

*Custo estimado: ~$0.20/hora (ligada). Lembre-se de desligar quando não usar!*

---

## 🔗 Passo 2: Configurar Acesso SSH

Para conectar seu VS Code ou Cursor localmente à VM:

1.  **No seu terminal local (Mac):**
    ```bash
    # Se ainda não tiver chaves SSH, gere uma:
    ssh-keygen -t ed25519 -C "neo@neoprotocol" -f ~/.ssh/google_compute_engine
    ```

2.  **Instalar o Google Cloud SDK no Mac (se não tiver):**
    ```bash
    brew install --cask google-cloud-sdk
    ```

3.  **Gerar configuração SSH automática:**
    ```bash
    gcloud compute config-ssh
    ```
    *Isso adiciona a entrada `neo-dev-station.us-east1-b.project-id` no seu `~/.ssh/config`.*

---

## ⚙️ Passo 3: Preparar o Ambiente (Dentro da VM)

Conecte-se à VM e instale o Kit NΞØ:

1.  **Conectar:**
    ```bash
    gcloud compute ssh neo-dev-station
    ```

2.  **Rodar Script de Setup (Copie e cole tudo):**

```bash
# Atualizar sistema
sudo apt-get update && sudo apt-get upgrade -y

# Instalar Ferramentas Essenciais
sudo apt-get install -y git curl wget build-essential unzip tmux

# Instalar Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PNPM
sudo npm install -g pnpm

# Instalar Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# (Precisa relogar para Docker funcionar sem sudo, mas seguimos)

# Configurar Git (Ajuste com seus dados)
git config --global user.name "NΞØ Mellø"
git config --global user.email "neo@neoprotocol.space"

echo "✅ Ambiente Pronto! Node $(node -v), NPM $(npm -v), Docker $(docker --version)"
```

---

## 💻 Passo 4: Conectar o IDE (remote-ssh)

1.  No **VS Code** ou **Cursor**:
    *   Instale a extensão **"Remote - SSH"**.
2.  Abra a paleta de comandos (`Cmd + Shift + P`) e digite: `Remote-SSH: Connect to Host...`
3.  Selecione `neo-dev-station...` da lista.
4.  O IDE vai abrir uma janela nova rodando DIRETAMENTE na nuvem.
5.  Abra o terminal integrado (`Ctrl + '`) e clone seu repo:
    ```bash
    git clone https://github.com/moltbot/moltbot.git
    cd moltbot
    pnpm install
    ```

🚀 **Agora você tem poder ilimitado.** O build é instantâneo, a rede é Gigabit, e seu Mac fica frio.

---

## 🛑 Passo 5: Gerenciamento (Economize Créditos)

Para não queimar seus créditos à toa:

*   **Parar a VM (fim do dia):**
    ```bash
    gcloud compute instances stop neo-dev-station
    ```

*   **Reiniciar a VM (começo do dia):**
    ```bash
    gcloud compute instances start neo-dev-station
    ```

Use o aplicativo móvel "Google Cloud Console" para ligar/desligar a VM pelo celular!
