// components/Header.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { color } from '../constant';
import imageIndex from '../assets/imageIndex';


const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.greeting}>Hello, Welcome</Text>
        <Text style={styles.userName}>Savannah Nguyen</Text>
      </View>
      <TouchableOpacity style={styles.profileButton}>
        {/* Use a local image - you'll need to add this image to your assets */}
        <Image 
          source={imageIndex.profiel} 
          style={styles.profileIcon}
        //   defaultSource={require('./assets/default-profile.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  greeting: {
    fontSize: 14,
    color: color.textSecondary,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: color.textPrimary,
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 24,
    height: 24,
    tintColor: color.white,
  },
});

export default Header;
