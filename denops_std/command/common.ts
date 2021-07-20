import { Denops } from "../deps.ts";
import { CommandOptions } from "./types.ts";

export async function define(
  denops: Denops,
  cmd: string,
  repl: string,
  options?: CommandOptions,
) {
  const expr = buildDefineExpr(cmd, repl, options);
  await denops.cmd(expr);
}

export async function remove(
  denops: Denops,
  cmd: string,
) {
  await denops.cmd(`delcommand ${cmd}`);
}

export function buildDefineExpr(
  cmd: string,
  repl: string,
  options?: CommandOptions,
): string {
  let terms: string[];
  if (options?.overwrite) {
    terms = ["command!"];
  } else {
    terms = ["command"];
  }
  if (options?.attr) {
    const attr = options.attr;
    if (attr.nargs) {
      terms.push(`-nargs=${attr.nargs}`);
    }
    if (attr.complete) {
      const complete = ["-complete="];
      complete.push(attr.complete);
      if (attr.complete === "custom" && attr.custom) {
        complete.push(",", attr.custom);
      }
      if (attr.complete === "customlist" && attr.customlist) {
        complete.push(",", attr.customlist);
      }
      terms.push(complete.join(""));
    }
    if (attr.range != null) {
      if (attr.range === true) {
        terms.push("-range");
      } else {
        terms.push(`-range=${attr.range}`);
      }
    }
    if (attr.count != null) {
      if (attr.count === true) {
        terms.push("-count");
      } else {
        terms.push(`-count=${attr.count}`);
      }
    }
    if (attr.addr) {
      terms.push(`-addr=${attr.addr}`);
    }
    if (attr.bang) {
      terms.push("-bang");
    }
    if (attr.bar) {
      terms.push("-bar");
    }
    if (attr.register) {
      terms.push("-register");
    }
    if (attr.buffer) {
      terms.push("-buffer");
    }
  }
  terms.push(cmd);
  terms.push(repl);
  return terms.join(" ");
}
