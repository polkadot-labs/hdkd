import { expect, test, beforeAll, afterAll } from "vitest"

import { sr25519 } from "./sr25519"

beforeAll(async () => {
  // FIXME: Needed for thread_rng
  // see https://docs.rs/getrandom#nodejs-es-module-support
  // @ts-expect-error
  globalThis.crypto = (await import("node:crypto")).webcrypto
})

afterAll(() => {
  // @ts-expect-error
  delete globalThis.crypto
})

test("sr25519", () => {
  const privateKey = new Uint8Array(64).fill(1)

  const publicKey = sr25519.getPublicKey(privateKey)
  const msg = new TextEncoder().encode("hello")
  const signature = sr25519.sign(msg, privateKey)

  expect(sr25519.verify(signature, msg, publicKey)).toBe(true)
})
