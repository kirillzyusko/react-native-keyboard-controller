declare function registerEventHandler(
  handler: (event: never) => void,
  eventName: string,
  viewTag: number,
): number;
declare function unregisterEventHandler(id: number): void;

export { registerEventHandler, unregisterEventHandler };
