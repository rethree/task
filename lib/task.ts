import { OptionOf } from './options';
import { tryCatch } from './try-catch';
import { Action, Func, Next, TaskDef, Thenable } from './types';

const next = <a, b>(
  action: Action<a>,
  xf: Func<a, b> | Func<a, Thenable<b>>,
  fb: Next<b>,
  resume?: true
) =>
  action((x: any) => {
    OptionOf<a>().match(x, {
      Completed: async ({ value }) => fb(await tryCatch(xf)(value)),
      Faulted: async () => (resume ? fb(await tryCatch(xf)(x)) : fb(x)),
      default: async () => fb(await tryCatch(xf)(x))
    });
  });

const task = <a>(action: Action<a>): TaskDef<a> => ({
  map: xf => task(fb => next(action, xf, fb)),
  chain: xf => task(fb => next(action, xf, fb as any)),
  resume: xf => task(fb => next(action, xf, fb, true)),
  then(done) {
    try {
      action(async x => {
        const value = (await tryCatch(x => x)(x)) as any;
        done(value);
      });
    } catch (fault) {
      done(OptionOf<a>().Faulted({ fault }));
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

export const fromPromise = <a>(action: (fa: Func<Promise<a>, void>) => void) =>
  task(action);
