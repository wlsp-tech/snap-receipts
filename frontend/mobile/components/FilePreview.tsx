import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import {Image} from "expo-image";

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
            <Image
                style={styles.image}
                source={{ uri }}
                contentFit="cover"
                transition={1000}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        width: "100%",
        height: "100%",
    },
    image: {
        width: "100%",
        height: "100%",
    },
});
