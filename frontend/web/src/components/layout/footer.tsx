import {FullYear} from "@/lib/utils.ts";

const Footer = () => {
    return (
        <footer className="h-16 flex justify-between items-center bg-element-bg border-t-accent border-t-1 py-4 px-6 lg:px-8 -mx-60">
            <div className="flex w-full max-w-screen-custom">
                <small>{FullYear()} c wlsp.tech</small>
            </div>
        </footer>
    )
}

export default Footer;