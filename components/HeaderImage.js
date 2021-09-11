import React from "react";
import { Image, StyleSheet } from "react-native";

function HeaderImage() {
  return (
    <Image
      source={require("../assets/logo.jpeg")}
      resizeMode={"contain"}
      style={styles.logo}
    />
  );
}

export default HeaderImage;

const styles = StyleSheet.create({
  logo: {
    height: 30,
    width: 30,
  },
});
