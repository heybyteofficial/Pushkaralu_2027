/**
 * Message schema for WhatsApp Cloud API compliant messages.
 * Maps 1:1 to WhatsApp interactive and standard message types.
 */

export const MESSAGE_TYPES = {
  TEXT: "text",
  BUTTONS: "buttons",
  LIST: "list",
  IMAGE: "image",
  LOCATION: "location",
  REQUEST_LOCATION: "request_location",
  REQUEST_IMAGE: "request_image",
};

export const REPLY_TYPES = {
  TEXT: "text",
  BUTTON_REPLY: "button_reply",
  LIST_REPLY: "list_reply",
  IMAGE: "image",
  LOCATION: "location",
  AUDIO: "audio",
};
