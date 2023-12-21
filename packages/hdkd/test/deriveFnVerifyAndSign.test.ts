import { test, expect, beforeAll, afterAll } from "vitest"
import {
  Curve,
  ensureBytes,
  mnemonicToMiniSecret,
  parseSuri,
  ecdsa,
  ed25519,
  sr25519,
} from "@polkadot-labs/hdkd-helpers"

import subkeyTestCases from "./subkey-sign-test-cases.json"
import {
  CreateDeriveFn,
  ecdsaCreateDerive,
  ed25519CreateDerive,
  sr25519CreateDerive,
} from "../src"

const schemes: Record<string, CreateDeriveFn> = {
  ecdsa: ecdsaCreateDerive,
  ed25519: ed25519CreateDerive,
  sr25519: sr25519CreateDerive,
}

const curves: Record<string, Curve> = {
  ecdsa,
  ed25519,
  sr25519,
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
  "withNetworkAccount for $input.scheme $input.network $input.suri",
  ({ input, subkey: { output } }) => {
    const { phrase, paths, password } = parseSuri(input.suri)
    const seed = mnemonicToMiniSecret(phrase, password)
    const keypair = schemes[input.scheme](seed)(paths)

    const message = new TextEncoder().encode(input.message)

    expect(
      curves[input.scheme].verify(output, message, keypair.publicKey),
    ).toBe(true)

    // TODO: when subkey is installed in CI, do keypair.sign() and verify with subkey
    // sr25519 signatures are not deterministic
    if (input.scheme === "sr25519") return

    const signature = keypair.sign(message)
    expect(signature).toEqual(ensureBytes("output", output))
  },
)
