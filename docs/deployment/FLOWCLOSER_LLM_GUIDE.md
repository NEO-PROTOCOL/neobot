<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

# Flowcloser LLM Guide

```text
========================================
  LLM-NATIVE SUPPORT - NOT A BOT
========================================
```

────────────────────────────────────────
Philosophy
────────────────────────────────────────

**NOT:**

```text
✗ Pre-canned responses
✗ Option menus (1, 2, 3...)
✗ Automated FAQ
✗ Bot with fixed scripts
✗ "Please hold for transfer"
```

**IS:**

```text
✓ Natural LLM conversation
✓ Full context preserved
✓ Reasoning about real problems
✓ Direct action (API, DB, tools)
✓ Transparency about limitations
```

────────────────────────────────────────
Flowcloser Architecture
────────────────────────────────────────

```text
▓▓▓ LAYER 1: GATEWAY
────────────────────────────────────────
WhatsApp <─> Neobot Gateway
                │
                ├─> Message Queue
                ├─> Session Store
                └─> Context Manager

▓▓▓ LAYER 2: LLM AGENT
────────────────────────────────────────
Claude Opus 4.5 (200k context)
                │
                ├─> System Prompt
                ├─> User Message
                ├─> Session History
                ├─> Tool Schemas
                └─> Business Context

▓▓▓ LAYER 3: TOOLS/ACTIONS
────────────────────────────────────────
Skills (bash, Python, APIs)
                │
                ├─> Database queries
                ├─> External APIs
                ├─> File operations
                ├─> Payment gateways
                └─> Business logic

▓▓▓ LAYER 4: MEMORY
────────────────────────────────────────
Session Store + Ledger
                │
                ├─> Conversation history
                ├─> User preferences
                ├─> Transaction log
                └─> Audit trail
```

────────────────────────────────────────
System Prompt Design
────────────────────────────────────────

## Base Structure

```typescript
const systemPrompt = `
You are the support assistant for
${COMPANY_NAME}. Your role is to:

1. UNDERSTAND the customer's real problem
2. REASON about the best solution
3. EXECUTE actions when possible
4. BE TRANSPARENT about limitations

═══════════════════════════════════════
BUSINESS CONTEXT
═══════════════════════════════════════

Company: ${COMPANY_NAME}
Products: ${PRODUCTS}
Hours: ${BUSINESS_HOURS}
Policy: ${POLICIES}

═══════════════════════════════════════
AVAILABLE TOOLS
═══════════════════════════════════════

You have access to:
- check_order_status(order_id)
- create_ticket(title, description)
- schedule_callback(date, time)
- process_refund(order_id, reason)
- query_inventory(product_id)

Use these tools to SOLVE problems,
not just to "transfer".

═══════════════════════════════════════
COMMUNICATION STYLE
═══════════════════════════════════════

- Natural, not robotic
- Direct, no fluff
- Empathetic but efficient
- Use markdown when helpful
- Confirm critical actions

═══════════════════════════════════════
NEVER DO
═══════════════════════════════════════

✗ "Press 1 for..."
✗ "Please wait..."
✗ "I can't help with that"
✗ Pretend to be human
✗ Make impossible promises

═══════════════════════════════════════
ALWAYS DO
═══════════════════════════════════════

✓ Ask when unsure
✓ Explain what you're doing
✓ Confirm important actions
✓ Be transparent about being AI
✓ Escalate when necessary
`;
```

────────────────────────────────────────
Practical Implementation
────────────────────────────────────────

## 1. Agent Configuration

```typescript
// config/agents/customer-support.ts
export const customerSupportAgent = {
  id: "customer-support",
  name: "Customer Support Agent",
  
  model: {
    primary: "anthropic/claude-opus-4-5",
    temperature: 0.7, // Natural but focused
    maxTokens: 4096,
  },

  systemPrompt: loadPrompt(
    "customer-support.md"
  ),

  tools: [
    "check_order_status",
    "create_ticket",
    "schedule_callback",
    "process_refund",
    "query_inventory",
    "send_email",
  ],

  memory: {
    enabled: true,
    maxMessages: 50, // ~25 turns
    summarize: true,
  },

  channels: {
    whatsapp: {
      allowFrom: ["+55*"], // Brazil
      respondToMentions: true,
      ackReactions: true,
    },
  },
};
```

