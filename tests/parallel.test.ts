import delay from 'delay';
import { Parallel, Task, complete, fail, Option } from '../lib';

const { Completed, Faulted } = Option;

test('the amount of results returned is equal to the amount of tasks provided', async () => {
  const res = await Parallel(
    Task(f => f(42)),
    complete(9001),
    Task(async f => {
      await delay(100);
      f(42);
    })
  );

  expect(res['value']).toHaveLength(3);
});

test('all-successful parallel is considered successful', async () => {
  const res = await Parallel(complete(42), complete(9001));

  expect(res).toStrictEqual(
    Completed({
      value: [ Completed({ value: 42 }), Completed({ value: 9001 }) ]
    })
  );
});

test('all faulted parallel is considered faulted', async () => {
  const res = await Parallel(fail(42), fail(9001));

  expect(res).toStrictEqual(
    Faulted({
      fault: [ Faulted({ fault: 42 }), Faulted({ fault: 9001 }) ]
    })
  );
});

test('mixed-results parallel is considered faulted', async () => {
  const res = await Parallel(fail(42), complete(9001));

  expect(res).toStrictEqual(
    Faulted({
      fault: [ Faulted({ fault: 42 }), Completed({ value: 9001 }) ]
    })
  );
});

test('faulted parallel can be resumed', async () => {
  const res = await Parallel(fail(42), complete(9001)).resume(
    x => x['fault']['length']
  );

  expect(res).toStrictEqual(Completed({ value: 2 }));
});
