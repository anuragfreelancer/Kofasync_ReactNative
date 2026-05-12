import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomButton from '../../../compoent/CustomButton';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { GET_API } from '../../../Api/apiRequest';
import LoadingModal from '../../../utils/Loader';
import { image_url } from '../../../constant';

const MEN_DATA = [
  { id: '1', name: 'Undercut', img: imageIndex.man1 },
  { id: '2', name: 'Quiff', img: imageIndex.man1 },
  { id: '3', name: 'Crew Cut', img: imageIndex.man1 },
  { id: '4', name: 'Regular Cut', img: imageIndex.man1 },
];

const WOMEN_DATA = [
  { id: '1', name: 'Layer Cut', img: imageIndex.man1 },
  { id: '2', name: 'Feather Cut', img: imageIndex.man1 },
  { id: '3', name: 'Straight Cut', img: imageIndex.man1 },
];

export default function OurServices() {
  const route = useRoute<any>();
  const { serviceId, providerId, shopId } = route.params || {};
  const { token } = useSelector((state: any) => state.auth);

  const [gender, setGender] = useState('Men');
  const [selected, setSelected] = useState(null);
  const [subServices, setSubServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (serviceId) {
      fetchSubServices();
    }
  }, [serviceId]);

  const fetchSubServices = async () => {
    const res = await GET_API(`sub-services/public/${serviceId}`, token, "GET", setLoading);
    console.log("Sub-Services API Response:", res);
    if (res?.success) {
      setSubServices(res.data);
    }
  };

  const filteredData = subServices.filter((item: any) => 
    item.gender?.toLowerCase() === gender.toLowerCase()
  );

  const renderCard = ({ item }: any) => {
    const isSelected = selected === item._id;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelected(item._id)}
      >
        <Image
          source={item.image ? { uri: image_url + item.image } : imageIndex.man1}
          style={styles.cardImg}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text
            style={[styles.cardTitle, {
              color: "#9E9E9E",
              fontSize: 14,
              marginTop: 5
            }]}
          >{item.bookedCount || 0} booked</Text>

          <Text style={[styles.cardTitle, {
            color: "#09BFCD",
            fontSize: 15,
            marginTop: 5
          }]}>${item.price}</Text>

        </View>

        {/* Radio button */}
        <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <LoadingModal visible={loading} />
      <Text style={styles.heading}>Our Services</Text>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, gender === 'Men' && styles.tabActive]}
          onPress={() => setGender('Men')}
        >
          <Text style={[styles.tabTxt, gender === 'Men' && styles.tabTxtActive]}>
            Men
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, gender === 'Women' && styles.tabActive]}
          onPress={() => setGender('Women')}
        >
          <Text
            style={[styles.tabTxt, gender === 'Women' && styles.tabTxtActive]}
          >
            Women
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        renderItem={renderCard}
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          !loading ? (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: '#666' }}>No sub-services found for {gender}</Text>
            </View>
          ) : null
        }
      />

      {/* Bottom Apply Button */}
      <View style={styles.bottomArea}>
        <CustomButton 
          onPress={() => {
            if (selected) {
              navigation.navigate(ScreenNameEnum.AppointmentScreen, { 
                providerId, 
                subServiceId: selected,
                shopId 
              });
            } else {
              Alert.alert("Error", "Please select a sub-service first");
            }
          }} 
          title='Apply' 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
  },

  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 14,
  },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 4,
    borderRadius: 40,
    marginBottom: 15,
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 40,
    alignItems: 'center',
  },

  tabActive: {
    backgroundColor: '#09BFCD',
  },

  tabTxt: {
    fontSize: 14,
    color: '#555',
  },

  tabTxtActive: {
    color: '#fff',
    fontWeight: '600',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    borderWidth: 0.2,
    borderColor: "#181C2E",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  cardImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '500',
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#bbb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOuterActive: {
    borderColor: '#00C3E5',
  },

  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: '#00C3E5',
    borderRadius: 10,
  },

  bottomArea: {
    position: 'absolute',
    bottom: 30,
    left: 18,
    right: 18,
  },

  applyBtn: {
    backgroundColor: '#00C3E5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  applyTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