## 2. Tool Schema Example

```typescript
// src/tools/check-order-status.ts
export const checkOrderStatusTool = {
  name: "check_order_status",
  
  description: `
Check the status of a customer order.

Use when customer asks about:
- Where is my order?
- Has it shipped?
- When will it arrive?
- Track code?

Returns: status, location, ETA
  `,

  schema: {
    type: "object",
    properties: {
      order_id: {
        type: "string",
        description: "Order ID (e.g. #12345)",
      },
      customer_phone: {
        type: "string",
        description: "Phone for validation",
      },
    },
    required: ["order_id"],
  },

  async execute(params) {
    // 1. Validate order exists
    const order = await db.orders.findOne({
      id: params.order_id,
    });

    if (!order) {
      return {
        error: "Order not found",
        suggestion: "Double check order ID",
      };
    }

    // 2. Check authorization
    if (
      params.customer_phone &&
      order.phone !== params.customer_phone
    ) {
      return {
        error: "Unauthorized",
        message: "Order belongs to another customer",
      };
    }

    // 3. Get shipping info
    const tracking = await shippingAPI.track(
      order.trackingCode
    );

    // 4. Return rich data
    return {
      order_id: order.id,
      status: order.status,
      items: order.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
      })),
      shipping: {
        carrier: tracking.carrier,
        status: tracking.status,
        location: tracking.location,
        eta: tracking.eta,
        trackingUrl: tracking.url,
      },
    };
  },
};
```

## 3. Conversation Flow

```text
▓▓▓ EXAMPLE: ORDER TRACKING
────────────────────────────────────────

[User]
Where's my order #12345?

[Assistant - Thinking]
1. User asking about order status
2. Have order ID (#12345)
3. Should use check_order_status tool
4. May need phone validation

[Assistant - Tool Call]
check_order_status({
  order_id: "#12345",
  customer_phone: "+5562983231110"
})

[Tool Result]
{
  "status": "in_transit",
  "shipping": {
    "carrier": "Correios",
    "status": "Out for delivery",
    "location": "CD Goiânia",
    "eta": "2026-01-31",
    "trackingUrl": "..."
  }
}

[Assistant - Response]
Your order #12345 is on the way!

**Status:** Out for delivery
**Location:** CD Goiânia
**ETA:** Tomorrow (01/31)

Tracking code:
https://rastreamento.correios.com.br/...

Can I help with anything else?
```

────────────────────────────────────────
Advanced Patterns
────────────────────────────────────────

## Multi-Step Workflows

```text
▓▓▓ SCENARIO: RETURN PROCESS
────────────────────────────────────────

Step 1: Validate order
  ├─> check_order_status(order_id)
  └─> Verify eligibility

Step 2: Gather info
  ├─> Ask return reason
  ├─> Ask if wants exchange/refund
  └─> Confirm shipping address

Step 3: Create return
  ├─> create_return_request(...)
  ├─> generate_return_label()
  └─> send_email(label_url)

Step 4: Confirm
  └─> "All set! Label sent..."
```

## Context Management

