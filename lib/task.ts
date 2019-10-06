import { init as runInterpreter } from "./interpreter";
import { Computation, Func, TaskDef } from "./types";

const task = <a>(...queue: Computation[]): TaskDef<a> => ({
  map: (ab, resume?) => task(...queue, [ab, resume]),
  chain: (atb, resume?) => task(...queue, [atb, resume]),
  then(done) {
    runInterpreter(queue, done);
  }
});

export const Task = <a>(action: (fa: Func<a, void>) => void): TaskDef<a> =>
  task([action, true]);
