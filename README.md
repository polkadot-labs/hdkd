A Polkadot minimalistic HDKD library

```ts
import { bytesToHex } from "@noble/hashes/utils"
import { sr25519CreateDerive } from "@polkadot-labs/hdkd"
import {
  sr25519,
  DEV_PHRASE,
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers"

const entropy = mnemonicToEntropy(DEV_PHRASE)
const miniSecret = entropyToMiniSecret(entropy)
const derive = sr25519CreateDerive(miniSecret)

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
```
