import { blake2b } from "@noble/hashes/blake2.js"
import { hexToBytes, isBytes } from "@noble/hashes/utils.js"
import { Bytes, str, Tuple } from "scale-ts"
import type { DeriveKeyPairFn } from "./internal/types"
import type { Hex } from "./types"

export const blake2b256 = (msg: Hex) =>
  blake2b(ensureBytes("msg", msg), { dkLen: 32 })
export const blake2b512 = (msg: Hex) =>
  blake2b(ensureBytes("msg", msg), { dkLen: 64 })

/**
 * Adapted from: https://github.com/paulmillr/noble-curves/blob/a0ac59846ee76c52f7c18886f4963e1211345d48/src/utils.ts#L104 (MIT License)
 *
 * Takes hex string or Uint8Array, converts to Uint8Array.
 * Validates output length.
 * Will throw error for other types.
 * @param title descriptive title for an error e.g. 'secret key'
 * @param hex hex string or Uint8Array
 * @param expectedLength optional, will compare to result array's length
 * @returns
 */
export const ensureBytes = (
  title: string,
  hex: Hex,
  expectedLength?: number,
) => {
  let res: Uint8Array
  if (typeof hex === "string") {
    try {
      if (hex[1] === "x") hex = hex.slice(2)
      res = hexToBytes(hex)
    } catch (e) {
      throw new Error(`${title} must be hex string or Uint8Array, cause: ${e}`)
    }
  } else if (isBytes(hex)) {
    // Uint8Array.from() instead of hash.slice() because node.js Buffer
    // is instance of Uint8Array, and its slice() creates **mutable** copy
    res = Uint8Array.from(hex)
  } else {
    throw new Error(`${title} must be hex string or Uint8Array`)
  }
  const len = res.length
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(`${title} of length ${expectedLength} expected, got ${len}`)
  return res
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
