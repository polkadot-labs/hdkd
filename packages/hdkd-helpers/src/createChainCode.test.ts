import { bytesToHex } from "@noble/hashes/utils"
import { describe, expect, test } from "vitest"
import { createChainCode } from "./createChainCode"

describe("createChainCode", () => {
  test("string", () => {
    const code = createChainCode("Alice")
    expect(bytesToHex(code)).toStrictEqual(
      "14416c6963650000000000000000000000000000000000000000000000000000",
    )
  })
  test("number", () => {
    const code = createChainCode("0")
    expect(code).toStrictEqual(new Uint8Array(32).fill(0))
  })
})
