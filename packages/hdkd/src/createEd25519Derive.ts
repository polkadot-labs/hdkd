import {
  createDerive,
  ed25519,
  deriveEd25519,
} from "@polkadot-labs/hdkd-helpers"

import type { CreateDeriveFn } from "./types"

export const createEd25519Derive: CreateDeriveFn = (seed) =>
  createDerive({
    seed,
    curve: ed25519,
    derive: deriveEd25519,
  })
