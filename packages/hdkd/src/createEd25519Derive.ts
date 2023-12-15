import {
  createKeySet,
  ed25519,
  deriveEd25519,
} from "@polkadot-labs/hdkd-helpers"

import type { DeriveFn } from "./types"

export const createEd25519Derive: DeriveFn = (seed) =>
  createKeySet({
    seed,
    curve: ed25519,
    derive: deriveEd25519,
  }).derive
