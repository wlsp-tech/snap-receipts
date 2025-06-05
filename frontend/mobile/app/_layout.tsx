import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';

import {useColorScheme} from '@/hooks/useColorScheme';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {StyleSheet} from "react-native";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) return null;

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <SafeAreaProvider>
                <SafeAreaView edges={['top']} style={styles.topSafeArea}/>
                <Stack screenOptions={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: "#18181C",
                    },
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: 22
                    },
                    headerTintColor: "#fff",
                }}>
                    <Stack.Screen
                        name="index"
                        options={{
                            headerTitle: "Snap Receipts",
                            headerLeft: () => null,
                        }}
                    />
                    <Stack.Screen
                        name="document-upload/receipt/[token]"
                        options={{
                            title: "Document Uplaod",
                        }}/>
                    <Stack.Screen name="+not-found" options={{headerTitle: "Nothing here! What you searching for?"}}/>
                </Stack>
                <StatusBar
                    style={colorScheme === 'dark' ? 'light' : 'dark'}
                    backgroundColor="transparent"
                    translucent
                />
            </SafeAreaProvider>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    topSafeArea: {
        backgroundColor: "#18181C",
    },
})