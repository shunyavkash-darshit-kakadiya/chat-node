import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

export default function generateCustomId(prefix) {
  return `${prefix}${nanoid()}`;
}
