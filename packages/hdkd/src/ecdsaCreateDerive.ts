import { createDerive, ecdsa, ecdsaDerive } from "@polkadot-labs/hdkd-helpers"

import type { CreateDeriveFn } from "./types"

export const ecdsaCreateDerive: CreateDeriveFn = (seed) =>
  createDerive({
    seed,
    curve: ecdsa,
    derive: ecdsaDerive,
  })
