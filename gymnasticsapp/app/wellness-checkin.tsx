import React, { useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { api, useMutation, useQuery } from "@/lib/demoData";
import { Text, Input, SafeAreaView, Spinner } from "@/components/ui";
import { useRouter } from "expo-router";
import { Activity, ChevronLeft, Heart, Smile, Thermometer, Zap } from "lucide-react-native";
import { useAppTheme } from "@/lib/appTheme";
import { Entrance } from "@/components/cinematic/Entrance";

const EMOJIS_SORENESS = ["😄", "🙂", "😐", "😣", "🔥"];
const EMOJIS_ENERGY   = ["😴", "🥱", "⚡", "💪", "🚀"];
const EMOJIS_MOOD     = ["😤", "😔", "😐", "😊", "🎯"];

export default function WellnessCheckin() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const logWellness = useMutation(api.gymnasts.logWellness);
  const [loading, setLoading] = useState(false);
  const [soreness, setSoreness] = useState(2);
  const [energy, setEnergy] = useState(4);
  const [mood, setMood] = useState(4);
  const [notes, setNotes] = useState("");

  if (gymnast === undefined) return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}><Spinner /></View>;
  if (gymnast === null) return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}><Text style={{ color: colors.text }}>Gymnast not found</Text></View>;

  const handleSave = async () => {
    setLoading(true);
    try {
      await logWellness({ gymnastId: gymnast._id, soreness, energy, mood, notes });
      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const overallScore = Math.round(((6 - soreness) + energy + mood) / 3);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.bg }} edges={["top"]}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
          flexDirection: "row", alignItems: "center", gap: 12,
          borderBottomWidth: 1, borderBottomColor: colors.border,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            height: 44, width: 44, alignItems: "center", justifyContent: "center",
            borderRadius: 22, backgroundColor: colors.backBtnBg,
          }}
        >
          <ChevronLeft size={22} color={colors.backBtnIcon} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, color: colors.gold }}>
            Recovery Lab
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "900", color: colors.text, letterSpacing: -0.5 }}>
            Scout Snapshot
          </Text>
        </View>
        <View
          style={{
            height: 44, width: 44, alignItems: "center", justifyContent: "center",
            borderRadius: 22, backgroundColor: colors.greenBg,
            borderWidth: 1, borderColor: colors.green + "30",
          }}
        >
          <Heart size={20} color={colors.green} />
        </View>
      </View>

      <Entrance delay={0} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 }}
        >
          {/* Scout reading card */}
          <View style={{ marginBottom: 20, borderRadius: 20, overflow: "hidden", padding: 20, backgroundColor: colors.hero }}>
            <View style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: colors.goldGlow }} />
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              <View
                style={{
                  width: 64, height: 64, alignItems: "center", justifyContent: "center",
                  borderRadius: 18, backgroundColor: "rgba(255,255,255,0.07)",
                  borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                {overallScore >= 4
                  ? <Zap size={28} color={colors.gold} />
                  : overallScore >= 3
                    ? <Activity size={28} color={colors.blue} />
                    : <Thermometer size={28} color={colors.red} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, color: colors.gold, marginBottom: 4 }}>
                  Scout Reading
                </Text>
                <Text style={{ fontSize: 18, fontWeight: "900", color: colors.heroText, letterSpacing: -0.3 }}>
                  {overallScore >= 4 ? "Ready to Train Hard" : overallScore >= 3 ? "Moderate Readiness" : "Recovery Day Recommended"}
                </Text>
                <Text style={{ fontSize: 11, marginTop: 4, color: colors.heroSubtext }}>
                  Log how {gymnast.name} feels right now
                </Text>
              </View>
            </View>
          </View>

          <RatingSection
            label="Muscle Soreness"
            sublabel="1 = Fresh, 5 = Very Sore"
            value={soreness}
            onChange={setSoreness}
            emojis={EMOJIS_SORENESS}
            accentColor="#C2500A"
            icon={<Thermometer size={18} color="#C2500A" />}
          />

          <RatingSection
            label="Energy Levels"
            sublabel="1 = Drained, 5 = Charged Up"
            value={energy}
            onChange={setEnergy}
            emojis={EMOJIS_ENERGY}
            accentColor="#1D5BB5"
            icon={<Zap size={18} color="#1D5BB5" />}
          />

          <RatingSection
            label="Mental Focus & Mood"
            sublabel="1 = Frustrated, 5 = Locked In"
            value={mood}
            onChange={setMood}
            emojis={EMOJIS_MOOD}
            accentColor="#BE185D"
            icon={<Smile size={18} color="#BE185D" />}
          />

          <View className="mb-6 rounded-2xl p-4" style={[colors.shadow, { backgroundColor: colors.surface }]}>
            <View className="flex-row items-center gap-2 mb-3">
              <Activity size={18} color={colors.gold} />
              <Text className="font-black" style={{ color: colors.text }}>Practice Notes</Text>
            </View>
            <View className="overflow-hidden rounded-xl border" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
              <Input
                placeholder="How was today's practice? Any soreness spots?"
                value={notes}
                onChangeText={setNotes}
                multiline
                className="h-28 border-0 bg-transparent p-4"
                style={{ color: colors.text }}
                placeholderTextColor={colors.textDisabled}
              />
            </View>
            <Text className="mt-2 text-[10px] font-bold uppercase" style={{ color: colors.textMuted }}>
              Tip: Note specific areas of tightness or wins from today.
            </Text>
          </View>

          <Pressable
            onPress={handleSave}
            disabled={loading}
            className="overflow-hidden rounded-2xl py-4 items-center"
            style={{ backgroundColor: colors.gold }}
          >
            {loading ? <Spinner /> : <Text className="font-black text-base" style={{ color: "#1A1A1A" }}>Save Scout Report</Text>}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
      </Entrance>
    </SafeAreaView>
  );
}

