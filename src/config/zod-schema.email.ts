import { z } from "zod";

export const ResendConfigSchema = z
  .object({
    apiKey: z.string().optional(),
    from: z.string().optional(),
  })
  .strict()
  .optional();

export const EmailConfigSchema = z
  .object({
    resend: z
      .object({
        apiKey: z.string().optional(),
        from: z.string().optional(),
        nodes: z.record(z.string(), z.string()).optional(),
        skills: z.record(z.string(), z.string()).optional(),
      })
      .strict()
      .optional(),
    gmail: z
      .object({
        account: z.string().optional(),
        from: z.string().optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .optional();
