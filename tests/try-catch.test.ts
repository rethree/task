import { Option } from "../lib";
import { tryCatch } from "../lib/try-catch";

const { Completed, Faulted } = Option;

test("tryCatch returns Failure for throwing computations", async () => {
  const f = async () => {
    throw 42;
  };
  const option = await tryCatch(f)(0);

  expect(option).toStrictEqual(Faulted({ fault: 42 }));
});

test("tryCatch returns Completion for successful computations", async () => {
  const f = (x: number) => Promise.resolve(42 + x);
  const option = await tryCatch(f)(0);

  expect(option).toStrictEqual(Completed({ value: 42 }));
});

test("tryCatch accepts synchronous functions", async () => {
  const f = (x: number) => 42 + x;
  const option = await tryCatch(f)(0);

  expect(option).toStrictEqual(Completed({ value: 42 }));
});

test("tryCatch flattens options", async () => {
  const f = (x: number) => Promise.resolve(Completed({ value: 42 + x }));
  const option = await tryCatch(f)(0);

  expect(option).toStrictEqual(Completed({ value: 42 }));
});
