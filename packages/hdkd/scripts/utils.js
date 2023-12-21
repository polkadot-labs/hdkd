export const generateVariants = ([head, ...tail]) => {
  if (tail.length === 0) return head.map((h) => [h])
  const variants = []
  for (const h of head)
    for (const v of generateVariants(tail)) variants.push([h, ...v])
  return variants
}
