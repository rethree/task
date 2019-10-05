import { test } from "tap";
import { Task, isFaulted } from "../lib";

test("Task will execute inital synchronous computation", t => {
  const task = Task(f => {
    f(42);
  });

  task.then(option => {
    t.equal(option["value"], 42);
    t.done();
  });
});

test("Task will execute the initial asynchronous computation", t => {
  const task = Task(f => {
    setTimeout(() => f(42), 0);
  });

  task.then(option => {
    t.equal(option["value"], 42);
    t.done();
  });
});

test("Task will execute the initial microtask'ed computation", t => {
  const task = Task(f => {
    queueMicrotask(() => f(42));
  });

  task.then(option => {
    t.equal(option["value"], 42);
    t.done();
  });
});

test("Tasks are awaitable", async t => {
  const task = Task(f => {
    setTimeout(() => f(42), 0);
  });

  const option = await task;
  t.equal(option["value"], 42);
});

test("Task will execute mapped synchronous computations", t => {
  const task = Task<number>(f => {
    f(42);
  })
    .map(x => x + 8)
    .map(x => x + 50);

  task.then(option => {
    t.equal(option["value"], 100);
    t.done();
  });
});

test("Task will execute chained synchronous computations", t => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x => Task<number>(f => f(x + 8)))
    .chain(x => Task(f => f(x + 50)));

  task.then(option => {
    t.equal(option["value"], 100);
    t.done();
  });
});

test("Task will execute chained asynchronous computations", t => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x => Task<number>(f => setTimeout(() => f(x + 8), 0)))
    .chain(x => Task(f => queueMicrotask(() => f(x + 50))));

  task.then(option => {
    t.equal(option["value"], 100);
    t.done();
  });
});

test("Task will execute mixed synchronous computations", t => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x => Task<number>(f => f(x + 8)))
    .map(x => x + 50);

  task.then(option => {
    t.equal(option["value"], 100);
    t.done();
  });
});

test("Task will execute mixed-schedule computations", t => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x => Task<number>(f => setTimeout(() => f(x + 8), 0)))
    .map(x => x + 25)
    .chain(x => Task<number>(f => setTimeout(() => f(x + 25), 0)));

  task.then(option => {
    t.equal(option["value"], 100);
    t.done();
  });
});

test("Throwing synchronous computations will make task jump to completion with fault", t => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x => {
      throw "sup";
      return Task<number>(f => f(x + 8));
    })
    .map(x => x + 50);

  task.then(option => {
    t.equal(option["fault"], "sup");
    t.done();
  });
});

test("Throwing computations will continue if told to resume", t => {
  const task = Task<number>(f => {
    f(42);
  })
    .chain(x => {
      throw "sup";
      return Task<number>(f => f(x + 8));
    }, true)
    .map(x => (isFaulted(x) ? x.fault : x + 50));

  task.then(option => {
    t.equal(option["fault"], "sup");
    t.done();
  });
});

// test("Chain accepts promises", () => {});

// test("Chain accepts tasks", () => {});

// test("Task execution is sequential", () => {});
