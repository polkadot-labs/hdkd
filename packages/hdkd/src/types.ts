import { Hex, KeyPair } from "@polkadot-labs/hdkd-helpers"

export type DeriveFn = (seed: Hex) => (path: string) => KeyPair
