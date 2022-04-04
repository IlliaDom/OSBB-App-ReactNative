import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, TextInput } from 'react-native'
import { useSelector } from 'react-redux'
import {
    getAuth,
    onAuthStateChanged,
    FacebookAuthProvider,
    signInWithCredential,
    updateProfile,
    createUserWithEmailAndPassword
} from 'firebase/auth';




const SeconsStepRegister = ({ navigation }) => {


    const [email, setEmail] = useState('')
    const [displayName, setName] = useState('')
    const [password, setPassword] = useState('')
    const auth = useSelector((state) => state.firebase.firebaseAuth)


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user.email);
                navigation.navigate('Tabs')
            } else {
                // User is signed out
                // ...
            }
        });

    }, [])

    const handleRegister = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredatials => {
                const user = userCredatials.user
                console.log(user)
                navigation.navigate('Tabs')
            }).catch(e => console.log(e.message))
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='padding'
        >
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleRegister}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <Text style={styles.disabledText}>OR</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonTextOutline}>Login</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}
export default SeconsStepRegister;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
        marginVertical: 10,
        maxWidth: 600,
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 5,
        backgroundColor: '#FFFFFF',
        marginTop: 10,
        borderRadius: 5,
        borderColor: '#e4e4e4',
        borderWidth: 1,
    },
    buttonContainer: {
        width: '80%',
        alignItems: 'center',
        maxWidth: 600,
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#FE634E',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 5,
    },
    buttonOutline: {
        backgroundColor: '#ffff',
        borderColor: '#FE634E',
        borderWidth: 1,
    },
    buttonText: {
        color: '#ffff',
        fontSize: 16,
        fontWeight: '500',
    },
    buttonTextOutline: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FE634E'
    },
    disabledText: {
        color: '#979797',
        marginTop: 10,
    }
})
