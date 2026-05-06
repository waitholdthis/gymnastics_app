import React, { useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { api, useMutation, useQuery } from "@/lib/demoData";
import { Text, Input, SafeAreaView, Spinner } from "@/components/ui";
import { useRouter } from "expo-router";
import { Activity, ChevronLeft, Heart, Smile, Thermometer, Zap } from "lucide-react-native";

const EMOJIS_SORENESS = ["😄", "🙂", "😐", "😣", "🔥"];
const EMOJIS_ENERGY   = ["😴", "🥱", "⚡", "💪", "🚀"];
const EMOJIS_MOOD     = ["😤", "😔", "😐", "😊", "🎯"];

export default function WellnessCheckin() {
  const router = useRouter();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const logWellness = useMutation(api.gymnasts.logWellness);
  const [loading, setLoading] = useState(false);
  const [soreness, setSoreness] = useState(2);
  const [energy, setEnergy] = useState(4);
  const [mood, setMood] = useState(4);
  const [notes, setNotes] = useState("");

  if (gymnast === undefined) return <View className="flex-1 bg-[#061528] items-center justify-center"><Spinner /></View>;
  if (gymnast === null) return <View className="flex-1 bg-[#061528] items-center justify-center"><Text className="text-[#F8FAFC]">Gymnast not found</Text></View>;

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
    <SafeAreaView className="flex-1 bg-[#061528]" edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}>
        <View className="flex-row items-center gap-3 pt-6 mb-6">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#0B1F3D]"
          >
            <ChevronLeft size={22} color="#F8FAFC" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-[11px] font-black uppercase tracking-widest text-[#65F4A3]">Recovery Lab</Text>
            <Text className="text-2xl font-black text-[#F8FAFC]">Daily Scout Snapshot</Text>
          </View>
          <View className="h-11 w-11 items-center justify-center rounded-full border border-[#65F4A3]/30 bg-[#65F4A3]/15">
            <Heart size={20} color="#65F4A3" />
          </View>
        </View>

        <View className="mb-6 overflow-hidden rounded-[26px] border border-[#65F4A3]/20 bg-[#0B1F3D] p-5">
          <View className="absolute right-[-38px] top-[-38px] h-28 w-28 rounded-full bg-[#65F4A3]/10" />
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#061528] border border-[#65F4A3]/20">
              <Text className="text-3xl">{overallScore >= 4 ? "🌟" : overallScore >= 3 ? "👍" : "⚠️"}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-[11px] font-black uppercase tracking-widest text-[#65F4A3]">Scout Reading</Text>
              <Text className="text-xl font-black text-[#F8FAFC]">
                {overallScore >= 4 ? "Ready to Train Hard" : overallScore >= 3 ? "Moderate Readiness" : "Recovery Day Recommended"}
              </Text>
              <Text className="text-xs text-[#94A3B8] mt-0.5">Log how {gymnast.name} feels right now</Text>
            </View>
          </View>
        </View>

        <RatingSection
          label="Muscle Soreness"
          sublabel="1 = Fresh, 5 = Very Sore"
          value={soreness}
          onChange={setSoreness}
          emojis={EMOJIS_SORENESS}
          accentColor="#FB923C"
          icon={<Thermometer size={18} color="#FB923C" />}
        />

        <RatingSection
          label="Energy Levels"
          sublabel="1 = Drained, 5 = Charged Up"
          value={energy}
          onChange={setEnergy}
          emojis={EMOJIS_ENERGY}
          accentColor="#8FE7FF"
          icon={<Zap size={18} color="#8FE7FF" />}
        />

        <RatingSection
          label="Mental Focus & Mood"
          sublabel="1 = Frustrated, 5 = Locked In"
          value={mood}
          onChange={setMood}
          emojis={EMOJIS_MOOD}
          accentColor="#F472B6"
          icon={<Smile size={18} color="#F472B6" />}
        />

        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <Activity size={18} color="#8FE7FF" />
            <Text className="font-black text-[#F8FAFC]">Practice Notes</Text>
          </View>
          <View className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A1B33]">
            <Input
              placeholder="How was today's practice? Any soreness spots?"
              value={notes}
              onChangeText={setNotes}
              multiline
              className="h-28 border-0 bg-transparent p-4 text-[#F8FAFC]"
              placeholderTextColor="#4B6080"
            />
          </View>
          <Text className="mt-2 text-[10px] font-bold uppercase text-[#94A3B8]">
            Tip: Note specific areas of tightness or wins from today.
          </Text>
        </View>

        <Pressable
          onPress={handleSave}
          disabled={loading}
          className="overflow-hidden rounded-2xl bg-[#65F4A3] py-4 items-center"
        >
          {loading ? (
            <Spinner />
          ) : (
            <Text className="font-black text-[#061528] text-base">Save Scout Report</Text>
          )}
        </Pressable>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function RatingSection({
  label,
  sublabel,
  value,
  onChange,
  emojis,
  accentColor,
  icon,
}: {
  label: string;
  sublabel: string;
  value: number;
  onChange: (v: number) => void;
  emojis: string[];
  accentColor: string;
  icon: React.ReactNode;
}) {
  return (
    <View className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0A1B33] p-4">
      <View className="flex-row items-center gap-2 mb-1">
        {icon}
        <Text className="font-black text-[#F8FAFC]">{label}</Text>
      </View>
      <Text className="text-[10px] font-bold uppercase text-[#94A3B8] mb-4">{sublabel}</Text>
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
  val,
  selected,
  emoji,
  accentColor,
  onPress,
}: {
  val: number;
  selected: boolean;
  emoji: string;
  accentColor: string;
  onPress: () => void;
}) {
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
            borderColor: selected ? accentColor : "rgba(255,255,255,0.12)",
            backgroundColor: selected ? `${accentColor}26` : "#061528",
          },
        ]}
      >
        <Text style={{ fontSize: 20 }}>{emoji}</Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "900",
            color: selected ? accentColor : "#4B6080",
            marginTop: 2,
          }}
        >
          {val}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
