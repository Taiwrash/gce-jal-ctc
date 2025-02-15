import { StyleSheet, Platform, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { spacing } from '@/constants/spacing';

const API_ENDPOINTS = {
  ios: 'http://192.168.21.120:8050/api',
  android: 'http://192.168.21.120:8050/api',
  default: 'http://localhost:8050/api',
};

export default function HomeScreen() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = Platform.select(API_ENDPOINTS);

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ say: inputText }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Clear input on successful submission
      setInputText('');
      
      // Navigate to explore tab
      router.push('/explore');
      
    } catch (error) {
      console.error('Error details:', error);
      Alert.alert(
        'Error',
        'Failed to send message. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
      alert("you've successfully added your message, look up the screen for your contributions")
    }
  };

 return (
  <ThemedView style={styles.container}>
    <ThemedView style={styles.formContainer}>
    <ThemedView style={styles.splashContainer}>
        <ThemedText style={styles.splashTitle}>
          GCE Jalingo CTC GH Actions Demo
        </ThemedText>
        <ThemedText style={styles.splashSubtitle}>
          by Taiwrash
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            isLoading && styles.inputDisabled
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Share your thoughts..."
          placeholderTextColor={Colors.light.placeholder}
          editable={!isLoading}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
          textAlign="center"
          textAlignVertical="center"
        />
      </ThemedView>
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          isLoading && styles.buttonDisabled,
          pressed && styles.buttonPressed
        ]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.light.white} />
        ) : (
          <ThemedText style={styles.buttonText}>
            Share Message
          </ThemedText>
        )}
      </Pressable>
    </ThemedView>
  </ThemedView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  formContainer: {
    flex: 1,
    padding: spacing.medium,
    gap: spacing.small,
    justifyContent: 'center',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  splashContainer: {
    alignItems: 'center',
    marginBottom: spacing.large * 2,
    padding: spacing.medium,
  },
  splashTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.primary,
    textAlign: 'center',
    marginBottom: spacing.small,
  },
  splashSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.placeholder,
    textAlign: 'center',
  },
  inputContainer: {
    borderRadius: spacing.medium,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.light.border,
    borderRadius: spacing.medium,
    padding: spacing.large,
    fontSize: 18,
    color: Colors.light.text,
    minHeight: 150,
    backgroundColor: Colors.light.white,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  inputDisabled: {
    opacity: 0.7,
    backgroundColor: Colors.light.disabled,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: spacing.medium,
    borderRadius: spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    backgroundColor: Colors.light.disabled,
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: '600',
  },
});