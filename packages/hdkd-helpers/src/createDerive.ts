import { ensureBytes } from "./utils"
import { createChainCode } from "./createChainCode"
import { parseDerivations } from "./parseDerivations"
import type { Curve, Hex, DeriveFn } from "./types"
import { DeriveKeyPairFn } from "./internal/types"

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
        getPublicKey: (privateKey) =>
          curve.getPublicKey(ensureBytes("privateKey", privateKey)),
        sign: (message, privateKey) =>
          curve.sign(
            ensureBytes("message", message),
            ensureBytes("privateKey", privateKey),
          ),
        verify: (signature, message, publicKey) =>
          curve.verify(
            ensureBytes("signature", signature),
            ensureBytes("message", message),
            ensureBytes("publicKey", publicKey),
          ),
      },
      parseDerivations(path).map(([type, code]) => [
        type,
        createChainCode(code),
      ]),
    )
