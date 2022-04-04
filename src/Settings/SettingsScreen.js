import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getFirestore, collection, collectionGroup, query, where, setDoc, updateDoc, getDocs, doc } from 'firebase/firestore';
import { getOsbb, getOsbbNews, getOsbbVote} from '../../redux/firebaseReducer';
import { useSelector, useDispatch } from 'react-redux';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SettingsScreen = ({ navigation }) => {
    const auth = getAuth()
    const dispatch = useDispatch()
    const osbb = useSelector((state) => state.firebase.osbb)
    const [email, setEmail] = useState('')
    // console.log(auth)
    const handleLogout = () => {
        signOut(auth).then(() => {
            navigation.navigate('Login');
            dispatch(getOsbb(null))
            dispatch(getOsbbNews(null))
            dispatch(getOsbbVote(null))
        }).catch((error) => {
            console.log(error,'err')
        });
    }

    const addUser = async () => {
        const firestore = getFirestore();
        let osbb_users = osbb.users

        osbb_users.push(email)

        await updateDoc(doc(firestore, "osbb", osbb.doc), {
            users: osbb_users
        });
        setEmail("")
    }

    return (
        <View style={styles.container}>
            <View style={styles.settingsContainer}>
                <View style={styles.buttonContainer}>
                    <Text>Email: {auth && auth.currentUser.email}</Text>
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>LOGOUT</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {osbb && auth && osbb.admin === auth.currentUser.email &&
            <View style={styles.settingsContainer}>
                <View style={styles.addUserContainer}>
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.input}
                    />
                    <TouchableOpacity
                        onPress={addUser}
                        style={styles.buttonAddUser}
                    >
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.settingsText}>OSBB users:</Text>
                {osbb && osbb.users.map((item,index) => (
                    <View key={index} style={styles.userText}>
                        <Text>{index + 1}. {item}</Text>
                    </View>
                )) }
            </View>
            }
        </View>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    settingsText:{
        fontWeight: "bold",
        textAlign: 'center',
    },
    userText:{
        padding: 10,
        borderBottomWidth:1,
        borderBottomColor: '#cccccc'
    },
    settingsContainer: {
        backgroundColor: '#ffff',
        width: windowWidth - 30,
        maxWidth: 600,
        marginTop: 10,
        margin: 10,
        padding: 10,
        borderRadius: 5,
    },
    inputContainer: {
        width: '80%',
        marginVertical: 10,
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderColor: '#e4e4e4',
        borderWidth: 1,
        width: '80%'
    },
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#FE634E',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 5,
    },
    addUserContainer:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'row',
        marginVertical: 10,
    },
    buttonAddUser:{
        width: '20%',
        padding: 15,
        marginLeft:5,
        backgroundColor: '#FE634E',
        borderRadius: 5,
        alignItems: 'center',
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
    }
})