```typescript
// src/memory/context-manager.ts
export class ContextManager {
  async buildContext(
    sessionId: string,
    userMessage: string
  ) {
    // 1. Load session history
    const history = await this.getHistory(
      sessionId,
      { maxMessages: 50 }
    );

    // 2. Load user profile
    const profile = await this.getUserProfile(
      sessionId
    );

    // 3. Load business context
    const businessContext = {
      currentTime: new Date(),
      businessHours: this.isBusinessHours(),
      activePromotions: await this.getPromotions(),
      inventoryStatus: await this.getInventory(),
    };

    // 4. Combine everything
    return {
      history,
      profile,
      business: businessContext,
      current: {
        message: userMessage,
        timestamp: Date.now(),
      },
    };
  }

  private async getHistory(
    sessionId: string,
    opts: { maxMessages: number }
  ) {
    const messages = await db.messages
      .find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(opts.maxMessages)
      .toArray();

    // Summarize old messages if > threshold
    if (messages.length > 30) {
      const old = messages.slice(30);
      const summary = await this.summarize(old);
      return [
        { role: "system", content: summary },
        ...messages.slice(0, 30),
      ];
    }

    return messages;
  }
}
```

## Escalation Strategy

```typescript
// src/agents/escalation.ts
export class EscalationManager {
  shouldEscalate(context: ConversationContext) {
    return (
      // User explicitly asks for human
      context.userAskedForHuman ||
      // Stuck in loop (same issue 3x)
      this.detectLoop(context) ||
      // High-value customer + complex issue
      (context.customer.tier === "premium" &&
        context.issueComplexity > 8) ||
      // Legal/compliance sensitive
      this.isSensitiveTopic(context) ||
      // Tool failures
      context.consecutiveToolFailures > 2
    );
  }

  async escalate(
    sessionId: string,
    reason: string
  ) {
    // 1. Create support ticket
    const ticket = await createTicket({
      session: sessionId,
      reason,
      priority: "high",
      context: await this.exportContext(
        sessionId
      ),
    });

    // 2. Notify available agents
    await notifyAgents({
      ticketId: ticket.id,
      channel: "whatsapp",
    });

    // 3. Inform user
    return {
      message: `
I'll connect you with a human specialist.
Created ticket #${ticket.id} and an agent
will take over shortly.

Meanwhile, you can keep talking here
and I'll maintain the history.
      `,
    };
  }
}
```

────────────────────────────────────────
Configuration Example
────────────────────────────────────────

```json
// config/neobot.runtime.json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-opus-4-5",
        "fallback": "anthropic/claude-sonnet-4"
      },
      "memory": {
        "enabled": true,
        "provider": "session-memory",
        "maxTokens": 100000
      }
    },
    "customer-support": {
      "enabled": true,
      "channels": ["whatsapp"],
      "systemPrompt": "./prompts/customer-support.md",
      "tools": [
        "check_order_status",
        "create_ticket",
        "schedule_callback"
      ],
      "autoReply": {
        "enabled": true,
        "allowFrom": ["+55*"],
        "businessHoursOnly": false
      },
      "escalation": {
        "enabled": true,
        "maxConsecutiveFailures": 3,
        "sensitiveTopics": [
          "legal",
          "compliance",
          "refund > R$500"
        ]
      }
    }
  },
  "channels": {
    "whatsapp": {
      "allowFrom": ["+5562*"],
      "respondToMentions": true,
      "ackReactions": true,
      "typingIndicator": true
    }
  }
}
```

────────────────────────────────────────
Testing Strategy
────────────────────────────────────────

## 1. Unit Tests (Tools)

```typescript
// test/tools/check-order-status.test.ts
describe("check_order_status", () => {
  it("returns order info for valid ID", async () => {
    const result = await checkOrderStatusTool.execute({
      order_id: "#12345",
    });

    expect(result.status).toBe("in_transit");
    expect(result.shipping.carrier).toBeDefined();
  });

  it("handles non-existent order", async () => {
    const result = await checkOrderStatusTool.execute({
      order_id: "#99999",
    });

    expect(result.error).toBe("Order not found");
  });
});
```

## 2. Integration Tests (E2E)

