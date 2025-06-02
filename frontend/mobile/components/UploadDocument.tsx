import React, {useState} from "react";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import PhotoSelector from "./PhotoSelector";
import FilePreview from "./FilePreview";

export default function UploadDocument({token}: Readonly<{ token: string | string[] }>) {
    const [uri, setUri] = useState<string | null>(null);
    const [base64, setBase64] = useState<string | undefined>(undefined);
    const [readyToUploadFile, setReadyToUploadFile] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isUploaded, setIsUploaded] = useState<boolean>(false);

    const handleSelect = (fileUri: string, base64data?: string) => {
        setUri(fileUri);
        setBase64(base64data);
        setReadyToUploadFile(true);
    };

    const handleUpload = async () => {
        if (!base64 || !token) return;
        const authToken = Array.isArray(token) ? token[0] : token;

        if (!authToken) {
            alert("Token fehlt oder ist ungültig.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/snap-receipts/token/upload-by-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    token: authToken,
                    imageUri: base64,
                }),
            });

            if (!response.ok) throw new Error("Upload fehlgeschlagen");

            if (response.ok) {
                setReadyToUploadFile(false);
                setUri(null);
                setBase64(undefined);
                setIsUploaded(true);
            }
        } catch (error) {
            console.error(error);
            alert("Fehler beim Hochladen.");
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.previewWrapper}>
                        {loading && !isUploaded
                            ? (
                                <>
                                    <ActivityIndicator size="large"/>
                                    <Text>Uploading document..</Text>
                                </>
                            )
                            :
                            !loading && isUploaded && (
                                <Text>Document uploaded successfully!</Text>
                            )
                        }

                        {!loading && !isUploaded && (
                            <FilePreview uri={uri}/>
                        )}
                    </View>
                </View>
                {!loading && !isUploaded && (
                    <View style={styles.buttonWrapper}>
                        <PhotoSelector
                            onSelect={handleSelect}
                            readyToUploadFile={readyToUploadFile}
                            setReadyToUploadFile={setReadyToUploadFile}
                            loading={loading}
                            handleUploadCallback={handleUpload}
                        />
                    </View>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    innerContainer: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    previewWrapper: {
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
        height: "85%",
        width: "85%"
    },
    buttonWrapper: {
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        paddingVertical: 10,
        marginHorizontal: -20,
        backgroundColor: "#f5f5f5",
        boxShadow: "0 -5px 6px rgba(0, 0, 0, 0.18)",
        elevation: 11,
    },
});
