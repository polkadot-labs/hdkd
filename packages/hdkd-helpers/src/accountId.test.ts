import { test, expect } from "vitest"

import { accountId } from "./accountId"
import { ensureBytes } from "."

test.each([
  // ecdsa //Alice
  [
    "0x020a1091341fe5664bfa1782d5e04779689068c916b04cb365ec3153755684d9a1",
    "0x01e552298e47454041ea31273b4b630c64c104e4514aa3643490b8aaca9cf8ed",
  ],
  // sr25519 //Alice
  [
    "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
    "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
  ],
])("accountId", (publicKey, expectedAccountId) => {
  expect(accountId(publicKey)).toEqual(
    ensureBytes("expectedAccountId", expectedAccountId),
  )
})
