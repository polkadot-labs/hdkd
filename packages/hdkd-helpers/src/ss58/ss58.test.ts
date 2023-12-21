import { expect, test } from "vitest"

import { ss58Decode, ss58Encode } from "./ss58"
import { ensureBytes } from ".."

test.each([
  // ecdsa substrate //Alice
  [
    "0x020a1091341fe5664bfa1782d5e04779689068c916b04cb365ec3153755684d9a1",
    42,
    "KW39r9CJjAVzmkf9zQ4YDb2hqfAVGdRqn53eRqyruqpxAP5YL",
  ],
  // ecdsa polkadot //Alice
  [
    "0x020a1091341fe5664bfa1782d5e04779689068c916b04cb365ec3153755684d9a1",
    0,
    "1CoWvCoktJHtTXSDybnqa1Evg2weWuhRusAiry1dU1fNR2Fy",
  ],
  // ed25519 substrate //Alice
  [
    "0x88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee",
    42,
    "5FA9nQDVg267DEd8m1ZypXLBnvN7SFxYwV7ndqSYGiN9TTpu",
  ],
  // ed25519 polkadot //Alice
  [
    "0x88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee",
    0,
    "146SvjUZXoMaemdeiecyxgALeYMm8ZWh1yrGo8RtpoPfe7WL",
  ],
  // sr25519 substrate //Alice
  [
    "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
    42,
    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  ],
  // sr25519 polkadot //Alice
  [
    "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
    0,
    "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
  ],
])("ss58Decode(ss58Encode(%s, %i))", (publicKey, prefix, ss58PublicKey) => {
  const encoded = ss58Encode(publicKey, prefix)
  expect(encoded).toBe(ss58PublicKey)
  const decoded = ss58Decode(encoded)
  expect(decoded).toEqual([ensureBytes("publicKey", publicKey), prefix])
})
