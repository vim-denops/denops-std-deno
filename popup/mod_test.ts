import { assertEquals } from "@std/assert";
import { test } from "@denops/test";
import * as fn from "../function/mod.ts";
import * as popup from "./mod.ts";

test({
  mode: "all",
  name: "popup",
  fn: async (denops, t) => {
    // Extend screen size
    await denops.cmd("set lines=100 columns=100");

    await t.step({
      name: `open() opens a popup window and close() closes it`,
      fn: async () => {
        let popupWindow: popup.PopupWindow;
        const inner = async () => {
          popupWindow = await popup.open(denops, {
            relative: "editor",
            width: 50,
            height: 50,
            row: 1,
            col: 1,
          });
          const { winid } = popupWindow;
          assertEquals(await fn.win_gettype(denops, winid), "popup");
          assertEquals(await fn.winwidth(denops, winid), 50);
          assertEquals(await fn.winheight(denops, winid), 50);
        };
        await inner();

        // Still alive
        assertEquals(await fn.win_gettype(denops, popupWindow!.winid), "popup");

        // Explicitly close
        await popupWindow!.close();
        assertEquals(
          await fn.win_gettype(denops, popupWindow!.winid),
          "unknown",
        );
      },
    });

    await t.step({
      name: `open() with await using statement`,
      fn: async () => {
        let winid: number;
        const inner = async () => {
          await using popupWindow = await popup.open(denops, {
            relative: "editor",
            width: 50,
            height: 50,
            row: 1,
            col: 1,
          });
          winid = popupWindow.winid;
          assertEquals(await fn.win_gettype(denops, winid), "popup");
          assertEquals(await fn.winwidth(denops, winid), 50);
          assertEquals(await fn.winheight(denops, winid), 50);
        };
        await inner();

        // Automatically disposed
        assertEquals(await fn.win_gettype(denops, winid!), "unknown");
      },
    });

    // With numerous options
    const base: popup.OpenOptions = {
      relative: "editor",
      width: 20, // Max 20 in test
      height: 20, // Max 24 in test
      row: 50,
      col: 50,
    };
    const optionsSet: popup.OpenOptions[] = [
      { ...base },
      { ...base, relative: "cursor" },
      { ...base, anchor: "NW" },
      { ...base, anchor: "NE" },
      { ...base, anchor: "SW" },
      { ...base, anchor: "SE" },
      { ...base, zindex: 100 },
      { ...base, border: "single" },
      { ...base, border: "double" },
      { ...base, border: "rounded" },
      { ...base, border: ["", "", "", "|", "", "", "", "|"] },
      { ...base, border: "single", title: "Hello world!" },
      { ...base, highlight: {} },
      { ...base, highlight: { normal: "Normal" } },
      { ...base, highlight: { border: "Border" } },
      { ...base, highlight: { normal: "Normal", border: "Border" } },
    ];
    for (const options of optionsSet) {
      await t.step({
        name: `open() with options: ${JSON.stringify(options)}`,
        fn: async () => {
          await using popupWindow = await popup.open(denops, options);
          assertEquals(
            await fn.win_gettype(denops, popupWindow.winid),
            "popup",
          );
          assertEquals(await fn.winwidth(denops, popupWindow.winid), 20);
          assertEquals(await fn.winheight(denops, popupWindow.winid), 20);
        },
      });
    }

    await t.step({
      name: `open() with relative cursor`,
      fn: async () => {
        await fn.append(denops, 0, [
          "0123456789",
          "0123456789",
          "0123456789",
          "0123456789",
          "0123456789",
          "0123456789",
          "0123456789",
          "0123456789",
          "0123456789",
          "0123456789",
        ]);
        await fn.cursor(denops, [5, 5]);

        await using popupWindow = await popup.open(denops, {
          relative: "cursor",
          width: 20,
          height: 20,
          row: 3,
          col: 3,
          anchor: "NW",
        });

        assertEquals(await fn.win_gettype(denops, popupWindow.winid), "popup");
        assertEquals(await fn.winwidth(denops, popupWindow.winid), 20);
        assertEquals(await fn.winheight(denops, popupWindow.winid), 20);

        const info = (await fn.getwininfo(denops, popupWindow.winid))[0];
        assertEquals(info.winrow, 7, "winrow should be 7");
        assertEquals(info.wincol, 7, "wincol should be 7");
      },
    });
  },
});
