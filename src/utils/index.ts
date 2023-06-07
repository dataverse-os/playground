import app from "../../output/app.json"
import { Model, Output } from "../types";

export function getAddressFromPkh(did: string) {
  return did.slice(did.lastIndexOf(":") + 1);
}

export function generateRandomString(length: number): string {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getNamespaceAndReferenceFromDID(did: string) {
  const res = did.match('did:pkh:([-a-z0-9]{3,8}):([-_a-zA-Z0-9]{1,32})');
  if (!res) {
    throw new Error('Not in pkhDID format');
  }
  return {
    namespace: res[1],
    reference: res[2],
  };
}

export function  getPostModelFromOutput() {
  return app.createDapp.streamIDs.find(
    (model) => model.name === `${app.createDapp.slug}_post`
  ) as Model;
}

export function getOutput(): Output {
  return app as Output;
}
