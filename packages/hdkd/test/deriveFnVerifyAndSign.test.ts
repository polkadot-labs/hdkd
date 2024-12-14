import {
  type Curve,
  ecdsa,
  ed25519,
  ensureBytes,
  mnemonicToMiniSecret,
  parseSuri,
  sr25519,
} from "@polkadot-labs/hdkd-helpers"
import { expect, test } from "vitest"

import {
  type CreateDeriveFn,
  ecdsaCreateDerive,
  ed25519CreateDerive,
  sr25519CreateDerive,
} from "../src"
import subkeyTestCases from "./subkey-sign-test-cases.json"

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

test.each(subkeyTestCases)(
  "withNetworkAccount for $input.scheme $input.network $input.suri",
  ({ input, subkey: { output } }) => {
    const { phrase, paths, password } = parseSuri(input.suri)
    const seed = mnemonicToMiniSecret(phrase!, password)
    const keypair = schemes[input.scheme]!(seed)(paths!)

    const message = new TextEncoder().encode(input.message)!

    expect(
      curves[input.scheme]!.verify(output, message, keypair.publicKey),
    ).toBe(true)

    // TODO: when subkey is installed in CI, do keypair.sign() and verify with subkey
    // sr25519 signatures are not deterministic
    if (input.scheme === "sr25519") return

    const signature = keypair.sign(message)
    expect(signature).toEqual(ensureBytes("output", output))
  },
)
