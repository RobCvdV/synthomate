import { Id } from "./Id";

export type AnyObject<T = any> = { [key: string]: T };
export type AnyEntity = AnyObject & { id: Id };
