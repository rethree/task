import { exec as interpret } from "./interpreter";
import { OptionOf } from "./options";
import { Computation, Func, Options, TaskDef, _ } from "./types";

const task = <a>(
  action: (fa: Func<_, void>) => void,
  queue: Computation[]
): TaskDef<a> => ({
  map: (ab, resume?) => task(action, [...queue, [ab, resume]]),
  chain: (atb, resume?) => task(action, [...queue, [atb, resume]]),
  then(done) {
    try {
      action(x => interpret(x, queue, done));
    } catch (fault) {
      done(OptionOf<a>().Faulted({ fault }));
    }
  }
});

export const Task = <a>(action: (fa: Func<a, void>) => void): TaskDef<a> => {
  const option = OptionOf<a>();
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
