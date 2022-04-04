import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, Text, View, TouchableOpacity } from 'react-native'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useSelector, useDispatch } from 'react-redux';
import { getFirestore, collection, collectionGroup, query, where, setDoc, updateDoc, getDocs, doc } from 'firebase/firestore';
import Loading from '../common/Loading';
import { MaterialIcons } from '@expo/vector-icons';
import { getOsbb, getOsbbNews, getOsbbVote } from '../../redux/firebaseReducer';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VoteScreen = ({ navigation }) => {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const auth = getAuth()
    const dispatch = useDispatch()
    const db = useSelector((state) => state.firebase.firestore)
    const vote = useSelector((state) => state.firebase.vote)
    const osbbData = useSelector((state) => state.firebase.osbb)
    const [osbb, osbb_loading, osbb_error] = useCollectionData(collection(db, "osbb"))
    const [osbb_vote, loading, error] = useCollectionData(collectionGroup(db, "osbb_vote"))
    const voteArray = []

    useEffect(() => {
        osbb_vote && osbbData && osbb_vote.map((item) => {
            if (item.osbb === osbbData.name) {
                voteArray.push(item)
                dispatch(getOsbbVote(voteArray))
            }
        })
    }, [osbb_vote, osbbData, auth])

    const sendVote = async (variant,item) => {
        const firestore = getFirestore();
        let all_users = item.all_users
        let all =  item.vote_variants
        let existing = variant
        let isClear = false
        let vote_count = item.vote_count

        if(item.all_users.includes(auth.currentUser.email)){
            isClear = false
        }else {
            isClear = true
            all.map((v) => {
                if(v.title === existing.title){
                    v.users.push(auth.currentUser.email)
                    all_users.push(auth.currentUser.email)
                    vote_count = vote_count + 1
                }
            })
        }

        isClear && await updateDoc(doc(firestore, "osbb_vote", item.doc), {
            vote_variants: all,
            all_users: all_users,
            vote_count: vote_count,
        });
    }


    if (loading) {
        return (<Loading />)
    }

    const renderItem = ({ item }) => (
        <View style={styles.voteContainer}>
            <Text style={styles.voteTitle}>{item.title}</Text>
            <Text style={styles.voteDescription}>{item.description}</Text>
            <View style={styles.voteContainer}>
                {
                    item.vote_variants.map((variant, index) => <TouchableOpacity key={index} onPress={() => sendVote(variant, item)} style={styles.voteButton}>
                        {variant.users.includes(auth.currentUser.email) ? 
                        <Ionicons name="checkmark-circle-outline" size={24} color="green" /> : 
                        <Ionicons name="checkmark-circle-outline" size={24} color="#838383" />}
                        <Text style={styles.voteText}>{variant.title}</Text>
                    </TouchableOpacity>)
                }
            </View>
            <View style={styles.bottomContainer}>
                <Text style={styles.dateText}>{new Date(item.create_time * 1000).getHours()}:{new Date(item.create_time * 1000).getMinutes() === 0 ? '00' : new Date(item.create_time * 1000).getMinutes()} {new Date(item.create_time * 1000).getDate()} {months[new Date(item.create_time * 1000).getMonth()]}</Text>
            </View>
        </View>
    );


    return (
        <View style={styles.container}>
            <FlatList
                data={vote && vote}
                renderItem={renderItem}
                keyExtractor={item => item.title}
            /> 
            {osbbData && osbbData.admin === auth.currentUser.email &&
                <View style={styles.addNewsContainer}>
                    <TouchableOpacity style={styles.addNews} onPress={() => navigation.navigate('Create Vote')}>
                        <MaterialIcons name="add" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export default VoteScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    voteButton:{
        padding: 10,
        flexDirection: 'row',
        marginTop:5,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    voteText:{
        marginLeft:10,
        fontWeight: 'bold',
    },
    voteContainer: {
        backgroundColor: '#ffff',
        width: windowWidth - 30,
        maxWidth: 600,
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
    },
    likeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    bottomContainer: {
        marginTop: 10,
        justifyContent:"flex-end",
        alignItems: 'center',
        flexDirection: 'row',
    },
    likeCount: {
        marginLeft: 5,
        color: '#838383'
    },
    voteTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    voteDescription: {
        fontSize: 16,
        fontWeight: '400',
        marginTop: 10,
        color: '#838383',
    },
    dateText: {
        color: '#838383'
    },
    inputContainer: {
        width: '80%',
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
    buttonContainer: {
        width: '60%',
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
    addNewsContainer: {
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    addNews: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FE634E',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