```typescript
// test/e2e/customer-support.test.ts
describe("Customer Support Flow", () => {
  it("handles order tracking", async () => {
    // 1. Send user message
    const response = await sendMessage({
      from: "+5562983231110",
      body: "Where's my order #12345?",
    });

    // 2. Wait for agent response
    await waitForReply(5000);

    // 3. Verify tool was called
    expect(mockCheckOrderStatus).toHaveBeenCalledWith({
      order_id: "#12345",
      customer_phone: "+5562983231110",
    });

    // 4. Verify response quality
    const reply = await getLastMessage();
    expect(reply).toContain("Status:");
    expect(reply).toContain("ETA:");
  });
});
```

## 3. Manual Test Script

```text
▓▓▓ MANUAL TEST CHECKLIST
────────────────────────────────────────

[ ] Happy Path: Order tracking
    └─> "Where's order #12345?"
    └─> Should return status + ETA

[ ] Error Handling: Invalid order
    └─> "Where's order #99999?"
    └─> Should explain not found

[ ] Tool Usage: Create ticket
    └─> "Product arrived broken"
    └─> Should create ticket + confirm

[ ] Escalation: Ask for human
    └─> "I want to talk to manager"
    └─> Should escalate gracefully

[ ] Multi-turn: Complex issue
    └─> Start with vague problem
    └─> Agent asks clarifying questions
    └─> Resolves after gathering info

[ ] Business Hours: After hours
    └─> Test outside business hours
    └─> Should mention next availability

[ ] Memory: Context retention
    └─> Reference earlier message
    └─> Should remember conversation
```

────────────────────────────────────────
Production Checklist
────────────────────────────────────────

```text
▓▓▓ PRE-DEPLOY
────────────────────────────────────────
[ ] System prompt reviewed
[ ] Tools tested individually
[ ] E2E tests passing
[ ] Escalation paths defined
[ ] Business hours configured
[ ] Allowlist configured
[ ] Monitoring setup
[ ] Backup humans available

▓▓▓ ROLLOUT
────────────────────────────────────────
[ ] Start with small test group
[ ] Monitor first 100 conversations
[ ] Collect feedback
[ ] Adjust prompts/tools
[ ] Gradually increase traffic

▓▓▓ MONITORING
────────────────────────────────────────
[ ] Response time < 3s
[ ] Tool success rate > 95%
[ ] Escalation rate < 20%
[ ] User satisfaction > 4/5
[ ] Zero data leaks
```

────────────────────────────────────────
Key Differentiators
────────────────────────────────────────

## vs Traditional Bots

```text
╔═══════════════════════════════════╗
║  TRADITIONAL BOT vs FLOWCLOSER    ║
╚═══════════════════════════════════╝

Traditional Bot:
✗ Menu: "Press 1, 2, 3..."
✗ Rigid: Can't handle variations
✗ Dumb: No reasoning
✗ Limited: Pre-programmed flows
✗ Frustrating: "Invalid option"

Flowcloser LLM:
✓ Natural: "Where's my order?"
✓ Flexible: Understands intent
✓ Smart: Reasons about problems
✓ Powerful: Uses tools dynamically
✓ Helpful: Actually resolves issues
```

## Benefits

```text
▓▓▓ FOR BUSINESS
────────────────────────────────────────
• Reduces human load (70-80%)
• 24/7 availability at no extra cost
• Scales infinitely
• Consistent service quality
• Structured data (ledger)

▓▓▓ FOR CUSTOMERS
────────────────────────────────────────
• Immediate response
• Real problem resolution
• No annoying menus
• Context memory
• Transparency about AI
```

────────────────────────────────────────
Next Steps
────────────────────────────────────────

```text
1. Define business context
   └─> Products, policies, FAQs

2. Design system prompt
   └─> Tone, capabilities, limitations

3. Implement tools
   └─> check_order, create_ticket, etc

4. Test thoroughly
   └─> Unit, E2E, manual

5. Deploy gradually
   └─> Small group → Full traffic

6. Monitor & iterate
   └─> Logs, metrics, feedback
```

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"LLM-native support is not about
 replacing humans. It's about letting
 them focus on what matters."

Code is law. Conversations are context.
────────────────────────────────────────
