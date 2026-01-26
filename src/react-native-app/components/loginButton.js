import { Text, TouchableOpacity, useColorScheme } from "react-native";
import { getTheme } from '../styles/Theme';
import { createStyles } from '../styles/loginButton.styles';
import { useEffect, useMemo } from 'react'
import { useTheme } from "../scheme";
export default function AppButton({ title, onPress, style }) {
    const {scheme, setScheme} = useTheme();
    const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
    const styles = useMemo(() => createStyles(theme), [theme]);
    let textStyle = "textEnter";
    let buttonStyle = "buttonEnter";
    if (style === "movePage") {
        textStyle = "textMovePage";
        buttonStyle = "buttonMovePage";
    }
    return (
        <TouchableOpacity style={styles[buttonStyle]} onPress={onPress}>
            <Text style={styles[textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}