// FILE: src/components/project/ProjectList.tsx
import React from 'react';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
import EmptyState from '@/components/ui/EmptyState';
import ProjectCard from '@/components/project/ProjectCard';
import { Project } from '@/types';

interface ProjectListProps {
  projects: Project[];
  refreshing: boolean;
  onRefresh: () => void;
  onOpenProject: (projectId: string) => void;
}

export default function ProjectList({
  projects,
  refreshing,
  onRefresh,
  onOpenProject
}: ProjectListProps) {
  const renderItem: ListRenderItem<Project> = ({ item }) => (
    <ProjectCard project={item} onPress={() => onOpenProject(item.id)} />
  );

  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: 40, flexGrow: projects.length ? 0 : 1 }}
      data={projects}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={renderItem}
      ItemSeparatorComponent={() => null}
      ListEmptyComponent={
        <EmptyState
          illustration="🎞️"
          title="No videos yet"
          subtitle="Create your first music slideshow to see it here."
        />
      }
    />
  );
}
