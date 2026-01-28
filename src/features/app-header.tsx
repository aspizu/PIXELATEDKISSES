import {Button} from "@/components/ui/button"
import {imageToImageData, loadImageFromFile} from "@/lib/image-processing"
import {useAppStore} from "@/state/store"
import {saveAs} from "file-saver"
import {Plus, SquareArrowOutUpRight, SquareSplitHorizontal} from "lucide-react"
import {showOpenFilePicker} from "show-open-file-picker"

export function AppHeader() {
    const setImage = useAppStore((store) => store.setImage)
    const exported = useAppStore((store) => store.exported)

    async function onOpenPress() {
        let fileHandle: FileSystemFileHandle
        try {
            const fileHandles = await showOpenFilePicker({
                types: [
                    {
                        description: "Images",
                        accept: {
                            "image/*": [".png", ".jpg", ".jpeg", ".bmp", ".gif"],
                        },
                    },
                ],
                multiple: false,
            })
            fileHandle = fileHandles[0]
        } catch {
            return
        }
        const file = await fileHandle.getFile()
        const image = await loadImageFromFile(file)
        const imageData = await imageToImageData(image, {maxWidth: 768})
        setImage(imageData)
    }

    function onExportPress() {
        if (!exported) return
        saveAs(exported, "PIXELATEDKISSES.png")
    }

    return (
        <div className="flex gap-1 p-1">
            <Button size="sm" variant="secondary" onClick={onOpenPress}>
                OPEN
                <Plus />
            </Button>
            <Button
                size="sm"
                variant="secondary"
                onClick={onExportPress}
                disabled={!exported}
            >
                EXPORT
                <SquareArrowOutUpRight />
            </Button>
            <div className="grow" />
            <Button size="icon-sm" variant="ghost">
                <SquareSplitHorizontal />
            </Button>
        </div>
    )
}
