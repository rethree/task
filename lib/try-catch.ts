import { OptionOf, isOption } from "./options";
import { Options, Thenable } from "./types";

export const tryCatch = <a, b>(
  f: (x: a | Options<a>) => b | Thenable<b>
) => async (x: a | Options<a>) => {
  const { Completed, Faulted } = OptionOf<b>();
  try {
    const value = await f(x);
    return isOption<b>(value) ? value : Completed({ value });
  } catch (fault) {
    return Faulted({ fault });
  }
};
