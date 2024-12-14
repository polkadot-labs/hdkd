import type { Hex, KeyPair } from "@polkadot-labs/hdkd-helpers"

export type CreateDeriveFn = (seed: Hex) => (path: string) => KeyPair
