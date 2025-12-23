import { StyleSheet } from "react-native";
import SettingsScreen from "./screens/SettingsScreen";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    webView: {
        flex: 1,
    },
    settingHeaderButton: {
        color: 'black',
        fontSize: 18,
        marginRight: 10
    },







    SettingsScreen: {
        container: {
            alignItems: "center",
            flex: 1,
            backgroundColor: "#fff",
            padding: 20
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 10
        },
        input: {
            height: 50,
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            minWidth: 300,
            fontSize: 20,
        },
        saveButton: {
            backgroundColor: "#007AFF",
            paddingVertical: 20,
            borderRadius: 5,
            alignItems: "center",
            marginTop: 30,
            minWidth: 300,
        },
        saveButtonPressed: {
            backgroundColor: "#005BBB",
        },
        saveButtonText: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
        },
    }

});

export default styles;