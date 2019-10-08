import { ofType, unionize } from "unionize";
import { Completion, Failure, Options } from "./types";

export const OptionOf = <a>() =>
  unionize({
    Faulted: ofType<Failure>(),
    Completed: ofType<Completion<a>>()
  });

export const Option = OptionOf();

export const isOption = <a>(x: any): x is Options<a> =>
  Option.is.Faulted(x) || Option.is.Completed(x);

export const isFaulted = (x: any): x is Failure => OptionOf().is.Faulted(x);
