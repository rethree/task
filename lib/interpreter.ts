import { O } from "./options";
import { Computation, Func, Options, _ } from "./types";

export const exec = async (
  x: _,
  [[f, blocking, resumable], ...fs]: Computation[],
  done: Func<Options<_>, _>
) => {
  try {
    const something = f(x);
    const maybeOption = blocking ? await something : (something as any);
    const active = fs.length > 0;

    O.match(maybeOption, {
      Faulted: _ =>
        resumable && active ? exec(maybeOption, fs, done) : done(maybeOption),
      Completed: ({ value }) =>
        active ? exec(value, fs, done) : done(maybeOption),
      default: value =>
        active ? exec(value, fs, done) : done(O.Completed({ value }))
    });
  } catch (fault) {
    done(O.Faulted({ fault }));
  }
};
