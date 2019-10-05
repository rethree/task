import { ofType, unionize } from "unionize";
import { Completion, Failure, Options, _ } from "./types";

export const OptionOf = <a>() =>
  unionize({
    Faulted: ofType<Failure>(),
    Completed: ofType<Completion<a>>()
  });

export const Option = OptionOf();

export const isFaulted = (x: any): x is Failure => OptionOf().is.Faulted(x);

export const allCompleted = <a>(
  x: Options<a>[]
): x is ({ tag: "Completed" } & Completion<a>)[] => !x.some(isFaulted);
