import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import PhotoSelector from "./PhotoSelector";
import FilePreview from "./FilePreview";

export default function UploadDocument() {
    const [uri, setUri] = useState<string | null>(null);
    const [base64, setBase64] = useState<string | undefined>();

    const handleSelect = (fileUri: string, base64data?: string) => {
        setUri(fileUri);
        setBase64(base64data);

        console.log(base64)
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.previewWrapper}>
                    <FilePreview uri={uri} />
                </View>

                <View style={styles.buttonWrapper}>
                    <PhotoSelector onSelect={handleSelect} />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    previewWrapper: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonWrapper: {
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        height: 70,
        marginHorizontal: -20,
        backgroundColor: "#f5f5f5",
        shadowOffset: {
            width: 0,
            height: -5,
        },
        shadowOpacity: 0.16,
        shadowRadius: 6.68,
        elevation: 11,
    },
});