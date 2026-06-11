import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatusBarComponent from "../../../compoent/StatusBarCompoent";
import imageIndex from "../../../assets/imageIndex";
import { useNavigation, useRoute } from "@react-navigation/native";
import font from "../../../theme/font";
import { color, image_url } from "../../../constant";
import { useSelector } from "react-redux";
import { socketService } from "../../../socket/socketService";
import { getMessages } from "../../../Api/chatApi";
import moment from "moment";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}

const ChatScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { providerData } = route.params || {};
  const recipientId = providerData?.providerId?._id || providerData?._id;
  const recipientName = providerData?.providerId?.name || providerData?.shopName || providerData?.name || "User";
  const recipientImage = providerData?.providerId?.profileImage || providerData?.shopImage || providerData?.profileImage;

  const { token, userData } = useSelector((state: any) => state.auth);
  const currentUserId = userData?._id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<any>(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      console.log("currentUserId", currentUserId);
      console.log("recipientId", recipientId);
      const chatRoomId = [currentUserId, recipientId].sort().join("_");
      const res = await getMessages(chatRoomId, token, setLoading);
      const msgs = Array.isArray(res) ? res : res.data || [];
      const formattedMessages: Message[] = msgs.map((msg: any) => ({
        id: msg._id,
        text: msg.message,
        sender: String(msg.senderId) === String(currentUserId) ? "me" : "other",
        time: moment(msg.timestamp || msg.createdAt).format("HH:mm"),
      }));
      setMessages(formattedMessages);
    } catch (err) {
      console.error("Load messages error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim().length === 0) return;

    const messageData = {
      recipientId: recipientId,
      message: inputText.trim(),
    };

    socketService.sendMessage(messageData);
    setInputText("");
  };

  useEffect(() => {
    // Keyboard listener: scroll to bottom when keyboard appears
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
    // Cleanup on unmount
    return () => {
      keyboardShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (recipientId && currentUserId) {
      loadMessages();
      socketService.connect(token);
      socketService.joinChat(recipientId);

      const handleReceiveMessage = (msg: any) => {
        // Only append if the message is from/to the current recipient and not already present
        if (
          (String(msg.senderId) === String(recipientId) ||
            String(msg.receiverId) === String(recipientId)) &&
          !messages.some((m) => m.id === msg._id)
        ) {
          const newMsg: Message = {
            id: msg._id || Date.now().toString(),
            text: msg.message,
            sender: String(msg.senderId) === String(currentUserId) ? "me" : "other",
            time: moment(msg.timestamp || msg.createdAt).format("HH:mm"),
          };
          setMessages((prev) => [...prev, newMsg]);
          // Emit mark-read event
          socketService.markRead(msg._id);
        }
      };

      socketService.onReceiveMessage(handleReceiveMessage);

      // Typing status listeners
      socketService.onTyping(() => {
        setIsTyping(true);
      });
      socketService.onStopTyping(() => {
        setIsTyping(false);
      });

      return () => {
        socketService.removeListener("receive-message");
        socketService.removeListener("user-typing");
        socketService.removeListener("user-stop-typing");
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }
  }, [recipientId, currentUserId]);

  const handleTextChange = (text: string) => {
    setInputText(text);
    if (recipientId) {
      socketService.sendTyping(recipientId);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        socketService.stopTyping();
      }, 1500);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "me" ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text
        // onPress={() => deleteMessageApi(item?.id)}
        style={item.sender === "me" ? styles.myMessageText : styles.otherMessageText}>
        {item.text}
      </Text>
      <Text style={styles.timeText}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={imageIndex.back} style={{ height: 30, width: 30 }} />
        </TouchableOpacity>
        <Image
          source={
            recipientImage
              ? { uri: image_url + recipientImage }
              : { uri: "https://ui-avatars.com/api/?background=09BFCD&color=fff&name=" + encodeURIComponent(recipientName) }
          }
          style={[styles.avatar, { marginLeft: 11 }]}
        />
        <View>
          <Text style={styles.name}>{recipientName}</Text>
          <Text style={[styles.status, isTyping ? { color: "#09BFCD" } : null]}>
            {isTyping ? "Typing..." : "Online"}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />


        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={handleTextChange}
            placeholderTextColor={"#999"}
          />
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
            <Image
              source={imageIndex.share}
              style={{
                height: 55,
                width: 55,
              }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  name: { fontFamily: font.TrialBold, fontSize: 16, color: color.primary },
  status: { fontSize: 12, color: "green", fontFamily: font.MonolithRegular, },
  chatContainer: { padding: 10 },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#09BFCD",
    borderBottomRightRadius: 0,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F6F6F6",
    borderBottomLeftRadius: 0,
  },
  myMessageText: { color: "white", fontFamily: font.MonolithRegular, fontSize: 14 },
  otherMessageText: { color: "#2C2D3A", fontFamily: font.MonolithRegular, fontSize: 14 },
  timeText: { fontSize: 10, fontFamily: font.MonolithRegular, marginTop: 5, textAlign: "right" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    height: 55,
    justifyContent: "center",
    marginHorizontal: 10,
    marginBottom: 30
  },
  input: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    height: 60,
    justifyContent: "center",
    marginTop: 15
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30
  },
});

export default ChatScreen;
