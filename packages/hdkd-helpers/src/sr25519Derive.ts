import { HDKD, getPublicKey, secretFromSeed } from "micro-sr25519"
import { DeriveKeyPairFn } from "./internal/types"

export const sr25519Derive: DeriveKeyPairFn = (seed, curve, derivations) => {
  const privateKey = derivations.reduce((secretKey, [type, chainCode]) => {
    const deriveFn = type === "hard" ? HDKD.secretHard : HDKD.secretSoft
    return deriveFn(secretKey, chainCode)
  }, secretFromSeed(seed))
  const publicKey = getPublicKey(privateKey)
  return {
    publicKey,
    sign(message) {
      return curve.sign(message, privateKey)
    },
  }
}
