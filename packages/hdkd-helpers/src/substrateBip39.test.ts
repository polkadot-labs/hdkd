import { bytesToHex } from "@noble/hashes/utils"
import { expect, test } from "vitest"
import { DEV_MINI_SECRET, DEV_PHRASE } from "./constants"
import {
  mnemonicToMiniSecret,
  mnemonicToMiniSecretAsync,
} from "./substrateBip39"

test("mnemonicToMiniSecret", () => {
  expect(bytesToHex(mnemonicToMiniSecret(DEV_PHRASE))).toBe(DEV_MINI_SECRET)
})

test("mnemonicToMiniSecretAsync", async () => {
  expect(bytesToHex(await mnemonicToMiniSecretAsync(DEV_PHRASE))).toBe(
    DEV_MINI_SECRET,
  )
})
