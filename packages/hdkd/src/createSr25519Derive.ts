import {
  createKeySet,
  sr25519,
  deriveSr25519,
} from "@polkadot-labs/hdkd-helpers"

import { DeriveFn } from "./types"

export const createSr25519Derive: DeriveFn = (seed) =>
  createKeySet({
    seed,
    curve: sr25519,
    derive: deriveSr25519,
  }).derive
