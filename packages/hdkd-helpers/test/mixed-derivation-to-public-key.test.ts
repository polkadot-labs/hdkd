import { afterAll, beforeAll, expect, test } from "vitest"
import {
  sr25519_derive_keypair_hard,
  sr25519_derive_keypair_soft,
  sr25519_keypair_from_seed,
} from "@polkadot-labs/schnorrkel-wasm"
import { bytesToHex } from "@noble/hashes/utils"

import { DEV_MINI_SECRET } from "../src/constants"
import { Hex } from "../src/types"
import { createChainCode } from "../src/createChainCode"
import { parseSuri } from "../src/parseSuri"
import { parseDerivations } from "../src/parseDerivations"
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
//   subkey inspect --scheme sr25519 //Alice/0
//   subkey inspect --scheme sr25519 //Alice/foo
//   subkey inspect --scheme sr25519 //Alice/foo//bar
test.each([
  [
    `${DEV_MINI_SECRET}//Alice/0`,
    "9057db4878163172ea51d570612043a98971737bf608b544991130ac110b0801",
  ],
  [
    `${DEV_MINI_SECRET}//Alice/foo`,
    "f2d22c92a77441efe17f5f4e5e9fc535df36943a88f81ab941cbecfe1b55367f",
  ],
  [
    `${DEV_MINI_SECRET}//Alice/foo//bar`,
    "964be39cf833c7575b3bd2c903c25e7da40db799457f58f04f0d050bfdd44568",
  ],
] as [suri: string, expectedPublicKey: Hex][])(
  "sr25519 public key from hard/soft/hard derivations",
  (suri, expectedPublicKey) => {
    const suriParsed = parseSuri(suri)
    const derivations = parseDerivations(parseSuri(suri).paths)
    const keypair = sr25519_keypair_from_seed(
      ensureBytes("miniSecret", suriParsed.phrase, 32),
    )
    const derivedKeypair = derivations.reduce((keypair, [type, derivation]) => {
      const chainCode = createChainCode(derivation)
      const deriveFn =
        type === "hard"
          ? sr25519_derive_keypair_hard
          : sr25519_derive_keypair_soft
      return deriveFn(keypair, chainCode)
    }, keypair)
    const derivedPublicKey = derivedKeypair.slice(64)
    expect(bytesToHex(derivedPublicKey)).toBe(expectedPublicKey)
  },
)
