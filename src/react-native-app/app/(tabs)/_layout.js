import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name='itemList' options={{ headerShown: false }} />
        </Stack>
    );
}
