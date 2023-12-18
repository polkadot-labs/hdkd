import { bytesToHex } from "@noble/hashes/utils"
import {
  sr25519CreateDerive,
  ed25519CreateDerive,
  ecdsaCreateDerive,
} from "@polkadot-labs/hdkd"
import { DEV_MINI_SECRET } from "@polkadot-labs/hdkd-helpers"
import { useMemo } from "react"

function App() {
  const keypairs = useMemo(
    () =>
      (
        [
          ["sr25519", "//Alice", sr25519CreateDerive],
          ["sr25519", "//Alice//0", sr25519CreateDerive],
          ["sr25519", "//Alice/0", sr25519CreateDerive],
          ["ed25519", "//Alice", ed25519CreateDerive],
          ["ed25519", "//Alice//0", ed25519CreateDerive],
          ["ecdsa", "//Alice", ecdsaCreateDerive],
          ["ecdsa", "//Alice//0", ecdsaCreateDerive],
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
