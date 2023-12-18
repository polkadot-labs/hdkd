import { test, expect, beforeAll, afterAll } from "vitest"
import {
  mnemonicToMiniSecret,
  parseSuri,
  ensureBytes,
} from "@polkadot-labs/hdkd-helpers"

import subkeyTestCases from "./subkey-test-cases.json"
import {
  CreateDeriveFn,
  createEcdsaDerive,
  createEd25519Derive,
  createSr25519Derive,
} from "../src"

const schemes: Record<string, CreateDeriveFn> = {
  ecdsa: createEcdsaDerive,
  ed25519: createEd25519Derive,
  sr25519: createSr25519Derive,
}

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

test.each(subkeyTestCases)(
  "deriveFn for $input.scheme $input.suri",
  ({ input, subkey: { output } }) => {
    const { phrase, paths, password } = parseSuri(input.suri)
    const seed = mnemonicToMiniSecret(phrase, password)
    const keypair = schemes[input.scheme](seed)(paths)

    expect(keypair.publicKey).toEqual(
      ensureBytes("output.publicKey", output.publicKey),
    )
  },
)
