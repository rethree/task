import { OptionOf } from "./options";
import { tryCatch } from "./try-catch";
import { Action, Func, Next, Thenable } from "./types";

export const next = <a, b>(
  action: Action<a>,
  xf: Func<a, b> | Func<a, Thenable<b>>,
  fb: Next<b>,
  resume?: true
) =>
  action((x: any) => {
    OptionOf<a>().match(x, {
      Completed: async ({ value }) => fb(await tryCatch(xf)(value)),
      Faulted: async () => (resume ? fb(await tryCatch(xf)(x)) : fb(x)),
      default: async () => fb(await tryCatch(xf)(x))
    });
  });
