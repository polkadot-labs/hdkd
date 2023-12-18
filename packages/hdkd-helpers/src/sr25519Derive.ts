import {
  sr25519_derive_keypair_hard,
  sr25519_derive_keypair_soft,
  sr25519_keypair_from_seed,
} from "@polkadot-labs/schnorrkel-wasm"
import { DeriveKeyPairFn } from "./types"

export const sr25519Derive: DeriveKeyPairFn = (seed, curve, derivations) => {
  const keypair = sr25519_keypair_from_seed(seed)
  const derivedKeypair = derivations.reduce((keypair, [type, chainCode]) => {
    const deriveFn =
      type === "hard"
        ? sr25519_derive_keypair_hard
        : sr25519_derive_keypair_soft
    return deriveFn(keypair, chainCode)
  }, keypair)
  const privateKey = derivedKeypair.slice(0, 64)
  return {
    publicKey: derivedKeypair.slice(64),
    sign(message) {
      return curve.sign(message, privateKey)
    },
  }
}
