import { ensureBytes } from "@noble/curves/abstract/utils"
import { createChainCode } from "./createChainCode"
import { parseDerivations } from "./parseDerivations"
import type { Curve, DeriveKeyPairFn, Hex, KeySet } from "./types"

type CreateKeySetOptions = {
  seed: Hex
  curve: Curve
  derive: DeriveKeyPairFn
}
export const createKeySet = ({
  seed,
  curve,
  derive,
}: CreateKeySetOptions): KeySet => ({
  derive(path) {
    return derive(
      ensureBytes("seed", seed, 32),
      curve,
      parseDerivations(path).map(([type, code]) => [
        type,
        createChainCode(code),
      ]),
    )
  },
})
