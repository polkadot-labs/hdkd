import { expect, test } from "vitest"
import { ss58Address } from "./ss58Address"

test.each([
  // ecdsa //Alice
  [
    "0x020a1091341fe5664bfa1782d5e04779689068c916b04cb365ec3153755684d9a1",
    "5C7C2Z5sWbytvHpuLTvzKunnnRwQxft1jiqrLD5rhucQ5S9X",
  ],
  // sr25519 //Alice
  [
    "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  ],
])("ss58Address", (publicKey, expectedSs58Address) => {
  expect(ss58Address(publicKey)).toBe(expectedSs58Address)
})
