import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
const axios = require("axios");
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://express-airbnb-api.herokuapp.com/rooms"
      );
      setData(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item._id)}
        renderItem={({ item, index }) => {
          let starRating = [];
          for (let i = 1; i <= 5; i++) {
            if (i <= Number(item.ratingValue)) {
              starRating.push(
                <MaterialIcons
                  key={index + i}
                  name="star"
                  size={24}
                  color="gold"
                />
              );
            } else {
              starRating.push(
                <MaterialIcons
                  key={index + i}
                  name="star-border"
                  size={24}
                  color="grey"
                />
              );
            }
          }

          return (
            <TouchableOpacity
              style={styles.roomcart}
              onPress={() => navigation.navigate("Room", { id: item._id })}
            >
              <View>
                <Image
                  style={styles.roomimg}
                  source={{ uri: item.photos[0].url }}
                />
                <View style={styles.roomprice}>
                  <Text style={styles.roompricetext}>{item.price} $</Text>
                </View>
              </View>
              <View style={styles.roominfo}>
                <View style={styles.roomtitle}>
                  <Text numberOfLines={1}>{item.title}</Text>
                  <Text>{starRating}</Text>
                </View>
                <View style={styles.ownerimgview}>
                  <Image
                    style={styles.ownerimg}
                    source={{ uri: item.user.account.photo.url }}
                  ></Image>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: "100%",
    backgroundColor: "white",
    marginRight: "5%",
    marginLeft: "5%",
  },

  roomcart: {
    borderStyle: "solid",
    borderTopWidth: 1,
    marginTop: "10%",
    marginBottom: "0%",
    borderColor: "gray",
  },

  roomimg: {
    width: 350,
    height: 200,
    resizeMode: "cover",
    marginTop: "3%",
  },
  ownerimg: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },

  roominfo: {
    flexDirection: "row",
  },

  roomtitle: {
    flex: 2,
  },

  ownerimgview: {
    flex: 1,
    alignItems: "flex-end",
  },

  roomprice: {
    backgroundColor: "black",
    color: "white",
    height: 30,
    width: 100,
    textAlign: "center",
    position: "absolute",
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  roompricetext: {
    color: "white",
    fontSize: 20,
  },
});
