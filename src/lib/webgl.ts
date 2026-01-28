import fsSource from "@/shaders/fragmentShader.glsl?raw"
import vsSource from "@/shaders/vertexShader.glsl?raw"
import type {WebGLState} from "@/state/store"

export function setTexture(gl: WebGLRenderingContext, imageData: ImageData) {
    const texture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
}

export function renderImage({gl, shaderProgram}: WebGLState) {
    const VERTICES = new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1])
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.STATIC_DRAW)

    // Set and enable our array buffer as the program's "position" variable
    const positionLocation = gl.getAttribLocation(shaderProgram, "position")
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(positionLocation)

    // Draw our 6 VERTICES as 2 triangles
    gl.drawArrays(gl.TRIANGLES, 0, 6)
}

export function initWebGL(canvas: HTMLCanvasElement): WebGLState {
    const gl = canvas.getContext("webgl2")
    if (!gl) {
        throw new Error(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
        )
    }
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    if (!vertexShader) {
        throw new Error("Unable to create vertex shader.")
    }
    gl.shaderSource(vertexShader, vsSource)
    gl.compileShader(vertexShader)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    if (!fragmentShader) {
        throw new Error("Unable to create fragment shader.")
    }
    gl.shaderSource(fragmentShader, fsSource)
    gl.compileShader(fragmentShader)
    const shaderProgram = gl.createProgram()
    if (!shaderProgram) {
        throw new Error("Unable to create shader program.")
    }
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    gl.useProgram(shaderProgram)
    const uniformLocations = {
        threshold1: gl.getUniformLocation(shaderProgram, "threshold1"),
        threshold2: gl.getUniformLocation(shaderProgram, "threshold2"),
        color1: gl.getUniformLocation(shaderProgram, "color1"),
        color2: gl.getUniformLocation(shaderProgram, "color2"),
        color3: gl.getUniformLocation(shaderProgram, "color3"),
        grain: gl.getUniformLocation(shaderProgram, "grain"),
        contrast: gl.getUniformLocation(shaderProgram, "contrast"),
        brightness: gl.getUniformLocation(shaderProgram, "brightness"),
    }
    return {gl, shaderProgram, uniformLocations}
}

export function setUniforms(
    {gl, uniformLocations}: WebGLState,
    shaderState: {
        threshold1: number
        threshold2: number
        color1: [number, number, number]
        color2: [number, number, number]
        color3: [number, number, number]
        grain: number
        contrast: number
        brightness: number
    },
) {
    gl.uniform1f(uniformLocations.threshold1, shaderState.threshold1)
    gl.uniform1f(uniformLocations.threshold2, shaderState.threshold2)
    gl.uniform3fv(uniformLocations.color1, shaderState.color1)
    gl.uniform3fv(uniformLocations.color2, shaderState.color2)
    gl.uniform3fv(uniformLocations.color3, shaderState.color3)
    gl.uniform1f(uniformLocations.grain, shaderState.grain)
    gl.uniform1f(uniformLocations.contrast, shaderState.contrast)
    gl.uniform1f(uniformLocations.brightness, shaderState.brightness)
}
