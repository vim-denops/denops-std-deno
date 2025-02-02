import type { Denops } from "@denops/core";
import { unreachable } from "@lambdalisue/errorutil";
import * as vimFn from "../function/vim/mod.ts";

import type { Anchor, Border, OpenOptions } from "./types.ts";

export function openPopup(
  denops: Denops,
  bufnr: number,
  options: Omit<OpenOptions, "bufnr" | "noRedraw">,
): Promise<number> {
  const popupCreateOptions = toPopupCreateOptions(options);
  return vimFn.popup_create(denops, bufnr, popupCreateOptions) as Promise<
    number
  >;
}

export function configPopup(
  denops: Denops,
  winid: number,
  options: Partial<Omit<OpenOptions, "bufnr" | "noRedraw">>,
): Promise<void> {
  const popupSetOptionsOptions = toPopupSetOptionsOptions(options);
  return vimFn.popup_setoptions(denops, winid, popupSetOptionsOptions);
}

export async function closePopup(denops: Denops, winid: number): Promise<void> {
  await vimFn.popup_close(denops, winid);
}

function toPopupCreateOptions(
  options: Omit<OpenOptions, "bufnr" | "noRedraw">,
): vimFn.PopupCreateOptions {
  return {
    ...toPopupSetOptionsOptions(options),
    posinvert: false, // To keep consistent with the behavior of Neovim's floating window
  };
}

function handleRelative(
  relative: "editor" | "cursor",
  offset: number,
): string | number {
  switch (relative) {
    case "editor":
      return offset;
    case "cursor":
      return offset < 0 ? `cursor${offset}` : `cursor+${offset}`;
    default:
      unreachable(relative);
  }
}

function toPopupSetOptionsOptions(
  options: Partial<Omit<OpenOptions, "bufnr" | "noRedraw">>,
): vimFn.PopupSetOptionsOptions {
  const v: vimFn.PopupCreateOptions = {
    line: options.row
      ? handleRelative(options.relative ?? "editor", options.row)
      : undefined,
    col: options.col
      ? handleRelative(options.relative ?? "editor", options.col)
      : undefined,
    pos: options.anchor ? posFromAnchor(options.anchor) : undefined,
    fixed: true, // To keep consistent with the behavior of Neovim's floating window
    flip: false, // To keep consistent with the behavior of Neovim's floating window
    maxheight: options.height,
    minheight: options.height,
    maxwidth: options.width,
    minwidth: options.width,
    title: options.title,
    highlight: options.highlight?.normal,
    borderhighlight: options.highlight?.border
      ? [options.highlight?.border]
      : undefined,
    scrollbar: 0, // To keep consistent with the behavior of Neovim's floating window
    zindex: options.zindex,
  };
  if (options.border) {
    const { border, borderchars } = toVimBorder(options.border);
    v.border = border;
    v.borderchars = borderchars;
  }
  return Object.fromEntries(
    Object
      .entries(v)
      .filter(([, v]) => v != undefined),
  ) as vimFn.PopupSetOptionsOptions;
}

function posFromAnchor(anchor: Anchor): vimFn.PopupCreateOptions["pos"] {
  switch (anchor) {
    case "NW":
      return "topleft";
    case "NE":
      return "topright";
    case "SW":
      return "botleft";
    case "SE":
      return "botright";
    default:
      unreachable(anchor);
  }
}

function toVimBorder(
  border: Border,
): {
  border: vimFn.PopupCreateOptions["border"];
  borderchars: vimFn.PopupCreateOptions["borderchars"];
} {
  if (typeof border === "string") {
    switch (border) {
      case "single":
        return {
          border: [],
          borderchars: ["─", "│", "─", "│", "┌", "┐", "┘", "└"],
        };
      case "double":
        return {
          border: [],
          borderchars: ["═", "║", "═", "║", "╔", "╗", "╝", "╚"],
        };
      case "rounded":
        return {
          border: [],
          borderchars: ["─", "│", "─", "│", "╭", "╮", "╯", "╰"],
        };
      default:
        unreachable(border);
    }
  }
  const [lt, t, rt, r, rb, b, lb, l] = border;
  return {
    border: [t ? 1 : 0, r ? 1 : 0, b ? 1 : 0, l ? 1 : 0],
    borderchars: [t, r, b, l, lt, rt, rb, lb],
  };
}
