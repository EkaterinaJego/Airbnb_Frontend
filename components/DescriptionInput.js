import React from "react";
import { StyleSheet, TextInput, Dimensions } from "react-native";

export const DescriptionInput = ({
  setDescription,
  description,
  setInfoModified,
}) => {
  const { width } = Dimensions.get("window");

  return (
    <TextInput
      maxLength={250}
      multiline
      numberOfLines={10}
      placeholder="Description"
      style={styles.textinput2}
      value={description}
      onChangeText={(text) => {
        setDescription(text);
        setInfoModified(true);
      }}
    />
  );
};
const styles = StyleSheet.create({
  textinput2: {
    borderWidth: 2,
    borderColor: "pink",
    width: "100%",
    height: 100,

    textAlign: "left",
    textAlignVertical: "top",
    paddingBottom: 0,
    justifyContent: "center",
  },
});
