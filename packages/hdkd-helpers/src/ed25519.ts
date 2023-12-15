import { ed25519 as ed25519_ } from "@noble/curves/ed25519"

import { Curve } from "./types"

export const ed25519: Curve = {
  getPublicKey(privateKey) {
    return ed25519_.getPublicKey(privateKey)
  },
  sign(message, privateKey) {
    return ed25519_.sign(message, privateKey)
  },
  verify(signature, message, publicKey) {
    return ed25519_.verify(signature, message, publicKey)
  },
}
