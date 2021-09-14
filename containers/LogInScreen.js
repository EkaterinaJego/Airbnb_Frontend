import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const axios = require("axios");

const LogInScreen = ({ setToken, setId }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [allChamps, setAllChamps] = useState(true);

  const handleSignIn = async () => {
    if (email && password) {
      try {
        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/log_in",
          {
            email,
            password,
          }
        );
        if (response.data.token && response.data.id) {
          const userToken = response.data.token;
          const userId = response.data.id;
          console.log(userToken);
          setToken(userToken);
          setId(userId);
          setAllChamps(true);
          navigation.navigate("Home", { username: response.data.username });
        } else {
          setAllChamps(false);
          console.log("Erorr occured");
        }
      } catch (error) {
        console.log(error.response);
      }
    } else {
      console.log("Please fullfill all fields");
    }
  };
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <SafeAreaView>
        <ScrollView style={{ marginLeft: 20, marginRight: 20 }}>
          <View>
            <View style={styles.logo}>
              <Image
                source={require("../assets/téléchargement.jpg")}
                resizeMode="contain"
              ></Image>
              <Text style={styles.nameofthepage}>LOG IN</Text>
            </View>
            <View style={styles.textinput}>
              <TextInput
                placeholder="email"
                style={styles.textinputeach}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setEmail(text);
                }}
                value={email}
              ></TextInput>
              <TextInput
                placeholder="password"
                autoCapitalize="none"
                style={styles.textinputeach}
                onChangeText={(text) => {
                  setPassword(text);
                }}
                secureTextEntry={true}
                value={password}
              ></TextInput>
              <View style={{ alignItems: "center", marginTop: 120 }}>
                {!allChamps ? (
                  <Text style={styles.fillfields}>Please fill all fields</Text>
                ) : (
                  <Text style={{ display: "none" }}></Text>
                )}
                <View style={styles.button}>
                  <TouchableOpacity onPress={handleSignIn}>
                    <Text>Sign In</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("SignUp");
                  }}
                >
                  <Text style={styles.registerbutton}>
                    No account ? Register
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    height: "100%",
  },

  logo: {
    alignItems: "center",
  },

  nameofthepage: {
    fontSize: 20,
    color: "grey",
    marginBottom: 60,
  },

  textinput: {
    width: "100%",
  },

  textinputeach: {
    marginBottom: 30,
    borderBottomColor: "pink",
    borderBottomWidth: 1,
  },

  fillfields: {
    color: "red",
    opacity: 0.6,
  },

  button: {
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",

    width: "50%",
    height: 40,
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 20,
  },

  registerbutton: {
    fontSize: 12,
    marginTop: 18,
    color: "grey",
  },
});
