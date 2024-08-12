import { expect, test } from "vitest"

import { sr25519 } from "./sr25519"

test("sr25519", () => {
  const privateKey = new Uint8Array(64).fill(1)

  const publicKey = sr25519.getPublicKey(privateKey)
  const msg = new TextEncoder().encode("hello")
  const signature = sr25519.sign(msg, privateKey)

  expect(sr25519.verify(signature, msg, publicKey)).toBe(true)
})
