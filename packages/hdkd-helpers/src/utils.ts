import { ensureBytes as ensureBytes_ } from "@noble/curves/abstract/utils"
import { blake2b } from "@noble/hashes/blake2b"
import { Bytes, Tuple, str } from "scale-ts"

import { DeriveKeyPairFn } from "./internal/types"
import { Hex } from "./types"

export const blake2b256 = (msg: Hex) => blake2b(msg, { dkLen: 32 })
export const blake2b512 = (msg: Hex) => blake2b(msg, { dkLen: 64 })

export const ensureBytes = (
  title: string,
  hex: Hex,
  expectedLength?: number,
) => {
  if (typeof hex === "string" && hex[1] === "x") hex = hex.slice(2)
  return ensureBytes_(title, hex, expectedLength)
}

const derivationCodec = /* @__PURE__ */ Tuple(str, Bytes(32), Bytes(32))
const createDeriveFn =
  (prefix: string) => (seed: Uint8Array, chainCode: Uint8Array) =>
    blake2b256(derivationCodec.enc([prefix, seed, chainCode]))

export const createDeriveKeyPairFn =
  (prefix: string): DeriveKeyPairFn =>
  (seed, curve, derivations) => {
    const derive = createDeriveFn(prefix)
    const privateKey = derivations.reduce((seed, [type, chainCode]) => {
      if (type === "soft") throw new Error("Soft derivations are not supported")
      return derive(seed, chainCode)
    }, seed)
    return {
      publicKey: curve.getPublicKey(privateKey),
      sign(message) {
        return curve.sign(message, privateKey)
      },
    }
  }
