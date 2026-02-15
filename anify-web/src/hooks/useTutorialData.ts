// src/hooks/useTutorialData.ts

import { useMemo } from 'react';
import { useWorld, useCurrentWorld } from '@/contexts/WorldContext';
import type { TutorialStep, WorldMetaCharacter } from '@/types/world-metadata';

interface TutorialMessage {
  id: string;
  content: string;
  character?: string;
  isVoice?: boolean;
  delay?: number;
}

/**
 * 从 WorldContext 获取教程配置
 */
export function useTutorialData() {
  const world = useCurrentWorld();
  const { getCharacter, isTutorialWorld } = useWorld();

  const tutorialConfig = useMemo(() => {
    if (!world?.tutorial || !isTutorialWorld()) {
      return null;
    }
    return world.tutorial;
  }, [world, isTutorialWorld]);

  const getStep = useMemo(() => {
    return (stepId: string): TutorialStep | undefined => {
      return tutorialConfig?.steps.find(s => s.id === stepId);
    };
  }, [tutorialConfig]);

  const getStepMessages = useMemo(() => {
    return (stepId: string): TutorialMessage[] => {
      const step = tutorialConfig?.steps.find(s => s.id === stepId);
      if (!step?.messages || step.messages.length === 0) return [];

      // 从 dialogues 中获取消息节点
      const messages: TutorialMessage[] = [];

      for (const messageId of step.messages) {
        // 查找所有 dialogue trees 中的节点
        for (const tree of Object.values(world?.dialogues ?? {})) {
          const node = tree.nodes.find(n => n.id === messageId);
          if (node && node.content) {
            messages.push({
              id: node.id,
              content: node.content,
              character: node.character,
              isVoice: node.isVoice,
              delay: node.delay ?? 0,
            });
          }
        }
      }

      return messages;
    };
  }, [tutorialConfig, world]);

  const getStepCharacter = useMemo(() => {
    return (stepId: string): WorldMetaCharacter | undefined => {
      const step = tutorialConfig?.steps.find(s => s.id === stepId);
      if (!step?.character) return undefined;
      return getCharacter(step.character);
    };
  }, [tutorialConfig, getCharacter]);

  const stepOrder = useMemo(() => {
    return tutorialConfig?.stepOrder ?? [];
  }, [tutorialConfig]);

  const getNextStep = useMemo(() => {
    return (currentStepId: string): string | null => {
      const step = tutorialConfig?.steps.find(s => s.id === currentStepId);
      return step?.nextStep ?? null;
    };
  }, [tutorialConfig]);

  return {
    isEnabled: tutorialConfig?.enabled ?? false,
    tutorialConfig,
    stepOrder,
    getStep,
    getStepMessages,
    getStepCharacter,
    getNextStep,
  };
}

export type { TutorialMessage };
