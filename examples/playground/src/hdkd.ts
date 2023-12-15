import { bytesToHex } from "@noble/hashes/utils"
import { createSr25519Derive } from "@polkadot-labs/hdkd"
import { sr25519, DEV_PHRASE } from "@polkadot-labs/hdkd-helpers"
import { mnemonicToMiniSecret } from "@polkadot/util-crypto"

const miniSecret = mnemonicToMiniSecret(DEV_PHRASE)
const derive = createSr25519Derive(miniSecret)

const keypair = derive("//Alice")
const message = new TextEncoder().encode("Hello")
const signature = keypair.sign(message)

console.log("//Alice")
console.log("publicKey =", bytesToHex(keypair.publicKey))
console.log("sign('Hello') =", bytesToHex(signature))
console.log(
  "verify(sign('Hello')) =",
  sr25519.verify(signature, message, keypair.publicKey),
)
