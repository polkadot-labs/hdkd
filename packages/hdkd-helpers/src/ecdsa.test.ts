import { secp256k1 } from "@noble/curves/secp256k1"
import { expect, test } from "vitest"
import { ecdsa } from "./ecdsa"

test("ecdsa", () => {
  const privateKey = secp256k1.utils.randomSecretKey()

  const publicKey = ecdsa.getPublicKey(privateKey)
  const msg = new TextEncoder().encode("hello")
  const signature = ecdsa.sign(msg, privateKey)

  expect(ecdsa.verify(signature, msg, publicKey)).toBe(true)
})
