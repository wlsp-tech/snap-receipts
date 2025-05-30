import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';

import {useColorScheme} from '@/hooks/useColorScheme';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) return null;

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        headerTitle: "Snap Receipts",
                        headerLeft: () => null,
                    }}
                />
                <Stack.Screen name="document-upload/receipt/[uuid]" options={{ headerShown: false}} />
                <Stack.Screen name="+not-found" options={{headerTitle: "Nothing here! What you searching for?"}}/>
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
        </ThemeProvider>
    );
}
