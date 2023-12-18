import { ensureBytes } from "./utils"
import {
  sr25519_pubkey,
  sr25519_sign,
  sr25519_verify,
} from "@polkadot-labs/schnorrkel-wasm"

import { Curve } from "./types"

export const sr25519: Curve = {
  getPublicKey(privateKey) {
    return sr25519_pubkey(ensureBytes("privateKey", privateKey, 64))
  },
  sign(message, privateKey) {
    privateKey = ensureBytes("privateKey", privateKey, 64)
    return sr25519_sign(
      sr25519_pubkey(privateKey),
      privateKey,
      ensureBytes("message", message),
    )
  },
  verify(signature, message, publicKey) {
    return sr25519_verify(
      ensureBytes("publicKey", publicKey, 32),
      ensureBytes("message", message),
      ensureBytes("signature", signature, 64),
    )
  },
}
