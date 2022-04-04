import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Dimensions } from 'react-native';
import { getFirestore, collection, collectionGroup, query, where, setDoc, updateDoc, getDocs, doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth } from "firebase/auth";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const CreateVote = ({ navigation }) => {
    const auth = getAuth()
    const [title, setTitle] = useState('')
    const [variant, setVariant] = useState([{ title: "", users: [], }, { title: "", users: [],}]);

    const [description, setDescription] = useState('')
    const osbb = useSelector((state) => state.firebase.osbb)


    const handleInputChange = (text, index) => {
        const list = [...variant];
        list[index].title = text;
        setVariant(list);
    };

    const handleAddClick = () => {
        setVariant([...variant, { title: "", users: [] }]);
    };

    const handleRemoveClick = index => {
        const list = [...variant];
        list.splice(index, 1);
        setVariant(list);
    };
    const CreateVote = async () => {
        try {
            if (title.length > 0 && description.length > 0){
                const random = Math.floor(Math.random() * 9999)
                const doc1 = osbb.name + "_" + auth.currentUser.email + "_" + random
                const firestore = getFirestore();
                
                await setDoc(doc(firestore, "osbb_vote", doc1), {
                    vote_variants: variant,
                    create_time: Timestamp.now(),
                    description: description,
                    title: title,
                    osbb: osbb.name,
                    doc: doc1,
                    vote_count: 0,
                    all_users: [],
                });
                navigation.navigate('Vote')
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
                <TextInput style={styles.input} placeholder="Title" onChangeText={text => setTitle(text)} />
            </View>
            <View style={styles.newsContainer}>
                <TextInput style={[styles.input, { minHeight: 100 }]} onChangeText={text => setDescription(text)} placeholder="Description" multiline />
            </View>
            {variant.map((variant, index) =>(
                <View style={[styles.newsContainer,styles.variantContainer]} key={index}>
                    <TextInput style={[styles.input, styles.variantInput]} placeholder={"Variant " + parseInt(index + 1)} onChangeText={text => handleInputChange(text,index)} />
                    <TouchableOpacity style={styles.deleteContainer} onPress={() => handleRemoveClick(index)}>
                        <MaterialCommunityIcons name="delete-outline" size={24} color="#FE634E" />
                    </TouchableOpacity>
                </View>
            ))} 
            <View style={[styles.newsContainer,{display: 'flex',justifyContent:'center',alignItems: 'center',}]} >
                <TouchableOpacity style={styles.buttonOutline} onPress={() => handleAddClick()}>
                    <Text style={[styles.text, { color: '#FE634E' }]}>Add Variant</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.newsContainer}>
                <TouchableOpacity style={styles.button} onPress={() => CreateVote()}>
                    <Text style={[styles.text]}>Create</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CreateVote

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
    variantContainer:{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
    },
    deleteContainer:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '15%',
        padding: 5,
        borderWidth:1,
        borderColor: '#FE634E',
        marginLeft:-5,
        backgroundColor: '#ffff',
        borderTopRightRadius:5,
        borderBottomRightRadius:5,
    },
    input: {
        backgroundColor: '#ffff',
        padding: 10,
        borderRadius: 5,
    },
    variantInput:{
        width:'85%'
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#FE634E',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 5,
    },
    buttonOutline : {
        width: '50%',
        padding: 5,
        borderWidth: 1,
        borderColor:'#FE634E',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 5,
    },
    text: {
        color: '#ffff',
        fontSize: 18
    }

})