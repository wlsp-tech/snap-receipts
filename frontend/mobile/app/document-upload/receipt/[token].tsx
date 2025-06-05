import { useLocalSearchParams } from "expo-router";
import {View, StyleSheet} from "react-native";
import UploadDocument from "@/components/UploadDocument";

export default function ReceiptScreen() {
    const { token } = useLocalSearchParams();
    return (
        <View style={styles.container}>
            <UploadDocument token={token}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingBottom: 0,
    },
    content: {
        alignItems: "center",
    },
})