# Polkadot minimalistic HDKD libraries

Welcome to the monorepo for Polkadot minimalistic Hierarchical Deterministic Key Derivation (HDKD) libraries.
This repository contains a collection of libraries designed to facilitate Hierarchical Deterministic (HD) account derivation and cryptographic operations within the Polkadot and Substrate ecosystems.
These libraries provide robust support for various signature schemes, are optimized for performance and ease of use, and are designed to be composable.

## Libraries

- `@polkadot-labs/hdkd` is a Hierarchical Deterministic (HD) account derivation library compatible with the Polkadot and Substrate ecosystems. It supports the sr25519, ed25519, and ecdsa signature schemes, providing a comprehensive solution for HD account derivation.
- `@polkadot-labs/hdkd-helpers` is a pure JavaScript library providing utility functions for three signature schemes: sr25519, ed25519, and ecdsa. This library is designed to assist with Hierarchical Deterministic Key Derivation (HDKD) in the Polkadot ecosystem. It is built on top of `@noble/hashes`, `@noble/curves`, and `micro-sr25519`.
- `@polkadot-labs/schnorrkel-wasm` is a JavaScript WebAssembly (WASM) wrapper for the Schnorrkel crate. This package provides a convenient interface for using Schnorrkel's cryptographic functions in JavaScript applications.

## Usage

Here is an example of how to use the library:

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

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
