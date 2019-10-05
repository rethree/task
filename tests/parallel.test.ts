// import { test } from 'tap';
// import { complete, fail, isFaulted, Parallel } from '../lib';
// import { expectCompleted, expectFaulted } from './utils';

// test('the amount of results returned is equal to the amount of tasks provided', async t => {
//   const res = await Parallel<any>(complete(42), fail(9001), complete('sup'))();

//   t.equal(res.length, 3);
// });

// test('successful tasks results are being carried over', async t => {
//   const res = await Parallel(complete(42), complete(9001))();

//   expectCompleted(res, t, ([{ value }]) => t.equal(value, 42));
// });

// test('faulted tasks results are being carried over', async t => {
//   const res = await Parallel(fail(42), fail(9001))();

//   expectFaulted(res, t, errors => {
//     t.equal(errors.length, 2);
//     t.ok(errors.some(({ fault }) => fault === 42));
//     t.ok(errors.some(({ fault }) => fault === 9001));
//   });
// });

// test('mixed-results tasks results are being carried over', async t => {
//   const tasks = await Parallel(fail(42), complete(9001))();

//   expectFaulted(tasks.filter(isFaulted), t, ([{ fault }]) =>
//     t.equal(fault, 42)
//   );
//   expectCompleted(tasks.filter(x => !isFaulted(x)), t, ([{ value }]) =>
//     t.equal(value, 9001)
//   );
// });
