import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import imageIndex from '../../../assets/imageIndex';

const TABS = ['Completed', 'Upcoming', 'Cancelled'];

const BookingsScreen = () => {
  const [activeTab, setActiveTab] = useState('Completed');
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState('');

  const DATA = [
    {
      id: 1,
      title: 'Facial Treatment',
      date: '12 Nov 2025',
      time: '11:30 AM',
      provider: 'Saba Khan',
      status: 'Completed',
      image: 'https://i.imgur.com/n3V4J7b.jpeg',
    },
    {
      id: 2,
      title: 'Facial Treatment',
      date: '12 Nov 2025',
      time: '11:20 AM',
      provider: 'Saba Khan',
      status: 'Completed',
      image: 'https://i.imgur.com/f9XHqag.jpeg',
    },
  ];

  const filteredData = DATA.filter(item => {
    return (
      item.status === activeTab &&
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      item.provider.toLowerCase().includes(providerFilter.toLowerCase())
    );
  });

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor:"white" }}>
      {/* Header */}
      <Text style={styles.header}>Bookings</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>

            <View style={{
              borderWidth:1 ,
              borderColor: 
              activeTab === tab ? "#09BFCD" :"white" ,
             
              marginTop:5
            }}/>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filters */}
  

      {/* List */}
      <FlatList 
      style={{
        marginTop:20
      }}
        showsVerticalScrollIndicator={false}
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <BookingCard item={item} />}
      />
    </SafeAreaView>
  );
};

// ----------------- Card Component -----------------

const BookingCard = ({ item }) => {
  return (
       <View style={{
       
  
 backgroundColor: '#fff',
   padding: 15,
  borderRadius: 10,
borderColor:"#D9D9D9",
  // ANDROID shadow
 borderWidth:0.4,
  // IOS shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
      }}>
    <View style={styles.card}>
   
      {/* Image */}
      <Image source={imageIndex.salone} style={styles.image} />

      {/* Info */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.row}>
          <Image source={imageIndex.calneder} 
          
          style={{
            height:22,
            width:22,
            resizeMode:"contain"
          }}
          />
           <Text style={styles.meta}>{item.date}</Text>
        </View>

        <View style={styles.row}>
          <Image   style={{
            height:22,
            width:22,
            resizeMode:"contain"
          }} source={imageIndex.time2}/>
          <Text style={styles.meta}>{item.time}</Text>
        </View>

        <View style={styles.row}>
          <Image 
          
            style={{
            height:22,
            width:22,
            resizeMode:"contain"
          }}
          source={imageIndex.pfioel12}/>
          <Text style={styles.meta}>Provider: {item.provider}</Text>


       
      
      </View>

      </View>
        </View>
        <View style={{

          borderWidth:0.5, 
          borderColor:"#E3E3E3" ,
          marginTop:12,
          marginBottom:8
        }}/>
         <View style={styles.successBox}>
          <Text style={styles.successText}>✔ Hey, you have completed it!</Text>
        </View>
    </View>
  );
};

// ----------------- Styles -----------------

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 10,
   },
  activeTab: {
    // backgroundColor: '#09BFCD',
  },
  tabText: {
    color: 'black',
    fontWeight: '500', 
            fontSize:17
  },
  tabTextActive: {
    color: '#09BFCD',
        fontWeight: '500',
            fontSize:17


  },
  input: {
    backgroundColor: '#F3F3F3',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  card: {
 backgroundColor: '#fff',
   borderRadius: 14,
 flexDirection:"row",
 marginBottom:4,
  // Android Shadow
  // elevation: 8,

  // iOS Shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  },
  image: {
    width: 95,
    height: 95,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  meta: {
    color: '#555',
    marginLeft:4 ,
    fontWeight:"500"
  },
  icon: {
    marginRight: 6,
   },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  successBox: {
    marginTop: 8,
    backgroundColor: '#00C36633',
    padding: 12,
    borderRadius: 8,
  },
  successText: {
    color: '#00C366',
    fontWeight: '500',
    fontSize: 13,
   },
});

export default BookingsScreen;
