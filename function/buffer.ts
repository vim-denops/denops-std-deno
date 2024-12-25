import type { Denops } from "../mod.ts";
import type { BufInfo, ChangeList, MarkInformation } from "./types.ts";

/**
 * If the **{buf}** argument is a number, buffer numbers are used.
 * Number zero is the alternate buffer for the current window.
 *
 * If the **{buf}** argument is a string it must match a buffer name
 * exactly.  The name can be:
 * - Relative to the current directory.
 * - A full path.
 * - The name of a buffer with 'buftype' set to "nofile".
 * - A URL name.
 */
export type BufExistsArg = string | number;

/**
 * If **{buf}** is omitted the current buffer is used.
 * If **{buf}** is a Number, that buffer number's name is given.
 * Number zero is the alternate buffer for the current window.
 * If **{buf}** is a String, it is used as a `file-pattern` to match
 * with the buffer names.  This is always done like 'magic' is
 * set and 'cpoptions' is empty.  When there is more than one
 * match an empty string is returned.
 * "" or "%" can be used for the current buffer, "#" for the
 * alternate buffer.
 * A full match is preferred, otherwise a match at the start, end
 * or middle of the buffer name is accepted.  If you only want a
 * full match then put "^" at the start and "$" at the end of the
 * pattern.
 */
export type BufNameArg = string | number;

/**
 * For **{lnum}** and **{end}** "$" can be used for the last line of the
 * buffer.  Otherwise a number must be used.
 */
export type BufLnumArg = "$" | number;

/**
 * Only the buffers matching the specified criteria are returned.
 */
export interface GetBufInfoDictArg {
  /** Include only listed buffers. */
  buflisted?: boolean;
  /** Include only loaded buffers. */
  bufloaded?: boolean;
  /** Include only modified buffers. */
  bufmodified?: boolean;
}

/**
 * Like `append()` but append the text in buffer **{buf}**.
 *
 * This function works only for loaded buffers. First call
 * `bufload()` if needed.
 *
 * For the use of **{buf}**, see `bufname()`.
 *
 * **{lnum}** is the line number to append below.  Note that using
 * `line()` would use the current buffer, not the one appending
 * to.  Use "$" to append at the end of the buffer.  Other string
 * values are not supported.
 *
 * On success 0 is returned, on failure 1 is returned.
 * In `Vim9` script an error is given for an invalid **{lnum}**.
 *
 * If **{buf}** is not a valid buffer or **{lnum}** is not valid, an
 * error message is given. Example:
 *
 *     :let failed = appendbufline(13, 0, "# THE START")
 *
 * However, when **{text}** is an empty list then no error is given
 * for an invalid **{lnum}**, since **{lnum}** isn't actually used.
 *
 * Can also be used as a `method` after a List, the base is
 * passed as the second argument:
 *
 *     mylist->appendbufline(buf, lnum)
 */
export async function appendbufline(
  denops: Denops,
  buf: BufNameArg,
  lnum: BufLnumArg,
  text: string | string[],
): Promise<number> {
  return await denops.call("appendbufline", buf, lnum, text) as number;
}

/**
 * Add a buffer to the buffer list with name **{name}** (must be a
 * String).
 * If a buffer for file **{name}** already exists, return that buffer
 * number.  Otherwise return the buffer number of the newly
 * created buffer.  When **{name}** is an empty string then a new
 * buffer is always created.
 * The buffer will not have 'buflisted' set and not be loaded
 * yet.  To add some text to the buffer use this:
 *
 *     let bufnr = bufadd('someName')
 *     call bufload(bufnr)
 *     call setbufline(bufnr, 1, ['some', 'text'])
 *
 * Returns 0 on error.
 * Can also be used as a `method`:
 *
 *     let bufnr = 'somename'->bufadd()
 */
export async function bufadd(
  denops: Denops,
  name: string,
): Promise<number> {
  const bufnr = await denops.call("bufadd", name);
  return bufnr as number;
}

