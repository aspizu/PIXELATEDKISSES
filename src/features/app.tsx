import {AppFooter} from "./app-footer"
import {AppHeader} from "./app-header"
import {AppPreview} from "./app-preview"

export function App() {
    return (
        <div className="flex h-full flex-col">
            <AppHeader />
            <AppPreview />
            <AppFooter />
        </div>
    )
}
