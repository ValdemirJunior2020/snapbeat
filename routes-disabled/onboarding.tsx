// FILE: app/onboarding.tsx
import React, { useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { ONBOARDING_KEY } from '@/constants/config';
import { radii, spacing, typography } from '@/constants/styles';
import { OnboardingSlide } from '@/types';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = useMemo<OnboardingSlide[]>(
    () => [
      {
        id: '1',
        title: 'Turn photos into music videos',
        subtitle: 'Pick up to 30 images, add your soundtrack, and generate a polished slideshow.',
        illustration: '📸'
      },
      {
        id: '2',
        title: 'Match the beat',
        subtitle: 'Set the BPM and style so every transition feels intentional and clean.',
        illustration: '🎵'
      },
      {
        id: '3',
        title: 'Export and share',
        subtitle: 'Preview your final MP4, unlock exports once, and share it with Instagram or anywhere else.',
        illustration: '🚀'
      }
    ],
    []
  );

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(auth)/login');
  };

  const goNext = async () => {
    if (currentIndex === slides.length - 1) {
      await completeOnboarding();
      return;
    }

    flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
  };

  const renderItem: ListRenderItem<OnboardingSlide> = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.illustrationCircle}>
        <Text style={styles.illustration}>{item.illustration}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity activeOpacity={0.75} onPress={completeOnboarding} style={styles.skipButton}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        ref={flatListRef}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {slides.map((slide, index) => (
            <View key={slide.id} style={[styles.dot, index === currentIndex && styles.dotActive]} />
          ))}
        </View>

        <Button
          label={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={goNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: spacing.sm
  },
  skipText: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '600'
  },
  slide: {
    width,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm
  },
  illustrationCircle: {
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  illustration: {
    fontSize: 72
  },
  title: {
    color: colors.text,
    fontSize: typography.heading1,
    fontWeight: '800',
    textAlign: 'center'
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: 'center'
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.border
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.accent
  }
});
