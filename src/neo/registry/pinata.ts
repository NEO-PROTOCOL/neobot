/**
 * Pinata IPFS Integration
 *
 * Pinning redundante para garantir persistência de skills no IPFS
 * Usa Pinata como backup remoto após publicação no nó local
 *
 * NOTA: Plano gratuito do Pinata não permite "pin by CID"
 * Solução: Upload direto do conteúdo (quando possível) ou usar Infura
 */

/**
 * Faz upload direto de arquivo para Pinata (plano gratuito)
 */
export async function uploadToPinata(
  filePath: string,
  options?: { name?: string },
): Promise<string | null> {
  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_API_KEY;

  if (!apiKey || !secretKey) {
    return null;
  }

  try {
    const FormData = (await import("form-data")).default;
    const formData = new FormData();
    const fs = await import("fs");

    formData.append("file", fs.createReadStream(filePath));

    if (options?.name) {
      formData.append(
        "pinataMetadata",
        JSON.stringify({
          name: options.name,
        }),
      );
    }

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretKey,
        ...formData.getHeaders(),
      },
      body: formData as unknown as BodyInit,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pinata upload error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    return result.IpfsHash; // CID retornado pelo Pinata
  } catch (error) {
    console.error(`❌ Failed to upload to Pinata: ${filePath}`, error);
    return null;
  }
}

/**
 * Tenta pinar um CID no Pinata (requer plano pago)
 * Se falhar, retorna false mas não lança erro
 */
export async function pinToPinata(cid: string): Promise<boolean> {
  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_API_KEY;

  if (!apiKey || !secretKey) {
    console.warn("⚠️  Pinata credentials not found. Skipping remote pin.");
    return false;
  }

  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinByHash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretKey,
      },
      body: JSON.stringify({
        hashToPin: cid,
        pinataOptions: {
          cidVersion: 1, // IPFS CID v1
        },
        pinataMetadata: {
          name: `NEO Skill: ${cid}`,
          keyvalues: {
            source: "neobot",
            type: "skill",
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Pinata API error: ${response.status}`;

      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.reason === "PAID_FEATURE_ONLY") {
          errorMessage = `Pinata: Pin by CID requires a paid plan. Your content is still pinned locally.`;
          console.warn(`⚠️  ${errorMessage}`);
          console.warn(`   Consider using Infura IPFS as backup instead, or upgrade Pinata plan.`);
          return false; // Não lança erro, apenas avisa
        }
        errorMessage += ` - ${errorText}`;
      } catch {
        errorMessage += ` - ${errorText}`;
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    const gatewayUrl = process.env.PINATA_GATEWAY_URL || "https://gateway.pinata.cloud";

    console.log(`✅ Pinned to Pinata: ${cid}`);
    console.log(`   Pinata ID: ${result.id}`);
    console.log(`   Gateway: ${gatewayUrl}/ipfs/${cid}`);
    return true;
  } catch (error: unknown) {
    // Se for erro de plano pago, apenas avisa
    if (error instanceof Error && error.message?.includes("PAID_FEATURE_ONLY")) {
      console.warn(`⚠️  Pinata: Pin by CID requires paid plan. Content pinned locally only.`);
      console.warn(`   Gateway Pinata não funcionará sem plano pago.`);
      console.warn(`   Use gateway local ou considere upgrade do Pinata.`);
      return false;
    }
    console.error(`❌ Failed to pin to Pinata: ${cid}`, error);
    return false;
  }
}

/**
 * Verifica se Pinata está configurado
 */
export function isPinataConfigured(): boolean {
  return !!(process.env.PINATA_API_KEY && process.env.PINATA_SECRET_API_KEY);
}

/**
 * Retorna URL do gateway Pinata para um CID
 */
export function getPinataGatewayUrl(cid: string): string | null {
  const gatewayUrl = process.env.PINATA_GATEWAY_URL;
  if (!gatewayUrl) {return null;}

  // Remove trailing slash se existir
  const baseUrl = gatewayUrl.replace(/\/$/, "");
  return `${baseUrl}/ipfs/${cid}`;
}

/**
 * Retorna todos os gateways disponíveis para um CID
 */
export function getAllGatewayUrls(cid: string): Array<{ name: string; url: string }> {
  const urls: Array<{ name: string; url: string }> = [];

  // Gateway local
  urls.push({
    name: "Local IPFS",
    url: `http://127.0.0.1:8080/ipfs/${cid}`,
  });

  // Gateway Pinata (se configurado)
  const pinataUrl = getPinataGatewayUrl(cid);
  if (pinataUrl) {
    urls.push({
      name: "Pinata Gateway",
      url: pinataUrl,
    });
  }

  // Gateway público IPFS
  urls.push({
    name: "Public IPFS",
    url: `https://ipfs.io/ipfs/${cid}`,
  });

  return urls;
}

/**
 * Pina múltiplos CIDs no Pinata
 */
export async function pinMultipleToPinata(cids: string[]): Promise<void> {
  if (!isPinataConfigured()) {
    console.warn("⚠️  Pinata not configured. Skipping remote pins.");
    return;
  }

  console.log(`📌 Attempting to pin ${cids.length} CIDs to Pinata...`);
  console.log(`   Note: Free plan may not support pin by CID. Content is pinned locally.`);

  const results = await Promise.allSettled(cids.map((cid) => pinToPinata(cid)));

  const succeeded = results.filter((r) => r.status === "fulfilled" &&  r.value).length;
  const failed = results.filter((r) => r.status === "fulfilled" && ! r.value).length;

  if (succeeded > 0) {
    console.log(`✅ Pinata: ${succeeded} pinned successfully`);
  }

  if (failed > 0) {
    console.log(`⚠️  Pinata: ${failed} failed (likely free plan limitation)`);
    console.log(`   Content is still accessible via local IPFS gateway.`);
  }
}
