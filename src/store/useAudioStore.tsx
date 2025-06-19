import { create } from 'zustand';
import { combine } from 'zustand/middleware';

import { useAnimationLoop } from '@/utils/useAnimationLoop';
import { useCanvas } from '@/utils/useCanvas';

const INITIAL_STATE = {
  useAnimationLoop,
  useCanvas
};

export const useAudioStore = create(
  combine(INITIAL_STATE, (_, get) => ({
    getAllState: () => {
      return get();
    }
  }))
);
