import { Option } from "./options";
import { Computation, Func, Options, TaskDef, _ } from "./types";
import { exec as interpret } from "./interpreter";

const task = <a>(
  action: (fa: Func<_, void>) => void,
  q: Computation[]
): TaskDef<a> => ({
  map: (ab, resume) => task(action, [...q, [ab, false, resume]]),
  chain: (atb, resume) => task(action, [...q, [atb, true, resume]]),
  then(done) {
    try {
      action(x => interpret(x, q, done));
    } catch (fault) {
      done(Option<a>().Faulted({ fault }));
    }
  }
});

export const Task = <a>(action: (fa: (x: a) => void) => void): TaskDef<a> => {
  const option = Option<a>();
  return {
    ...task(action, []),
    then: <b>(done: Func<Options<a>, b>) => {
      try {
        action(value => {
          done(option.Completed({ value }));
        });
      } catch (fault) {
        done(option.Faulted({ fault }));
      }
    }
  };
};
