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

export type Next<a> = Func<Options<a> | a, void>;

export type Action<a> = Func<Next<a>, void>;

export type TaskDef<a> = {
  readonly map: <b>(xf: Func<a, b>) => TaskDef<b>;
  readonly chain: <b>(xf: Func<a, Thenable<b>>) => TaskDef<b>;
  readonly resume: <b>(xf: Func<a | Failure, b | Thenable<b>>) => TaskDef<b>;
  readonly then: (done: Func<Options<a>, void>) => void;
};
