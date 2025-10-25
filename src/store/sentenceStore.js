import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useSentenceStore = create((set, get) => ({
  tabs: ['Default'],
  activeTab: 'Default',
  sentencesByTab: {
    Default: [],
  },
  text: '',
  filterTag: '',
  newTabName: '',

  setText: (text) => set({ text }),
  setFilterTag: (filterTag) => set({ filterTag }),
  setNewTabName: (name) => set({ newTabName: name }),

  // Tab Management
  addTab: (name) => {
    if (get().tabs.includes(name) || !name.trim()) return;
    set((state) => ({
      tabs: [...state.tabs, name],
      sentencesByTab: { ...state.sentencesByTab, [name]: [] },
      newTabName: '', // Clear input after adding
    }));
  },
  deleteTab: (name) => {
    if (name === 'Default') return; // Cannot delete the default tab
    set((state) => {
      const newTabs = state.tabs.filter((t) => t !== name);
      const newSentencesByTab = { ...state.sentencesByTab };
      delete newSentencesByTab[name];
      const newActiveTab = state.activeTab === name ? 'Default' : state.activeTab;
      return {
        tabs: newTabs,
        sentencesByTab: newSentencesByTab,
        activeTab: newActiveTab,
        text: '',
        filterTag: '',
        newTabName: '',
      };
    });
  },
  setActiveTab: (name) => {
    set({ activeTab: name, text: '', filterTag: '', newTabName: '' });
  },

  // Sentence Management (scoped to active tab)
  addSentence: (sentence) => {
    const activeTab = get().activeTab;
    set((state) => ({
      sentencesByTab: {
        ...state.sentencesByTab,
        [activeTab]: [
          ...state.sentencesByTab[activeTab],
          { text: sentence, count: 0, tags: [], createdAt: new Date() },
        ],
      },
    }));
  },
  deleteSentence: (createdAt) => {
    const activeTab = get().activeTab;
    set((state) => ({
      sentencesByTab: {
        ...state.sentencesByTab,
        [activeTab]: state.sentencesByTab[activeTab].filter((s) => s.createdAt !== createdAt),
      },
    }));
  },
  incrementCount: (createdAt) => {
    const activeTab = get().activeTab;
    set((state) => ({
      sentencesByTab: {
        ...state.sentencesByTab,
        [activeTab]: state.sentencesByTab[activeTab].map((s) =>
          s.createdAt === createdAt ? { ...s, count: s.count + 1 } : s
        ),
      },
    }));
  },
  addTag: (createdAt, tag) => {
    const activeTab = get().activeTab;
    set((state) => ({
      sentencesByTab: {
        ...state.sentencesByTab,
        [activeTab]: state.sentencesByTab[activeTab].map((s) =>
          s.createdAt === createdAt ? { ...s, tags: [...s.tags, tag] } : s
        ),
      },
    }));
  },
  removeTag: (createdAt, tagToRemove) => {
    const activeTab = get().activeTab;
    set((state) => ({
      sentencesByTab: {
        ...state.sentencesByTab,
        [activeTab]: state.sentencesByTab[activeTab].map((s) =>
          s.createdAt === createdAt
            ? { ...s, tags: s.tags.filter((tag) => tag !== tagToRemove) }
            : s
        ),
      },
    }));
  },
  cloneSentence: (createdAt) => {
    const activeTab = get().activeTab;
    set((state) => {
      const sentenceToClone = state.sentencesByTab[activeTab].find(s => s.createdAt === createdAt);
      if (sentenceToClone) {
        return {
          sentencesByTab: {
            ...state.sentencesByTab,
            [activeTab]: [
              ...state.sentencesByTab[activeTab],
              { ...sentenceToClone, createdAt: new Date() },
            ],
          },
        };
      }
      return state;
    });
  },

  // Persistence
  loadState: async () => {
    try {
      const savedState = await AsyncStorage.getItem('appState');
      if (savedState !== null) {
        set(JSON.parse(savedState));
      }
    } catch (error) {
      console.error('Failed to load state from storage', error);
    }
  },
}));

// Persist state to AsyncStorage
useSentenceStore.subscribe(async (state) => {
  try {
    const stateToSave = {
      tabs: state.tabs,
      activeTab: state.activeTab,
      sentencesByTab: state.sentencesByTab,
    };
    await AsyncStorage.setItem('appState', JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Failed to save state to storage', error);
  }
});

// Load state on startup
useSentenceStore.getState().loadState();

export default useSentenceStore;
