import { isFaulted, Task, fromPromise } from '../lib';
import delay from 'delay';

const queueMicrotask = process.nextTick;

test('Task will execute inital synchronous computation', done => {
  const task = Task(f => {
    f(42);
  });

  task.then(option => {
    expect(option['value']).toBe(42);
    done();
  });
});

test('Task will execute the initial asynchronous computation', done => {
  const task = Task(f => {
    setTimeout(() => f(42), 0);
  });

  task.then(option => {
    expect(option['value']).toBe(42);
    done();
  });
});

test("Task will execute the initial microtask'ed computation", done => {
  const task = Task(f => {
    queueMicrotask(() => f(42));
  });

  task.then(option => {
    expect(option['value']).toBe(42);
    done();
  });
});

test('Tasks are awaitable', async () => {
  const task = Task(f => {
    setTimeout(() => f(42), 0);
  });

  const option = await task;
  expect(option['value']).toBe(42);
});

test('Task will execute mapped synchronous computations', done => {
  const task = Task<number>(f => {
    f(42);
  })
    .map(x => x + 8)
    .map(x => x + 50);

  task.then(option => {
    expect(option['value']).toBe(100);
    done();
  });
});

test('Task will execute chained synchronous computations', done => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x => Task<number>(f => f(x + 8)))
    .chain(x => Task(f => f(x + 50)));

  task.then(option => {
    expect(option['value']).toBe(100);
    done();
  });
});

test('Task will execute chained asynchronous computations', done => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x => Task<number>(f => setTimeout(() => f(x + 8), 0)))
    .chain(x => Task(f => queueMicrotask(() => f(x + 50))));

  task.then(option => {
    expect(option['value']).toBe(100);
    done();
  });
});

test('Task will execute mixed synchronous computations', done => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x => Task<number>(f => f(x + 8)))
    .map(x => x + 50);

  task.then(option => {
    expect(option['value']).toBe(100);
    done();
  });
});

test('Task will execute mixed-schedule computations', done => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x => Task<number>(f => setTimeout(() => f(x + 8), 0)))
    .map(x => x + 25)
    .chain(x => Task<number>(f => setTimeout(() => f(x + 25), 0)));

  task.then(option => {
    expect(option['value']).toBe(100);
    done();
  });
});

test('Throwing initial computations will make task jump to completion carrying fault with it', done => {
  const task = Task<number>(f => {
    throw Error('sup');
    f(42);
  });

  task.then(option => {
    expect(option['fault']['message']).toBe('sup');
    done();
  });
});

test('Throwing chained task will make task jump to completion carrying fault with it', done => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x =>
      Task<number>(f => {
        throw Error('sup');
        f(x + 42);
      })
    )
    .map(x => x + 50);

  task.then(option => {
    expect(option['fault']['message']).toBe('sup');
    done();
  });
});

test('Throwing synchronous computations will make task jump to completion carrying fault with it', done => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x => {
      throw Error('sup');
      return Task<number>(f => f(x + 8));
    })
    .map(x => x + 50);

  task.then(option => {
    expect(option['fault']['message']).toBe('sup');
    done();
  });
});

test('Throwing computations will continue if told to resume', done => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x => {
      throw 10;
      return Task<number>(f => f(x + 8));
    })
    .resume(x => (isFaulted(x) ? x.fault + 32 : 0));

  task.then(option => {
    expect(option['value']).toBe(42);
    done();
  });
});

test('Chain accepts promises', done => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x => new Promise<number>(f => setTimeout(() => f(x + 8), 0)))
    .chain(x => Task(f => queueMicrotask(() => f(x + 50))));

  task.then(option => {
    expect(option['value']).toBe(100);
    done();
  });
});

test('Task execution is sequential', done => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x => Task<number>(f => setTimeout(() => f(x / 2), 1000)))
    .chain(x => Task<number>(f => queueMicrotask(() => f(x + 5))))
    .chain(x => Task<number>(f => setTimeout(() => f(x + 5), 0)))
    .map(x => x + 11);

  task.then(option => {
    expect(option['value']).toBe(42);
    done();
  });
});

test.only('Initial asynchronous computation is going to get resolved', done => {
  const task = fromPromise<number>(f => {
    f(delay(100).then(() => Promise.resolve(42)));
  });

  task.then(option => {
    expect(option['value']).toBe(42);
    done();
  });
});
