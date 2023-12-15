import { bytesToHex } from "@noble/hashes/utils"
import {
  createSr25519Derive,
  createEd25519Derive,
  createEcdsaDerive,
} from "@polkadot-labs/hdkd"
import { DEV_MINI_SECRET } from "@polkadot-labs/hdkd-helpers"
import { useMemo } from "react"

function App() {
  const keypairs = useMemo(
    () =>
      (
        [
          ["sr25519", "//Alice", createSr25519Derive],
          ["sr25519", "//Alice//0", createSr25519Derive],
          ["sr25519", "//Alice/0", createSr25519Derive],
          ["ed25519", "//Alice", createEd25519Derive],
          ["ed25519", "//Alice//0", createEd25519Derive],
          ["ecdsa", "//Alice", createEcdsaDerive],
          ["ecdsa", "//Alice//0", createEcdsaDerive],
        ] as const
      ).map(([signatureScheme, derivationPath, createDerive]) => {
        const derive = createDerive(DEV_MINI_SECRET)
        const keypair = derive(derivationPath)
        return [signatureScheme, derivationPath, keypair] as const
      }),
    [],
  )
  return (
    <>
      {keypairs.map(([signatureScheme, derivationPath, keypair]) => (
        <article>
          <header>
            {signatureScheme} for {derivationPath}
          </header>
          <div>public key</div>
          <pre>{bytesToHex(keypair.publicKey)}</pre>
          <div>sign 'Hello'</div>
          <pre>
            {bytesToHex(keypair.sign(new TextEncoder().encode("Hello")))}
          </pre>
        </article>
      ))}
    </>
  )
}

export default App
