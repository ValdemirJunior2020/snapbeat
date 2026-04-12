// C:\Users\Valdemir Goncalves\Downloads\BeatVideoMaker\BeatVideoMaker\app\(app)\preview\[projectId].tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function PreviewScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preview Screen</Text>
      <Text style={styles.subtitle}>
        Temporary test build without react-native-video
      </Text>
      <Text style={styles.meta}>Project ID: {projectId ?? 'unknown'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    color: '#BBBBBB',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  meta: {
    color: '#888888',
    fontSize: 14,
  },
});