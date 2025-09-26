import { useCallback, useContext, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/context/ThemeContext";
import { AppContext } from "../../src/context/AppState";

const MAX_VISIBLE_SOUNDS = 3;

export default function BrowseBoardsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { boards, currentBoard, switchBoard } = useContext(AppContext);

  const [query, setQuery] = useState("");

  const filteredBoards = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    return boards
      .filter((board) =>
        trimmedQuery.length === 0
          ? true
          : board.name.toLowerCase().includes(trimmedQuery)
      )
      .sort((a, b) => {
        if (currentBoard?.id === a.id) return -1;
        if (currentBoard?.id === b.id) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [boards, currentBoard?.id, query]);

  const handleSelectBoard = useCallback(
    (boardId) => {
      switchBoard(boardId);
      router.push("/(tabs)");
    },
    [router, switchBoard]
  );

  const renderBoardCard = useCallback(
    ({ item: board }) => {
      const isActive = currentBoard?.id === board.id;
      const soundCount = board.sounds.length;
      const previewNames = board.sounds
        .slice(0, MAX_VISIBLE_SOUNDS)
        .map((sound) => sound.title || sound.name);

      return (
        <Pressable
          style={[
            styles.card,
            {
              borderColor: isActive ? colors.active : colors.secondary,
              backgroundColor: `${colors.primary}E6`,
            },
          ]}
          onPress={() => handleSelectBoard(board.id)}
        >
          <View style={styles.cardHeader}>
            <Text
              style={[styles.cardTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {board.name}
            </Text>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isActive
                    ? colors.secondary
                    : "rgba(229, 216, 207, 0.12)",
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: isActive ? colors.primary : colors.text,
                  },
                ]}
              >
                {soundCount} {soundCount === 1 ? "clip" : "clips"}
              </Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            {soundCount === 0 ? (
              <Text style={[styles.emptyText, { color: colors.text }]}>
                This board is empty—add your first clip from the Play tab.
              </Text>
            ) : (
              previewNames.map((name) => (
                <Text
                  key={`${board.id}-${name}`}
                  numberOfLines={1}
                  style={[styles.soundPreview, { color: colors.text }]}
                >
                  • {name}
                </Text>
              ))
            )}
            {soundCount > MAX_VISIBLE_SOUNDS ? (
              <Text style={[styles.moreIndicator, { color: colors.text }]}>
                +{soundCount - MAX_VISIBLE_SOUNDS} more
              </Text>
            ) : null}
          </View>

          <Text style={[styles.cardAction, { color: colors.active }]}>
            {isActive ? "Currently playing" : "Switch & play"}
          </Text>
        </Pressable>
      );
    },
    [
      colors.active,
      colors.primary,
      colors.secondary,
      colors.text,
      currentBoard?.id,
      handleSelectBoard,
    ]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Text style={[styles.title, { color: colors.text }]}>Browse Boards</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Jump between collections, preview clips, and curate your next set.
      </Text>

      <TextInput
        placeholder="Search by board name"
        placeholderTextColor="rgba(234, 224, 213, 0.5)"
        value={query}
        onChangeText={setQuery}
        style={[
          styles.searchInput,
          {
            backgroundColor: "rgba(165, 120, 120, 0.4)",
            borderColor: colors.secondary,
            color: colors.text,
          },
        ]}
      />

      <FlatList
        data={filteredBoards}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderBoardCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No boards yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.text }]}>
              Create a board from the Play tab to see it listed here.
            </Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.85,
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 120,
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  cardBody: {
    gap: 6,
  },
  soundPreview: {
    fontSize: 15,
    opacity: 0.9,
  },
  moreIndicator: {
    fontSize: 13,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.8,
  },
  cardAction: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: 15,
    opacity: 0.8,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
