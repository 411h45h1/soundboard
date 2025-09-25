import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppContext } from "../context/AppState";
import { triggerHaptic } from "../utils/haptics";
import { Audio } from "expo-audio";
import { normalize } from "../core/responsive";

const getFirstValue = (value, fallback = "") => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0] ?? fallback : fallback;
  }
  return value ?? fallback;
};

const EditBoard = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updateBoardItem } = useContext(AppContext);
  const sidParam = useMemo(() => getFirstValue(params.sid, ""), [params.sid]);
  const sid = useMemo(() => {
    const numeric = Number(sidParam);
    return Number.isFinite(numeric) ? numeric : null;
  }, [sidParam]);
  const fileName = useMemo(
    () => getFirstValue(params.fileName, ""),
    [params.fileName]
  );
  const src = useMemo(() => getFirstValue(params.src, ""), [params.src]);
  const initialTitle = useMemo(
    () => getFirstValue(params.title, ""),
    [params.title]
  );

  const [titleText, setTitleText] = useState(initialTitle);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSoundAndGetDuration = async () => {
      try {
        if (!src) {
          setLoading(false);
          return;
        }

        setLoading(true);
        const { sound } = await Audio.Sound.createAsync(
          { uri: src },
          {},
          null,
          false
        );

        const status = await sound.getStatusAsync();
        if (status.isLoaded && status.durationMillis) {
          setDuration(status.durationMillis);
        }

        await sound.unloadAsync();
        setLoading(false);
      } catch (error) {
        console.error("Error getting audio duration:", error);
        setLoading(false);
      }
    };

    loadSoundAndGetDuration();
  }, [src]);

  useEffect(() => {
    setTitleText(initialTitle);
  }, [initialTitle]);

  const formatDuration = (milliseconds) => {
    if (!milliseconds) return "Unknown length";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    if (sid == null) {
      triggerHaptic("error");
      return;
    }

    if (titleText.trim()) {
      triggerHaptic("success");
      updateBoardItem(sid, { title: titleText });
      router.back();
    } else {
      triggerHaptic("error");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={{ flex: 1, backgroundColor: "#5E403F", paddingHorizontal: 10 }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: normalize(35),
              fontWeight: "bold",
              color: "white",
            }}
          >
            Edit sound
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#A57878",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: "flex-start",
              marginBottom: 20,
            }}
            onPress={() => {
              triggerHaptic("selection");
              router.back();
            }}
          >
            <AntDesign name="back" size={normalize(20)} color="white" />
          </TouchableOpacity>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: normalize(16),
                fontWeight: "bold",
                color: "#EAE0D5",
                marginBottom: 5,
              }}
            >
              File Name:
            </Text>
            <Text
              style={{
                fontSize: normalize(16),
                color: "#EAE0D5",
              }}
            >
              {fileName}
            </Text>
          </View>

          {loading ? (
            <View style={{ marginBottom: 20, alignItems: "flex-start" }}>
              <Text
                style={{
                  fontSize: normalize(16),
                  fontWeight: "bold",
                  color: "#EAE0D5",
                  marginBottom: 5,
                }}
              >
                Length:
              </Text>
              <ActivityIndicator size="small" color="#EAE0D5" />
            </View>
          ) : (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: normalize(16),
                  fontWeight: "bold",
                  color: "#EAE0D5",
                  marginBottom: 5,
                }}
              >
                Length:
              </Text>
              <Text
                style={{
                  fontSize: normalize(16),
                  color: "#EAE0D5",
                }}
              >
                {formatDuration(duration)}
              </Text>
            </View>
          )}

          <View style={{ marginBottom: 30 }}>
            <Text
              style={{
                fontSize: normalize(16),
                fontWeight: "bold",
                color: "#EAE0D5",
                marginBottom: 5,
              }}
            >
              Title:
            </Text>
            <TextInput
              style={{
                backgroundColor: "#5E403F",
                borderRadius: 5,
                paddingHorizontal: 10,
                fontSize: normalize(16),
                height: 40,
                color: "#EAE0D5",
              }}
              onChangeText={setTitleText}
              value={titleText}
              placeholder="Enter title"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#646F4B",
              paddingVertical: 12,
              borderRadius: 5,
              alignItems: "center",
            }}
            onPress={() => {
              triggerHaptic("medium");
              handleSubmit();
            }}
          >
            <Text
              style={{
                color: "#EAE0D5",
                fontSize: normalize(18),
                fontWeight: "bold",
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditBoard;
