import { StyleSheet, Platform, FlatList, ActivityIndicator, Alert, Animated } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { spacing } from '@/constants/spacing';

type Comment = {
  id: number;
  say: string;
  created_at: string;
};

const API_ENDPOINTS = {
  ios: 'http://192.168.21.120:8050/api/comments',
  android: 'http://192.168.21.120:8050/api/comments',
  default: 'http://localhost:8050/api/comments',
};

export default function ExploreScreen() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = Platform.select(API_ENDPOINTS);
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert(
        'Error',
        'Failed to fetch messages. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const CommentCard = ({ item, index }: { item: Comment; index: number }) => {
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}>
        <ThemedView style={styles.cardContent}>
          <ThemedText style={styles.message}>{item.say}</ThemedText>
          <ThemedText style={styles.timestamp}>
            {new Date(item.created_at).toLocaleString()}
          </ThemedText>
        </ThemedView>
      </Animated.View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Recent Messages</ThemedText>
      </ThemedView>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => <CommentCard item={item} index={index} />}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
        refreshing={isLoading}
        onRefresh={fetchComments}
      />
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: spacing.medium,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: spacing.medium,
  },
  card: {
    marginVertical: spacing.small / 2,
    backgroundColor: Colors.light.white,
    borderRadius: spacing.small,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardContent: {
    padding: spacing.medium,
    backgroundColor: 'transparent',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: Colors.light.text,
    marginBottom: spacing.small,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.light.placeholder,
    fontWeight: '500',
  },
  separator: {
    height: spacing.small,
  },
});