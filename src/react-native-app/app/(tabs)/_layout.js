import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name='mainPage' options={{ headerShown: false }} />
        </Stack>
    );
}
