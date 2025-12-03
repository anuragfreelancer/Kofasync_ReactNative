import { View, Text, ScrollView, StyleSheet, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ReviewCard from '../BottomTab/DashBoard/ReviewCard'
import CustomHeader from '../../compoent/CustomHeader';
import imageIndex from '../../assets/imageIndex';

const reviews = [
  {
    id: 1,
    name: "Kadin Calzoni",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    rating: 4,
    review:
      "The workers are very professional and the results are very satisfying. I like it very much.",
  },
  {
    id: 2,
    name: "Hanna Dokidis",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    rating: 5,
    review:
      "The workers are very professional and the results are very satisfying. I like it very much.",
  },
  {
    id: 3,
    name: "Terry Siphron",
    image: "https://randomuser.me/api/portraits/men/33.jpg",
    rating: 5,
    review:
      "The workers are very professional and the results are very satisfying. I like it very much.",
  },
];
const MyReviews = () => {
  return (
    <SafeAreaView style={{flex:1}}>
        <CustomHeader label='My Reviews'/>
        <Image source={imageIndex.ratting} resizeMode='contain' style={{height:100, width:'90%', alignSelf:'center'}}/>

        <ScrollView contentContainerStyle={{padding:15}}>
      <Text style={styles.title}>Reviews</Text>
     {reviews?.map((item)=> <ReviewCard item={item}/>
     )}
</ScrollView>
    </SafeAreaView>
  )
}

export default MyReviews


const styles = StyleSheet.create({
    title:{
        fontWeight:'bold',
        fontSize:22
    }
})