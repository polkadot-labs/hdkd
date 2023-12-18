import { afterAll, beforeAll, expect, test } from "vitest"
import { sr25519_secret_from_seed } from "@polkadot-labs/schnorrkel-wasm"
import { bytesToHex } from "@noble/hashes/utils"

import { DEV_MINI_SECRET } from "../src/constants"
import { sr25519 } from "../src/sr25519"
import { ecdsa } from "../src/ecdsa"
import { ed25519 } from "../src/ed25519"
import { Curve, Hex } from "../src/types"
import { ensureBytes } from "../src/utils"

beforeAll(async () => {
  // FIXME: Needed for thread_rng
  // see https://docs.rs/getrandom#nodejs-es-module-support
  // @ts-expect-error
  globalThis.crypto = (await import("node:crypto")).webcrypto
})

afterAll(() => {
  // @ts-expect-error
  delete globalThis.crypto
})

// Test values from
//   subkey inspect --scheme ecdsa
//   subkey inspect --scheme ed25519
//   subkey inspect --scheme sr25519
test.each([
  [
    "ecdsa",
    DEV_MINI_SECRET,
    (miniSecret) => miniSecret,
    ecdsa,
    "035b26108e8b97479c547da4860d862dc08ab2c29ada449c74d5a9a58a6c46a8c4",
  ],
  [
    "ed25519",
    DEV_MINI_SECRET,
    (miniSecret) => miniSecret,
    ed25519,
    "345071da55e5dccefaaa440339415ef9f2663338a38f7da0df21be5ab4e055ef",
  ],
  [
    "sr25519",
    DEV_MINI_SECRET,
    (miniSecret) =>
      sr25519_secret_from_seed(ensureBytes("miniSecret", miniSecret)),
    sr25519,
    "46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a",
  ],
] as [
  curveName: string,
  miniSecret: Hex,
  getPrivateKey: (hex: Hex) => Hex,
  curve: Curve,
  expectedPublicKey: Hex,
][])(
  "%s.getPublicKey(...) from mini secret",
  (_, miniSecret, getPrivateKey, curve, expectedPublicKey) => {
    const privateKey = getPrivateKey(miniSecret)
    const publicKey = curve.getPublicKey(privateKey)

    expect(bytesToHex(publicKey)).toBe(expectedPublicKey)
  },
)
