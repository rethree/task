import { TaskDef, _, Options } from './types';
import { Task, isFaulted, Option } from '../lib';

const { Faulted } = Option;

export const Parallel = <a>(...tasks: TaskDef<a>[]): TaskDef<Options<_>[]> => {
  const results: Options<_>[] = [];
  return Task(f => {
    tasks.forEach(async task => {
      results.push(await task);
      if (results.length === tasks.length) {
        results.some(isFaulted)
          ? f(Faulted({ fault: results }) as any)
          : f(results);
      }
    });
  });
};
