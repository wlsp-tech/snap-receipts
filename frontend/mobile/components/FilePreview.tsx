import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";

type Props = {
    uri: string | null;
};

export default function FilePreview({ uri }: Readonly<Props>) {
    if (!uri) {
        return (
            <View style={styles.imageContainer}>
                <Image source={require("../assets/images/placeholder.png")} style={styles.image} />
            </View>
        );
    }

    if (uri.endsWith(".pdf")) {
        if (Platform.OS === "web") {
            return (
                <View style={styles.imageContainer}>
                    <iframe src={uri} title="PDF Preview" width="100%" height="100%" style={{ border: "none" }} />
                </View>
            );
        }
        return <Text>PDF ausgewählt (Vorschau nur im Web)</Text>;
    }

    return (
        <View style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
        </View>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        width: "100%",
        height: "auto",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
});
