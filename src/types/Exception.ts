import { Id } from "types/Id";

export class Exception extends Error {
  constructor(
    readonly id: Id,
    readonly message: string = `${id}`,
    readonly reason: string = "",
  ) {
    super(message);
  }

  static readonly IsNotValid = new Exception("IsNotValid");
  static readonly Cancelled = new Exception("Cancelled");
  static readonly IsNotImplemented = new Exception("IsNotImplemented");

  because = (reason: string): Exception =>
    new Exception(this.id, this.message, reason);

  equals = (e: Exception | Id): boolean =>
    e instanceof Exception ? this.id === e.id : this.id === e;
}

export const isException = (e?: unknown): e is Exception =>
  e instanceof Exception;
export const isCancelled = (e?: unknown): e is Exception =>
  e instanceof Exception && Exception.Cancelled.equals(e);

export const exceptionToString = <T = any>(e: T) =>
  isException(e) ? `${e.message}: ${e.reason ?? "reason unknown"}` : e;

export const injectLogException =
  (cons: Console, ...args: any[]) =>
  (e: any) => {
    cons.error(...args, exceptionToString(e));
    return e;
  };
export const injectLogAndThrowException =
  (cons: Console, ...args: any[]) =>
  (e: any) => {
    cons.error(...args, exceptionToString(e));
    throw e;
  };
