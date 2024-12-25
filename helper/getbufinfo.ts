import type { Denops } from "../mod.ts";
import type { BufInfo } from "../function/types.ts";
import type { BufNameArg, GetBufInfoDictArg } from "../function/buffer.ts";

/**
 * TODO: write
 */
export function getbufinfo(
  denops: Denops,
  buf?: BufNameArg,
): Promise<BufInfo[]>;
export function getbufinfo(
  denops: Denops,
  dict?: GetBufInfoDictArg,
): Promise<BufInfo[]>;
export async function getbufinfo(
  denops: Denops,
  ...args: unknown[]
): Promise<BufInfo[]> {
  const bufinfos = await denops.eval(
    "map(call('getbufinfo', l:args), {_, v -> filter(v, {k -> k !=# 'variables'})})",
    {
      args: args,
    },
  ) as Record<
    keyof BufInfo,
    unknown
  >[];
  return bufinfos.map((bufinfo) => ({
    ...bufinfo,
    changed: !!bufinfo.changed,
    hidden: !!bufinfo.hidden,
    listed: !!bufinfo.listed,
    loaded: !!bufinfo.loaded,
  } as unknown as BufInfo));
}
