export type CommandOptions = {
  overwrite?: boolean;
  attr?: {
    nargs?: "0" | "1" | "+" | "?" | "*";
    complete?:
      | "arglist"
      | "augroup"
      | "buffer"
      | "behave"
      | "color"
      | "command"
      | "compiler"
      | "cscope"
      | "dir"
      | "environment"
      | "event"
      | "expression"
      | "file"
      | "file_in_path"
      | "filetype"
      | "function"
      | "help"
      | "highlight"
      | "history"
      | "locale"
      | "mapclear"
      | "mapping"
      | "menu"
      | "messages"
      | "option"
      | "packadd"
      | "shellcmd"
      | "sign"
      | "syntax"
      | "syntime"
      | "tag"
      | "tag_listfiles"
      | "user"
      | "var"
      | "custom"
      | "customlist";
    custom?: string;
    customlist?: string;
    range?: number | "%" | true;
    count?: number | true;
    addr?:
      | "lines"
      | "arguments"
      | "buffers"
      | "loaded_buffers"
      | "windows"
      | "tabs"
      | "quickfix"
      | "other";
    bang?: boolean;
    bar?: boolean;
    register?: boolean;
    buffer?: boolean;
  };
};
