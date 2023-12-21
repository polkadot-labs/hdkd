import { ed25519 as ed25519_ } from "@noble/curves/ed25519"

import { Curve } from "./types"
import { ensureBytes } from "."

export const ed25519: Curve = {
  getPublicKey(privateKey) {
    return ed25519_.getPublicKey(ensureBytes("privateKey", privateKey))
  },
  sign(message, privateKey) {
    return ed25519_.sign(
      ensureBytes("message", message),
      ensureBytes("privateKey", privateKey),
    )
  },
  verify(signature, message, publicKey) {
    return ed25519_.verify(
      ensureBytes("signature", signature),
      ensureBytes("message", message),
      ensureBytes("privateKey", publicKey),
    )
  },
}
