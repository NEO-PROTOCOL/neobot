/**
 * @file config.ts
 * @description IPFS configuration
 */

export const IPFS_CONFIG = {
  api: {
    host: '127.0.0.1',
    port: 5001,
    protocol: 'http',
  },
  gateway: {
    host: '127.0.0.1',
    port: 8080,
    protocol: 'http',
  },
  node: {
    peerId: '12D3KooWBSy5SgGEgnSboE6Kqg3GaRe8aKF7YLqcJfHPaRLRXBSX',
    agent: 'kubo/v0.39.0',
    desktopUI: '3b52cab',
  },
};

export const IPFS_API_URL = `${IPFS_CONFIG.api.protocol}://${IPFS_CONFIG.api.host}:${IPFS_CONFIG.api.port}`;
export const IPFS_GATEWAY_URL = `${IPFS_CONFIG.gateway.protocol}://${IPFS_CONFIG.gateway.host}:${IPFS_CONFIG.gateway.port}`;
