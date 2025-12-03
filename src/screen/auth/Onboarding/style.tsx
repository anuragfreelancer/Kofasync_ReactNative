// style.ts
import { Dimensions, Platform, StyleSheet } from 'react-native';
import font from '../../../theme/font';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width,
    flex: 1,
     alignItems: 'center',
    
    // paddingHorizontal: 2,
  },
  image: {
    width: 448,
    height: 500,
    resizeMode: 'contain',
    marginBottom: 30,
    backgroundColor:"transparent",
    
  },
  title: {
    fontSize: 32,
     color: '#000',
    textAlign: 'left',
    marginBottom: 12,
    fontFamily:"Bold",
    marginTop:20,
    marginHorizontal:15
  },
  description: {
    fontSize: 14,
    color: '#76889A',
    // textAlign: 'center',
     lineHeight:20,
    fontFamily:font.MonolithRegular,
    marginHorizontal:15

  },
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 70 : 55,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#09BFCD',
    fontWeight:"600"
    },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20, 
    alignItems:"center"
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  footerButton: {
     marginBottom: Platform.OS === 'ios' ? 0 : 10,
      justifyContent:"center" ,
     alignItems:"center" ,
     flex:1 ,
     marginHorizontal:45
   },
});
