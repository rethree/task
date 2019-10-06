// import { isFaulted, OptionOf, allCompleted } from "../lib";
// import { Options } from "../lib/types";

// const { Faulted, Completed } = OptionOf();

// test("allCompleted detects failures withing mixed results", async t => {
//   const xs = [Faulted({ fault: Error("42") }), Completed({ value: 42 })];

//   t.false(allCompleted(xs));
// });

// test("allCompleted detects failures withing failed results", async t => {
//   const xs = [Faulted({ fault: Error("42") }), Faulted({ fault: 42 })];

//   t.false(allCompleted(xs));
// });

// test("allCompleted detects complete-only results", async t => {
//   const xs: Options<any>[] = [
//     Completed({ value: "9001" }),
//     Completed({ value: 42 })
//   ];

//   t.true(allCompleted(xs));
// });
