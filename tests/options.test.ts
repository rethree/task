import { test } from 'tap';
import { isFaulted, Option, allCompleted } from '../lib';
import { Options } from '../lib/types';

const { Faulted, Completed } = Option();

test('isFaulted detects faulted variant', async t => {
  const fault = Faulted({ fault: Error('42') });

  t.true(isFaulted(fault));
});

test('allCompleted detects failures withing mixed results', async t => {
  const xs = [Faulted({ fault: Error('42') }), Completed({ value: 42 })];

  t.false(allCompleted(xs));
});

test('allCompleted detects failures withing failed results', async t => {
  const xs = [Faulted({ fault: Error('42') }), Faulted({ fault: 42 })];

  t.false(allCompleted(xs));
});

test('allCompleted detects complete-only results', async t => {
  const xs: Options<any>[] = [
    Completed({ value: '9001' }),
    Completed({ value: 42 })
  ];

  t.true(allCompleted(xs));
});

test('Options are matched structurally', async t => {
  const optsX = Option();
  const optsY = Option();
  const x = optsX.Completed({ value: 4 });
  const y = optsY.Completed({ value: 4 });

  t.true(optsY.is.Completed(x));
  t.true(optsY.is.Completed(y));
});
