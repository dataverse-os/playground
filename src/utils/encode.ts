import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { fromString as uint8ArrayfromString } from "uint8arrays/from-string";

/**
 * Encode an object to base64 string
 *
 * @param obj - the object to encode
 * @returns A base64 string
 *
 */
export function encode(obj: Record<string, any>) {
  return uint8ArrayToString(
    uint8ArrayfromString(JSON.stringify(obj)),
    "base64url"
  );
}

/**
 * Decode a base64 string to JSON object
 *
 * @param s - a base64 string
 * @returns An object
 *
 */
export function decode(s: string): Record<string, any> {
  return JSON.parse(
    uint8ArrayToString(uint8ArrayfromString(s, "base64url"))
  ) as Record<string, any>;
}
