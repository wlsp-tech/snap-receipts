// app/+not-found.tsx
import {StyleSheet, View} from 'react-native';
import {ThemedText} from "@/components/ThemedText";
import {Link} from "expo-router";

export default function NotFoundScreen() {

    return (
        <View style={styles.container}>
            <ThemedText>404 Not Found</ThemedText>
            <Link href="/" style={styles.button}>Go back to Home</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center", padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16
    },
    uuid: {
        fontSize: 18,
        color: "#333"
    },
    button: {
        textDecorationStyle: "dashed",
        textDecorationLine: "underline",
    }
});
