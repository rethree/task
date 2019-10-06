import { Option, OptionOf } from "./options";
import { Computation, Func, Options, _ } from "./types";

const join = (x: any) => (Option.is.Completed(x) ? x.value : x);

export const exec = <a, b>(
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

const fold = (
  x: _,
  [[f, resumable], ...fs]: Computation[],
  done: Func<Options<_>, _>
) => {
  const active = fs.length > 0;
  const { Completed, Faulted } = Option;
  const c =
    typeof x === "object" && "then" in (x as any)
      ? x
      : Promise.resolve(join(x));

  (c as PromiseLike<_>)["then"](x => {
    try {
      console.log(x);
      const value = f(x);
      active ? fold(value, fs, done) : done(Completed({ value }));
    } catch (fault) {
      const failure = Faulted({ fault });
      resumable ? fold(failure, fs, done) : done(failure);
    }
  });
};