function RatingSection({
  label, sublabel, value, onChange, emojis, accentColor, icon,
}: {
  label: string;
  sublabel: string;
  value: number;
  onChange: (v: number) => void;
  emojis: string[];
  accentColor: string;
  icon: React.ReactNode;
}) {
  const { colors } = useAppTheme();
  return (
    <View className="mb-4 rounded-2xl p-4" style={[colors.shadow, { backgroundColor: colors.surface }]}>
      <View className="flex-row items-center gap-2 mb-1">
        {icon}
        <Text className="font-black" style={{ color: colors.text }}>{label}</Text>
      </View>
      <Text className="text-[10px] font-bold uppercase mb-4" style={{ color: colors.textMuted }}>{sublabel}</Text>
      <View className="flex-row gap-2">
        {[1, 2, 3, 4, 5].map((val) => (
          <RatingButton
            key={val}
            val={val}
            selected={value === val}
            emoji={emojis[val - 1]}
            accentColor={accentColor}
            onPress={() => onChange(val)}
          />
        ))}
      </View>
    </View>
  );
}

function RatingButton({
  val, selected, emoji, accentColor, onPress,
}: {
  val: number;
  selected: boolean;
  emoji: string;
  accentColor: string;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.2, useNativeDriver: true, speed: 50, bounciness: 12 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }),
    ]).start();
    onPress();
  };

  return (
    <Pressable onPress={handlePress} className="flex-1 items-center">
      <Animated.View
        style={[
          { transform: [{ scale }] },
          {
            width: "100%",
            aspectRatio: 1,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: selected ? 2 : 1,
            borderColor: selected ? accentColor : colors.border,
            backgroundColor: selected ? `${accentColor}15` : colors.bgSecondary,
          },
        ]}
      >
        <Text style={{ fontSize: 20 }}>{emoji}</Text>
        <Text style={{ fontSize: 10, fontWeight: "900", color: selected ? accentColor : colors.textDisabled, marginTop: 2 }}>
          {val}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
