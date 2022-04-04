import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, TextInput } from 'react-native'
import { useSelector } from 'react-redux'
import {
    getAuth,
    onAuthStateChanged,
    FacebookAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';




const Login = ({ navigation }) => {

    const [email, setEmail] = useState('')
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
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                navigation.navigate('Tabs')
                // ...
            })
            .catch((error) => {
                console.log(error.code, error.message)
                const errorMessage = error.message;
            });
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
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <Text style={styles.disabledText}>OR</Text>
                <View style={styles.registerButton}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                        style={[styles.button, styles.buttonOutline]}
                    >
                        <Text style={styles.buttonTextOutline}>Register OSBB</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SecondStep')}
                        style={[styles.button, styles.buttonOutline]}
                    >
                        <Text style={styles.buttonTextOutline}>Register as user</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}
export default Login;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
        maxWidth: 600,
        marginVertical: 10,
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
    registerButton: {
        display: 'flex',
        flexDirection: "column",
        width:'100%',
        justifyContent:"space-between"
    },
    buttonContainer: {
        width: '80%',
        maxWidth: 600,
        alignItems: 'center',
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
    disabledText:{
        color: '#979797',
        marginTop: 10,
    }
})
