export type _ = unknown;
export type Nil = undefined;

export type StrMap<a = any> = {
  readonly [key: string]: a;
};

export type Func<a, b> = (x: a) => b;

export type Meta = {
  readonly meta: StrMap;
};

export type Failure = { fault: any; meta?: StrMap };

export type Completion<a> = { value: a; meta?: StrMap };

export type Options<a> =
  | Failure & { tag: "Faulted" }
  | Completion<a> & { tag: "Completed" };

export type Thenable<a> = PromiseLike<a> | TaskDef<a>;

export type Computation = [Func<_, _ | Thenable<_>>, true | Nil];

export type TaskDef<a> = {
  readonly map: <b, c extends [Func<a, b>, true?]>(
    ...args: c
  ) => TaskDef<c[1] extends Nil ? ReturnType<c[0]> : Failure>;
  readonly chain: <b, c extends [Func<a, Thenable<b>>, true?]>(
    ...args: c
  ) => TaskDef<
    ReturnType<c[0]> extends Thenable<infer b>
      ? c[1] extends Nil
        ? b
        : b | Failure
      : _
  >;
  readonly then: <b>(done: Func<Options<a>, b>) => void;
};
