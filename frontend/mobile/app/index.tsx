import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, Pressable} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
    const [uuid, setUuid] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem("uuid");
                setUuid(stored);
            } catch (error) {
                alert("Fehler beim Laden des Tokens" + String(error));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return <Text style={styles.text}>Lade...</Text>;
    }

    return (
        <View style={styles.container}>
            {uuid ? (
                <>
                    <Text style={styles.text}>✅ Aktiver Token gefunden: {uuid}</Text>
                    <Pressable
                        onPress={() => alert("Info" + "Hier würdest du zum Upload weitergeleitet.")}>
                        <Text>Zum Dokument-Upload</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => alert("Info" + "Token würde hier gelöscht werden.")}>
                        <Text>Prozess zurücksetzen</Text>
                    </Pressable>
                </>
            ) : (
                <>
                    <Text style={styles.text}>⚠️ Kein aktiver Token gefunden.</Text>
                    <Text style={styles.subText}>
                        Bitte öffne die Web-Plattform am Computer und scanne den QR-Code.
                    </Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 12,
    },
    subText: {
        fontSize: 14,
        textAlign: "center",
        color: "#666",
    },
});
