import { expect, test } from "vitest"
import { parseDerivations } from "./parseDerivations"

test("parseDerivations", () => {
  const derivations = parseDerivations("//a/b-1")

  expect(derivations).toEqual([
    ["hard", "a"],
    ["soft", "b-1"],
  ])
})
