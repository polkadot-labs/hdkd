export type Hex = Uint8Array | string

export type Curve = {
  getPublicKey: (privateKey: Hex) => Uint8Array
  sign: (message: Hex, privateKey: Hex) => Uint8Array
  verify: (signature: Hex, message: Hex, publicKey: Hex) => boolean
}

export type KeyPair = {
  publicKey: Uint8Array
  sign: (message: Hex) => Uint8Array
}

export type DeriveFn = (path: string) => KeyPair
