import { getPublicKey, sign, verify } from "@scure/sr25519"
import { ensureBytes } from "./utils"

import type { Curve } from "./types"

export const sr25519: Curve = {
  getPublicKey(privateKey) {
    return getPublicKey(ensureBytes("privateKey", privateKey, 64))
  },
  sign(message, privateKey) {
    return sign(
      ensureBytes("privateKey", privateKey, 64),
      ensureBytes("message", message),
    )
  },
  verify(signature, message, publicKey) {
    return verify(
      ensureBytes("message", message),
      ensureBytes("signature", signature, 64),
      ensureBytes("publicKey", publicKey, 32),
    )
  },
}
