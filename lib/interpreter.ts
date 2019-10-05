import { Option, OptionOf } from "./options";
import { Computation, Func, Options, _, Thenable } from "./types";

const tryCatch = <a, b>(f: Func<a, b | Thenable<b>>) => async (
  x: a
): Promise<Options<b>> => {
  const option = OptionOf<b>();
  try {
    const value = (await f(x)) as any;
    return option.match(value, {
      Completed: _ => value,
      Faulted: _ => value,
      default: _ => option.Completed({ value })
    });
  } catch (fault) {
    return option.Faulted({ fault, meta: { args: x } });
  }
};

export const exec = async (
  x: _,
  [[f, resumable], ...fs]: Computation[],
  done: Func<Options<_>, _>
) => {
  const active = fs.length > 0;
  const option = await tryCatch(f)(x);

  Option.match(option, {
    Faulted: _ => (resumable && active ? exec(option, fs, done) : done(option)),
    Completed: ({ value }) => (active ? exec(value, fs, done) : done(option))
  });
};
