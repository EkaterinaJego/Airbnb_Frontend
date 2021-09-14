import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios from "axios";
import { TextInput } from "react-native-gesture-handler";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { DescriptionInput } from "../components/DescriptionInput";

export default function ProfileScreen({ userId, userToken, setToken, setId }) {
  // console.log("userToken ===> ", userToken);
  // console.log("userId ===> ", userId);

  const { width } = Dimensions.get("window");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageModified, setImageModified] = useState(false);
  const [infoModified, setInfoModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (userToken && userId) {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${userId}`,
          {
            headers: {
              authorization: `Bearer ${userToken}`,
            },
          }
        );
        setEmail(response.data.email);
        setUsername(response.data.username);
        setDescription(response.data.description);
        if (response.data.photo) {
          setImage(response.data.photo[0].url);
        }
        setIsLoading(false);
      } catch (error) {
        console.log("ERROR ===>", error.response.data);
      }
    } else {
      console.log("ID ou TOKEN are missing");
    }
  };

  // Edit information :
  const handleUpdate = async () => {
    if (imageModified || infoModified) {
      setIsLoading(true);

      // if avatar was changed :
      if (imageModified) {
        try {
          const formData = new FormData();
          const uriParts = image.split(".");
          const fileType = uriParts[uriParts.length - 1];
          formData.append("photo", {
            uri: image,
            name: "userPicture",
            type: `image/${fileType}`,
          });
          const response = await axios.put(
            "https://express-airbnb-api.herokuapp.com/user/upload_picture",
            formData,
            { headers: { authorization: `Bearer ${userToken}` } }
          );
          // console.log("FORMDATA=========>", formData);
          if (response.data) {
            setImage(response.data.photo[0].url);
          }
        } catch (error) {
          // console.log("ERROR=======>", error);
        }
      }
      if (infoModified) {
        try {
          // If user information was modified :
          const response = await axios.put(
            "https://express-airbnb-api.herokuapp.com/user/update",
            { email, description, username },
            { headers: { authorization: `Bearer ${userToken}` } }
          );
        } catch (error) {
          console.log("ERROR=====>", error);
        }
      }
      imageModified && setImageModified(false);
      infoModified && setInfoModified(false);
      setIsLoading(false);
      fetchData();
    }
  };

  const handlePickImage = async () => {
    // Demander l'autorisation d'accès à la gallerie
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      // Si c'est ok => récupérer une image
      const result = await ImagePicker.launchImageLibraryAsync();
      console.log(result);
      if (!result.cancelled) {
        setImage(result.uri);
        console.log("IMAGE URI=====>", image);
        setImageModified(true);
      } else {
        alert("Pas d'image choisie !");
      }
    }
  };
  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      // console.log(result);
      if (!result.cancelled) {
        setImage(result.uri);
        setImageModified(true);
      }
    }
  };

  return isLoading ? (
    <ActivityIndicator size="large" color="blue" />
  ) : (
    <KeyboardAwareScrollView>
      <ScrollView style={styles.main}>
        <View style={styles.iconphotogallery}>
          <View>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.userimage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.iconperson}>
                <Ionicons
                  name="ios-person-circle-outline"
                  size={200}
                  color="grey"
                />
              </View>
            )}
          </View>
          <View style={styles.cameragallerybtns}>
            <TouchableOpacity onPress={handlePickImage}>
              <Ionicons
                name="md-images-outline"
                size={40}
                color="grey"
                style={styles.galery}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTakePhoto}>
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
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setInfoModified(true);
            }}
          />
          <TextInput
            style={styles.textinput}
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setInfoModified(true);
            }}
          />
          <DescriptionInput
            value={description}
            setDescription={setDescription}
            setInfoModified={setInfoModified}
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
              Update
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logoutbtnview}>
          <TouchableOpacity
            style={styles.logoutbtn}
            onPress={() => {
              setId(null), setToken(null);
            }}
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
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  main: {
    flex: 1,
    height: "100%",

    marginLeft: 10,
    marginRight: 10,
  },

  iconperson: {
    alignItems: "center",
  },

  iconphotogallery: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginLeft: 10,
    marginRight: 10,
  },

  twoicons: {
    justifyContent: "space-around",
    alignItems: "center",
  },

  userinfo: {
    alignItems: "center",
    justifyContent: "center",

    marginTop: 20,
  },

  textinput: {
    borderBottomWidth: 2,
    borderColor: "pink",
    width: "100%",
    marginBottom: 20,
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
    width: 250,
    height: 250,
    borderRadius: 10,
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
  // modalView: {
  //   margin: 20,
  //   backgroundColor: "white",
  //   borderRadius: 20,
  //   padding: 35,
  //   alignItems: "center",
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },
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

  cameragallerybtns: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
});
