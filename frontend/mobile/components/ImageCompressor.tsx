import React, { useEffect } from "react";
import { SaveFormat, useImageManipulator } from "expo-image-manipulator";
import { StyleSheet, View } from "react-native";
import FilePreview from "@/components/FilePreview";

type Props = {
    uri: string | null;
    setCompressedUri: (uri: string | null) => void;
    setReadyToUploadFile: (b: boolean) => void;
};

export default function ImageCompressor({
    uri,
    setCompressedUri,
    setReadyToUploadFile,
}: Props) {
    const manipulator = useImageManipulator(uri ?? "");

    useEffect(() => {
        (async () => {
            if (!uri) return;

            try {
                manipulator.resize({ width: 1024 });
                const result = await (await manipulator.renderAsync()).saveAsync({
                    format: SaveFormat.JPEG,
                    compress: 0.7,
                });
                setCompressedUri(result.uri);
                setReadyToUploadFile(true);
            } catch (error) {
                alert(`Error while uploading: ${(error instanceof Error ? error.message : String(error))}`);
            }
        })();
    }, [manipulator, setCompressedUri, setReadyToUploadFile, uri]);

    return (
        <View style={styles.container}>
            <FilePreview uri={uri} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderRadius: 12,
    },
});
