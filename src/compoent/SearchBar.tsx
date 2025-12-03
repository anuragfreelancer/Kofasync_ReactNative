import React from "react";
import { View, TextInput, Image, StyleSheet } from "react-native";
import imageIndex from "../assets/imageIndex";

interface SearchBarProps {
  placeholder?: string;
  onSearchChange?: (text: string) => void;
  value?:string,
  searchBar1:any
 }

const SearchBar: React.FC<SearchBarProps> = ({ searchBar1,placeholder = "Search", onSearchChange ,value}) => {
  return (
    <View style={[styles.searchBar,searchBar1]}>
      <Image source={imageIndex.search1} style={styles.icon} resizeMode="cover" />
      <TextInput 
       allowFontScaling={false} 
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="white"
        onChangeText={onSearchChange}
        value={value}
      />
      {/* <Image source={imageIndex.filter} style={styles.icon} resizeMode="cover"  /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
     borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    marginBottom: 20,
    marginTop: 30,
    borderWidth: 1,
    height: 55,
    borderColor:"white"
  
  
  },
  icon: {
    height: 20,
    width: 20,
    tintColor:"white"
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
    marginLeft: 15,
  },
});

export default SearchBar;
