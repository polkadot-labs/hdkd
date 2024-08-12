import { bytesToHex } from "@noble/hashes/utils"
import {
  sr25519_derive_public_soft,
  sr25519_secret_from_seed,
} from "@polkadot-labs/schnorrkel-wasm"
import { expect, test } from "vitest"

import { DEV_MINI_SECRET } from "../src/constants"
import { createChainCode } from "../src/createChainCode"
import { parseDerivations } from "../src/parseDerivations"
import { parseSuri } from "../src/parseSuri"
import { sr25519 } from "../src/sr25519"
import { Hex } from "../src/types"
import { ensureBytes } from "../src/utils"

// Test values from
//   subkey inspect --scheme sr25519 /foo
//   subkey inspect --scheme sr25519 /foo/0
//   subkey inspect --scheme sr25519 /foo/bar
test.each([
  [
    `${DEV_MINI_SECRET}/foo`,
    "40b9675df90efa6069ff623b0fdfcf706cd47ca7452a5056c7ad58194d23440a",
  ],
  [
    `${DEV_MINI_SECRET}/foo/0`,
    "56a599173e976347dcadc9a0c094711044482dcd1c803b55d0971008efd2e36b",
  ],
  [
    `${DEV_MINI_SECRET}/foo/bar`,
    "3abc3c000cbcdb69bf1bb3a0d62a006a0db63807dd4e74db502d84774cc68900",
  ],
] as [suri: string, expectedPublicKey: Hex][])(
  "sr25519.getPublicKey(...) from soft derivations",
  (suri, expectedPublicKey) => {
    const suriParsed = parseSuri(suri)
    const privateKey = sr25519_secret_from_seed(
      ensureBytes("miniSecret", suriParsed.phrase, 32),
    )
    const publicKey = sr25519.getPublicKey(privateKey)
    const derivations = parseDerivations(parseSuri(suri).paths)
    const derivedPublicKey = derivations.reduce((publicKey, [, derivation]) => {
      const chainCode = createChainCode(derivation)
      return sr25519_derive_public_soft(publicKey, chainCode)
    }, publicKey)

    expect(bytesToHex(derivedPublicKey)).toBe(expectedPublicKey)
  },
)
