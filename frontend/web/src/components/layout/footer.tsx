import {FullYear} from "@/lib/utils.ts";

const Footer = () => {
    return (
        <footer className="h-16 flex justify-between items-center bg-element-bg border-t-accent border-t-1 py-4 px-2 lg:px-8 dark:bg-[#18181C]">
            <div className="flex max-w-screen-custom w-full px-2 lg:px-8">
                <small className="p-2">{FullYear()} c wlsp.tech</small>
            </div>
        </footer>
    )
}

export default Footer;