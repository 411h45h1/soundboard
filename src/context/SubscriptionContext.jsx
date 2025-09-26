import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "soundboard.subscription.status";

const PREMIUM_FEATURES = [
  {
    id: "unlimited-boards",
    title: "Unlimited boards",
    description: "Create as many themed collections as you like with no cap.",
  },
  {
    id: "longer-recordings",
    title: "Long-form recordings",
    description: "Record clips up to five minutes directly in the app.",
  },
  {
    id: "studio-effects",
    title: "Studio effects",
    description: "Unlock EQ presets and mastering tools (coming soon).",
  },
  {
    id: "cloud-sync",
    title: "Cloud sync",
    description: "Back up your library and keep multiple devices in sync.",
  },
];

const FREE_FEATURES = [
  {
    id: "starter-boards",
    title: "Three curated boards",
    description: "Stay organized with up to three active boards at a time.",
  },
  {
    id: "core-editing",
    title: "Essential editing",
    description: "Trim titles, rename boards, and reorder sounds with ease.",
  },
];

const defaultSubscription = {
  plan: "free",
  isPremium: false,
  activatedAt: null,
  lastSource: null,
};

const SubscriptionContext = createContext(undefined);

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState(defaultSubscription);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadStatus = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (isMounted) {
            setSubscription({ ...defaultSubscription, ...parsed });
          }
        }
      } catch (error) {
        console.warn("Unable to load subscription status", error);
      } finally {
        if (isMounted) {
          setHydrated(true);
        }
      }
    };

    loadStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistSubscription = useCallback(async (nextState) => {
    setSubscription(nextState);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (error) {
      console.warn("Failed to persist subscription status", error);
    }
  }, []);

  const upgradeToPremium = useCallback(
    async ({ source = "manual" } = {}) => {
      const nextState = {
        plan: "premium",
        isPremium: true,
        activatedAt: Date.now(),
        lastSource: source,
      };
      await persistSubscription(nextState);
    },
    [persistSubscription]
  );

  const downgradeToFree = useCallback(async () => {
    await persistSubscription(defaultSubscription);
  }, [persistSubscription]);

  const restorePurchases = useCallback(async () => {
    // Placeholder for a real restore flow.
    await upgradeToPremium({ source: "restore" });
  }, [upgradeToPremium]);

  const limits = useMemo(
    () => ({
      maxBoards: subscription.isPremium ? Number.POSITIVE_INFINITY : 3,
      maxRecordingSeconds: subscription.isPremium ? 300 : 60,
      maxUploadsPerBoard: subscription.isPremium
        ? Number.POSITIVE_INFINITY
        : 24,
    }),
    [subscription.isPremium]
  );

  const canCreateBoard = useCallback(
    (currentBoardCount) => {
      return subscription.isPremium || currentBoardCount < limits.maxBoards;
    },
    [limits.maxBoards, subscription.isPremium]
  );

  const canAddSound = useCallback(
    (currentSounds) => {
      return (
        subscription.isPremium || currentSounds < limits.maxUploadsPerBoard
      );
    },
    [limits.maxUploadsPerBoard, subscription.isPremium]
  );

  const value = useMemo(
    () => ({
      ...subscription,
      hydrated,
      limits,
      benefits: subscription.isPremium ? PREMIUM_FEATURES : FREE_FEATURES,
      premiumBenefits: PREMIUM_FEATURES,
      freeBenefits: FREE_FEATURES,
      upgradeToPremium,
      downgradeToFree,
      restorePurchases,
      canCreateBoard,
      canAddSound,
    }),
    [
      subscription,
      hydrated,
      limits,
      upgradeToPremium,
      downgradeToFree,
      restorePurchases,
      canCreateBoard,
      canAddSound,
    ]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
}
