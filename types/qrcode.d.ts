declare module 'qrcode' {
  interface QRCodeToDataURLOptions {
    margin?: number
    width?: number
    scale?: number
    color?: {
      dark?: string
      light?: string
    }
  }

  export function toDataURL(text: string, options?: QRCodeToDataURLOptions): Promise<string>
  export function toCanvas(canvas: HTMLCanvasElement, text: string, options?: QRCodeToDataURLOptions): Promise<void>
  export function toString(text: string, options?: QRCodeToDataURLOptions): Promise<string>
  const qrcode: {
    toDataURL: typeof toDataURL
    toCanvas: typeof toCanvas
    toString: typeof toString
  }
  export default qrcode
}