/**
 * The result is a Number, which is `TRUE` if a buffer called
 * **{buf}** exists.
 * If the **{buf}** argument is a number, buffer numbers are used.
 * Number zero is the alternate buffer for the current window.
 *
 * If the **{buf}** argument is a string it must match a buffer name
 * exactly.  The name can be:
 * - Relative to the current directory.
 * - A full path.
 * - The name of a buffer with 'buftype' set to "nofile".
 * - A URL name.
 * Unlisted buffers will be found.
 * Note that help files are listed by their short name in the
 * output of `:buffers`, but bufexists() requires using their
 * long name to be able to find them.
 * bufexists() may report a buffer exists, but to use the name
 * with a `:buffer` command you may need to use `expand()`.  Esp
 * for MS-Windows 8.3 names in the form `"c:\DOCUME~1"`
 * Use "bufexists(0)" to test for the existence of an alternate
 * file name.
 *
 * Can also be used as a `method`:
 *
 *     let exists = 'somename'->bufexists()
 *
 * Obsolete name: buffer_exists().
 */
export async function bufexists(
  denops: Denops,
  buf: BufExistsArg,
): Promise<boolean> {
  const result = await denops.call("bufexists", buf) as number;
  return !!result;
}

/**
 * The result is a Number, which is `TRUE` if a buffer called
 * **{buf}** exists and is listed (has the 'buflisted' option set).
 * The **{buf}** argument is used like with `bufexists()`.
 *
 * Can also be used as a `method`:
 *
 *     let listed = 'somename'->buflisted()
 */
export async function buflisted(
  denops: Denops,
  buf: BufExistsArg,
): Promise<boolean> {
  const result = await denops.call("buflisted", buf) as number;
  return !!result;
}

/**
 * Ensure the buffer **{buf}** is loaded.  When the buffer name
 * refers to an existing file then the file is read.  Otherwise
 * the buffer will be empty.  If the buffer was already loaded
 * then there is no change.  If the buffer is not related to a
 * file then no file is read (e.g., when 'buftype' is "nofile").
 * If there is an existing swap file for the file of the buffer,
 * there will be no dialog, the buffer will be loaded anyway.
 * The **{buf}** argument is used like with `bufexists()`.
 *
 * Can also be used as a `method`:
 *
 *     eval 'somename'->bufload()
 */
export async function bufload(
  denops: Denops,
  buf: BufExistsArg,
): Promise<void> {
  await denops.call("bufload", buf);
}

/**
 * The result is a Number, which is `TRUE` if a buffer called
 * **{buf}** exists and is loaded (shown in a window or hidden).
 * The **{buf}** argument is used like with `bufexists()`.
 *
 * Can also be used as a `method`:
 *
 *     let loaded = 'somename'->bufloaded()
 */
export async function bufloaded(
  denops: Denops,
  buf: BufExistsArg,
): Promise<boolean> {
  const result = await denops.call("bufloaded", buf) as number;
  return !!result;
}

/**
 * The result is the name of a buffer.  Mostly as it is displayed
 * by the `:ls` command, but not using special names such as
 * "[No Name]".
 * If **{buf}** is omitted the current buffer is used.
 * If **{buf}** is a Number, that buffer number's name is given.
 * Number zero is the alternate buffer for the current window.
 * If **{buf}** is a String, it is used as a `file-pattern` to match
 * with the buffer names.  This is always done like 'magic' is
 * set and 'cpoptions' is empty.  When there is more than one
 * match an empty string is returned.
 * "" or "%" can be used for the current buffer, "#" for the
 * alternate buffer.
 * A full match is preferred, otherwise a match at the start, end
 * or middle of the buffer name is accepted.  If you only want a
 * full match then put "^" at the start and "$" at the end of the
 * pattern.
 * Listed buffers are found first.  If there is a single match
 * with a listed buffer, that one is returned.  Next unlisted
 * buffers are searched for.
 * If the **{buf}** is a String, but you want to use it as a buffer
 * number, force it to be a Number by adding zero to it:
 *
 *     :echo bufname("3" + 0)
 *
 * Can also be used as a `method`:
 *
 *     echo bufnr->bufname()
 *
 * If the buffer doesn't exist, or doesn't have a name, an empty
 * string is returned.
 *
 *     bufname("#")            alternate buffer name
 *     bufname(3)              name of buffer 3
 *     bufname("%")            name of current buffer
 *     bufname("file2")        name of buffer where "file2" matches.
 *
 * Obsolete name: buffer_name().
 */
export async function bufname(
  denops: Denops,
  buf?: BufNameArg,
): Promise<string> {
  return await denops.call("bufname", buf) as string;
}

