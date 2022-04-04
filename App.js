import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './src/Auth/Register';
import Login from './src/Auth/Login';
import HomePage from './src/Home/HomePage';
import store from './redux/store';
import { Provider } from 'react-redux';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect } from 'react';
import { useState } from 'react';
import  Loading  from './src/common/Loading';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from './src/Settings/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import VoteScreen from './src/Vote/VoteScreen';
import CreateNews from './src/Home/CreateNews';
import CreateVote from './src/Vote/CreateVote'
import SeconsStepRegister from './src/Auth/SeconStepRegister';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator()

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{ headerShown: true }} name="News" component={HomePage} />
      <Stack.Screen options={{ headerShown: true }} name="Create News" component={CreateNews} />
    </Stack.Navigator>
  )
}

const VoteStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{ headerShown: true }} name="Vote" component={VoteScreen} />
      <Stack.Screen options={{ headerShown: true }} name="Create Vote" component={CreateVote} />
    </Stack.Navigator>
  )
}

const TabsNavigator = () => {
  return (
    <Tabs.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings';
          } else if (route.name === 'Votes') {
            return <MaterialCommunityIcons name="vote" size={size} color={color} />
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen options={{ headerShown: false }} name="Home" component={HomeStackNavigator} />
      <Tabs.Screen options={{ headerShown: false }} name="Votes" component={VoteStackNavigator} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  )
}

export default function App() {

  const auth = getAuth();
  const [Auth, loading, error] = useAuthState(auth)
  // console.log(Auth)

  if (loading) {
    return (<Loading />)
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
          <Stack.Screen options={{ headerShown: false }} name="Tabs" component={TabsNavigator} />
          <Stack.Screen options={{ headerShown: false }} name="Register" component={Register} />
          <Stack.Screen options={{ headerShown: false }} name="SecondStep" component={SeconsStepRegister}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
