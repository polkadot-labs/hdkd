import { bytesToHex } from "@noble/hashes/utils"
import { expect, test } from "vitest"

import { type Curve, type Hex, ecdsa, ed25519 } from "."
import { DEV_PHRASE } from "./constants"
import { createDerive } from "./createDerive"
import { ecdsaDerive } from "./ecdsaDerive"
import { ed25519Derive } from "./ed25519Derive"
import type { DeriveKeyPairFn } from "./internal/types"
import { parseSuri } from "./parseSuri"
import { sr25519 } from "./sr25519"
import { sr25519Derive } from "./sr25519Derive"
import { mnemonicToMiniSecret } from "./substrateBip39"

test("createKeySet sr25519", () => {
  const seed = mnemonicToMiniSecret(DEV_PHRASE)
  const derive = createDerive({
    seed,
    curve: sr25519,
    derive: sr25519Derive,
  })
  const keyPair = derive("//Alice")

  expect(bytesToHex(keyPair.publicKey)).toBe(
    "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
  )

  const message = new TextEncoder().encode("a message")
  const signature = keyPair.sign(message)

  expect(sr25519.verify(signature, message, keyPair.publicKey)).toBe(true)
})

test("createKeySet sr25519", () => {
  const seed = mnemonicToMiniSecret(DEV_PHRASE)
  const derive = createDerive({
    seed,
    curve: sr25519,
    derive: sr25519Derive,
  })
  const keyPair = derive("//Alice//foo")

  expect(bytesToHex(keyPair.publicKey)).toBe(
    "c674c01a238914605f5f47615c3230eff592a2d1148190cac4b7825e61c80842",
  )
})

test("createKeySet ed25519", () => {
  const seed = mnemonicToMiniSecret(DEV_PHRASE)
  const derive = createDerive({
    seed,
    curve: ed25519,
    derive: ed25519Derive,
  })
  const keyPair = derive("//Alice")

  expect(bytesToHex(keyPair.publicKey)).toBe(
    "88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee",
  )
})

test("createKeySet ecdsa", () => {
  const seed = mnemonicToMiniSecret(DEV_PHRASE)
  const derive = createDerive({
    seed,
    curve: ecdsa,
    derive: ecdsaDerive,
  })
  const keyPair = derive("//Alice")

  expect(bytesToHex(keyPair.publicKey)).toBe(
    "020a1091341fe5664bfa1782d5e04779689068c916b04cb365ec3153755684d9a1",
  )
})

test.each([
  [
    "createKeySet for ecdsa",
    `${DEV_PHRASE}`,
    ecdsa,
    ecdsaDerive,
    "035b26108e8b97479c547da4860d862dc08ab2c29ada449c74d5a9a58a6c46a8c4",
  ],
  [
    "createKeySet for ecdsa with hard derivation",
    `${DEV_PHRASE}//Alice`,
    ecdsa,
    ecdsaDerive,
    "020a1091341fe5664bfa1782d5e04779689068c916b04cb365ec3153755684d9a1",
  ],
  [
    "createKeySet for ecdsa with nested hard derivation",
    `${DEV_PHRASE}//Alice//0`,
    ecdsa,
    ecdsaDerive,
    "03ca2e6606a5c42b9671765ff60aaa98c3033ab0fb155f08afa884343def0857f0",
  ],
  [
    "createKeySet for ecdsa with password",
    `${DEV_PHRASE}//Alice///password`,
    ecdsa,
    ecdsaDerive,
    "02fa78ba5b4ae2b0086a1c10363978990df68915635890c88d94e136dfb36241f9",
  ],
  [
    "createKeySet for ed25519",
    `${DEV_PHRASE}`,
    ed25519,
    ed25519Derive,
    "345071da55e5dccefaaa440339415ef9f2663338a38f7da0df21be5ab4e055ef",
  ],
  [
    "createKeySet for ed25519 with hard derivation",
    `${DEV_PHRASE}//Alice`,
    ed25519,
    ed25519Derive,
    "88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee",
  ],
  [
    "createKeySet for ed25519 with nested hard derivation",
    `${DEV_PHRASE}//Alice//0`,
    ed25519,
    ed25519Derive,
    "de6c1b2cf7076546c493ada471947fbab1f100a31c680ac82ea78c46e33dd3e4",
  ],
  [
    "createKeySet for ed25519 with password",
    `${DEV_PHRASE}//Alice///password`,
    ed25519,
    ed25519Derive,
    "2818a78aba524c30f6054d7bf23dd78bc2d20c4111d00f6ba56a060e97e0d8d4",
  ],
  [
    "createKeySet for sr25519",
    `${DEV_PHRASE}`,
    sr25519,
    sr25519Derive,
    "46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a",
  ],
  [
    "createKeySet for sr25519 with hard derivation",
    `${DEV_PHRASE}//Alice`,
    sr25519,
    sr25519Derive,
    "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
  ],
  [
    "createKeySet for sr25519 with nested hard derivation",
    `${DEV_PHRASE}//Alice//0`,
    sr25519,
    sr25519Derive,
    "4435d0e6e507975038a9fe8f6002b6a8aa6a2740de8b2e5ea193654d204ada09",
  ],
  [
    "createKeySet for sr25519 with nested soft derivation",
    `${DEV_PHRASE}//Alice/0`,
    sr25519,
    sr25519Derive,
    "9057db4878163172ea51d570612043a98971737bf608b544991130ac110b0801",
  ],
  [
    "createKeySet for sr25519 with password",
    `${DEV_PHRASE}//Alice///password`,
    sr25519,
    sr25519Derive,
    "32fc18294f88e02ec071e59bb3996aa21f4519d92593dc6e01fda2921d459b23",
  ],
] as [
  testName: string,
  suri: string,
  curve: Curve,
  derive: DeriveKeyPairFn,
  expectedPublicKey: Hex,
][])("%s", (_, suri, curve, deriveKeyPair, expectedPublicKey) => {
  const { phrase, paths, password } = parseSuri(suri)
  const seed = mnemonicToMiniSecret(phrase!, password)
  const derive = createDerive({
    seed,
    curve,
    derive: deriveKeyPair,
  })
  const keyPair = derive(paths!)

  expect(bytesToHex(keyPair.publicKey)).toBe(expectedPublicKey)

  const message = new TextEncoder().encode("a message")
  const signature = keyPair.sign(message)

  expect(curve.verify(signature, message, keyPair.publicKey)).toBe(true)
})
