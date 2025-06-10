import React, { useRef, useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { BlurView } from "expo-blur";
import {IconSymbol} from "@/components/ui/IconSymbol";

type Props = {
    onSelect: (uri: string, type: string) => void;
    readyToUploadFile: boolean;
    setReadyToUploadFile: (state: boolean) => void;
    handleUploadCallback: () => void;
};

export default function PhotoSelector({
  onSelect,
  readyToUploadFile,
  setReadyToUploadFile,
  handleUploadCallback,
}: Readonly<Props>) {
    const [modalVisible, setModalVisible] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            alert("Need permisson to use camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.5,
            allowsEditing: false,
            base64: false,
            mediaTypes: "images",
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setReadyToUploadFile(true);
            setModalVisible(false);
            onSelect(asset.uri, asset.type || "image/webp");
        }
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const uri = URL.createObjectURL(file);
        const mime = file.type;
        setModalVisible(false);
        setReadyToUploadFile(true);
        onSelect(uri, mime);
    };

    return (
        <View>
            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <BlurView intensity={8} tint="default" style={styles.modalView}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Pressable style={styles.button} onPress={openCamera}>
                                <Text style={styles.text}>
                                    <IconSymbol name={"camera"} color={"white"} />
                                    Take photo
                                </Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={openFilePicker}>
                                <Text style={styles.text}>
                                    <IconSymbol name={"folder"} color={"white"} />
                                    Choose from Device
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.destructiveBtn]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.text}>
                                    <IconSymbol name={"0.circle.fill.ar"} color={"black"} />
                                    Cancel
                                </Text>
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
                    style={{ display: "none" }}
                    onChange={onFileChange}
                />
            )}

            <View style={styles.btnContainer}>
                {!readyToUploadFile && (
                    <Pressable
                        style={[styles.button, styles.wideBtn]}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.text}>Scann document</Text>
                    </Pressable>
                )}
                {readyToUploadFile && (
                    <Pressable
                        style={[styles.button, styles.wideBtn]}
                        onPress={handleUploadCallback}
                    >
                        <Text style={styles.text}>
                            upload document
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
        alignItems: "center",
    },
    modalView: {
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        padding: 20,
        paddingBottom: 8,
        gap: 12,
    },
    button: {
        backgroundColor: "#18181C",
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    wideBtn: {
        width: "75%",
        alignSelf: "center",
    },
    destructiveBtn: {
        backgroundColor: "#e7000b",
    },
    btnContainer: {
        alignItems: "center",
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
