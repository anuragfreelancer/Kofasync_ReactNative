import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import StatusBarComponent from "../../../compoent/StatusBarCompoent";
import { SafeAreaView } from "react-native-safe-area-context";
import font from "../../../theme/font";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import ScreenNameEnum from "../../../routes/screenName.enum";
import { useSelector } from "react-redux";
import { socketService } from "../../../socket/socketService";
import { getConversations } from "../../../Api/chatApi";
import { image_url } from "../../../constant";
import moment from "moment";

type ChatItem = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  profileImage: string;
  isOnline?: boolean;
  unreadCount?: number;
  rawItem?: any;
};

export default function ChatInboxScreen() {
  const [query, setQuery] = useState("");
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { token, userData } = useSelector((state: any) => state.auth);
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  useEffect(() => {
    console.log("token", token)

  }, [])
  const loadChats = async () => {
    try {
      if (!isFocused && chats.length > 0) return;
      setLoading(true);

      const res = await getConversations();
      console.log('res', res)
      const data = Array.isArray(res) ? res : res.data || [];
      const formattedChats: ChatItem[] = data.map((item: any) => ({
        id: item._id,
        name: item.name || item.senderName || "User",
        lastMessage: item.lastMessage || "No messages yet",
        time: item.timestamp ? moment(item.timestamp).fromNow() : "",
        profileImage: item.profileImage || "",
        unreadCount: item.unreadCount || 0,
        rawItem: item,
      }));
      setChats(formattedChats);
    } catch (err) {
      console.error("Load chats error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadChats();
    }
  }, [isFocused]);

  useEffect(() => {
    if (token) {
      socketService.connect(token);

      const handleReceiveMessage = () => {
        loadChats();
      };

      socketService.onReceiveMessage(handleReceiveMessage);

      // Online status tracking
      socketService.onUserOnline((data: any) => {
        setOnlineUsers(data.activeUsers || []);
      });

      socketService.onUserOffline((data: any) => {
        setOnlineUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      });

      return () => {
        socketService.removeListener("receive-message");
        socketService.removeListener("user-online");
        socketService.removeListener("user-offline");
      };
    }
  }, [token]);

  // Join all chat rooms to receive messages in real time
  useEffect(() => {
    if (!userData?._id || chats.length === 0) return;
    chats.forEach((chat) => {
      socketService.joinChat(chat.id);
    });
  }, [chats, userData?._id]);

  const filteredData = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = chats.map(chat => ({
      ...chat,
      isOnline: onlineUsers.some(u => String(u.userId) === String(chat.id))
    }));
    if (!q) return list;
    return list.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.lastMessage.toLowerCase().includes(q)
    );
  }, [query, chats, onlineUsers]);

  const renderItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={() => {
        // Reset unread count locally when clicked
        setChats(prev => prev.map(c => c.id === item.id ? { ...c, unreadCount: 0 } : c));
        navigation.navigate(ScreenNameEnum.ChatScreen, { providerData: item.rawItem });
      }}
    >
      <View style={styles.avatarWrap}>
        <Image
          source={
            item?.profileImage
              ? { uri: image_url + item?.profileImage }
              : { uri: "https://ui-avatars.com/api/?background=09BFCD&color=fff&name=" + encodeURIComponent(item.name) }
          }
          style={styles.avatar}
        />
        {item.isOnline && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.textCol}>
        <View style={styles.nameTimeRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>

        <View style={styles.messageRow}>
          <Text
            style={[styles.lastMessage, item.unreadCount ? styles.unread : null]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>

          {!!item.unreadCount && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <Text style={styles.header}>Chat</Text>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search…"
          placeholderTextColor="#9aa0a6"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          returnKeyType="search"
        />
      </View>


      <FlatList
        data={filteredData}
        style={{ marginTop: 15 }}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        onRefresh={loadChats}
        refreshing={loading}
      />

    </SafeAreaView>
  );
}

const AVATAR_SIZE = 48;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    fontSize: 28,
    marginBottom: 12,
    color: "#0f172a",
    fontWeight: 'bold'
  },
  searchBox: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 0,
    marginBottom: 8,
    height: 48,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  input: {
    fontSize: 16,
    color: "black",
    fontFamily: font.MonolithRegular,
    paddingVertical: 0,
  },
  separator: {
    height: 3,
    marginLeft: AVATAR_SIZE + 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  avatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    marginRight: 16,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: AVATAR_SIZE / 2,
  },
  onlineDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    right: 0,
    bottom: 0,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  textCol: {
    flex: 1,
  },
  nameTimeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontFamily: font.MonolithRegular,
    color: "#0f172a",
    fontWeight: 'bold'
  },
  time: {
    fontSize: 12,
    color: "black",
    marginLeft: 8,
    fontFamily: font.MonolithRegular
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  lastMessage: {
    flex: 1,
    fontSize: 13,
    color: "#1E1E1E",
    fontFamily: font.MonolithRegular
  },
  unread: {
    color: "#09BFCD",
    fontFamily: font.MonolithRegular,
    fontSize: 12
  },
  badge: {
    backgroundColor: "#09BFCD",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontFamily: font.MonolithRegular
  },
});
