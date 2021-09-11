import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen({ setToken, setId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateDescription, setUpdateDescripton] = useState("");
  const [updateUsername, setUpdateUsername] = useState("");
  const [image, setImage] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        const userId = await AsyncStorage.getItem("userId");
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${userId}`,
          {
            headers: {
              authorization: `Bearer ${userToken}`,
            },
          }
        );
        setUpdateDescripton(response.data.description);
        setUpdateEmail(response.data.email);
        setUpdateUsername(response.data.username);
        // console.log("RESPONSE DATA==>", response.data);

        if (response.data.photo) {
          setImage(response.data.photo[0].url);
          console.log("RESPONSE DATA URL==>", response.data.photo[0].url);
        }

        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchData();
  }, []);

  const handleGallery = async () => {
    try {
      const cameraRollPerm =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraRollPerm.status === "granted") {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
        console.log("PICKER RESULT GALLERY==>", pickerResult);
        if (!pickerResult.cancelled) {
          setImage(pickerResult.uri);
        }
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleCamera = async () => {
    try {
      const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
      const cameraRollPerm =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      // only if user allows permission to camera AND camera roll
      if (
        cameraPerm.status === "granted" &&
        cameraRollPerm.status === "granted"
      ) {
        const pickerResult = await ImagePicker.launchCameraAsync({
          allowEditing: true,
          aspect: [4, 3],
        });
        console.log(pickerResult);
        if (!pickerResult.cancelled) {
          setImage(pickerResult.uri);
        }
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleImagePicker = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const tab = image.split(".");
      const formData = new FormData();
      formData.append("photo", {
        uri: image,
        name: "photo",
        type: `image/${tab[tab.length - 1]}`,
      });
      // console.log("FORMDATA===>", formData);

      const response = await axios.put(
        "https://express-airbnb-api.herokuapp.com/user/upload_picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.data.photo) {
        setImage(response.data.photo[0].url);

        setModalVisible(true);
      }
      // console.log("RESPONSE ==>", response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleUpdate = async () => {
    try {
      if (updateEmail || updateDescription || updateUsername) {
        const userToken = await AsyncStorage.getItem("userToken");
        const response = await axios.put(
          "https://express-airbnb-api.herokuapp.com/user/update",
          {
            email: updateEmail,
            description: updateDescription,
            username: updateUsername,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (response.data) {
          setUpdateEmail(response.data.email);
          setUpdateDescripton(response.data.description);
          setUpdateUsername(response.data.username);
          setModalVisible(true);
        }
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <KeyboardAwareScrollView>
      <ScrollView style={styles.main}>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{displayMessage}</Text>

                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textStyle}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View style={styles.iconphotogallery}>
            {image ? (
              <Image source={{ uri: image }} style={styles.userimage} />
            ) : (
              <View style={styles.iconperson}>
                <Ionicons
                  name="ios-person-circle-outline"
                  size={200}
                  color="grey"
                />
              </View>
            )}
            <View style={styles.twoicons}>
              <TouchableOpacity onPress={handleGallery}>
                <Ionicons
                  name="md-images-outline"
                  size={40}
                  color="grey"
                  style={styles.galery}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCamera}>
                <MaterialIcons
                  name="photo-camera"
                  size={40}
                  color="grey"
                  style={styles.photo}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.userinfo}>
            <TextInput
              style={styles.textinput}
              value={updateEmail}
              onChangeText={
                ((text) => setUpdateEmail(text), setIsModified(true))
              }
            />
            <TextInput
              style={styles.textinput}
              value={updateUsername}
              onChangeText={
                ((text) => setUpdateUsername(text), setIsModified(true))
              }
            />
            <TextInput
              style={styles.textinput2}
              multiline={true}
              maxLength={40}
              numberOfLines={10}
              value={updateDescription}
              editable
              onChangeText={
                ((text) => setUpdateDescripton(text), setIsModified(true))
              }
            />
          </View>

          <View style={styles.updatebtnview}>
            <TouchableOpacity style={styles.updatebtn} onPress={handleUpdate}>
              <Text
                style={{
                  textAlign: "center",
                  paddingTop: 20,
                  fontSize: 20,
                  color: "grey",
                }}
              >
                Update Information
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.updatebtnview}>
            <TouchableOpacity
              style={styles.updatebtn}
              onPress={handleImagePicker}
            >
              <Text
                style={{
                  textAlign: "center",
                  paddingTop: 20,
                  fontSize: 20,
                  color: "grey",
                }}
              >
                Update Avatar
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logoutbtnview}>
            <TouchableOpacity
              onPress={() => {
                setToken(null);
                setId(null);
              }}
              style={styles.logoutbtn}
            >
              <Text
                style={{
                  textAlign: "center",
                  paddingTop: 20,
                  fontSize: 20,
                  color: "grey",
                }}
              >
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  main: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
    marginLeft: 10,
    marginRight: 10,
  },

  iconperson: {
    alignItems: "center",
  },

  iconphotogallery: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  twoicons: {
    justifyContent: "space-around",
    alignItems: "center",
  },

  userinfo: {
    alignItems: "center",
    justifyContent: "center",
  },

  textinput: {
    borderBottomWidth: 2,
    borderColor: "pink",
    width: "100%",
    marginBottom: 20,
  },

  textinput2: {
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "pink",
    width: "100%",
    marginBottom: 10,
    paddingTop: 25,
    textAlign: "left",
    textAlignVertical: "bottom",
    paddingBottom: 15,
    justifyContent: "center",
  },

  updatebtnview: {
    alignItems: "center",
    justifyContent: "space-around",
    height: 90,
  },
  updatebtn: {
    width: "60%",
    borderColor: "red",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRadius: 25,
    height: 60,
  },
  logoutbtnview: {
    alignItems: "center",
    justifyContent: "space-around",
    height: 90,
  },

  userimage: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginRight: 20,
    marginBottom: 40,
  },

  logoutbtn: {
    width: "60%",
    borderColor: "red",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRadius: 25,
    height: 60,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: "grey",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
