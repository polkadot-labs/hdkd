import { createDerive, ecdsa, deriveEcdsa } from "@polkadot-labs/hdkd-helpers"

import type { CreateDeriveFn } from "./types"

export const createEcdsaDerive: CreateDeriveFn = (seed) =>
  createDerive({
    seed,
    curve: ecdsa,
    derive: deriveEcdsa,
  })
