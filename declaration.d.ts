export {};

declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

declare module "*.svg" {
  const content: any;
  export default content;
}

declare global {
  interface Window {
    Warp: any;
  }
}
