import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../compoent/CustomHeader';
import imageIndex from '../../assets/imageIndex';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { GET_API, PUT_API } from '../../Api/apiRequest';
import { color } from '../../constant';

const NotificationItem = ({ item, onMarkRead }: any) => {
  return (
    <View style={[styles.itemContainer, item.isRead ? null : styles.unreadBackground]}>
      <View style={styles.dot} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, item.isRead ? styles.readTitle : styles.unreadTitle]}>{item.title || item.message || 'Notification'}</Text>
        <Text style={styles.date}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : item.date || 'N/A'}</Text>
      </View>
      {!item.isRead && (
        <TouchableOpacity style={styles.actionButton} onPress={() => onMarkRead(item._id || item.id)}>
          <Text style={styles.actionText}>Mark read</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const { token } = useSelector((state: any) => state.auth);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  useEffect(() => {
    loadNotifications();
  }, [token]);

  const fetchUnreadCount = async () => {
    if (!token) return;
    const result = await GET_API('notifications/unread-count', token, 'GET', setLoading);
    const count = result?.data?.count ?? result?.count ?? result?.unreadCount ?? 0;
    setUnreadCount(Number(count));
  };

  const fetchNotifications = async (pageNumber = 1) => {
    if (!token) return;
    const result = await GET_API(`notifications?page=${pageNumber}&limit=${limit}`, token, 'GET', setLoading);
    const payload = result?.data ?? result;
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.notifications)
      ? payload.notifications
      : [];

    if (pageNumber === 1) {
      setNotifications(items);
      setHasMore(items.length === limit);
    } else {
      setNotifications(prev => [...prev, ...items]);
      setHasMore(items.length === limit);
    }

    setPage(pageNumber);
  };

  const loadNotifications = async () => {
    setLoading(true);
    setHasMore(true);
    await Promise.all([fetchNotifications(1), fetchUnreadCount()]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (loading || refreshing || !hasMore || notifications.length === 0) return;
    await fetchNotifications(page + 1);
  };

  const markSingleRead = async (id: string) => {
    if (!token || !id) return;
    setLoading(true);
    const result = await PUT_API(token, {}, `notifications/${id}/read`, setLoading);
    if (result?.success) {
      await loadNotifications();
    } else {
      // Alert.alert('Error', result?.message || 'Could not mark notification as read.');
      setLoading(false);
    }
  };

  const renderItem = useCallback(
    ({ item }: any) => <NotificationItem item={item} onMarkRead={markSingleRead} />,
    [markSingleRead]
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        label="Notifications"
        menuIcon={imageIndex.left}
        leftPress={true}
        navigation={navigation}
      />

      <View style={styles.headerRow}>
        {/* <Text style={styles.headerText}>Unread: {unreadCount}</Text> */}
      </View>

      {loading && notifications.length === 0 ? (
        <ActivityIndicator color={color.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id?.toString() || item.id?.toString() || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No notifications yet.</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  markAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#09BFCD',
    borderRadius: 20,
  },
  markAllText: {
    color: '#fff',
    fontWeight: '600',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
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
  unreadTitle: {
    fontWeight: '700',
  },
  readTitle: {
    fontWeight: '400',
    color: '#666',
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  actionButton: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    color: '#09BFCD',
    fontWeight: '600',
  },
  deleteButton: {},
  deleteText: {
    fontSize: 13,
    color: '#FF3B30',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
  },
});

export default NotificationsScreen;
