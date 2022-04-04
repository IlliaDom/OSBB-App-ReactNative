import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React,{ useEffect, useState} from 'react'
import { Dimensions } from 'react-native';
import { getFirestore, collection, collectionGroup, query, where, setDoc, updateDoc, getDocs, doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import { getAuth } from "firebase/auth";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const CreateNews = ({ navigation}) => {
    const auth = getAuth()
    const [title,setTitle] = useState('')
    const [description,setDescription] = useState('')
    const osbb = useSelector((state) => state.firebase.osbb)
    
    console.log(osbb)
    const createNews = async () => {
        try {
            if (title.length > 0 && description.length > 0){
                const random = Math.floor(Math.random() * 9999)
                const doc1 = osbb.name + "_" + auth.currentUser.email + "_" + random
                const firestore = getFirestore();
                await setDoc(doc(firestore, "osbb-news", doc1), {
                    likes: 0,
                    liked_by: [""],
                    create_time: Timestamp.now(),
                    description: description,
                    title: title,
                    osbb: osbb.name,
                    doc: doc1,
                });
                navigation.navigate('News')
            }else {
                Alert.alert('Validation Error', `All field is required`)
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <View style={styles.container}>
        <View style={styles.newsContainer}>
              <TextInput style={styles.input} placeholder="Title" required onChangeText={text => setTitle(text)}/>
        </View>
        <View style={styles.newsContainer}>
              <TextInput style={[styles.input, { minHeight: 200 }]} required onChangeText={text => setDescription(text)} placeholder="Description" multiline/>
        </View>
        <View style={styles.newsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => createNews()}>
                <Text style={styles.text}>Create</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default CreateNews

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    newsContainer: {
        width: windowWidth - 30,
        maxWidth: 600,
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
    },
    input: {
        backgroundColor: '#ffff',
        padding:10,
        borderRadius: 5,

    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#FE634E',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 5,
    },
    text: {
        color: '#ffff',
        fontSize:18
    }

})