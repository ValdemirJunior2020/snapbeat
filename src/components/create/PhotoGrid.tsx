// FILE: src/components/create/PhotoGrid.tsx
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams
} from 'react-native-draggable-flatlist';
import { colors } from '@/constants/colors';
import { radii, spacing, typography } from '@/constants/styles';
import { LocalMediaAsset } from '@/types';

interface PhotoGridProps {
  photos: LocalMediaAsset[];
  onReorder: (photos: LocalMediaAsset[]) => void;
  onRemove: (index: number) => void;
}

export default function PhotoGrid({ photos, onReorder, onRemove }: PhotoGridProps) {
  const renderItem = ({ item, getIndex, drag, isActive }: RenderItemParams<LocalMediaAsset>) => {
    const index = getIndex() ?? 0;

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        delayLongPress={150}
        onLongPress={drag}
        style={[styles.item, isActive && styles.itemActive]}
      >
        <Image source={{ uri: item.uri }} style={styles.image} />
        <View style={styles.overlay}>
          <Text style={styles.order}>{index + 1}</Text>
          <TouchableOpacity activeOpacity={0.75} onPress={() => onRemove(index)} style={styles.deleteButton}>
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <DraggableFlatList
      activationDistance={10}
      contentContainerStyle={styles.listContent}
      data={photos}
      keyExtractor={(item, index) => `${item.uri}-${index}`}
      numColumns={2}
      onDragEnd={({ data }) => onReorder(data)}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: spacing.sm
  },
  item: {
    flex: 1,
    margin: 6,
    borderRadius: radii.large,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  itemActive: {
    opacity: 0.85
  },
  image: {
    width: '100%',
    aspectRatio: 1
  },
  overlay: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    right: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  order: {
    color: colors.text,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    overflow: 'hidden',
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    fontSize: typography.caption,
    fontWeight: '700'
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000090'
  },
  deleteText: {
    color: colors.text,
    fontWeight: '800'
  }
});
