const DERIVATION_RE = /(\/{1,2})([^\/]+)/g

export const parseDerivations = (derivationsStr: string) => {
  const derivations = [] as [type: "hard" | "soft", code: string][]
  for (const [_, type, code] of derivationsStr.matchAll(DERIVATION_RE)) {
    derivations.push([type === "//" ? "hard" : "soft", code!])
  }
  return derivations
}
