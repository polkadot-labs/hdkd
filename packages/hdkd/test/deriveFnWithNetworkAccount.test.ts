import { test, expect, beforeAll, afterAll } from "vitest"
import {
  mnemonicToMiniSecret,
  parseSuri,
  ensureBytes,
} from "@polkadot-labs/hdkd-helpers"
import registry from "@substrate/ss58-registry"

import subkeyTestCases from "./subkey-test-cases.json"
import {
  CreateDeriveFn,
  ecdsaCreateDerive,
  ed25519CreateDerive,
  sr25519CreateDerive,
  withNetworkAccount,
} from "../src"

const schemes: Record<string, CreateDeriveFn> = {
  ecdsa: ecdsaCreateDerive,
  ed25519: ed25519CreateDerive,
  sr25519: sr25519CreateDerive,
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

const prefixByNetwork = Object.fromEntries(
  registry.map(({ network, prefix }) => [network, prefix]),
)

test.each(subkeyTestCases)(
  "withNetworkAccount for $input.scheme $input.network $input.suri",
  ({ input, subkey: { output } }) => {
    const { phrase, paths, password } = parseSuri(input.suri)
    const seed = mnemonicToMiniSecret(phrase, password)
    const keypair = withNetworkAccount(
      schemes[input.scheme](seed)(paths),
      prefixByNetwork[output.networkId],
    )

    expect(keypair.publicKey).toEqual(
      ensureBytes("output.publicKey", output.publicKey),
    )
    expect(keypair.accountId).toEqual(
      ensureBytes("output.accountId", output.accountId),
    )
    expect(keypair.ss58Address).toEqual(output.ss58Address)
    expect(keypair.ss58PublicKey).toEqual(output.ss58PublicKey)
  },
)
