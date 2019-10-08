import { next } from './next';
import { isOption, OptionOf } from './options';
import { Action, Func, TaskDef } from './types';

const task = <a>(action: Action<a>): TaskDef<a> => ({
  map: xf => task(fb => next(action, xf, fb)),
  chain: xf => task(fb => next(action, xf, fb as any)),
  resume: xf => task(fb => next(action, xf, fb, true)),
  then(done) {
    const { Completed, Faulted } = OptionOf<a>();
    try {
      action((value: any) => {
        isOption<a>(value) ? done(value) : done(Completed({ value }));
      });
    } catch (fault) {
      done(Faulted({ fault }));
    }
  }
});

export const complete = <a>(x: a) => task<a>(f => f(x));

export const fail = <a>(fault: a) =>
  task<a>(f =>
    f(
      OptionOf<a>().Faulted({
        fault
      })
    )
  );

export const Task = <a>(action: (fa: Func<a, void>) => void) => task(action);
