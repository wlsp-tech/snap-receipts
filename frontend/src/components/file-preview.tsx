import Image from "@/components/ui/image";

export default function FilePreview({ uri }: Readonly<{ uri: string | null }>) {
    if (!uri) {
        return <Image
            src={"/placeholder.svg"}
            alt={"Placeholder Image"}
        />
    }
    return <Image src={uri} alt="Preview" />;
}