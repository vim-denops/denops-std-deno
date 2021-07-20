import { assertEquals, test } from "../deps_test.ts";
import { globals } from "../variable/mod.ts";
import { define, remove } from "./common.ts";
import { exists } from "../function/mod.ts";
import type { CommandOptions } from "./types.ts";

test({
  mode: "any",
  name: "command.define() defines a command",
  fn: async (denops) => {
    await globals.set(denops, "denops_command_test", 0);
    await define(denops, "DenopsTest", "let g:denops_command_test += 1");
    assertEquals(await globals.get(denops, "denops_command_test"), 0);
    await denops.cmd("DenopsTest");
    assertEquals(await globals.get(denops, "denops_command_test"), 1);
    await denops.cmd("DenopsTest");
    assertEquals(await globals.get(denops, "denops_command_test"), 2);
  },
});

test({
  mode: "any",
  name: "command.define() defines a command (nargs)",
  fn: async (denops) => {
    const opt: CommandOptions = {
      attr: {
        nargs: "1",
      },
    };
    await globals.set(denops, "denops_command_test", 0);
    await define(
      denops,
      "DenopsTest",
      "let g:denops_command_test += <f-args>",
      opt,
    );
    assertEquals(await globals.get(denops, "denops_command_test"), 0);
    await denops.cmd("DenopsTest 1");
    assertEquals(await globals.get(denops, "denops_command_test"), 1);
    await denops.cmd("DenopsTest 5");
    assertEquals(await globals.get(denops, "denops_command_test"), 6);
  },
});

test({
  mode: "any",
  name: "command.define() defines a command (count)",
  fn: async (denops) => {
    const opt: CommandOptions = {
      attr: {
        count: 1,
      },
    };
    await globals.set(denops, "denops_command_test", 0);
    await define(
      denops,
      "DenopsTest",
      "let g:denops_command_test += <count>",
      opt,
    );
    assertEquals(await globals.get(denops, "denops_command_test"), 0);
    await denops.cmd("DenopsTest");
    assertEquals(await globals.get(denops, "denops_command_test"), 1);
    await denops.cmd("5DenopsTest");
    assertEquals(await globals.get(denops, "denops_command_test"), 6);
  },
});

test({
  mode: "any",
  name: "command.remove() removes a command",
  fn: async (denops) => {
    await globals.set(denops, "denops_command_test", 0);
    await define(denops, "DenopsTest", "let g:denops_command_test += 1");
    assertEquals(await globals.get(denops, "denops_command_test"), 0);
    await denops.cmd("DenopsTest");
    assertEquals(await globals.get(denops, "denops_command_test"), 1);
    await remove(denops, "DenopsTest");
    assertEquals(await exists(denops, ":DenopsTest"), false);
  },
});
