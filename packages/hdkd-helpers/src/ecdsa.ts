import { secp256k1 } from "@noble/curves/secp256k1"
import type { Curve } from "./types"
import { blake2b256, ensureBytes } from "./utils"

export const ecdsa: Curve = {
  getPublicKey(privateKey) {
    return secp256k1.getPublicKey(ensureBytes("privateKey", privateKey))
  },
  sign(message, privateKey) {
    // See https://github.com/paritytech/substrate/blob/033d4e86cc7eff0066cd376b9375f815761d653c/primitives/core/src/ecdsa.rs#L326
    const recoverableSignature = secp256k1.sign(
      blake2b256(ensureBytes("message", message)),
      ensureBytes("privateKey", privateKey),
      { prehash: false, format: "recovered" },
    )
    const signature = new Uint8Array(recoverableSignature.length)
    signature.set(recoverableSignature.subarray(1, recoverableSignature.length))
    signature[recoverableSignature.length] = recoverableSignature[0]!
    return signature
  },
  verify(signature, message, publicKey) {
    signature = ensureBytes("signature", signature)
    const recoverableSignature = new Uint8Array(signature.length)
    recoverableSignature.set(signature.subarray(0, signature.length - 1), 1)
    recoverableSignature[0] = signature[recoverableSignature.length]!
    return secp256k1.verify(
      recoverableSignature,
      blake2b256(ensureBytes("message", message)),
      ensureBytes("publicKey", publicKey),
      { prehash: false, format: "recovered" },
    )
  },
}
