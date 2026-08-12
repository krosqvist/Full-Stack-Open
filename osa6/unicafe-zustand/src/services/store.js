import { create } from 'zustand'

const useCounterStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,

  actions: {
    good: () => set((state) => ({ good: state.good + 1 })),
    neutral: () => set((state) => ({ neutral: state.neutral + 1 })),
    bad: () => set((state) => ({ bad: state.bad + 1 })),
  },
}))

export const useGood = () => useCounterStore(state => state.good)
export const useNeutral = () => useCounterStore(state => state.neutral)
export const useBad = () => useCounterStore(state => state.bad)
export const useCounterControls = () => useCounterStore(state => state.actions)