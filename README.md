# @recubed/task

[![Build Status](https://travis-ci.org/rethree/task.svg?branch=master)](https://travis-ci.org/rethree/task)
[![CodeFactor](https://www.codefactor.io/repository/github/rethree/task/badge)](https://www.codefactor.io/repository/github/rethree/task)
[![Coverage Status](https://coveralls.io/repos/github/rethree/task/badge.svg?branch=master)](https://coveralls.io/github/rethree/task?branch=master)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![dependencies
Status](https://david-dm.org/rethree/task/status.svg)](https://david-dm.org/rethree/task)
[![devDependencies Status](https://david-dm.org/rethree/task/dev-status.svg)](https://david-dm.org/rethree/task?type=dev)
[![Built with Spacemacs](https://cdn.rawgit.com/syl20bnr/spacemacs/442d025779da2f62fc86c2082703697714db6514/assets/spacemacs-badge.svg)](http://spacemacs.org)

Tiny, monadic, asynchronous primitive. Resembles the native `Promise` interface but differs where that one is considered lacking (by the author, obviously), namely:

#### Laziness

`Task`'s can be mapped and nested without any computation being triggered and will only fire computations when `then` is called.

#### Error handling

`Task`'s do not reject but wrap errors in a variant `Option` type. This approach can help reducing the unhandled rejection issue, minimize forking and simplify mental processing of asynchronous pipelines. In addition, `Task`'s will not proceed with the execution but jump to the completion handler if an error is encountered.

`Task`'s can be created similarly to promises, except that you are not given the rejection callback reference.

```typescript
const task = Task(f => {
  setTimeout(() => f(42), 0);
});

//yes, tasks are awaitable!
const x = await task;
console.log(x);
// { tag: 'completed', value: 42 }
```

Completed and faulted `Task`'s can also be created using the `complete` and `fail` unary constructors respectively. If the initial computation is supposed to run a promise, the `fromPromise` constructor can be of help.


`Task` definition allows 'free' (lazy) mapping (`raw value -> raw value`), chaining (`raw value -> Task | Promise`) and mixing these two. Functions are guaranteed to be run sequentially (in declaration order) whether they are asynchronous or not.

```typescript
const task = Task<number>(f => {
  f(42);
})
  .chain(x => Task<number>(f => setTimeout(() => f(x + 8), 0)))
  .map(x => x + 25)
  .chain(x => Promise.resolve(x + 5))
  .chain(x => Task<number>(f => setTimeout(() => f(x + 20), 0)));

const x = await task;
console.log(x);
// { tag: 'completed', value: 100 }
```

Once `Task` encounters throwing computation it will skip further processing and jump to the final callback carrying the
error wrapped in an `Option` variant type

```typescript
const task = Task<number>(f => {
  f(42);
})
  .chain(x => {
    throw Error(42);
  })
  .map(x => x + 25);

const x = await task;
console.log(x);
// { tag: 'faulted', fault: { message: "42" } }
```

This behaviour can be explicitlly amended by calling the `resume` method (`raw value | Failure -> raw value | Task | Promise`),

```typescript
const task = Task<number>(f => {
  f(42);
})
  .chain(x => {
    throw 10;
    return Task<number>(f => f(x + 8));
  })
  .resume(x => (isFaulted(x) ? x.fault + 32 : 0));

const x = await task;
console.log(x);
// { tag: 'completed', value: 42 } }
```

Last, but not least `Task`'s can be run in "parallel" or concurrently. To be more precise, `Parallel`'ed tasks run within `Promise.all` with the same set of guarantees on the top of the being "unrejectable". Unlike `Promise.all` and like `Promise.allSettled` it will continue running until all the tasks are completed and return a list of results (including failures).

```typescript
const option = await Parallel(complete(10), fail(42));

console.log(option);
// { tag: 'faulted', fault: [ { tag: 'faulted', fault: 42 }, tag: 'completed', value: 10 } ] }
```

#### Incoming

Standard operators, `race` is the first to focus on.
