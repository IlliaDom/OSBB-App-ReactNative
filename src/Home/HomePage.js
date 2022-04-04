import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, Text, View, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useSelector,useDispatch } from 'react-redux';
import { getFirestore, collection, setDoc, updateDoc, getDocs, doc} from 'firebase/firestore';
import Loading from '../common/Loading';
import { getOsbb, getOsbbNews } from '../../redux/firebaseReducer';
import { AntDesign } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { getDatabase, ref, set } from "firebase/database";




const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const HomePage = ({ navigation }) => {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const auth = getAuth()
    const dispatch = useDispatch()
    // console.log(auth)
    const db = useSelector((state) => state.firebase.firestore)
    const news = useSelector((state) => state.firebase.news)
    // const citiesRef = collection(db, "osbb-news");
    const [osbbData,setOsbbData] = useState(null)

    const [osbb, osbb_loading, osbb_error] = useCollectionData(collection(db, "osbb"))
    const [osbb_news, loading, error] = useCollectionData(collection(db, "osbb-news"))


    useEffect(()=>{
        osbb && auth.currentUser.email && osbb.map((item)=>{
            console.log(auth.currentUser.email)
            item.users.map((user)=>{
                if (user.toLowerCase() === auth.currentUser.email.toLowerCase()){
                    setOsbbData(item)
                    dispatch(getOsbb(item))
                }
            })
        })
        
    },[osbb,auth])

    const newsArray = []
    
    useEffect(() => {
        osbb_news && osbbData && osbb_news.map((item) => {
            if (item.osbb === osbbData.name) {
                newsArray.push(item)
                dispatch(getOsbbNews(newsArray))
            }
        })
    }, [osbb_news, osbbData ,auth])


    const likePost = async (item) => {
        const firestore = getFirestore();
        let likes_count = item.likes
        let liked_by = item.liked_by

       if( item.liked_by.length > 0 ) {
           if (item.liked_by.includes(auth.currentUser.email)) {
                likes_count = item.likes - 1
                const index = liked_by.indexOf(auth.currentUser.email)
                liked_by.splice(index,1)
            } else {
               likes_count = item.likes + 1
               liked_by.push(auth.currentUser.email)
            }
        } else {
            likes_count = item.likes + 1 
            liked_by(auth.currentUser.email)
        }
        await updateDoc(doc(firestore, "osbb-news",item.doc), {
            likes: likes_count,
            liked_by: liked_by
        });
    }

    
    if (loading) {
        return (<Loading />)
    }

    const renderItem = ({ item }) => (
        <View style={styles.newsContainer}>
            <Text style={styles.newsTitle}>{item && item.title}</Text>
            <Text style={styles.newsDescription}>{item && item.description}</Text>
            <View style={styles.bottomContainer}>
                <View style={styles.likeContainer}>
                    <TouchableOpacity style={styles.likeButton} onPress={()=>likePost(item)}>
                        {auth && item && item.liked_by.includes(auth.currentUser.email) ? <AntDesign  name="heart" size={24} color="tomato" />
                        :
                        <AntDesign name="hearto" size={24} color="#838383" />}
                    </TouchableOpacity>
                    <Text style={styles.likeCount}>{item && item.likes}</Text>
                </View>
                <Text style={styles.dateText}>{new Date(item && item.create_time * 1000).getHours()}:{new Date(item.create_time * 1000).getMinutes() === 0 ? '00' : new Date(item && item.create_time * 1000).getMinutes()} {new Date(item && item.create_time * 1000).getDate()} {months[new Date(item && item.create_time * 1000).getMonth()]}</Text>
            </View>
        </View>
    );


    return (
        <View style={styles.container}>
            <FlatList
                data={news && news}
                renderItem={renderItem}
                keyExtractor={item => item.title}
            />
            {osbbData && auth && osbbData.admin === auth.currentUser.email &&
                <View style={styles.addNewsContainer}>
                    <TouchableOpacity style={styles.addNews} onPress={() => navigation.navigate('Create News')}>
                        <MaterialIcons name="add" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export default HomePage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'flex-start',
        alignItems: 'center',
    },
    newsContainer:{
        backgroundColor: '#ffff',
        width:windowWidth - 30,
        maxWidth:600,
        marginTop: 10,
        margin: 10,
        padding: 10,
        borderRadius: 5,
    },
    likeContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    bottomContainer: {
        marginTop: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    likeCount:{
        marginLeft:5,
        color: '#838383'
    },
    newsTitle:{
        fontSize: 16,
        fontWeight: 'bold',
    },
    newsDescription: {
        fontSize: 16,
        fontWeight: '400',
        marginTop: 10,
        color: '#838383',
    },
    dateText:{
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
    addNewsContainer : {
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
        justifyContent:'center',
        alignItems: 'center',
    }
})
