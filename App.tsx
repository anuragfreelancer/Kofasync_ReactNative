import React, { FunctionComponent } from 'react';
import { LogBox, Text, } from 'react-native';
import 'react-native-gesture-handler';
import AppNavigator from './src/navigators/AppNavigator';
import { TextInput } from 'react-native';
import 'react-native-reanimated';
// "react-native-maps": "^1.26.14",
// 

LogBox.ignoreAllLogs();
(Text as any).defaultProps = (Text as any).defaultProps || {};


(Text as any).defaultProps.allowFontScaling = false;

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};

(TextInput as any).defaultProps.allowFontScaling = false;

(TextInput as any).defaultProps.underlineColorAndroid = "transparent";

const App: FunctionComponent<any> = () => <AppNavigator />;

export default App;


// // const MAPTILER_API_KEY = 'UMbdXFSYALqFF0N335yL';
// import React, { useEffect, useState } from 'react';
// import {
//     SafeAreaView,
//     View,
//     Text,
//     TextInput,
//     FlatList,
//     TouchableOpacity,
//     ActivityIndicator,
//     Modal,
//     StyleSheet,
// } from 'react-native';
// import axios from 'axios';

// const MAPTILER_API_KEY = 'UMbdXFSYALqFF0N335yL';

// const LocationSearchScreen = () => {
//     const [search, setSearch] = useState('');
//     const [results, setResults] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const [selectedAddress, setSelectedAddress] = useState(null);
//     const [modalVisible, setModalVisible] = useState(false);

//     useEffect(() => {
//         const debounce = setTimeout(() => {
//             if (search.trim().length >= 3) {
//                 searchLocations();
//             } else {
//                 setResults([]);
//             }
//         }, 500);

//         return () => clearTimeout(debounce);
//     }, [search]);

//     const searchLocations = async () => {
//         try {
//             setLoading(true);

//             const response = await axios.get(
//                 `https://api.maptiler.com/geocoding/${encodeURIComponent(
//                     search,
//                 )}.json`,
//                 {
//                     params: {
//                         key: MAPTILER_API_KEY,
//                         autocomplete: true,
//                         limit: 10,
//                     },
//                 },
//             );

//             const formattedResults = response.data.features.map(item => {
//                 let village = item.text || '';
//                 let tehsil = '';
//                 let district = '';
//                 let state = '';
//                 let country = '';
//                 let pincode = '';

//                 item.context?.forEach(ctx => {
//                     if (ctx.id?.startsWith('county')) {
//                         tehsil = ctx.text;
//                     }

//                     if (ctx.id?.startsWith('subregion')) {
//                         district = ctx.text;
//                     }

//                     if (ctx.id?.startsWith('region')) {
//                         state = ctx.text;
//                     }

//                     if (ctx.id?.startsWith('country')) {
//                         country = ctx.text;
//                     }

//                     if (
//                         ctx.id?.startsWith('postcode') ||
//                         ctx.id?.startsWith('postal_code')
//                     ) {
//                         pincode = ctx.text;
//                     }
//                 });

//                 return {
//                     id: item.id,
//                     village,
//                     tehsil,
//                     district,
//                     state,
//                     country,
//                     pincode,
//                     latitude: item.center?.[1],
//                     longitude: item.center?.[0],
//                     fullAddress: item.place_name,

//                     displayAddress: [
//                         village,
//                         tehsil,
//                         district,
//                         state,
//                         country,
//                         pincode,
//                     ]
//                         .filter(Boolean)
//                         .join(', '),
//                 };
//             });

//             setResults(formattedResults);
//         } catch (error) {
//             console.log('Search Error =>', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const onSelectAddress = item => {
//         setSelectedAddress(item);
//         setModalVisible(true);
//     };

//     const renderItem = ({ item }) => (
//         <TouchableOpacity
//             style={styles.item}
//             onPress={() => onSelectAddress(item)}>
//             <Text style={styles.addressText}>
//                 {item.displayAddress}
//             </Text>
//         </TouchableOpacity>
//     );

//     return (
//         <SafeAreaView style={styles.container}>
//             <Text style={styles.heading}>
//                 Search Address
//             </Text>

//             <TextInput
//                 style={styles.input}
//                 placeholder="Search village, city, district..."
//                 value={search}
//                 onChangeText={setSearch}
//             />

