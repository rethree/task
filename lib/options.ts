import { ofType, unionize } from "unionize";
import { Completion, Failure, Options, _ } from "./types";

export const Option = <a>() =>
  unionize({
    Faulted: ofType<Failure>(),
    Completed: ofType<Completion<a>>()
  });

export const O = Option();

export const isFaulted = (x: any): x is Failure => Option().is.Faulted(x);

export const allCompleted = <a>(
  x: Options<a>[]
): x is ({ tag: "Completed" } & Completion<a>)[] => !x.some(isFaulted);