/**
 * The result is the number of a buffer, as it is displayed by
 * the `:ls` command.  For the use of **{buf}**, see `bufname()`
 * above.
 *
 * If the buffer doesn't exist, -1 is returned.  Or, if the
 * **{create}** argument is present and TRUE, a new, unlisted,
 * buffer is created and its number is returned.  Example:
 *
 *     let newbuf = bufnr('Scratch001', 1)
 *
 * Using an empty name uses the current buffer. To create a new
 * buffer with an empty name use `bufadd()`.
 *
 * bufnr("$") is the last buffer:
 *
 *     :let last_buffer = bufnr("$")
 *
 * The result is a Number, which is the highest buffer number
 * of existing buffers.  Note that not all buffers with a smaller
 * number necessarily exist, because ":bwipeout" may have removed
 * them.  Use bufexists() to test for the existence of a buffer.
 *
 * Can also be used as a `method`:
 *
 *     echo bufref->bufnr()
 *
 * Obsolete name: buffer_number().
 *
 * Obsolete name for bufnr("$"): last_buffer_nr().
 */
export async function bufnr(
  denops: Denops,
  buf?: BufNameArg,
  create?: boolean,
): Promise<number> {
  return await denops.call("bufnr", buf, create) as number;
}

/**
 * The result is a Number, which is the `window-ID` of the first
 * window associated with buffer **{buf}**.  For the use of **{buf}**,
 * see `bufname()` above.  If buffer **{buf}** doesn't exist or
 * there is no such window, -1 is returned.  Example:
 *
 *     echo "A window containing buffer 1 is " .. (bufwinid(1))
 *
 * Only deals with the current tab page.  See `win_findbuf()` for
 * finding more.
 *
 * Can also be used as a `method`:
 *
 *     FindBuffer()->bufwinid()
 */
export async function bufwinid(
  denops: Denops,
  buf: BufNameArg,
): Promise<number> {
  return await denops.call("bufwinid", buf) as number;
}

/**
 * Like `bufwinid()` but return the window number instead of the
 * `window-ID`.
 * If buffer **{buf}** doesn't exist or there is no such window, -1
 * is returned.  Example:
 *
 *     echo "A window containing buffer 1 is " .. (bufwinnr(1))
 *
 * The number can be used with `CTRL-W_w` and ":wincmd w"
 * `:wincmd`.
 *
 * Can also be used as a `method`:
 *
 *     FindBuffer()->bufwinnr()
 */
export async function bufwinnr(
  denops: Denops,
  buf: BufNameArg,
): Promise<number> {
  return await denops.call("bufwinnr", buf) as number;
}

/**
 * Delete lines **{first}** to **{last}** (inclusive) from buffer **{buf}**.
 * If **{last}** is omitted then delete line **{first}** only.
 * On success 0 is returned, on failure 1 is returned.
 *
 * This function works only for loaded buffers. First call
 * `bufload()` if needed.
 *
 * For the use of **{buf}**, see `bufname()` above.
 *
 * **{first}** and **{last}** are used like with `getline()`. Note that
 * when using `line()` this refers to the current buffer. Use "$"
 * to refer to the last line in buffer **{buf}**.
 *
 * Can also be used as a `method`:
 *
 *     GetBuffer()->deletebufline(1)
 */
export async function deletebufline(
  denops: Denops,
  buf: BufNameArg,
  first: BufLnumArg,
  last?: BufLnumArg,
): Promise<number> {
  return await denops.call("deletebufline", buf, first, last) as number;
}

