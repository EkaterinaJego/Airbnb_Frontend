import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./containers/HomeScreen";
import RoomScreen from "./containers/RoomScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import AroundScreen from "./containers/AroundScreen";
import ProfileScreen from "./containers/ProfileScreen";
import HeaderImage from "./components/HeaderImage";
// const axios = require("axios");

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

//my backend : https://airbnb-backend-by-ejego.herokuapp.com/

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);

  // save or remove token in AsyncStorage & state
  const setToken = async (token) => {
    if (token) {
      AsyncStorage.setItem("userToken", token);
      setUserToken(token);
    } else {
      AsyncStorage.removeItem("userToken");
      setUserToken(null);
    }
    setUserToken(token);
  };

  // save or remove id in AsyncStorage & state
  const setId = async (id) => {
    if (id) {
      AsyncStorage.setItem("userId", id);
      setUserId(id);
    } else {
      AsyncStorage.removeItem("userId");
      setUserId(null);
    }
    setUserId(id);
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");
      setUserToken(userToken);
      setUserId(userId);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? null : userToken === null ? (
        <Stack.Navigator>
          <Stack.Screen name="SignIn">
            {() => <SignInScreen setToken={setToken} setId={setId} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp">
            {() => <SignUpScreen setToken={setToken} setId={setId} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                tabBarOptions={{
                  activeTintColor: "#E41C57",
                  inactiveTintColor: "grey",
                }}
              >
                <Tab.Screen
                  name="Home"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: () => (
                      <Ionicons name={"ios-home"} size={30} color={"grey"} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Home"
                        options={{
                          headerTitle: (props) => <HeaderImage {...props} />,
                        }}
                      >
                        {(props) => <HomeScreen {...props} />}
                      </Stack.Screen>

                      <Stack.Screen
                        name="Room"
                        options={{
                          headerTitle: (props) => <HeaderImage {...props} />,
                        }}
                      >
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="Around"
                  options={{
                    tabBarLabel: "Around me",
                    tabBarIcon: () => (
                      <Ionicons name={"pin"} size={30} color={"grey"} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Around"
                        options={{
                          headerTitle: (props) => <HeaderImage {...props} />,
                        }}
                      >
                        {(props) => (
                          <AroundScreen setToken={setToken} {...props} />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="Profile"
                  options={{
                    tabBarLabel: "My Profile",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name={"person-circle-outline"}
                        size={30}
                        color={"grey"}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Profile"
                        options={{
                          headerTitle: (props) => <HeaderImage {...props} />,
                        }}
                      >
                        {(props) => (
                          <ProfileScreen
                            {...props}
                            userToken={userToken}
                            userId={userId}
                            setToken={setToken}
                            setId={setId}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
