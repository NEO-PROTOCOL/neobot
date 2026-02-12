/**
 * NEO IPFS Status - Configuration
 */

export const IPFS_CONFIG = {
  api: {
    host: '127.0.0.1',
    port: 5001,
    protocol: 'http'
  },
  
  gateway: {
    host: '127.0.0.1',
    port: 8080,
    protocol: 'http'
  },
  
  timeout: 5000 // ms
}

export const IPFS_API_URL = `${IPFS_CONFIG.api.protocol}://${IPFS_CONFIG.api.host}:${IPFS_CONFIG.api.port}`

export const IPFS_GATEWAY_URL = `${IPFS_CONFIG.gateway.protocol}://${IPFS_CONFIG.gateway.host}:${IPFS_CONFIG.gateway.port}`
