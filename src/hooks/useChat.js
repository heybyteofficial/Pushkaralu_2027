import { useCallback, useEffect, useRef, useState } from "react";
import { validateWhatsAppLimits } from "../chat-core/whatsappLimits";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const uid = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

const typingTime = (m) =>
  m.delayMs ??
  (m.type === "text" || m.type === "buttons"
    ? 350 + Math.min((m.text?.length || 20) * 5, 850)
    : 500);

/**
 * useChat hook: orchestrates real WhatsApp message queueing,
 * typing indicators, tick states (sending -> sent -> delivered -> read),
 * and error handling.
 */
export function useChat(transport) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  const queue = useRef(Promise.resolve());
  const started = useRef(false);

  const pushBot = useCallback(async (msgs = []) => {
    for (const m of msgs) {
      setTyping(true);
      await sleep(typingTime(m));
      if (process.env.NODE_ENV !== "production") {
        validateWhatsAppLimits(m);
      }
      setMessages((prev) => [
        ...prev,
        { id: uid(), from: "bot", at: Date.now(), msg: m },
      ]);
    }
    setTyping(false);
  }, []);

  useEffect(() => {
    if (started.current || !transport) return;
    started.current = true;
    queue.current = queue.current.then(async () => {
      const initialMsgs = await transport.start();
      await pushBot(initialMsgs);
    });
  }, [transport, pushBot]);

  const send = useCallback(
    (reply) => {
      const id = uid();
      const setStatus = (status) =>
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id && m.from === "user" ? { ...m, status } : m
          )
        );

      setMessages((prev) => [
        ...prev,
        { id, from: "user", at: Date.now(), reply, status: "sending" },
      ]);

      queue.current = queue.current.then(async () => {
        try {
          setError(null);
          // Realistic tick timeline: sending -> sent -> delivered -> read
          await sleep(150);
          setStatus("sent");
          await sleep(220);
          setStatus("delivered");

          const res = await transport.send(reply);
          setStatus("read");
          await pushBot(res);
        } catch (e) {
          setTyping(false);
          setError("Message delivery failed. Please check network connection.");
          console.error(e);
        }
      });
    },
    [transport, pushBot]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setTyping(false);
    setError(null);
    queue.current = queue.current.then(async () => {
      const initialMsgs = await transport.start();
      await pushBot(initialMsgs);
    });
  }, [transport, pushBot]);

  return { messages, typing, error, send, clearMessages };
}
