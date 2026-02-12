/**
 * Lighthouse IPFS Integration
 *
 * Pinning redundante para garantir persistência de skills no IPFS
 * Lighthouse é Web3 descentralizado e suporta pin by CID no plano gratuito
 *
 * API Docs: https://docs.lighthouse.storage/lighthouse-1/how-to/pin-cid
 */

/**
 * Pina um CID existente no Lighthouse
 *
 * @param cid - CID do conteúdo já publicado no IPFS
 * @param fileName - Nome opcional do arquivo
 * @returns true se pinado com sucesso, false caso contrário
 */
export async function pinToLighthouse(cid: string, fileName?: string): Promise<boolean> {
  const apiKey = process.env.LIGHTHOUSE_API_KEY;

  if (!apiKey) {
    console.warn("⚠️  Lighthouse API key not found. Skipping remote pin.");
    return false;
  }

  try {
    const body: Record<string, string> = { cid };
    if (fileName) {
      body.fileName = fileName;
    }

    const response = await fetch("https://api.lighthouse.storage/api/lighthouse/pin", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Lighthouse API error: ${response.status}`;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage += ` - ${JSON.stringify(errorJson)}`;
      } catch {
        errorMessage += ` - ${errorText}`;
      }

      // Não lança erro, apenas retorna false (graceful degradation)
      console.warn(`⚠️  ${errorMessage}`);
      return false;
    }

    const result = await response.json();

    // Lighthouse retorna { data: { cid: "...", ... } } ou similar
    if (result.data?.cid || result.cid || response.status === 200) {
      console.log(`✅ Lighthouse: CID ${cid} pinned successfully`);
      return true;
    }

    console.warn(`⚠️  Lighthouse: Unexpected response format`);
    return false;
  } catch (error: any) {
    console.warn(`⚠️  Lighthouse: Failed to pin CID ${cid}: ${error.message}`);
    return false;
  }
}

/**
 * Pina múltiplos CIDs no Lighthouse
 */
export async function pinMultipleToLighthouse(
  cids: string[],
  options?: { fileName?: (cid: string, index: number) => string },
): Promise<void> {
  if (cids.length === 0) {
    return;
  }

  console.log(`📌 Attempting to pin ${cids.length} CIDs to Lighthouse...`);

  const results = await Promise.allSettled(
    cids.map((cid, index) => {
      const fileName = options?.fileName ? options.fileName(cid, index) : undefined;
      return pinToLighthouse(cid, fileName);
    }),
  );

  const succeeded = results.filter((r) => r.status === "fulfilled" && r.value === true).length;
  const failed = results.filter((r) => r.status === "fulfilled" && r.value === false).length;
  const errors = results.filter((r) => r.status === "rejected").length;

  if (succeeded > 0) {
    console.log(`✅ Lighthouse: ${succeeded} CID(s) pinned successfully`);
  }

  if (failed > 0 || errors > 0) {
    console.warn(`⚠️  Lighthouse: ${failed + errors} failed`);
  }
}

/**
 * Verifica se Lighthouse está configurado
 */
export function isLighthouseConfigured(): boolean {
  return !!process.env.LIGHTHOUSE_API_KEY;
}

/**
 * Retorna URL do gateway Lighthouse para um CID
 */
export function getLighthouseGatewayUrl(cid: string): string {
  return `https://gateway.lighthouse.storage/ipfs/${cid}`;
}

/**
 * Retorna todos os gateways disponíveis para um CID
 */
export function getAllGatewayUrls(cid: string): Array<{ name: string; url: string }> {
  const gateways = [
    { name: "Local", url: `http://127.0.0.1:8080/ipfs/${cid}` },
    { name: "Public IPFS", url: `https://ipfs.io/ipfs/${cid}` },
    { name: "Lighthouse", url: getLighthouseGatewayUrl(cid) },
  ];

  // Adiciona Pinata gateway se configurado (mesmo que não funcione sem plano pago)
  if (process.env.PINATA_GATEWAY_URL) {
    gateways.push({
      name: "Pinata",
      url: `${process.env.PINATA_GATEWAY_URL}/ipfs/${cid}`,
    });
  }

  return gateways;
}

/**
 * Faz upload direto de arquivo para Lighthouse
 *
 * @param filePath - Caminho do arquivo para upload
 * @param options - Opções adicionais (name, etc)
 * @returns CID do arquivo ou null se falhar
 */
export async function uploadToLighthouse(
  filePath: string,
  options?: { name?: string },
): Promise<string | null> {
  const apiKey = process.env.LIGHTHOUSE_API_KEY;

  if (!apiKey) {
    console.warn("⚠️  Lighthouse API key not found. Skipping upload.");
    return null;
  }

  try {
    // Lighthouse usa FormData para upload de arquivos
    const FormData = (await import("form-data")).default;
    const formData = new FormData();
    const fs = await import("fs");

    formData.append("file", fs.createReadStream(filePath));

    if (options?.name) {
      formData.append("fileName", options.name);
    }

    const response = await fetch("https://api.lighthouse.storage/api/lighthouse/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
      body: formData as any,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Lighthouse upload error: ${response.status} - ${error}`);
    }

    const result = await response.json();

    // Lighthouse retorna { data: { Hash: "...", ... } } ou { Hash: "..." }
    const cid = result.data?.Hash || result.Hash || result.cid;

    if (cid) {
      console.log(`✅ Lighthouse: File uploaded successfully (CID: ${cid})`);
      return cid;
    }

    throw new Error("Lighthouse: No CID in response");
  } catch (error: any) {
    console.error(`❌ Lighthouse upload failed: ${error.message}`);
    return null;
  }
}
