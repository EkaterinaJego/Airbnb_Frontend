import axios from "axios";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, Text, View, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

export default function AroundScreen() {
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [coords, setCoords] = useState({});

  useEffect(() => {
    const askPermission = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync();
          setCoords({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          const response = await axios.get(
            `https://express-airbnb-api.herokuapp.com/rooms/around?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
          );
          setData(response.data);
          // console.log("RESPONSE DATA =", response.data);
          setIsLoading(false);
        } else {
          const response = await axios.get(
            " `https://express-airbnb-api.herokuapp.com/rooms/around"
          );
          setData(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    askPermission();
  }, []);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 48.856614,
          longitude: 2.3522219,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation={true}
      >
        {data.map((marker, index) => {
          return (
            <MapView.Marker
              key={index}
              coordinate={{
                latitude: marker.location[1],
                longitude: marker.location[0],
              }}
            >
              <MapView.Callout />
            </MapView.Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: "100%",
    width: "100%",
  },
});
