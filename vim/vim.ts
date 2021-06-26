import { Context, Denops, Dispatcher } from "../deps.ts";

/**
 * Vim is a facade instance visible from each denops plugins for
 *
 * 1. Communicate with other plugins
 * 2. Communicate with the host (Vim/Neovim)
 * 3. Register them msgpack-rpc APIs
 *
 */
export class Vim {
  #denops: Denops;

  constructor(denops: Denops) {
    this.#denops = denops;
  }

  /**
   * Plugin name
   */
  get name(): string {
    return this.#denops.name;
  }

  /**
   * Call an arbitrary function of Vim/Neovim and return the result
   *
   * @param fn: A function name of Vim/Neovim.
   * @param args: Arguments of the function.
   */
  async call(func: string, ...args: unknown[]): Promise<unknown> {
    return await this.#denops.call(func, ...args);
  }

  /**
   * Execute an arbitrary command of Vim/Neovim under a given context.
   *
   * @param cmd: A command expression to be executed.
   * @param ctx: A context object which is expanded to the local namespace (l:)
   */
  async cmd(cmd: string, ctx: Context = {}): Promise<void> {
    await this.#denops.cmd(cmd, ctx);
  }

  /**
   * Evaluate an arbitrary expression of Vim/Neovim under a given context and return the result.
   *
   * @param expr: An expression to be evaluated.
   * @param ctx: A context object which is expanded to the local namespace (l:)
   */
  async eval(expr: string, ctx: Context = {}): Promise<unknown> {
    return await this.#denops.eval(expr, ctx);
  }

  /**
   * Register plugin APIs
   *
   * @param dispatcher: A collection of the plugin APIs
   */
  register(dispatcher: Dispatcher): void {
    this.#denops.dispatcher = dispatcher;
  }
}
