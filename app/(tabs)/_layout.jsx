import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { useTheme } from "../../src/context/ThemeContext";

const TABS = [
  {
    name: "index",
    label: "Play",
    title: "Soundboard",
    icon: { sf: { default: "play.circle", selected: "play.circle.fill" } },
  },
  {
    name: "search",
    label: "Boards",
    title: "Browse Boards",
    icon: {
      sf: {
        default: "square.grid.2x2",
        selected: "square.grid.2x2.fill",
      },
    },
  },
  {
    name: "settings",
    label: "Settings",
    title: "Settings",
    icon: {
      sf: { default: "gearshape", selected: "gearshape.fill" },
    },
  },
];

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <NativeTabs
      screenOptions={({ route }) => ({
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        title: TABS.find((tab) => tab.name === route.name)?.title ?? route.name,
      })}
    >
      {TABS.map((tab) => (
        <NativeTabs.Trigger name={tab.name} key={tab.name}>
          <Label>{tab.label}</Label>
          <Icon sf={tab.icon.sf} drawable={`custom_${tab.name}_drawable`} />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
