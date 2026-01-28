import {initWebGL, renderImage, setTexture, setUniforms} from "@/lib/webgl"
import {useAppStore} from "@/state/store"
import {useWindowSize} from "@uidotdev/usehooks"
import {useCallback, useEffect, useRef} from "react"

function scalePreview(canvas: HTMLCanvasElement) {
    const parent = canvas.parentElement
    if (!parent) return
    if (canvas.width < canvas.height) {
        const scale = parent.clientHeight / canvas.height
        canvas.style.scale = `${scale}`
    } else {
        const scale = parent.clientWidth / canvas.width
        canvas.style.scale = `${scale}`
    }
}

export function AppPreview() {
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
    const setWebGLState = useAppStore((store) => store.setWebGLState)
    const setExported = useAppStore((store) => store.setExported)
    const canvasRef = useRef<HTMLCanvasElement>(null)
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
        scalePreview(canvasRef.current)
    }, [image, setWebGLState])
    const size = useWindowSize()
    useEffect(() => {
        if (!canvasRef.current) return
        scalePreview(canvasRef.current)
    }, [size])
    return (
        <div className="bg-muted relative h-full">
            <canvas
                ref={canvasRef}
                className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
            />
            {image && (
                <span className="text-muted-foreground absolute right-1 bottom-1 rounded text-xs font-medium">
                    {image.width} × {image.height}
                </span>
            )}
        </div>
    )
}
