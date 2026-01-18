import { useMemo, useState } from 'react'
import { View, Text, TextInput, useColorScheme } from 'react-native'
import { useRouter } from 'expo-router';
import AppButton from '../../components/loginButton';
import { getTheme } from '../../styles/Theme';
import { createStyles } from '../../styles/loginPage.styles';
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [isUsernameSelected, setIsUsernameSelected] = useState(null);
    const [isPasswordSelected, setIsPasswordSelected] = useState(null);
    const validPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const scheme = useColorScheme();
    const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
    const styles = useMemo(() => createStyles(theme), [theme]);
    const router = useRouter();
    const validateInput = () => {
        let valid = 1;
        if (!username) {
            setUsernameError("username is requried!");
            valid = 0;
        }
        console.log(`pass: ${password}`)
        if (!password) {
            setPasswordError("password is requried!");
            valid = 0;
        } else if (!validPasswordRegex.test(password)) {
            setPasswordError("Password should contain at least 8 characters, one letter and one number!");
            valid = 0;
        }
        return valid;
    }
    const handleSubmit = () => {
        if (!validateInput()) {
            return;
        }

    }
    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <Text style={styles.AppName}> Drive </Text>

                <TextInput value={username}
                    onChangeText={(username) => { setUsernameError(null); setUsername(username) }}
                    onFocus={() => { setIsUsernameSelected(true) }}
                    onBlur={() => { setIsUsernameSelected(false) }}
                    style={[styles.input, usernameError && styles.inputError, isUsernameSelected && styles.selectedInput]}
                    placeholder='Username'
                    autoCapitalize="none"></TextInput>
                {usernameError && <Text style={styles.inputTextError}>{usernameError}</Text>}
                <TextInput value={password}
                    onChangeText={(password) => { setPasswordError(null); setPassword(password) }}
                    onFocus={() => { setIsPasswordSelected(true) }}
                    onBlur={() => { setIsPasswordSelected(false) }}
                    style={[styles.input, passwordError && styles.inputError, isPasswordSelected && styles.selectedInput]}
                    placeholder='Password'
                    autoCapitalize="none"
                    secureTextEntry></TextInput>
                {passwordError && <Text style={styles.inputTextError}>{passwordError}</Text>}
                <AppButton
                    title="Login"
                    onPress={() => { console.log(username + " password:" + password); handleSubmit() }}
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