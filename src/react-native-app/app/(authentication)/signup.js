import { useMemo, useState } from 'react'
import { View, Text, TextInput, useColorScheme } from 'react-native'
import { useRouter } from 'expo-router';
import AppButton from '../../components/loginButton';
import { getTheme } from '../../styles/Theme';
import { createStyles } from '../../styles/loginPage.styles';
import { SERVER_URL } from '../../config';
export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secPassword, setSecPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [photo, setPhoto] = useState("a");

    //errors
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [secPasswordError, setSecPasswordError] = useState(null);
    const [nicknameError, setNicknameError] = useState(null);
    const [generalError, setGeneralError] = useState(null);

    //selected
    const [isUsernameSelected, setIsUsernameSelected] = useState(null);
    const [isPasswordSelected, setIsPasswordSelected] = useState(null);
    const [isSecPasswordSelected, setIsSecPasswordSelected] = useState(null);
    const [isNicknameSelected, setIsNicknameSelected] = useState(null);
    const validPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const scheme = "dark"; //useColorScheme();
    const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
    const styles = useMemo(() => createStyles(theme), [theme]);
    const router = useRouter();
    const validateInput = () => {
        let valid = true;
        if (!username) {
            setUsernameError("username is requried!");
            valid = false;
        }
        if (!nickname) {
            setNicknameError("nickname is requried!");
            valid = false;
        }
        if (!secPassword) {
            setSecPasswordError("please enter the password again");
            valid = false;
        }
        if (!password) {
            setPasswordError("Password is requried!");
            valid = false;
        } else if (!validPasswordRegex.test(password)) {
            setPasswordError('Password should contain at least 8 characters, one letter and one number')
            valid = false;
        } else if (secPassword && password !== secPassword) {
            setPasswordError('passwords Should Match');
            setSecPasswordError('passwords Should Match');
            valid = false;
        }
        return valid;
    }
    const handleSubmit = () => {
        if (!validateInput()) {
            return;
        }

        let data = { username: username, password: password, nickname: nickname, photo: photo };
        fetch(`${SERVER_URL}/api/users`, {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        }).then(async (response) => {
            if (response.status === 200) { //user was created passing to login
                router.replace('/login');
            } else { //waiting for the response to tell the user what went wrong
                const errorData = await response.json();
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
                <TextInput value={secPassword}
                    onChangeText={(secPassword) => { setSecPasswordError(null); setSecPassword(secPassword) }}
                    onFocus={() => { setIsSecPasswordSelected(true) }}
                    onBlur={() => { setIsSecPasswordSelected(false) }}
                    style={[styles.input, isSecPasswordSelected && styles.selectedInput, secPasswordError && styles.inputError]}
                    placeholder='verify Password'
                    placeholderTextColor={theme.colors["text-muted"]}
                    autoCapitalize="none"
                    secureTextEntry></TextInput>
                {secPasswordError && <Text style={styles.inputTextError}>{secPasswordError}</Text>}
                <TextInput value={nickname}
                    onChangeText={(nickname) => { setNicknameError(null); setNickname(nickname) }}
                    onFocus={() => { setIsNicknameSelected(true) }}
                    onBlur={() => { setIsNicknameSelected(false) }}
                    style={[styles.input, isNicknameSelected && styles.selectedInput, nicknameError && styles.inputError]}
                    placeholder='nickname'
                    placeholderTextColor={theme.colors["text-muted"]}
                    autoCapitalize="none"></TextInput>
                {nicknameError && <Text style={styles.inputTextError}>{nicknameError}</Text>}

                <AppButton
                    title="SingUp"
                    onPress={() => { handleSubmit() }}
                />
                {generalError && <Text style={styles.inputTextError}>{generalError}</Text>}
            </View>
            <View style={styles.inline}>
                <Text style={styles.text}>Already have an account?</Text>
                <AppButton
                    title="Login"
                    onPress={() => router.replace('/login')}
                    style={"movePage"}
                />
            </ View>
        </View>
    );
}