//             {loading && (
//                 <ActivityIndicator
//                     size="small"
//                     style={{ marginTop: 10 }}
//                 />
//             )}

//             <FlatList
//                 data={results}
//                 keyExtractor={item => item.id}
//                 renderItem={renderItem}
//                 keyboardShouldPersistTaps="handled"
//                 showsVerticalScrollIndicator={false}
//             />

//             <Modal
//                 visible={modalVisible}
//                 transparent
//                 animationType="slide"
//                 onRequestClose={() => setModalVisible(false)}>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContainer}>
//                         <Text style={styles.modalTitle}>
//                             Selected Address
//                         </Text>

//                         <Text style={styles.label}>
//                             Full Address
//                         </Text>
//                         <Text style={styles.value}>
//                             {selectedAddress?.fullAddress || '-'}
//                         </Text>

//                         <Text style={styles.label}>
//                             Village
//                         </Text>
//                         <Text style={styles.value}>
//                             {selectedAddress?.village || '-'}
//                         </Text>

//                         <Text style={styles.label}>
//                             Tehsil
//                         </Text>
//                         <Text style={styles.value}>
//                             {selectedAddress?.tehsil || '-'}
//                         </Text>

//                         <Text style={styles.label}>
//                             District
//                         </Text>
//                         <Text style={styles.value}>
//                             {selectedAddress?.district || '-'}
//                         </Text>

//                         <Text style={styles.label}>
//                             State
//                         </Text>
//                         <Text style={styles.value}>
//                             {selectedAddress?.state || '-'}
//                         </Text>

//                         <Text style={styles.label}>
//                             Country
//                         </Text>
//                         <Text style={styles.value}>
//                             {selectedAddress?.country || '-'}
//                         </Text>

//                         <Text style={styles.label}>
//                             Pincode
//                         </Text>
//                         <Text style={styles.value}>
//                             {selectedAddress?.pincode || '-'}
//                         </Text>

//                         <Text style={styles.label}>
//                             Latitude
//                         </Text>
//                         <Text style={styles.value}>
//                             {selectedAddress?.latitude || '-'}
//                         </Text>

//                         <Text style={styles.label}>
//                             Longitude
//                         </Text>
//                         <Text style={styles.value}>
//                             {selectedAddress?.longitude || '-'}
//                         </Text>

//                         <TouchableOpacity
//                             style={styles.closeBtn}
//                             onPress={() => setModalVisible(false)}>
//                             <Text style={styles.closeBtnText}>
//                                 Close
//                             </Text>
//                         </TouchableOpacity>

//                         {/* Example Submit */}
//                         <TouchableOpacity
//                             style={styles.submitBtn}
//                             onPress={() => {
//                                 console.log(
//                                     'Selected Address:',
//                                     selectedAddress,
//                                 );
//                             }}>
//                             <Text style={styles.closeBtnText}>
//                                 Submit
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
//         </SafeAreaView>
//     );
// };

// export default LocationSearchScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         padding: 16,
//     },

//     heading: {
//         fontSize: 22,
//         fontWeight: '700',
//         marginBottom: 15,
//     },

//     input: {
//         height: 50,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 10,
//         paddingHorizontal: 15,
//         marginBottom: 10,
//     },

//     item: {
//         paddingVertical: 14,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//     },

//     addressText: {
//         fontSize: 15,
//         color: '#333',
//         lineHeight: 22,
//     },

//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         justifyContent: 'center',
//         padding: 20,
//     },

//     modalContainer: {
//         backgroundColor: '#fff',
//         borderRadius: 15,
//         padding: 20,
//     },

//     modalTitle: {
//         fontSize: 20,
//         fontWeight: '700',
//         marginBottom: 15,
//     },

//     label: {
//         marginTop: 10,
//         fontWeight: '700',
//         color: '#000',
//     },

//     value: {
//         marginTop: 3,
//         color: '#555',
//     },

//     closeBtn: {
//         marginTop: 25,
//         backgroundColor: '#007AFF',
//         padding: 12,
//         borderRadius: 10,
//         alignItems: 'center',
//     },

//     submitBtn: {
//         marginTop: 10,
//         backgroundColor: '#34C759',
//         padding: 12,
//         borderRadius: 10,
//         alignItems: 'center',
//     },

//     closeBtnText: {
//         color: '#fff',
//         fontWeight: '600',
//     },
// });