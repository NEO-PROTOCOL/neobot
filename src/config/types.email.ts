export type ResendConfig = {
  apiKey?: string;
  from?: string;
};

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  /** ID do nó disparador (ex: 'flowpay', 'neobot') para resolver a identidade de envio. */
  nodeId?: string;
  /** ID da skill disparadora (ex: 'flowpay:unlock') para resolver a identidade de envio. */
  skillId?: string;
}

export type EmailConfig = {
  /** Resend API configuration for sending emails. */
  resend?: ResendConfig & {
    /** Mapeamento de nodeId para endereços de envio (Ex: { "flowpay": "FlowPay <billing@...>" }) */
    nodes?: Record<string, string>;
    /** Mapeamento de skillId para endereços de envio (Ex: { "flowpay:unlock": "NEØ FlowPay <access@...>" }) */
    skills?: Record<string, string>;
  };
  /** Gmail configuration for sending emails. */
  gmail?: {
    account?: string;
    from?: string;
  };
};
