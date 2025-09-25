import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { useTheme } from "../../../src/context/ThemeContext";

export default function TabLayout() {
  const { colors } = useTheme();

  const tabs = [
    {
      name: "index",
      label: "Home",
      icon: { sf: { default: "house", selected: "house.fill" } },
    },
    {
      name: "search",
      label: "Search",
      icon: {
        sf: { default: "magnifyingglass", selected: "magnifyingglass.fill" },
      },
    },
    {
      name: "profile",
      label: "Profile",
      icon: { sf: { default: "person", selected: "person.fill" } },
    },
  ];

  const getTitle = (routeName) => {
    switch (routeName) {
      case "index":
        return "Home";
      case "search":
        return "Search";
      case "profile":
        return "Profile";
      default:
        return routeName;
    }
  };

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
        title: getTitle(route.name),
      })}
    >
      {tabs.map((tab) => (
        <NativeTabs.Trigger name={tab.name} key={tab.name}>
          <Label>{tab.label}</Label>
          <Icon sf={tab.icon.sf} drawable={`custom_${tab.name}_drawable`} />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
