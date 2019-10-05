import { Completion, Failure, Options } from '../lib/types';
import { allCompleted, isFaulted } from '../lib';

export const expectFaulted = <a>(
  task: Options<a>[],
  t: any,
  test: (results: Failure[]) => PromiseLike<void> | void
) => {
  if (!allCompleted(task)) test(task.filter(isFaulted));
  else t.fail('task is in an unexpected (successful) state');
};

export const expectCompleted = <a>(
  task: Options<a>[],
  t: any,
  test: (completed: Completion<a>[]) => PromiseLike<void> | void
) => {
  if (allCompleted(task)) test(task);
  else t.fail('task is in an unexpected (faulted) state');
};
