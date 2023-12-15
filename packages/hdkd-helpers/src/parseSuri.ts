const SURI_RE = /^(\w+(?: \w+)*)((?:\/{1,2}\w+)*)(?:\/{3}(.*))?$/

export const parseSuri = (suri: string) => {
  const [, phrase, paths, password] = SURI_RE.exec(suri) ?? []
  return { phrase, paths, password }
}
