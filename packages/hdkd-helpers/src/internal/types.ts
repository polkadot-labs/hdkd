import { Curve, KeyPair } from ".."

export type DeriveKeyPairFn = (
  seed: Uint8Array,
  curve: Curve,
  derivations: [type: "hard" | "soft", chainCodes: Uint8Array][],
) => KeyPair
