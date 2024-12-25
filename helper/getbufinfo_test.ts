import { getbufinfo } from "./getbufinfo.ts";
import { assertEquals, assertFalse } from "@std/assert";
import { assert, is } from "@core/unknownutil";
import { test } from "@denops/test";
import type { BufInfo } from "../function/types.ts";

test({
  mode: "all",
  name: "buffer",
  fn: async (denops, t) => {
    await t.step({
      name: "getbufinfo()",
      fn: async () => {
        await denops.cmd("enew!");
        await denops.cmd("new foo");
        await denops.call("setline", 1, "abcdef");
        await denops.cmd("new bar");
        await denops.cmd("hide");
        await denops.cmd("new baz");
        await denops.cmd("bunload!");

        const actual = await getbufinfo(denops);
        assert(actual, is.ArrayOf((x): x is BufInfo => is.Record(x)));
        assertEquals(actual.length, 4);
        assertEquals(
          actual.map(({ changed, hidden, listed, loaded }) => (
            { changed, hidden, listed, loaded }
          )),
          [
            {
              // [No Name]
              changed: false,
              hidden: false,
              listed: true,
              loaded: true,
            },
            {
              // foo
              changed: true,
              hidden: false,
              listed: true,
              loaded: true,
            },
            {
              // bar
              changed: false,
              hidden: true,
              listed: true,
              loaded: true,
            },
            {
              // baz
              changed: false,
              hidden: false,
              listed: true,
              loaded: false,
            },
          ],
          "boolean properties are invalid.",
        );
      },
    });
    await denops.cmd("1,$bwipeout!");

    await t.step({
      name: "getbufinfo() will filter buffer-local variables",
      fn: async () => {
        await denops.cmd("enew!");
        await denops.cmd("let b:var = 0");

        const actual = await getbufinfo(denops);
        assertEquals(actual.length, 1);
        assertFalse("variables" in actual[0]);
      },
    });
  },
});
