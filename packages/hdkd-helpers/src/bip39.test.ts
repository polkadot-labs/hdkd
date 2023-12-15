import { expect, test } from "vitest"
import { entropyToMnemonic, generateMnemonic, mnemonicToEntropy } from "./bip39"
import { DEV_PHRASE } from "./constants"

test("mnemonicToEntropy -> entropyToMnemonic", () => {
  expect(entropyToMnemonic(mnemonicToEntropy(DEV_PHRASE))).toBe(DEV_PHRASE)
})

test("generateMnemonic", () => {
  const mnemonic = generateMnemonic()
  expect(entropyToMnemonic(mnemonicToEntropy(mnemonic))).toBe(mnemonic)
})
