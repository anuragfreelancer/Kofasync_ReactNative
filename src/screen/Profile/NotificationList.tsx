import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../compoent/CustomHeader';
import imageIndex from '../../assets/imageIndex';
import { useNavigation } from '@react-navigation/native';
import { GetApi } from '../../api/apiRequest';
import { useSelector } from 'react-redux';
import LoadingModal from '../../utils/Loader';
import moment from 'moment';

const notifications = [
  {
    title: '',
    data: [
      {
        id: '1',
        title: 'Your weekly review has been answered',
        date: 'Jun 2, 2024 at 09:41 AM',
        unread: false,
      },
      {
        id: '2',
        title: 'Unread notification title',
        date: 'Date',
        unread: true,
      },
    ],
  },


];

const NotificationItem = ({ item }) => {
  return (
    <View
      style={[
        styles.itemContainer,
        item.unread && styles.unreadBackground
      ]}
    >
      <View style={styles.dot} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{item.message}</Text>
      </View>
        <Text style={styles.title}>{moment(item.created_at).fromNow()}</Text>

    </View>
  );
};

const NotificationsScreen = () => {
  const navigation = useNavigation()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const isLogin = useSelector((state: any) => state.auth);
  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const param = {
      token: isLogin?.token,
      method: 'POST',
      url: 'shift/getNotifications',

    }
    console.log(param)
    const dd = await GetApi(param, setLoading)
    console.log(dd, 'this is data')
    if (dd.success) {
      setData(dd?.data?.data)
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      {loading && <LoadingModal />}
      <CustomHeader
        label={"Notification"}
        // leftPress={() => navigation.goBack()}
      // rightIcons={[
      //     { icon: imageIndex.close, onPress:()=>navigation.navigate(ScreenNameEnum.NotificationsScreen)}
      // ]}
      />
      <FlatList
        // sections={f}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}
        // renderSectionHeader={({ section: { title } }) => (
        //   <Text style={styles.sectionHeader}>{title}</Text>
        // )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#555',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  unreadBackground: {
    backgroundColor: '#F0F8F5',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6FCF97',
    marginTop: 6,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    color: '#333',
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
});

export default NotificationsScreen;
