import {useState} from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import PhotoSelector from "./PhotoSelector";
import ImageCompressor from "@/components/ImageCompressor";
import LottieStatus from "@/components/LottieStatus";

export default function UploadDocument({
   token,
}: {
    token: string | string[];
}) {
    const [fileUri, setFileUri] = useState<string | null>(null);
    const [compressedUri, setCompressedUri] = useState<string | null>(null);
    const [readyToUploadFile, setReadyToUploadFile] = useState<boolean>(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSelect = (uri: string) => {
        setFileUri(uri);
        setStatus("idle");
        setReadyToUploadFile(false);
    };

    const handleUpload = async () => {
        if (!compressedUri || !token) return;

        const authToken = Array.isArray(token) ? token[0] : token;

        setStatus("loading");

        try {
            const formData = new FormData();

            if (Platform.OS === "web") {
                const response = await fetch(compressedUri);
                const blob = await response.blob();
                formData.append("file", blob, "upload.png");
            } else {
                formData.append("file", {
                    uri: compressedUri,
                    name: "upload.png",
                    type: "image/png",
                } as any);
            }

            formData.append("token", authToken);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/snap-receipts/token/upload-by-token`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            await response.json();
            setFileUri(null);
            setCompressedUri(null);
            setReadyToUploadFile(false);
            setStatus("success");
        } catch {
            setStatus("error");
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.innerContainer}>
                    <LottieStatus status={status}/>

                    {status === "success" && <View style={styles.statusMessage}>
                        <Text style={styles.statusText}>Document uploaded successfully!</Text>
                        <Text style={styles.statusText}>Continue in your other device.</Text>
                    </View>}
                    {status === "error" && (
                        <View style={styles.statusMessage}>
                            <Text style={styles.statusText}>Upload failed. Please try again.</Text>
                        </View>
                    )}

                    {status === "idle" && (
                        <ImageCompressor
                            uri={fileUri}
                            setCompressedUri={setCompressedUri}
                            setReadyToUploadFile={setReadyToUploadFile}
                        />
                    )}
                </View>

                {status === "idle" && (
                    <View style={styles.buttonWrapper}>
                        <PhotoSelector
                            onSelect={handleSelect}
                            readyToUploadFile={readyToUploadFile}
                            setReadyToUploadFile={setReadyToUploadFile}
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
    },
    innerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "75%",
        marginHorizontal: "auto",
        paddingVertical: 40,
    },
    buttonWrapper: {
        position: "sticky",
        bottom: 0,
        left: 10,
        right: 10,
        justifyContent: "center",
        paddingVertical: 10,
        backgroundColor: "#f5f5f5",
        elevation: 11,
    },
    statusMessage: {
        position: "absolute",
        bottom: 150,
    },
    statusText: {
        fontSize: 18,
        fontWeight: "500",
        textAlign: "center"
    }
});
