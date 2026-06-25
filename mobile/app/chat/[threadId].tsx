import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { io, Socket } from 'socket.io-client';
import { Colors } from '@/constants/colors';
import { FontFamilies } from '@/constants/typography';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';

const SOCKET_URL = 'http://10.0.2.2:3000';

export default function ChatScreen() {
  const { threadId } = useLocalSearchParams() as { threadId: string };
  // threadId format: listingId_u1_u2
  const [listingId, u1, u2] = threadId.split('_');
  const router = useRouter();
  const { user } = useAuthStore();
  const currentUserId = user?.id;
  const otherUserId = currentUserId === u1 ? u2 : u1;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Fetch initial history
    const fetchHistory = async () => {
      try {
        const res = await api.get<any>(`/messages/${threadId}`);
        res.data?.data?.messages ? setMessages(res.data.data.messages) : setMessages(res.data?.messages || []);
      } catch (err) {
        console.error('Failed to fetch messages', err);
      }
    };
    fetchHistory();

    // Setup Socket.io
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_chat', threadId);
    });

    newSocket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [threadId, listingId, otherUserId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const content = input.trim();
    setInput(''); // Optimistic clear

    try {
      await api.post(`/messages/${threadId}`, {
        listing_id: listingId,
        receiver_id: otherUserId,
        message: content,
      });
      // Message will be pushed back to us via socket
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender_id === currentUserId;

    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.messageText, isMe && styles.messageTextMe]}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor={Colors.slate}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} 
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmLinen,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.slateTint,
  },
  backBtn: {
    marginRight: 16,
  },
  backText: {
    fontSize: 24,
    color: Colors.midnightInk,
  },
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    color: Colors.midnightInk,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageRow: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowThem: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  bubbleMe: {
    backgroundColor: Colors.guraOrange,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.slateTint,
  },
  messageText: {
    fontFamily: FontFamilies.body,
    fontSize: 16,
    color: Colors.midnightInk,
    lineHeight: 22,
  },
  messageTextMe: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.slateTint,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.warmLinen,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 100,
    fontFamily: FontFamilies.body,
    fontSize: 16,
    color: Colors.midnightInk,
  },
  sendBtn: {
    marginLeft: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendText: {
    fontFamily: FontFamilies.heading,
    fontSize: 16,
    color: Colors.guraOrange,
  }
});
