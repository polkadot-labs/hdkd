import { bytesToHex } from "@noble/hashes/utils.js"
import { DEV_PHRASE } from "@polkadot-labs/hdkd-helpers"
import { $ } from "execa"
import { generateVariants } from "./utils.js"

const variants = [
  ...generateVariants([
    ["ecdsa", "ed25519", "sr25519"],
    [`${DEV_PHRASE}//Alice`],
    ["Hello World"],
  ]),
]

const subkeyInspect = (scheme, suri, message) =>
  // TODO: install subkey in CI
  $`subkey sign --scheme ${scheme} --suri ${suri} --hex --message ${bytesToHex(
    new TextEncoder().encode(message),
  )}`

const testCases = await Promise.all(
  variants.map(async ([scheme, suri, message]) => {
    const { command, stdout: output } = await subkeyInspect(
      scheme,
      suri,
      message,
    )
    return {
      input: { scheme, suri, message },
      subkey: {
        command,
        output,
      },
    }
  }),
)

console.log(JSON.stringify(testCases, undefined, 2))
