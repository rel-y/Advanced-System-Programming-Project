import { useMemo } from 'react'
import { View, Text, TextInput, useColorScheme } from 'react-native'
import { useRouter } from 'expo-router';
import AppButton from '../../components/loginButton';
import { getTheme } from '../../styles/Theme';
import { createStyles } from '../../styles/loginPage.styles';
export default function Login() {
    const scheme = useColorScheme();
    const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
    const styles = useMemo(() => createStyles(theme), [theme]);
    const router = useRouter();
    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <Text style={styles.AppName}> Drive </Text>

                <TextInput style={styles.input} placeholder='Username' autoCapitalize="none"></TextInput>
                <TextInput style={styles.input} placeholder='Password' autoCapitalize="none" secureTextEntry></TextInput>

                <AppButton
                    title="Login"
                    onPress={() => router.replace('/(tabs)')}
                />
            </View>
            <View style={styles.inline}>
                <Text style={styles.text}>Don't have an account?</Text>
                <AppButton
                    title="SingUp"
                    onPress={() => router.replace('/signup')}
                    style={"movePage"}
                />
            </ View>
        </View>
    );
}