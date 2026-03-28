import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useGalleryStore } from '@/lib/store';
import type { RedditSource } from '@/lib/types';

function parseInput(input: string): RedditSource {
  const trimmed = input.trim().replace(/^\//, '');
  if (trimmed.startsWith('u/')) {
    return { type: 'user', name: trimmed.slice(2) };
  }
  if (trimmed.startsWith('r/')) {
    return { type: 'subreddit', name: trimmed.slice(2) };
  }
  return { type: 'subreddit', name: trimmed };
}

function encodeSource(source: RedditSource): string {
  return `${source.type === 'subreddit' ? 'r' : 'u'}-${source.name}`;
}

export default function HomeScreen() {
  const [input, setInput] = useState('');
  const router = useRouter();
  const { setSource, fetchInitial } = useGalleryStore();

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    Keyboard.dismiss();

    const source = parseInput(trimmed);
    setSource(source);
    fetchInitial();
    router.push(`/gallery/${encodeSource(source)}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Galleria</Text>
        <Text style={styles.subtitle}>Browse Reddit images</Text>

        <TextInput
          style={styles.input}
          placeholder="r/earthporn or u/username"
          placeholderTextColor="#666"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
        />

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Browse</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 48,
  },
  input: {
    width: '100%',
    maxWidth: 400,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    maxWidth: 400,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#ff4500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
