import axios from "axios";
import React, { useEffect, useState } from "react";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export default function RoomScreen({ route }) {
  const [isLoading, setIsLoading] = useState(true);
  const [roomData, setRoomData] = useState("");
  const [fullVisibility, setFullVisibility] = useState(3);
  const [images, setImages] = useState([]);

  const id = route.params.id;

  const { width } = Dimensions.get("window");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/${id}`
        );
        setRoomData(response.data);
        setImages(response.data.photos);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const starCount = () => {
    let starRating = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Number(roomData.ratingValue)) {
        starRating.push(
          <MaterialIcons key={i} name="star" size={24} color="gold" />
        );
      } else {
        starRating.push(
          <MaterialIcons key={i} name="star-border" size={24} color="grey" />
        );
      }
    }
    return starRating;
  };

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <ScrollView style={styles.container}>
      <View style={{ flex: 1 }}>
        <SwiperFlatList
          showPagination
          paginationActiveColor={"pink"}
          data={images}
          index={0}
          style={styles.swiper}
          renderItem={({ item }) => (
            <ImageBackground
              style={styles.roomimg}
              source={{ uri: item.url }}
              key={item.picture_id}
            />
          )}
        />
      </View>

      <View style={styles.roomprice}>
        <Text style={styles.roompricetext}>{roomData.price}$</Text>
      </View>

      <View style={styles.roominfo}>
        <View style={styles.roomtitle}>
          <Text numberOfLines={1}>{roomData.title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "grey" }}>
              {starCount(roomData.ratingValue)}
            </Text>
            <Text style={{ color: "grey" }}> {roomData.reviews} reviews</Text>
          </View>
        </View>
        <View style={styles.ownerimgview}>
          <Image
            style={styles.ownerimg}
            source={{ uri: roomData.user.account.photo.url }}
          ></Image>
        </View>
      </View>

      <Text numberOfLines={fullVisibility}>{roomData.description}</Text>
      <TouchableOpacity
        onPress={() => {
          if (fullVisibility === 3) {
            setFullVisibility(null);
          } else {
            setFullVisibility(3);
          }
        }}
      >
        {fullVisibility === 3 ? (
          <Text style={styles.showbtn}> Show more 🔽</Text>
        ) : (
          <Text style={styles.showbtn}>Show less 🔼</Text>
        )}
      </TouchableOpacity>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 48.856614,
          longitude: 2.3522219,
          latitudeDelta: 0.09,
          longitudeDelta: 0.09,
        }}
      >
        <MapView.Marker
          coordinate={{
            latitude: roomData.location[1],
            longitude: roomData.location[0],
          }}
          title={roomData.title}
        />
        <MapView.Callout />
      </MapView>
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "white",
  },
  roomimg: {
    width,
    height: 250,
    resizeMode: "cover",
    marginTop: "3%",
  },

  ownerimg: {
    width: 80,
    height: 80,
    borderRadius: 50,
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

  roominfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: "5%",
    marginLeft: "5%",
    marginTop: "2%",
  },

  roomtitle: {
    flex: 2,
    justifyContent: "center",
  },

  map: {
    height: 300,
    width: "100%",
  },

  swiper: {
    height: 300,
    width: "100%",
    flex: 1,
  },

  showbtn: {
    fontSize: 13,
    color: "grey",
    marginTop: "3%",
    marginBottom: "2%",
  },
});
