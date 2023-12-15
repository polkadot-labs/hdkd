import { createKeySet, ecdsa, deriveEcdsa } from "@polkadot-labs/hdkd-helpers"

import type { DeriveFn } from "./types"

export const createEcdsaDerive: DeriveFn = (seed) =>
  createKeySet({
    seed,
    curve: ecdsa,
    derive: deriveEcdsa,
  }).derive
