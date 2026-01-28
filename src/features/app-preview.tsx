import {cn} from "@/lib/utils"
import {initWebGL, renderImage, setTexture, setUniforms} from "@/lib/webgl"
import {useAppStore} from "@/state/store"
import {useWindowSize} from "@uidotdev/usehooks"
import {useCallback, useEffect, useRef, useState} from "react"

function computeScale(canvas: HTMLCanvasElement): number {
    const parent = canvas.parentElement
    if (!parent) return 1

    const scaleX = parent.clientWidth / canvas.width
    const scaleY = parent.clientHeight / canvas.height

    return Math.min(scaleX, scaleY)
}

export function AppPreview() {
    const [scale, setScale] = useState(0)
    const image = useAppStore((store) => store.image)
    const gl = useAppStore((store) => store.gl)
    const threshold1 = useAppStore((store) => store.threshold1)
    const threshold2 = useAppStore((store) => store.threshold2)
    const color1 = useAppStore((store) => store.color1)
    const color2 = useAppStore((store) => store.color2)
    const color3 = useAppStore((store) => store.color3)
    const grain = useAppStore((store) => store.grain)
    const contrast = useAppStore((store) => store.contrast)
    const brightness = useAppStore((store) => store.brightness)
    const isOriginalVisible = useAppStore((store) => store.isOriginalVisible)
    const dataURL = useAppStore((store) => store.dataURL)
    const setWebGLState = useAppStore((store) => store.setWebGLState)
    const setExported = useAppStore((store) => store.setExported)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const render = useCallback(() => {
        if (!gl) return
        if (!canvasRef.current) return
        if (!image) return
        setTexture(gl.gl, image)
        setUniforms(gl, {
            threshold1,
            threshold2,
            color1,
            color2,
            color3,
            grain,
            contrast,
            brightness,
        })
        renderImage(gl)
        const dataURL = canvasRef.current.toDataURL("image/png")
        setExported(dataURL)
    }, [
        image,
        gl,
        threshold1,
        threshold2,
        color1,
        color2,
        color3,
        grain,
        contrast,
        brightness,
        setExported,
    ])
    useEffect(render, [render])
    useEffect(() => {
        if (!canvasRef.current) return
        if (!image) return
        canvasRef.current.width = image.width
        canvasRef.current.height = image.height
        setWebGLState(initWebGL(canvasRef.current))
        const scale = computeScale(canvasRef.current)
        setScale(scale)
        canvasRef.current.style.scale = `${scale}`
        if (!imgRef.current) return
        imgRef.current.style.scale = `${scale}`
    }, [image, setWebGLState])
    const size = useWindowSize()
    useEffect(() => {
        if (!canvasRef.current) return
        const scale = computeScale(canvasRef.current)
        setScale(scale)
        canvasRef.current.style.scale = `${scale}`
        if (!imgRef.current) return
        imgRef.current.style.scale = `${scale}`
    }, [size])
    return (
        <div className="bg-muted relative h-full w-full">
            <canvas
                ref={canvasRef}
                className="absolute top-[50%] left-[50%] z-1 translate-x-[-50%] translate-y-[-50%]"
                style={{scale: `${scale}`}}
            />
            {dataURL && (
                <img
                    ref={imgRef}
                    src={dataURL}
                    width={image?.width}
                    height={image?.height}
                    className={cn(
                        "absolute top-[50%] left-[50%] z-2 translate-x-[-50%] translate-y-[-50%]",
                        !isOriginalVisible && "hidden",
                    )}
                    style={{scale: `${scale}`}}
                />
            )}
            {image && (
                <span className="text-muted-foreground absolute right-1 bottom-1 z-2 rounded text-xs font-medium">
                    {image.width} × {image.height}
                </span>
            )}
        </div>
    )
}
