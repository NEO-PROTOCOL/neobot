<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

========================================
DIRETRIZ: AUDITABLE SETTLEMENT (V2)
========================================
DESTINO: Nó FlowPay Core (Settlement Engine)
OFFICIAL: flowpaycore.com
ENS: flowpaycore.eth
WALLET: 0xb872d02b3b040c05925e186490e9564e32356129
TX: 0x99764ddf4b8c9a0b5eb41ed424a1518f695bf018afd5e896e3ddc5097f73da26
ASSUNTO: Ciclo de Finalidade e PoI
REFERÊNCIA: DIRE-FLOW-2026-002
========================================

O FlowPay é o motor de liquidação do
NΞØ. A liquidação não é apenas o envio
da transação, mas a prova irrevogável
de sua finalidade on-chain.

▓▓▓ ORDENS DE EXECUÇÃO
────────────────────────────────────────
└─ Blindagem de Perímetro:
└─ Uso obrigatório do NΞØ Tunnel.
└─ Handshake via TUNNEL_SECRET.
└─ Loop de Finalidade:
└─ A liquidação só termina após
a confirmação do bloco via RPC.
└─ Falhas de confirmação exigem
retry automático via Nexus.
└─ Proof of Integrity (PoI):
└─ Gerar prova de integridade
assinada pelo Neobot Audit.
└─ Ancorar o PoI no log local
vinculado ao ID mio-flowpay.
└─ Segregação de Soberania:
└─ FlowPay atua como Relayer Proxy.
└─ Chaves de Minting permanecem
isoladas na Smart Factory.

────────────────────────────────────────
O valor deve ser convertido em prova.
Imutabilidade é o ativo; o Neobot
é o auditor; a Nexus é o comando.
────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Arquiteto Core · NΞØ Protocol
neo@neoprotocol.space

"Código é lei. Expanda até que o
caos se torne protocolo."

Segurança por design.
Exploits não encontram refúgio aqui.
────────────────────────────────────────
