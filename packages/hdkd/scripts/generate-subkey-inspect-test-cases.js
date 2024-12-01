import { DEV_PHRASE } from "@polkadot-labs/hdkd-helpers"
import { $ } from "execa"
import { generateVariants } from "./utils.js"

const variants = [
  ...generateVariants([
    ["ecdsa", "ed25519", "sr25519"],
    [DEV_PHRASE],
    ["BareSecp256k1", "BareEd25519", "BareSr25519"],
  ]),
  ...generateVariants([
    ["ecdsa", "ed25519", "sr25519"],
    [
      `${DEV_PHRASE}//Alice`,
      `${DEV_PHRASE}//Alice//0`,
      `${DEV_PHRASE}//Alice///password`,
    ],
    ["substrate", "polkadot"],
  ]),
  ...generateVariants([
    ["sr25519"],
    [
      `${DEV_PHRASE}//Alice/0`,
      `${DEV_PHRASE}//Alice/foo`,
      `${DEV_PHRASE}//Alice/foo/bar`,
      `${DEV_PHRASE}//Alice/foo//bar`,
    ],
    ["substrate"],
  ]),
]

const subkeyInspect = (scheme, suri, network) =>
  // TODO: install subkey in CI
  $`subkey inspect --output-type json --scheme ${scheme} ${suri} --network ${network}`

const testCases = await Promise.all(
  variants.map(async ([scheme, suri, network]) => {
    network ??= "substrate"
    const { command, stdout } = await subkeyInspect(scheme, suri, network)
    return {
      input: { scheme, suri, network },
      subkey: {
        command,
        output: JSON.parse(stdout),
      },
    }
  }),
)

console.log(JSON.stringify(testCases, undefined, 2))
