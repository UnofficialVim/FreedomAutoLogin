import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ec7f23",
    },
    webView: {
        flex: 1,
    },
    settingHeaderButton: {
        color: 'black',
        fontSize: 18,
        marginRight: 10
    },
    ImageBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    headerStyle: {
        backgroundColor: '#ec7f23',
    },



    EntryScreen: {
        loginButton: {
            pressed: {
                backgroundColor: '#d96f1f',
            },
            backgroundColor: '#ec7f23',
            margin: 20,
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
        },
        loginButtonText: {
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
        },
        LoginButtonContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            padding: 20,
            marginBottom: "50%"
        },
        logo: {
            width: "100%",
            height: "50%",
            
        }
    },


    SettingsScreen: {
        container: {
            alignItems: "center",
            flex: 1,
            padding: 20
        },
        title: {
            fontSize: 26,
            fontWeight: "bold",
            marginBottom: 10,
            color: "#fff"
        },
        input: {
            height: 50,
            borderColor: "gray",
            backgroundColor: "#fff",
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 10,
            minWidth: 300,
            fontSize: 20,
        },
        saveButton: {
            backgroundColor: "#ec7f23",
            paddingVertical: 20,
            borderRadius: 10,
            alignItems: "center",
            marginTop: 30,
            minWidth: 300,
        },
        saveButtonPressed: {
            backgroundColor: "#d96f1f",
        },
        saveButtonText: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
        },
        permissionStatus: {
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 20,
        },
        toggleSwitch: {
            true: {
                alignItems: "center",
                minWidth: 200,
                marginTop: 25,
                padding: 10,
                backgroundColor: "#c0ffc0",
                borderRadius: 5,
            },
            false: {
                alignItems: "center",
                minWidth: 200,
                marginTop: 25,
                padding: 10,
                backgroundColor: "#f0f0f0",
                borderRadius: 5,
        },
        text: {
            fontSize: 16,
            fontWeight: "bold",
        },
    }
}});


export default styles;