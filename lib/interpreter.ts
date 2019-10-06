import { Option, OptionOf } from "./options";
import { Computation, Func, Options, _, Thenable } from "./types";

const { Completed, Faulted } = Option;

export const init = <a, b>(
  [[f], ...fs]: Computation[],
  done: Func<Options<a>, b>
) => {
  const { Completed, Faulted } = OptionOf<a>();
  try {
    f((value: a) => {
      fs.length > 0 ? fold(value, fs, done) : done(Completed({ value }));
    });
  } catch (fault) {
    done(Faulted({ fault }));
  }
};

const fold = async (
  maybeThenable: _ | Thenable<_>,
  [[f, resumable], ...fs]: Computation[],
  done: Func<Options<_>, _>
) => {
  const active = fs.length > 0;
  try {
    const x = await maybeThenable;
    const something = (await f(x)) as any;

    Option.match(something, {
      Completed: ({ value }) => {
        active ? fold(value, fs, done) : done(something);
      },
      Faulted: _ => {
        active && resumable ? fold(something, fs, done) : done(something);
      },
      default: _ => {
        active
          ? fold(something, fs, done)
          : done(Completed({ value: something }));
      }
    });
  } catch (fault) {
    const failure = Faulted({ fault });
    active && resumable ? fold(failure, fs, done) : done(failure);
  }
};