/**
 * Get information about buffers as a List of Dictionaries.
 *
 * Without an argument information about all the buffers is
 * returned.
 *
 * When the argument is a `Dictionary` only the buffers matching
 * the specified criteria are returned.  The following keys can
 * be specified in **{dict}**:
 *         buflisted       include only listed buffers.
 *         bufloaded       include only loaded buffers.
 *         bufmodified     include only modified buffers.
 *
 * Otherwise, **{buf}** specifies a particular buffer to return
 * information for.  For the use of **{buf}**, see `bufname()`
 * above.  If the buffer is found the returned List has one item.
 * Otherwise the result is an empty list.
 *
 * Each returned List item is a dictionary with the following
 * entries:
 *         bufnr           Buffer number.
 *         changed         TRUE if the buffer is modified.
 *         changedtick     Number of changes made to the buffer.
 *         command         TRUE if the buffer belongs to the
 *                         command-line window `cmdwin`.
 *         hidden          TRUE if the buffer is hidden.
 *         lastused        Timestamp in seconds, like
 *                         `localtime()`, when the buffer was
 *                         last used.
 *                         *only with the `+viminfo` feature*
 *         listed          TRUE if the buffer is listed.
 *         lnum            Line number used for the buffer when
 *                         opened in the current window.
 *                         Only valid if the buffer has been
 *                         displayed in the window in the past.
 *                         If you want the line number of the
 *                         last known cursor position in a given
 *                         window, use `line()`:
 *
 *                             :echo line('.', {winid})
 *
 *         linecount       Number of lines in the buffer (only
 *                         valid when loaded)
 *         loaded          TRUE if the buffer is loaded.
 *         name            Full path to the file in the buffer.
 *         signs           List of signs placed in the buffer.
 *                         Each list item is a dictionary with
 *                         the following fields:
 *                             id    sign identifier
 *                             lnum  line number
 *                             name  sign name
 *         variables       A reference to the dictionary with
 *                         buffer-local variables.
 *         windows         List of `window-ID`s that display this
 *                         buffer
 *         popups          List of popup `window-ID`s that
 *                         display this buffer
 *
 * Examples:
 *
 *     for buf in getbufinfo()
 *         echo buf.name
 *     endfor
 *     for buf in getbufinfo({'buflisted':1})
 *         if buf.changed
 *             ....
 *         endif
 *     endfor
 *
 * To get buffer-local options use:
 *
 *     getbufvar({bufnr}, '&option_name')
 *
 * Can also be used as a `method`:
 *
 *     GetBufnr()->getbufinfo()
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
  const bufinfos = await denops.call("getbufinfo", ...args) as Record<
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

/**
 * Return a `List` with the lines starting from **{lnum}** to **{end}**
 * (inclusive) in the buffer **{buf}**.  If **{end}** is omitted, a
 * `List` with only the line **{lnum}** is returned.  See
 * `getbufoneline()` for only getting the line.
 *
 * For the use of **{buf}**, see `bufname()` above.
 *
 * For **{lnum}** and **{end}** "$" can be used for the last line of the
 * buffer.  Otherwise a number must be used.
 *
 * When **{lnum}** is smaller than 1 or bigger than the number of
 * lines in the buffer, an empty `List` is returned.
 *
 * When **{end}** is greater than the number of lines in the buffer,
 * it is treated as **{end}** is set to the number of lines in the
 * buffer.  When **{end}** is before **{lnum}** an empty `List` is
 * returned.
 *
 * This function works only for loaded buffers.  For unloaded and
 * non-existing buffers, an empty `List` is returned.
 *
 * Example:
 *
 *     :let lines = getbufline(bufnr("myfile"), 1, "$")
 *
 * Can also be used as a `method`:
 *
 *     GetBufnr()->getbufline(lnum)
 */
export async function getbufline(
  denops: Denops,
  buf: BufNameArg,
  lnum: BufLnumArg,
  end?: BufLnumArg,
): Promise<string[]> {
  return await denops.call("getbufline", buf, lnum, end) as string[];
}

/**
 * The result is the value of option or local buffer variable
 * **{varname}** in buffer **{buf}**.  Note that the name without "b:"
 * must be used.
 * The **{varname}** argument is a string.
 * When **{varname}** is empty returns a `Dictionary` with all the
 * buffer-local variables.
 * When **{varname}** is equal to "&" returns a `Dictionary` with all
 * the buffer-local options.
 * Otherwise, when **{varname}** starts with "&" returns the value of
 * a buffer-local option.
 * This also works for a global or buffer-local option, but it
 * doesn't work for a global variable, window-local variable or
 * window-local option.
 * For the use of **{buf}**, see `bufname()` above.
 * When the buffer or variable doesn't exist **{def}** or an empty
 * string is returned, there is no error message.
 * Examples:
 *
 *     :let bufmodified = getbufvar(1, "&mod")
 *     :echo "todo myvar = " .. getbufvar("todo", "myvar")
 *
 * Can also be used as a `method`:
 *
 *     GetBufnr()->getbufvar(varname)
 */
export function getbufvar(
  denops: Denops,
  buf: BufNameArg,
  varname: "" | "&",
  def?: unknown,
): Promise<Record<string, unknown>>;
export function getbufvar(
  denops: Denops,
  buf: BufNameArg,
  varname: string,
  def?: unknown,
): Promise<unknown>;
export function getbufvar(
  denops: Denops,
  ...args: unknown[]
): Promise<unknown> {
  return denops.call("getbufvar", ...args);
}

