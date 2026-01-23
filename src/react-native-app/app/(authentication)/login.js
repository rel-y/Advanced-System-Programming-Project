import { useMemo, useState } from 'react'
import { View, Text, TextInput} from 'react-native'
import { useRouter } from 'expo-router';
import AppButton from '../../components/loginButton';
import { getTheme } from '../../styles/Theme';
import { createStyles } from '../../styles/loginPage.styles';
import { SERVER_URL } from '../../config';
import { setToken } from '../../api/api';
import { useTheme } from '../../scheme';
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [isUsernameSelected, setIsUsernameSelected] = useState(null);
    const [isPasswordSelected, setIsPasswordSelected] = useState(null);
    const [generalError, setGeneralError] = useState(null);
    const validPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const {scheme, setScheme} = useTheme();
    const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
    const styles = useMemo(() => createStyles(theme), [theme]);
    const router = useRouter();
    const validateInput = () => {
        let valid = 1;
        if (!username) {
            setUsernameError("username is requried!");
            valid = 0;
        }
        if (!password) {
            setPasswordError("password is requried!");
            valid = 0;
        } else if (!validPasswordRegex.test(password)) {
            setPasswordError("Password should contain at least 8 characters, one letter and one number!");
            valid = 0;
        }
        return valid;
    }
    const handleSubmit = (e) => {
        
        if (!validateInput()) {
            return;
        }
        e.preventDefault();
        const data = { username: username, password: password };
        
        fetch(`${SERVER_URL}/api/tokens`, {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        }).then(async (response) => {
            console.log(response);
            if (response.status === 201) { //user was created passign to main page
                const data = await response.json();
                setToken(data.token);
                
                router.replace('/(tabs)/mainPage');
            } else { //waiting for the response to tell the user what went wrong
                const errorData = await response.json();
                console.log(errorData);
                setGeneralError(errorData.error || "Unknown error");
            }
        });
    }
    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <Text style={styles.AppName}> Drive </Text>

                <TextInput value={username}
                    onChangeText={(username) => { setUsernameError(null); setUsername(username) }}
                    onFocus={() => { setIsUsernameSelected(true) }}
                    onBlur={() => { setIsUsernameSelected(false) }}
                    style={[styles.input, isUsernameSelected && styles.selectedInput, usernameError && styles.inputError]}
                    placeholder='Username'
                    placeholderTextColor={theme.colors["text-muted"]}
                    autoCapitalize="none"></TextInput>
                {usernameError && <Text style={styles.inputTextError}>{usernameError}</Text>}
                <TextInput value={password}
                    onChangeText={(password) => { setPasswordError(null); setPassword(password) }}
                    onFocus={() => { setIsPasswordSelected(true) }}
                    onBlur={() => { setIsPasswordSelected(false) }}
                    style={[styles.input, isPasswordSelected && styles.selectedInput, passwordError && styles.inputError]}
                    placeholder='Password'
                    placeholderTextColor={theme.colors["text-muted"]}
                    autoCapitalize="none"
                    secureTextEntry></TextInput>
                {passwordError && <Text style={styles.inputTextError}>{passwordError}</Text>}
                <AppButton
                    title="Login"
                    onPress={(e) => { handleSubmit(e) }}
                />
            </View>
            <View style={styles.inline}>
                <Text style={styles.text}>Don't have an account?</Text>
                <AppButton
                    title="Sign Up"
                    onPress={() => router.replace('/signup')}
                    style={"movePage"}
                />
            </ View>
        </View>
    );
}