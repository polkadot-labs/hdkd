import * as K from "@polkadot/keyring"
import * as U from "@polkadot/util-crypto"
// @ts-ignore
import { blake2b } from "@noble/hashes/blake2b"
// @ts-ignore
import { hexToBytes, bytesToHex } from "@noble/hashes/utils"

await U.cryptoWaitReady()
{
  const keyring = new K.Keyring({ type: "sr25519" })
  const pair = keyring.addFromUri(
    `${K.DEV_PHRASE}//Alice`,
    undefined,
    "sr25519",
  )
  console.log(bytesToHex(pair.publicKey))
  // console.log(bytesToHex(pair.addressRaw));
  // console.log(bytesToHex(blake2b(pair.publicKey, { dkLen: 32 })));
}

{
  const keyring = new K.Keyring({ type: "sr25519" })
  const pair = keyring.addFromUri(`${K.DEV_PHRASE}`, undefined, "sr25519")
  console.log(bytesToHex(pair.derive("//Alice").publicKey))
}

{
  const keyring = new K.Keyring({ type: "sr25519" })
  const pair = keyring.addFromUri(
    `${K.DEV_PHRASE}//a/b/c//d//e`,
    undefined,
    "sr25519",
  )
  pair.sign("", { withType: true })
  console.log(bytesToHex(pair.publicKey))
}
{
  const keyring = new K.Keyring({ type: "ecdsa" })
  const pair = keyring.addFromUri(
    `${K.DEV_PHRASE}//a//aa//bb`,
    undefined,
    "ecdsa",
  )
  pair.sign("", { withType: true })
  console.log(bytesToHex(pair.publicKey))
}

{
  const keyring = new K.Keyring({ type: "ed25519" })

  const pair = keyring.addFromUri(
    `${K.DEV_PHRASE}//a//aa//bb`,
    undefined,
    "ed25519",
  )
  pair.sign("", { withType: true })
  console.log(bytesToHex(pair.publicKey))
}
