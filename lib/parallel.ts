import { TaskDef, Options, _ } from "./types";
import { Task } from "./task";
import { isFaulted, Option } from "./options";

const { Completed, Faulted } = Option;

export const Parallel = <a>(...tasks: TaskDef<a>[]): TaskDef<Options<_>[]> =>
  Task(async f => {
    const results = await Promise.all(tasks as any);
    results.some(isFaulted)
      ? f(Faulted({ fault: results }) as any)
      : f(Completed({ value: results }) as any);
  });
