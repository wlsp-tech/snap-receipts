import { useLocalSearchParams } from "expo-router";
import {View, Text, StyleSheet} from "react-native";
import UploadDocument from "@/components/UploadDocument";

export default function ReceiptScreen() {
    const { uuid } = useLocalSearchParams();

    const handleTakePhoto = () => {
        console.log("Opens camera: ", uuid)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Document Upload</Text>
            <UploadDocument />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        padding: 20,
        paddingBottom: 0,
    },
    content: {
        alignItems: "center",
        marginTop: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center"
    },
})