import {Slider} from "@/components/ui/slider"
import {cn} from "@/lib/utils"
import {useAppStore} from "@/state/store"
import {Blend, Contrast, Film, SunMedium} from "lucide-react"
import {useState} from "react"

const buttons = {
    colors: {name: "COLORS", icon: Blend},
    grain: {name: "FILM GRAIN", icon: Film},
    contrast: {name: "CONTRAST", icon: Contrast},
    brightness: {name: "BRIGHTNESS", icon: SunMedium},
} as const

export function AppFooter() {
    const [active, setActive] = useState<keyof typeof buttons>("colors")
    const threshold1 = useAppStore((store) => store.threshold1)
    const threshold2 = useAppStore((store) => store.threshold2)
    const grain = useAppStore((store) => store.grain)
    const contrast = useAppStore((store) => store.contrast)
    const brightness = useAppStore((store) => store.brightness)
    const setThreshold1 = useAppStore((store) => store.setThreshold1)
    const setThreshold2 = useAppStore((store) => store.setThreshold2)
    const setGrain = useAppStore((store) => store.setGrain)
    const setContrast = useAppStore((store) => store.setContrast)
    const setBrightness = useAppStore((store) => store.setBrightness)
    return (
        <div className="flex flex-col p-2">
            <div className="mt-2 mb-4">
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
            <div className="flex justify-center gap-2">
                {Object.entries(buttons).map(([key, {name, icon: Icon}]) => (
                    <button
                        key={key}
                        className={cn(
                            "text-muted-foreground flex w-32 flex-col items-center gap-1 text-xs font-medium transition-colors",
                            active === key && "text-primary",
                        )}
                        onClick={() => setActive(key as keyof typeof buttons)}
                    >
                        <Icon className="size-5" />
                        {name}
                    </button>
                ))}
            </div>
        </div>
    )
}
