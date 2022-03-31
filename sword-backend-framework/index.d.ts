export interface ContextData {
  query?: unknown;
  params?: unknown;
  res?: unknown;
}
export interface HttpContext<T extends ContextData = ContextData> {
  readonly key: string; // context的key由api构造
  readonly method: HttpInstructMethod[];
  readonly proto: Record<string, unknown>;
  query: T["query"];
  params: T["params"];
  return?: {
    data: T["res"]; // 返回对象
  };
}

export type HttpInstructMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE";

export type HttpInstruct = (path?: string) => HttpInstructReturn;
export type HttpInstructReturn = {
  method: HttpInstructMethod;
  path?: string;
};

export type HttpApiHandler<C extends ContextData> = (
  ctx: HttpContext<C>
) => C["res"];


export type HttpApiReturn<C extends ContextData> = {
  instruct: {
    method: HttpInstructMethod[];
    path?: string;
  };
  handler: (ctx: HttpContext<C>) => C["res"];
};
export interface Use {
  ValidateProto: (
    key: string,
    data: Record<string, unknown>,
    schema: Record<string, unknown>
  ) =>
    | {
        isSucc: true;
        errMsg?: undefined;
      }
    | {
        isSucc: false;
        errMsg: string;
      };
}

export type Plugin = {
  name: string;
  // 提供几个钩子用来定义函数，作为框架runtime的shim
  server?: Partial<{
    start: (...args: any[]) => Promise<void> | void
  }>,
  log?: Partial<{
    err: (v: string | Error) => void;
    info: (v: string) => void;
    success: (v: string) => void;
  }>
}