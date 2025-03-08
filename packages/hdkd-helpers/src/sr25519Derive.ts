import { randomBytes } from "@noble/hashes/utils"
import { HDKD, getPublicKey, secretFromSeed } from "micro-sr25519"
import type { DeriveKeyPairFn } from "./internal/types"

export const sr25519Derive: DeriveKeyPairFn = (seed, curve, derivations) => {
  const privateKey = derivations.reduce(
    (secretKey, [type, chainCode]) =>
      type === "hard"
        ? HDKD.secretHard(secretKey, chainCode)
        : HDKD.secretSoft(secretKey, chainCode, randomBytes),
    secretFromSeed(seed),
  )
  const publicKey = getPublicKey(privateKey)
  return {
    publicKey,
    sign(message) {
      return curve.sign(message, privateKey)
    },
  }
}
