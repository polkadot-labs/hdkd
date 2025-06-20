import {
  createDerive,
  sr25519,
  sr25519Derive,
} from "@polkadot-labs/hdkd-helpers"
import type { CreateDeriveFn } from "./types"

export const sr25519CreateDerive: CreateDeriveFn = (seed) =>
  createDerive({
    seed,
    curve: sr25519,
    derive: sr25519Derive,
  })
