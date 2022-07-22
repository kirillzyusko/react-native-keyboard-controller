// @ts-expect-error because `__turboModuleProxy` has any type (maybe think about own types declaration)
export const isTurboModuleEnabled = global.__turboModuleProxy != null;
