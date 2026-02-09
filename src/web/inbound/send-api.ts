import type { AnyMessageContent, WAPresence } from "@whiskeysockets/baileys";
import { recordChannelActivity } from "../../infra/channel-activity.js";
import { toWhatsappJid } from "../../utils.js";
import { normalizeJid } from "../../whatsapp/normalize.js";
import type { ActiveWebSendOptions } from "../active-listener.js";

async function sendMessageWithRetry(
  jid: string,
  content: AnyMessageContent,
  sock: {
    sendMessage: (jid: string, content: AnyMessageContent) => Promise<unknown>;
  },
  maxRetries = 3,
): Promise<unknown> {
  let lastErr: any;
  const normalizedJid = normalizeJid(jid);

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await sock.sendMessage(normalizedJid, content);
    } catch (err) {
      lastErr = err;
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastErr;
}

export function createWebSendApi(params: {
  sock: {
    sendMessage: (jid: string, content: AnyMessageContent) => Promise<unknown>;
    sendPresenceUpdate: (presence: WAPresence, jid?: string) => Promise<unknown>;
  };
  defaultAccountId: string;
}) {
  const { sock } = params;

  return {
    sendMessage: async (
      to: string,
      text: string,
      mediaBuffer?: Buffer,
      mediaType?: string,
      sendOptions?: ActiveWebSendOptions,
    ): Promise<{ messageId: string }> => {
      const jid = toWhatsappJid(to);
      let payload: AnyMessageContent;
      if (mediaBuffer && mediaType) {
        if (mediaType.startsWith("image/")) {
          payload = {
            image: mediaBuffer,
            caption: text || undefined,
            mimetype: mediaType,
          };
        } else if (mediaType.startsWith("audio/")) {
          payload = { audio: mediaBuffer, ptt: true, mimetype: mediaType };
        } else if (mediaType.startsWith("video/")) {
          const gifPlayback = sendOptions?.gifPlayback;
          payload = {
            video: mediaBuffer,
            caption: text || undefined,
            mimetype: mediaType,
            ...(gifPlayback ? { gifPlayback: true } : {}),
          };
        } else {
          payload = {
            document: mediaBuffer,
            fileName: "file",
            caption: text || undefined,
            mimetype: mediaType,
          };
        }
      } else {
        payload = { text };
      }

      const result = await sendMessageWithRetry(jid, payload, sock);

      const accountId = sendOptions?.accountId ?? params.defaultAccountId;
      recordChannelActivity({
        channel: "whatsapp",
        accountId,
        direction: "outbound",
      });
      const messageId =
        typeof result === "object" && result && "key" in result
          ? String((result as { key?: { id?: string } }).key?.id ?? "unknown")
          : "unknown";
      return { messageId };
    },
    sendPoll: async (
      to: string,
      poll: { question: string; options: string[]; maxSelections?: number },
    ): Promise<{ messageId: string }> => {
      const jid = toWhatsappJid(to);
      const result = await sendMessageWithRetry(
        jid,
        {
          poll: {
            name: poll.question,
            values: poll.options,
            selectableCount: poll.maxSelections ?? 1,
          },
        } as AnyMessageContent,
        sock,
      );
      recordChannelActivity({
        channel: "whatsapp",
        accountId: params.defaultAccountId,
        direction: "outbound",
      });
      const messageId =
        typeof result === "object" && result && "key" in result
          ? String((result as { key?: { id?: string } }).key?.id ?? "unknown")
          : "unknown";
      return { messageId };
    },
    sendReaction: async (
      chatJid: string,
      messageId: string,
      emoji: string,
      fromMe: boolean,
      participant?: string,
    ): Promise<void> => {
      const jid = toWhatsappJid(chatJid);
      await sendMessageWithRetry(
        jid,
        {
          react: {
            text: emoji,
            key: {
              remoteJid: normalizeJid(jid),
              id: messageId,
              fromMe,
              participant: participant ? normalizeJid(toWhatsappJid(participant)) : undefined,
            },
          },
        } as AnyMessageContent,
        sock,
      );
    },
    sendComposingTo: async (to: string): Promise<void> => {
      const jid = toWhatsappJid(to);
      await sock.sendPresenceUpdate("composing", normalizeJid(jid));
    },
  } as const;
}
