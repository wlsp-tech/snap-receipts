import React, {useRef, useState} from "react";
import {ActivityIndicator, Modal, Platform, Pressable, StyleSheet, Text, View} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {BlurView} from 'expo-blur';

type Props = {
    onSelect: (uri: string, base64?: string) => void;
    readyToUploadFile: boolean;
    setReadyToUploadFile: (state: boolean) => void;
    loading: boolean;
    handleUploadCallback: () => void;
};

export default function PhotoSelector({onSelect, readyToUploadFile, setReadyToUploadFile, loading, handleUploadCallback}: Readonly<Props>) {
    const [modalVisible, setModalVisible] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openCamera = async () => {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            alert("Kamera-Zugriff wird benötigt!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.7,
            base64: true,
            mediaTypes: "images",
        });
        setReadyToUploadFile(true)

        if (!result.canceled) {
            const {uri, base64} = result.assets[0];
            setReadyToUploadFile(true)
            setModalVisible(false);
            onSelect(uri, base64 ?? undefined);
        }
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uri = URL.createObjectURL(file);
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            if (typeof result === "string") {
                const base64 = result.split(",")[1];
                onSelect(uri, base64);
            }
        };
        reader.readAsDataURL(file);
        setModalVisible(false);
        setReadyToUploadFile(true)
    };

    return (
        <View>
            <Modal transparent animationType="fade" visible={modalVisible}
                   onRequestClose={() => setModalVisible(false)}>
                <BlurView intensity={8} tint="default" style={styles.modalView}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Pressable style={styles.button} onPress={openCamera}>
                                <Text style={styles.text}>Take a photo</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={openFilePicker}>
                                <Text style={styles.text}>Upload from library</Text>
                            </Pressable>
                            <Pressable style={[styles.button, styles.destructiveBtn]}
                                       onPress={() => setModalVisible(false)}>
                                <Text style={styles.text}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </BlurView>
            </Modal>

            {Platform.OS === "web" && (
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    style={{display: "none"}}
                    onChange={onFileChange}
                />
            )}

            <View style={styles.btnContainer}>
                {!readyToUploadFile && (
                    <Pressable style={[styles.button, styles.wideBtn]} onPress={() => setModalVisible(true)}>
                        <Text style={styles.text}>Scan Document</Text>
                    </Pressable>
                )}
                {readyToUploadFile
                    && (
                        <Pressable style={[styles.button, styles.wideBtn]} onPress={() => handleUploadCallback()}>
                        <Text style={styles.text}>
                            {loading &&
                                <ActivityIndicator size="small" color="green" />
                            } Upload Document
                        </Text>
                        </Pressable>
                    )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    modalView: {
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        padding: 20,
        paddingBottom: 8,
        gap: 12
    },
    button: {
        backgroundColor: "#18181C",
        padding: 12,
        borderRadius: 6,
        alignItems: "center"
    },
    wideBtn: {
        width: "75%",
        alignSelf: "center"
    },
    destructiveBtn: {
        backgroundColor: "#E7000B"
    },
    btnContainer: {
        alignItems: "center"
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },
});
