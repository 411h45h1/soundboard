import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { useTheme } from "../../src/context/ThemeContext";

export default function DrawerLayout() {
  const { colors } = useTheme();

  const screens = [
    {
      name: "(tabs)",
      label: "Home",
      title: "Home",
      headerShown: false,
      iconName: "home-outline",
      iconNameFocused: "home",
    },
    {
      name: "settings",
      label: "Settings",
      title: "Settings",
      headerShown: true,
      iconName: "settings-outline",
      iconNameFocused: "settings",
    },
    {
      name: "about",
      label: "About",
      title: "About",
      headerShown: true,
      iconName: "information-circle-outline",
      iconNameFocused: "information-circle",
    },
  ];

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          width: 240,
          backgroundColor: colors.primary,
        },
        drawerPosition: "right",
        drawerActiveTintColor: colors.active,
        drawerInactiveTintColor: colors.text,
        drawerLabelStyle: {
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {screens.map((screen) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          options={{
            drawerLabel: screen.label,
            title: screen.title,
            headerShown: screen.headerShown,
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? screen.iconNameFocused : screen.iconName}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Drawer>
  );
}