/**
 * Returns the `changelist` for the buffer **{buf}**. For the use
 * of **{buf}**, see `bufname()` above. If buffer **{buf}** doesn't
 * exist, an empty list is returned.
 *
 * The returned list contains two entries: a list with the change
 * locations and the current position in the list.  Each
 * entry in the change list is a dictionary with the following
 * entries:
 *         col             column number
 *         coladd          column offset for 'virtualedit'
 *         lnum            line number
 * If buffer **{buf}** is the current buffer, then the current
 * position refers to the position in the list. For other
 * buffers, it is set to the length of the list.
 *
 * Can also be used as a `method`:
 *
 *     GetBufnr()->getchangelist()
 */
export async function getchangelist(
  denops: Denops,
  buf?: BufNameArg,
): Promise<ChangeList | []> {
  return await denops.call("getchangelist", buf) as ChangeList;
}

/**
 * Without the **{buf}** argument returns a `List` with information
 * about all the global marks. `mark`
 *
 * If the optional **{buf}** argument is specified, returns the
 * local marks defined in buffer **{buf}**.  For the use of **{buf}**,
 * see `bufname()`.  If **{buf}** is invalid, an empty list is
 * returned.
 *
 * Each item in the returned List is a `Dict` with the following:
 *     mark   name of the mark prefixed by "'"
 *     pos    a `List` with the position of the mark:
 *                 [bufnum, lnum, col, off]
 *            Refer to `getpos()` for more information.
 *     file   file name
 *
 * Refer to `getpos()` for getting information about a specific
 * mark.
 *
 * Can also be used as a `method`:
 *
 *     GetBufnr()->getmarklist()
 */
export async function getmarklist(
  denops: Denops,
  buf?: BufNameArg,
): Promise<MarkInformation[]> {
  return await denops.call("getmarklist", buf) as MarkInformation[];
}

/**
 * Set line **{lnum}** to **{text}** in buffer **{buf}**.  This works like
 * `setline()` for the specified buffer.
 *
 * This function works only for loaded buffers. First call
 * `bufload()` if needed.
 *
 * To insert lines use `appendbufline()`.
 * Any text properties in **{lnum}** are cleared.
 *
 * **{text}** can be a string to set one line, or a List of strings
 * to set multiple lines.  If the List extends below the last
 * line then those lines are added.  If the List is empty then
 * nothing is changed and zero is returned.
 *
 * For the use of **{buf}**, see `bufname()` above.
 *
 * **{lnum}** is used like with `setline()`.
 * Use "$" to refer to the last line in buffer **{buf}**.
 * When **{lnum}** is just below the last line the **{text}** will be
 * added below the last line.
 *
 * When **{buf}** is not a valid buffer, the buffer is not loaded or
 * **{lnum}** is not valid then 1 is returned.  In `Vim9` script an
 * error is given.
 * On success 0 is returned.
 *
 * Can also be used as a `method`, the base is passed as the
 * third argument:
 *
 *     GetText()->setbufline(buf, lnum)
 */
export async function setbufline(
  denops: Denops,
  buf: BufNameArg,
  lnum: BufLnumArg,
  text: string | string[],
): Promise<boolean> {
  const result = await denops.call("setbufline", buf, lnum, text) as number;
  return !!result;
}

/**
 * Set option or local variable **{varname}** in buffer **{buf}** to
 * **{val}**.
 * This also works for a global or local window option, but it
 * doesn't work for a global or local window variable.
 * For a local window option the global value is unchanged.
 * For the use of **{buf}**, see `bufname()` above.
 * The **{varname}** argument is a string.
 * Note that the variable name without "b:" must be used.
 * Examples:
 *
 *     :call setbufvar(1, "&mod", 1)
 *     :call setbufvar("todo", "myvar", "foobar")
 *
 * This function is not available in the `sandbox`.
 *
 * Can also be used as a `method`, the base is passed as the
 * third argument:
 *
 *     GetValue()->setbufvar(buf, varname)
 */
export async function setbufvar(
  denops: Denops,
  buf: BufNameArg,
  varname: string,
  val: unknown,
): Promise<void> {
  await denops.call("setbufvar", buf, varname, val);
}

/**
 * The result is the swap file path of the buffer **{expr}**.
 * For the use of **{buf}**, see `bufname()` above.
 * If buffer **{buf}** is the current buffer, the result is equal to
 * `:swapname` (unless there is no swap file).
 * If buffer **{buf}** has no swap file, returns an empty string.
 *
 * Can also be used as a `method`:
 *
 *     GetBufname()->swapname()
 */
export async function swapname(
  denops: Denops,
  buf: BufNameArg,
): Promise<string> {
  return await denops.call("swapname", buf) as string;
}
