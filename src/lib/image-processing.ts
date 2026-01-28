export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = (err) => reject(err)
        img.src = URL.createObjectURL(file)
    })
}

export async function imageToImageData(
    image: HTMLImageElement,
    opts?: {
        maxWidth?: number
        maxHeight?: number
    },
): Promise<ImageData> {
    if (opts?.maxWidth && opts?.maxHeight) {
        throw new Error("Cannot specify both maxWidth and maxHeight.")
    }
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) {
        throw new Error("Unable to get 2D context from canvas.")
    }
    canvas.width = image.width
    canvas.height = image.height
    if (opts?.maxWidth) {
        if (image.width > opts.maxWidth) {
            canvas.width = opts.maxWidth
            canvas.height = (image.height * opts.maxWidth) / image.width
        }
    }
    if (opts?.maxHeight) {
        if (image.height > opts.maxHeight) {
            canvas.height = opts.maxHeight
            canvas.width = (image.width * opts.maxHeight) / image.height
        }
    }
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

export function imageDataToDataURL(imageData: ImageData): string {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) {
        throw new Error("Unable to get 2D context from canvas.")
    }
    canvas.width = imageData.width
    canvas.height = imageData.height
    ctx.putImageData(imageData, 0, 0)
    return canvas.toDataURL("image/png")
}
