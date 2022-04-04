import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity , View, KeyboardAvoidingView, TextInput } from 'react-native'
import { useSelector } from 'react-redux'
import {
    getAuth,
    onAuthStateChanged,
    FacebookAuthProvider,
    signInWithCredential,
    updateProfile,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore, collection, collectionGroup, query, where, setDoc, updateDoc, getDocs, doc, onSnapshot, Timestamp } from 'firebase/firestore';




const Register = ({navigation}) => {
    
    const [email, setEmail] = useState('')
    const [nameOSBB, setnameOSBB] = useState('')
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [address, setAdress] = useState('')
    const [zip, setZip] = useState('')

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

    const handleRegister = async () => {
        try {
            if (nameOSBB.length > 0 && country.length > 0 && city.length > 0 && address.length > 0 && zip.length > 0) {
                const random = Math.floor(Math.random() * 9999)
                const doc1 = nameOSBB + "_" + random
                const firestore = getFirestore();
                await setDoc(doc(firestore, "osbb", doc1), {
                    admin:email,
                    adress:address,
                    city: city,
                    country: country,
                    name: nameOSBB,
                    users: [email],
                    doc: doc1,
                    zip_code:zip,
                });
                navigation.navigate('SecondStep')
            } else {
                Alert.alert('Validation Error', `All field is required`)
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior='padding'
        >
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Admin Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="OSBB Name"
                    value={nameOSBB}
                    onChangeText={text => setnameOSBB(text)}
                    style={styles.input}
                />
                <TextInput 
                    placeholder="Country" 
                    value={country} 
                    onChangeText={text => setCountry(text)} 
                    style={styles.input} 
                />
                <TextInput
                    placeholder="City"
                    value={city}
                    onChangeText={text => setCity(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Address"
                    value={address}
                    onChangeText={text => setAdress(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Zip code"
                    value={zip}
                    onChangeText={text => setZip(text)}
                    style={styles.input}
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
export default  Register;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    inputContainer: {
        width:'80%',
        marginVertical:10,
        maxWidth: 600,
    },
    input: {
        paddingVertical:15,
        paddingHorizontal:5,
        backgroundColor: '#FFFFFF',
        marginTop:10,
        borderRadius:5,
        borderColor:'#e4e4e4',
        borderWidth:1,
    },
    buttonContainer:{
        width:'80%',
        alignItems: 'center',
        maxWidth: 600,
    },
    button:{
        width: '100%',
        padding: 15,
        backgroundColor:'#FE634E',
        alignItems: 'center',
        marginTop:10,
        borderRadius:5,
    },
    buttonOutline : {
        backgroundColor:'#ffff',
        borderColor:'#FE634E',
        borderWidth:1,
    },
    buttonText:{
        color:'#ffff',
        fontSize:16,
        fontWeight:'500',
    },
    buttonTextOutline:{
        fontSize:16,
        fontWeight:'500',
        color:'#FE634E'
    },
    disabledText: {
        color: '#979797',
        marginTop: 10,
    }
})
