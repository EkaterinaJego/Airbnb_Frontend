import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
const axios = require("axios");

const SignUpScreen = ({ setToken, setId }) => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (email && username && description && password && confirmpassword) {
      try {
        const response = await axios.post(
          "https://airbnb-backend-by-ejego.herokuapp.com/user/signup",
          {
            email: email,
            username: username,
            description: description,
            password: password,
          }
        );

        if (response.data.token && response.data.id) {
          const userToken = response.data.token;
          const userId = response.data.id;
          setToken(userToken);
          setId(userId);
        } else {
          console.log("Some information is missing");
        }
      } catch (error) {
        if (error.data.error === "This email already has an account") {
          alert("There is already this email in the database");
        }
      }
    } else {
      console.log("Some parameters are missing");
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
              <Text style={styles.nameofthepage}>SIGN UP</Text>
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
                placeholder="username"
                style={styles.textinputeach}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setUsername(text);
                }}
                value={username}
              ></TextInput>
              <TextInput
                placeholder="description"
                style={styles.textinputeach}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setDescription(text);
                }}
                value={description}
              ></TextInput>
              <TextInput
                placeholder="password"
                style={styles.textinputeach}
                secureTextEntry={true}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setPassword(text);
                }}
                value={password}
              ></TextInput>
              <TextInput
                placeholder="confirm password"
                style={styles.textinputeach}
                secureTextEntry={true}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setConfirmPassword(text);
                }}
                value={confirmpassword}
              ></TextInput>
              <View style={{ alignItems: "center", marginTop: 90 }}>
                {password && confirmpassword && password !== confirmpassword ? (
                  <Text style={styles.fillfields}>
                    Passwords must be the same
                  </Text>
                ) : (
                  <Text style={{ display: "none" }}></Text>
                )}
                <View style={styles.button}>
                  <TouchableOpacity onPress={handleSignUp}>
                    <Text>Sign Up</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("SignIn");
                  }}
                >
                  <Text style={styles.registerbutton}>
                    Already have an account ? Sign in
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

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
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
