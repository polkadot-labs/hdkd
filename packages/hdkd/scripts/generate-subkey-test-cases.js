import { $ } from "execa"
import { DEV_PHRASE } from "@polkadot-labs/hdkd-helpers"

const variants = [
  ["ecdsa", `${DEV_PHRASE}//Alice`],
  ["ecdsa", `${DEV_PHRASE}//Alice//0`],
  ["ecdsa", `${DEV_PHRASE}//Alice///password`],
  ["ed25519", `${DEV_PHRASE}//Alice`],
  ["ed25519", `${DEV_PHRASE}//Alice//0`],
  ["ed25519", `${DEV_PHRASE}//Alice///password`],
  ["sr25519", `${DEV_PHRASE}//Alice`],
  ["sr25519", `${DEV_PHRASE}//Alice//0`],
  ["sr25519", `${DEV_PHRASE}//Alice///password`],
  ["sr25519", `${DEV_PHRASE}//Alice/0`],
  ["sr25519", `${DEV_PHRASE}//Alice/foo`],
  ["sr25519", `${DEV_PHRASE}//Alice/foo/bar`],
  ["sr25519", `${DEV_PHRASE}//Alice/foo//bar`],
]

const subkeyInspect = (scheme, suri) =>
  // TODO: install subkey in CI
  $`subkey inspect --output-type json --scheme ${scheme} ${suri}`

const testCases = await Promise.all(
  variants.map(async ([scheme, suri]) => {
    const { command, stdout } = await subkeyInspect(scheme, suri)
    return {
      input: { scheme, suri },
      subkey: {
        command,
        output: JSON.parse(stdout),
      },
    }
  }),
)

console.log(JSON.stringify(testCases, undefined, 2))
