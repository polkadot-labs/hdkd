import { bytesToHex } from "@noble/hashes/utils"
import {
  sr25519_derive_seed_hard,
  sr25519_secret_from_seed,
} from "@polkadot-labs/schnorrkel-wasm"
import { Bytes, str, Tuple } from "scale-ts"
import { expect, test } from "vitest"
import { DEV_MINI_SECRET } from "../src/constants"
import { createChainCode } from "../src/createChainCode"
import { ecdsa } from "../src/ecdsa"
import { ed25519 } from "../src/ed25519"
import { parseDerivations } from "../src/parseDerivations"
import { parseSuri } from "../src/parseSuri"
import { sr25519 } from "../src/sr25519"
import type { Curve, Hex } from "../src/types"
import { blake2b256, ensureBytes } from "../src/utils"

// Test values from
//   subkey inspect --scheme ecdsa //Alice
//   subkey inspect --scheme ecdsa //Alice//0
//   subkey inspect --scheme ed25519 //Alice
//   subkey inspect --scheme ed25519 //Alice//0
//   subkey inspect --scheme sr25519 //Alice
//   subkey inspect --scheme sr25519 //Alice//0
test.each([
  [
    "ecdsa",
    `${DEV_MINI_SECRET}//Alice`,
    "Secp256k1HDKD",
    (miniSecret) => miniSecret,
    ecdsa,
    "cb6df9de1efca7a3998a8ead4e02159d5fa99c3e0d4fd6432667390bb4726854",
    "020a1091341fe5664bfa1782d5e04779689068c916b04cb365ec3153755684d9a1",
  ],
  [
    "ecdsa",
    `${DEV_MINI_SECRET}//Alice//0`,
    "Secp256k1HDKD",
    (miniSecret) => miniSecret,
    ecdsa,
    "e13a340c3fd262fffa4ec5d3e298932a4b6af4270e9a2619babb66950d6c8b66",
    "03ca2e6606a5c42b9671765ff60aaa98c3033ab0fb155f08afa884343def0857f0",
  ],
  [
    "ed25519",
    `${DEV_MINI_SECRET}//Alice`,
    "Ed25519HDKD",
    (miniSecret) => miniSecret,
    ed25519,
    "abf8e5bdbe30c65656c0a3cbd181ff8a56294a69dfedd27982aace4a76909115",
    "88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee",
  ],
  [
    "ed25519",
    `${DEV_MINI_SECRET}//Alice//0`,
    "Ed25519HDKD",
    (miniSecret) => miniSecret,
    ed25519,
    "c389de380858a8bcfadc4fbb7f93d840fc113c3ca0757f603763579580445427",
    "de6c1b2cf7076546c493ada471947fbab1f100a31c680ac82ea78c46e33dd3e4",
  ],
  [
    "sr25519",
    `${DEV_MINI_SECRET}//Alice`,
    "sr25519",
    sr25519_secret_from_seed,
    sr25519,
    "e5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a",
    "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
  ],
  [
    "sr25519",
    `${DEV_MINI_SECRET}//Alice//0`,
    "sr25519",
    sr25519_secret_from_seed,
    sr25519,
    "20315f8a4c88d387ce829c2d4a823e5fdb34d84232c98ba0f555a52cda644770",
    "4435d0e6e507975038a9fe8f6002b6a8aa6a2740de8b2e5ea193654d204ada09",
  ],
] as [
  curveName: string,
  suri: string,
  derivationPrefix: string,
  getPrivateKey: (hex: Hex) => Hex,
  curve: Curve,
  expectedDerivedMiniSecret: Hex,
  expectedPublicKey: Hex,
][])(
  "%s.getPublicKey(...) from mini secret",
  (
    _,
    suri,
    derivationPrefix,
    getPrivateKey,
    curve,
    expectedDerivedMiniSecret,
    expectedPublicKey,
  ) => {
    const suriParsed = parseSuri(suri)
    const derivations = parseDerivations(suriParsed.paths!)
    const derivedMiniSecret = derivations.reduce(
      (miniSecret, [, hardDerivation]) => {
        const chainCode = createChainCode(hardDerivation)
        return derivationPrefix === "sr25519"
          ? hardDeriveSr25519(miniSecret, chainCode)
          : hardDerive(derivationPrefix, miniSecret, chainCode)
      },
      ensureBytes("miniSecret", suriParsed.phrase!, 32),
    )

    expect(bytesToHex(derivedMiniSecret)).toBe(expectedDerivedMiniSecret)
    const privateKey = getPrivateKey(derivedMiniSecret)
    const publicKey = curve.getPublicKey(privateKey)
    expect(bytesToHex(publicKey)).toBe(expectedPublicKey)
  },
)

const derivationCodec = Tuple(str, Bytes(32), Bytes(32))
function hardDerive(
  prefix: string,
  seed: Uint8Array,
  chainCode: Uint8Array,
): Uint8Array {
  return blake2b256(derivationCodec.enc([prefix, seed, chainCode]))
}

function hardDeriveSr25519(
  seed: Uint8Array,
  chainCode: Uint8Array,
): Uint8Array {
  return sr25519_derive_seed_hard(seed, chainCode)
}
