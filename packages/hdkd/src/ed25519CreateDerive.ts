import {
  createDerive,
  ed25519,
  ed25519Derive,
} from "@polkadot-labs/hdkd-helpers"
import type { CreateDeriveFn } from "./types"

export const ed25519CreateDerive: CreateDeriveFn = (seed) =>
  createDerive({
    seed,
    curve: ed25519,
    derive: ed25519Derive,
  })
