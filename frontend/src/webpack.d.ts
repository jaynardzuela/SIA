declare module "*.jpg";
declare module "*.png";
declare module "*.svg";

declare interface __WebpackModuleApi {
    requireContext: (
        directory: string,
        useSubdirectories: boolean,
        regExp: RegExp
    ) => __WebpackModuleApi.RequireContext;
}

declare namespace __WebpackModuleApi {
    interface RequireContext {
        keys: () => string[];
        (id: string): any;
    }
}
