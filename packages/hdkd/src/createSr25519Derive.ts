import {
  createDerive,
  sr25519,
  deriveSr25519,
} from "@polkadot-labs/hdkd-helpers"

import { CreateDeriveFn } from "./types"

export const createSr25519Derive: CreateDeriveFn = (seed) =>
  createDerive({
    seed,
    curve: sr25519,
    derive: deriveSr25519,
  })
