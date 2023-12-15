import { bytesToHex } from "@noble/hashes/utils"
import { createSr25519Derive } from "@polkadot-labs/hdkd"
import { DEV_MINI_SECRET } from "@polkadot-labs/hdkd-helpers"

const derive = createSr25519Derive(DEV_MINI_SECRET)

const keypair = derive("//Alice")

console.log("//Alice", bytesToHex(keypair.publicKey))
