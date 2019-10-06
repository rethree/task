import { OptionOf, Option } from "./options";
import { Func } from "./types";

const join = (x: any) => (Option.is.Completed(x) ? x.value : x);

export const tryCatch = <a, b>(f: Func<a, b | PromiseLike<b>>) => async (
  x: a
) => {
  const { Completed, Faulted } = OptionOf<b>();
  try {
    const value = await join(f(x));
    return Completed({ value });
  } catch (fault) {
    return Faulted({ fault, meta: { args: x } });
  }
};
