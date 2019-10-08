import { isFaulted, isOption, Option } from "../lib";

const { Faulted, Completed } = Option;

test("isOption recognizes failures", async () => {
  const x = isOption(Faulted({ fault: 42 }));
  expect(x).toBe(true);
});

test("isOption recognizes completions", async () => {
  const x = isOption(Completed({ value: 42 }));
  expect(x).toBe(true);
});

test("isOption recognizes non-options", async () => {
  const x = isOption(42);
  expect(x).toBe(false);
});

test("isFaulted recognizes failures", async () => {
  const x = isFaulted(Faulted({ fault: 42 }));
  expect(x).toBe(true);
});

test("isFaulted recognizes completions", async () => {
  const x = isFaulted(Completed({ value: 42 }));
  expect(x).toBe(false);
});

test("isFaulted recognizes non-options", async () => {
  const x = isFaulted(42);
  expect(x).toBe(false);
});
