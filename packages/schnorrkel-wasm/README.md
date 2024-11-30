# @polkadot-labs/schnorrkel-wasm

`@polkadot-labs/schnorrkel-wasm` is a JavaScript WebAssembly (WASM) wrapper for the `schnorrkel` Rust crate. This package provides a convenient interface for using Schnorrkel's cryptographic functions in JavaScript applications.

## Features

- **Schnorrkel**: Provides access to Schnorrkel's cryptographic functions via WebAssembly.

## Installation

To install the library, you can use npm or yarn or pnpm:

```sh
npm install @polkadot-labs/schnorrkel-wasm
```

## Usage

Here is an example of how to use the library:

```ts
import {
  sr25519_secret_from_seed,
  sr25519_pubkey,
  sr25519_sign,
  sr25519_verify,
} from "@polkadot-labs/schnorrkel-wasm"

const seed = new Uint8Array(32)

// Example usage for generating a sr25519 keypair
const privateKey = sr25519_secret_from_seed(seed)
const publicKey = sr25519_pubkey(privateKey)

// Example usage for signing a message
const message = new TextEncoder().encode("Hello")
const signature = sr25519_sign(publicKey, privateKey, message)

// Example usage for verifying a signature
const isValid = sr25519_verify(publicKey, message, signature)
console.log("Is valid:", isValid)
```

## License

This project is licensed under the MIT License. See the [LICENSE](../../LICENSE) file for details.
