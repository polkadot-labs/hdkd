import { secp256k1 } from "@noble/curves/secp256k1"
import type { Curve } from "./types"
import { blake2b256, ensureBytes } from "./utils"

export const ecdsa: Curve = {
  getPublicKey(privateKey) {
    return secp256k1.getPublicKey(ensureBytes("privateKey", privateKey))
  },
  sign(message, privateKey) {
    const signature = secp256k1.sign(
      blake2b256(ensureBytes("message", message)),
      ensureBytes("privateKey", privateKey),
    )
    const signedBytes = signature.toCompactRawBytes()
    const out = new Uint8Array(signedBytes.length + 1)
    out.set(signedBytes)
    out[signedBytes.length] = signature.recovery
    return out
  },
  verify(signature, message, publicKey) {
    return secp256k1.verify(
      secp256k1.Signature.fromCompact(
        ensureBytes("signature", signature).slice(0, 64),
      ),
      blake2b256(ensureBytes("message", message)),
      ensureBytes("publicKey", publicKey),
    )
  },
}
