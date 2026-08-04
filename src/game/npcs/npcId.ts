declare const npcIdBrand: unique symbol;
export type NpcId = string & { readonly [npcIdBrand]: true };
export function npcId(value: string): NpcId {
  if (value.trim().length === 0) throw new Error('[NpcId] El identificador no puede estar vacío.');
  return value as NpcId;
}
