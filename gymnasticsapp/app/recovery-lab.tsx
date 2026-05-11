import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { api, useQuery } from "@/lib/demoData";
import { Text, SafeAreaView, Spinner } from "@/components/ui";
import { useRouter } from "expo-router";
import { Apple, ChevronLeft, ChevronRight, Clock, Dumbbell, Wind, Zap } from "lucide-react-native";

const CATEGORIES = ["All", "Conditioning", "Stretching", "Nutrition"] as const;
type Category = typeof CATEGORIES[number];

const SHADOW = { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 };

const CATEGORY_THEME: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  Conditioning: { color: "#1D5BB5", bg: "#EFF6FF", icon: <Dumbbell size={14} color="#1D5BB5" /> },
  Stretching:   { color: "#16A34A", bg: "#F0FDF4", icon: <Wind size={14} color="#16A34A" /> },
  Nutrition:    { color: "#C2500A", bg: "#FFF0E8", icon: <Apple size={14} color="#C2500A" /> },
};

export default function RecoveryLab() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const resources = useQuery(
    api.gymnasts.getRecoveryResources,
    selectedCategory === "All" ? {} : { category: selectedCategory as any }
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-4 pt-4 pb-3 flex-row items-center gap-3 border-b border-[#E8E8E8]">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full bg-[#F0F0EE]"
        >
          <ChevronLeft size={22} color="#444444" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843]">Athlete Wellness</Text>
          <Text className="text-2xl font-black text-[#1A1A1A]">Recovery Lab</Text>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-full bg-[#F0FDF4]">
          <Zap size={20} color="#16A34A" />
        </View>
      </View>

      {/* Category filter */}
      <View className="px-4 pt-3 mb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const theme = cat !== "All" ? CATEGORY_THEME[cat] : null;
            const activeColor = theme?.color ?? "#D4A843";
            const activeBg = theme?.bg ?? "#FDF6E3";

            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: isSelected ? activeBg : "#F8F8F6",
                  borderWidth: 1,
                  borderColor: isSelected ? activeColor : "#E8E8E8",
                }}
              >
                <Text className="font-black text-sm" style={{ color: isSelected ? activeColor : "#888888" }}>
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
            <Text className="text-[#888888] text-center">No recovery protocols found for this category.</Text>
          </View>
        ) : (
          <View className="gap-4 pb-28 pt-3">
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
  const theme = CATEGORY_THEME[item.category] ?? { color: "#1D5BB5", bg: "#EFF6FF", icon: null };
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      className="overflow-hidden rounded-2xl bg-white"
      style={[SHADOW, { borderLeftWidth: 3, borderLeftColor: theme.color }]}
    >
      <View className="p-4">
        <View className="flex-row items-start justify-between gap-3 mb-3">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <View className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1" style={{ backgroundColor: theme.bg }}>
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
            <Text className="text-lg font-black text-[#1A1A1A]">{item.title}</Text>
            <Text className="text-xs text-[#888888] mt-1 leading-4">{item.description}</Text>
          </View>
          {item.duration && (
            <View className="items-center rounded-xl border border-[#E8E8E8] bg-[#F8F8F6] px-3 py-2">
              <Clock size={14} color="#888888" />
              <Text className="text-sm font-black text-[#1A1A1A] mt-1">{item.duration}</Text>
            </View>
          )}
        </View>

        {expanded && (
          <View className="mb-3 rounded-xl border border-[#E8E8E8] bg-[#F8F8F6] p-4">
            <Text className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: theme.color }}>
              Protocol Steps
            </Text>
            <Text className="text-sm leading-6 text-[#555555]">{item.content}</Text>
          </View>
        )}

        <Pressable
          onPress={() => setExpanded(!expanded)}
          className="flex-row items-center gap-1 self-start"
        >
          <Text className="text-xs font-black" style={{ color: theme.color }}>
            {expanded ? "Collapse" : "View Full Protocol"}
          </Text>
          <ChevronRight
            size={14}
            color={theme.color}
            style={{ transform: [{ rotate: expanded ? "90deg" : "0deg" }] }}
          />
        </Pressable>
      </View>

      {expanded && (
        <Pressable
          className="mx-4 mb-4 items-center rounded-xl py-3"
          style={{ backgroundColor: theme.bg, borderWidth: 1, borderColor: `${theme.color}40` }}
        >
          <Text className="font-black text-sm" style={{ color: theme.color }}>Start This Protocol</Text>
        </Pressable>
      )}
    </View>
  );
}

function getIntensityColor(intensity: string) {
  if (intensity === "Low") return "#16A34A";
  if (intensity === "Medium") return "#D4A843";
  return "#E54B4B";
}

function getIntensityBg(intensity: string) {
  if (intensity === "Low") return "#F0FDF4";
  if (intensity === "Medium") return "#FDF6E3";
  return "#FFF0F0";
}
