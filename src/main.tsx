import {App} from "@/features/app"
import "@/styles/global.css"
import {StrictMode} from "react"
import {createRoot} from "react-dom/client"

// @ts-expect-error missing types
import "@fontsource-variable/figtree"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
