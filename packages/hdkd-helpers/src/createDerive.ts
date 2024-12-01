import { createChainCode } from "./createChainCode"
import { DeriveKeyPairFn } from "./internal/types"
import { parseDerivations } from "./parseDerivations"
import type { Curve, DeriveFn, Hex } from "./types"
import { ensureBytes } from "./utils"

type CreateDeriveOptions = {
  seed: Hex
  curve: Curve
  derive: DeriveKeyPairFn
}
export const createDerive =
  ({ seed, curve, derive }: CreateDeriveOptions): DeriveFn =>
  (path) =>
    derive(
      ensureBytes("seed", seed, 32),
      {
        getPublicKey: (privateKey) => curve.getPublicKey(privateKey),
        sign: (message, privateKey) => curve.sign(message, privateKey),
        verify: (signature, message, publicKey) =>
          curve.verify(signature, message, publicKey),
      },
      parseDerivations(path).map(([type, code]) => [
        type,
        createChainCode(code),
      ]),
    )
