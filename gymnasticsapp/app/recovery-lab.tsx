import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { api, useQuery } from "@/lib/demoData";
import { Text, SafeAreaView, Spinner } from "@/components/ui";
import { useRouter } from "expo-router";
import { Apple, ChevronLeft, ChevronRight, Clock, Dumbbell, Wind, Zap } from "lucide-react-native";

const CATEGORIES = ["All", "Conditioning", "Stretching", "Nutrition"] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_THEME: Record<string, { color: string; icon: React.ReactNode; bg: string }> = {
  Conditioning: { color: "#8FE7FF", icon: <Dumbbell size={14} color="#8FE7FF" />, bg: "#8FE7FF20" },
  Stretching:   { color: "#65F4A3", icon: <Wind size={14} color="#65F4A3" />,   bg: "#65F4A320" },
  Nutrition:    { color: "#FB923C", icon: <Apple size={14} color="#FB923C" />,  bg: "#FB923C20" },
};

export default function RecoveryLab() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const resources = useQuery(
    api.gymnasts.getRecoveryResources,
    selectedCategory === "All" ? {} : { category: selectedCategory as any }
  );

  return (
    <SafeAreaView className="flex-1 bg-[#061528]" edges={["top"]}>
      <View className="px-4 pt-6 pb-4 flex-row items-center gap-3">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full bg-[#0B1F3D]"
        >
          <ChevronLeft size={22} color="#F8FAFC" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[11px] font-black uppercase tracking-widest text-[#65F4A3]">Athlete Wellness</Text>
          <Text className="text-2xl font-black text-[#F8FAFC]">Recovery Lab</Text>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-full border border-[#65F4A3]/30 bg-[#65F4A3]/10">
          <Zap size={20} color="#65F4A3" />
        </View>
      </View>

      <View className="px-4 mb-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const theme = cat !== "All" ? CATEGORY_THEME[cat] : null;
            const activeColor = theme?.color ?? "#F6C453";

            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: isSelected ? `${activeColor}25` : "#0A1B33",
                  borderWidth: 1,
                  borderColor: isSelected ? activeColor : "rgba(255,255,255,0.1)",
                }}
              >
                <Text
                  className="font-black text-sm"
                  style={{ color: isSelected ? activeColor : "#94A3B8" }}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        {resources === undefined ? (
          <View className="py-20 items-center"><Spinner /></View>
        ) : resources.length === 0 ? (
          <View className="items-center py-24">
            <Text className="text-[#94A3B8] text-center">No recovery protocols found for this category.</Text>
          </View>
        ) : (
          <View className="gap-4 pb-28">
            {resources.map((item: any) => (
              <RecoveryCard key={item._id} item={item} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function RecoveryCard({ item }: { item: any }) {
  const theme = CATEGORY_THEME[item.category] ?? { color: "#8FE7FF", icon: null, bg: "#8FE7FF20" };
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      className="overflow-hidden rounded-[22px] bg-[#0A1B33]"
      style={{ borderWidth: 1, borderColor: `${theme.color}30` }}
    >
      <View className="absolute right-[-28px] top-[-28px] h-24 w-24 rounded-full" style={{ backgroundColor: `${theme.color}12` }} />

      <View className="p-4">
        <View className="flex-row items-start justify-between gap-3 mb-3">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <View className="flex-row items-center gap-1.5 rounded-full px-2 py-1" style={{ backgroundColor: theme.bg }}>
                {theme.icon}
                <Text className="text-[10px] font-black uppercase" style={{ color: theme.color }}>{item.category}</Text>
              </View>
              {item.intensity && (
                <View className="rounded-full px-2 py-1" style={{ backgroundColor: getIntensityBg(item.intensity) }}>
                  <Text className="text-[10px] font-black uppercase" style={{ color: getIntensityColor(item.intensity) }}>
                    {item.intensity}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-lg font-black text-[#F8FAFC]">{item.title}</Text>
            <Text className="text-xs text-[#94A3B8] mt-1 leading-4">{item.description}</Text>
          </View>
          {item.duration && (
            <View className="items-center rounded-2xl border border-white/10 bg-[#061528] px-3 py-2">
              <Clock size={14} color="#8FE7FF" />
              <Text className="text-sm font-black text-[#F8FAFC] mt-1">{item.duration}</Text>
            </View>
          )}
        </View>

        {expanded && (
          <View className="mb-3 rounded-2xl border border-white/10 bg-[#061528] p-4">
            <Text className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: theme.color }}>
              Protocol Steps
            </Text>
            <Text className="text-sm leading-6 text-[#C7D2FE]">{item.content}</Text>
          </View>
        )}

        <Pressable
          onPress={() => setExpanded(!expanded)}
          className="flex-row items-center gap-1 self-start"
        >
          <Text className="text-xs font-black" style={{ color: theme.color }}>
            {expanded ? "Collapse" : "View Full Protocol"}
          </Text>
          <ChevronRight size={14} color={theme.color} style={{ transform: [{ rotate: expanded ? "90deg" : "0deg" }] }} />
        </Pressable>
      </View>

      {expanded && (
        <Pressable
          className="mx-4 mb-4 items-center rounded-2xl py-3"
          style={{ backgroundColor: `${theme.color}25`, borderWidth: 1, borderColor: `${theme.color}50` }}
        >
          <Text className="font-black text-sm" style={{ color: theme.color }}>Start This Protocol</Text>
        </Pressable>
      )}
    </View>
  );
}

function getIntensityColor(intensity: string) {
  if (intensity === "Low") return "#65F4A3";
  if (intensity === "Medium") return "#F6C453";
  return "#F472B6";
}

function getIntensityBg(intensity: string) {
  if (intensity === "Low") return "#65F4A320";
  if (intensity === "Medium") return "#F6C45320";
  return "#F472B620";
}
