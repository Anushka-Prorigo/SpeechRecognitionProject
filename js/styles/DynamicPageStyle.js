import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    textInput: {
        width: '100%',
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 20,
    },
     recognizingContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    recognizingText: {
        marginTop: 10,
        fontSize: 30,
        fontStyle: 'italic',
    },
    gif: {
        width: 100,
        height: 100,
    },
    speechResultContainer: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
    },
    speechResultText: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',     
        padding: 10,
    },
});

export default styles;