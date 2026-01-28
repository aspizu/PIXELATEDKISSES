import {Slider} from "@/components/ui/slider"
import {cn} from "@/lib/utils"
import {useAppStore} from "@/state/store"
import {Blend, Contrast, Film, Palette, SunMedium} from "lucide-react"
import {useState} from "react"

function color2css(color: number[]) {
    return `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255})`
}

function arrcmp(a: number[], b: number[]) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false
    }
    return true
}

const palettes = [
    [1.0, 0.4, 0.4], // Red
    [0.4, 1.0, 0.4], // Green
    [0.4, 0.4, 1.0], // Blue
    [1.0, 1.0, 0.4], // Yellow
    [1.0, 0.4, 1.0], // Magenta
    [0.4, 1.0, 1.0], // Cyan
    [1.0, 0.7, 0.4], // Orange
    [0.7, 0.4, 1.0], // Purple
    [1.0, 0.7, 0.7], // Light Red
    [0.7, 1.0, 0.7], // Light Green
    [0.7, 0.7, 1.0], // Light Blue
    [1.0, 0.85, 0.88], // Pink
    [0.7, 0.55, 0.4], // Brown
    [1.0, 1.0, 1.0], // White
    [0.85, 0.85, 0.85], // Light Gray
    [0.7, 0.7, 0.7], // Gray
    [0.55, 0.55, 0.55], // Dark Gray
    [0.4, 0.4, 0.4], // Black
]

const buttons = {
    palette: {name: "PALETTE", icon: Palette},
    colors: {name: "COLORS", icon: Blend},
    grain: {name: "FILM GRAIN", icon: Film},
    contrast: {name: "CONTRAST", icon: Contrast},
    brightness: {name: "BRIGHTNESS", icon: SunMedium},
} as const

export function AppFooter() {
    const [active, setActive] = useState<keyof typeof buttons>("palette")
    const threshold1 = useAppStore((store) => store.threshold1)
    const threshold2 = useAppStore((store) => store.threshold2)
    const grain = useAppStore((store) => store.grain)
    const contrast = useAppStore((store) => store.contrast)
    const brightness = useAppStore((store) => store.brightness)
    const color3 = useAppStore((store) => store.color3)
    const setColor3 = useAppStore((store) => store.setColor3)
    const setThreshold1 = useAppStore((store) => store.setThreshold1)
    const setThreshold2 = useAppStore((store) => store.setThreshold2)
    const setGrain = useAppStore((store) => store.setGrain)
    const setContrast = useAppStore((store) => store.setContrast)
    const setBrightness = useAppStore((store) => store.setBrightness)
    return (
        <div className="flex flex-col">
            {active === "palette" && (
                <div className="flex gap-2 overflow-x-scroll p-2">
                    {palettes.map((color) => (
                        <button
                            key={color.toString()}
                            className={cn(
                                "size-8 shrink-0 rounded-full",
                                arrcmp(color, color3) &&
                                    "ring-offset-background ring-primary ring-3 ring-offset-1",
                            )}
                            style={{backgroundColor: color2css(color)}}
                            onClick={(event) => {
                                ;(event.target as HTMLElement).scrollIntoView({
                                    behavior: "smooth",
                                    inline: "center",
                                })
                                setColor3(color as [number, number, number])
                            }}
                        />
                    ))}
                </div>
            )}
            {active !== "palette" && (
                <div className="m-4">
                    {active === "colors" ?
                        <Slider
                            key="colors"
                            defaultValue={[threshold1 * 100, threshold2 * 100]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={([threshold1, threshold2]) => {
                                setThreshold1(threshold1 / 100)
                                setThreshold2(threshold2 / 100)
                            }}
                        />
                    : active === "grain" ?
                        <Slider
                            key="grain"
                            defaultValue={[grain * 100]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={([value]) => {
                                setGrain(value / 100)
                            }}
                        />
                    : active === "contrast" ?
                        <Slider
                            key="contrast"
                            defaultValue={[contrast * 100]}
                            min={-100}
                            max={100}
                            step={1}
                            onValueChange={([value]) => {
                                setContrast(value / 100)
                            }}
                        />
                    : active === "brightness" ?
                        <Slider
                            key="brightness"
                            defaultValue={[brightness * 100]}
                            min={-100}
                            max={100}
                            step={1}
                            onValueChange={([value]) => {
                                setBrightness(value / 100)
                            }}
                        />
                    :   null}
                </div>
            )}
            <div className="flex overflow-x-scroll p-2">
                {Object.entries(buttons).map(([key, {name, icon: Icon}]) => (
                    <button
                        key={key}
                        className={cn(
                            "text-muted-foreground flex w-20 shrink-0 flex-col items-center gap-1 text-xs font-medium transition-colors",
                            active === key && "text-primary",
                        )}
                        onClick={(event) => {
                            ;(event.target as HTMLButtonElement).scrollIntoView({
                                behavior: "smooth",
                                inline: "center",
                            })
                            return setActive(key as keyof typeof buttons)
                        }}
                    >
                        <Icon className="size-5" />
                        {name}
                    </button>
                ))}
            </div>
        </div>
    )
}
