import {create} from "zustand"

export interface WebGLState {
    gl: WebGLRenderingContext
    shaderProgram: WebGLProgram
    uniformLocations: {
        threshold1: WebGLUniformLocation | null
        threshold2: WebGLUniformLocation | null
        color1: WebGLUniformLocation | null
        color2: WebGLUniformLocation | null
        color3: WebGLUniformLocation | null
        grain: WebGLUniformLocation | null
        contrast: WebGLUniformLocation | null
        brightness: WebGLUniformLocation | null
    }
}

export interface AppState {
    image?: ImageData
    dataURL?: string
    exported?: string
    threshold1: number
    threshold2: number
    color1: [number, number, number]
    color2: [number, number, number]
    color3: [number, number, number]
    grain: number
    contrast: number
    brightness: number
    isOriginalVisible: boolean
    gl?: WebGLState
}

export interface AppActions {
    setImage: (image: ImageData) => void
    setExported: (exported: string) => void
    setThreshold1: (value: number) => void
    setThreshold2: (value: number) => void
    setColor1: (value: [number, number, number]) => void
    setColor2: (value: [number, number, number]) => void
    setColor3: (value: [number, number, number]) => void
    setGrain: (value: number) => void
    setContrast: (value: number) => void
    setBrightness: (value: number) => void
    setWebGLState: (glVars: WebGLState) => void
    setDataURL: (dataURL: string) => void
    setIsOriginalVisible: (visible: boolean) => void
}

export const useAppStore = create<AppState & AppActions>()((set) => ({
    threshold1: 0.25,
    threshold2: 0.75,
    color1: [0.0, 0.0, 0.0],
    color2: [0.5, 0.5, 0.5],
    color3: [1.0, 0.5, 0.5],
    grain: 0.0,
    contrast: 0.0,
    brightness: 0.0,
    isOriginalVisible: false,
    setIsOriginalVisible: (visible) => set({isOriginalVisible: visible}),
    setImage: (image) => set({image}),
    setExported: (exported) => set({exported}),
    setThreshold1: (threshold1) => set({threshold1}),
    setThreshold2: (threshold2) => set({threshold2}),
    setColor1: (color1) => set({color1}),
    setColor2: (color2) => set({color2}),
    setColor3: (color3) => set({color3}),
    setGrain: (grain) => set({grain}),
    setContrast: (contrast) => set({contrast}),
    setBrightness: (brightness) => set({brightness}),
    setWebGLState: (gl) => set({gl}),
    setDataURL: (dataURL: string) => set({dataURL}),
}))
