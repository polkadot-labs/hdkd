import { ed25519 as ed25519_ } from "@noble/curves/ed25519.js"
import { expect, test } from "vitest"
import { ed25519 } from "./ed25519"

test("ed25519", () => {
  const privateKey = ed25519_.utils.randomSecretKey()

  const publicKey = ed25519.getPublicKey(privateKey)
  const msg = new TextEncoder().encode("hello")
  const signature = ed25519.sign(msg, privateKey)

  expect(ed25519.verify(signature, msg, publicKey)).toBe(true)
})
