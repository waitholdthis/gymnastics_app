import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { api, useQuery } from "@/lib/demoData";
import { Text, SafeAreaView, Spinner } from "@/components/ui";
import { useRouter } from "expo-router";
import { Apple, ChevronLeft, ChevronRight, Clock, Dumbbell, Wind, Zap } from "lucide-react-native";
import { useAppTheme } from "@/lib/appTheme";

const CATEGORIES = ["All", "Conditioning", "Stretching", "Nutrition"] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_THEME: Record<string, { color: string; icon: (color: string) => React.ReactNode }> = {
  Conditioning: { color: "#1D5BB5", icon: (color) => <Dumbbell size={14} color={color} /> },
  Stretching:   { color: "#16A34A", icon: (color) => <Wind size={14} color={color} /> },
  Nutrition:    { color: "#C2500A", icon: (color) => <Apple size={14} color={color} /> },
};

function getCategoryBg(cat: string, colors: ReturnType<typeof useAppTheme>["colors"]): string {
  if (cat === "Conditioning") return colors.blueBg;
  if (cat === "Stretching") return colors.greenBg;
  if (cat === "Nutrition") return colors.orangeBg;
  return colors.goldBg;
}

export default function RecoveryLab() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const resources = useQuery(
    api.gymnasts.getRecoveryResources,
    selectedCategory === "All" ? {} : { category: selectedCategory as any }
  );

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
            Athlete Wellness
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "900", color: colors.text, letterSpacing: -0.5 }}>
            Recovery Lab
          </Text>
        </View>
        <View
          style={{
            height: 44, width: 44, alignItems: "center", justifyContent: "center",
            borderRadius: 22, backgroundColor: colors.greenBg,
            borderWidth: 1, borderColor: colors.green + "30",
          }}
        >
          <Zap size={20} color={colors.green} />
        </View>
      </View>

      {/* Category filter */}
      <View className="px-4 pt-3 mb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const theme = cat !== "All" ? CATEGORY_THEME[cat] : null;
            const activeColor = theme?.color ?? colors.gold;
            const activeBg = getCategoryBg(cat, colors);

            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: isSelected ? activeBg : colors.bgSecondary,
                  borderWidth: 1,
                  borderColor: isSelected ? activeColor : colors.border,
                }}
              >
                <Text className="font-black text-sm" style={{ color: isSelected ? activeColor : colors.textMuted }}>
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
            <Text className="text-center" style={{ color: colors.textMuted }}>No recovery protocols found for this category.</Text>
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
  const { colors } = useAppTheme();
  const theme = CATEGORY_THEME[item.category] ?? { color: "#1D5BB5", icon: () => null };
  const [expanded, setExpanded] = useState(false);

  const categoryBg = getCategoryBg(item.category, colors);

  return (
    <View
      className="overflow-hidden rounded-2xl"
      style={[colors.shadow, { backgroundColor: colors.surface, borderLeftWidth: 3, borderLeftColor: theme.color }]}
    >
      <View className="p-4">
        <View className="flex-row items-start justify-between gap-3 mb-3">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <View className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1" style={{ backgroundColor: categoryBg }}>
                {theme.icon(theme.color)}
                <Text className="text-[10px] font-black uppercase" style={{ color: theme.color }}>{item.category}</Text>
              </View>
              {item.intensity && (
                <View className="rounded-full px-2 py-1" style={{ backgroundColor: getIntensityBg(item.intensity, colors) }}>
                  <Text className="text-[10px] font-black uppercase" style={{ color: getIntensityColor(item.intensity, colors) }}>
                    {item.intensity}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-lg font-black" style={{ color: colors.text }}>{item.title}</Text>
            <Text className="text-xs mt-1 leading-4" style={{ color: colors.textMuted }}>{item.description}</Text>
          </View>
          {item.duration && (
            <View
              className="items-center rounded-xl px-3 py-2"
              style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgSecondary }}
            >
              <Clock size={14} color={colors.textMuted} />
              <Text className="text-sm font-black mt-1" style={{ color: colors.text }}>{item.duration}</Text>
            </View>
          )}
        </View>

        {expanded && (
          <View
            className="mb-3 rounded-xl p-4"
            style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgSecondary }}
          >
            <Text className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: theme.color }}>
              Protocol Steps
            </Text>
            <Text className="text-sm leading-6" style={{ color: colors.textSecondary }}>{item.content}</Text>
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
          style={{ backgroundColor: categoryBg, borderWidth: 1, borderColor: `${theme.color}40` }}
        >
          <Text className="font-black text-sm" style={{ color: theme.color }}>Start This Protocol</Text>
        </Pressable>
      )}
    </View>
  );
}

function getIntensityColor(intensity: string, colors: ReturnType<typeof useAppTheme>["colors"]) {
  if (intensity === "Low") return colors.green;
  if (intensity === "Medium") return colors.gold;
  return colors.red;
}

function getIntensityBg(intensity: string, colors: ReturnType<typeof useAppTheme>["colors"]) {
  if (intensity === "Low") return colors.greenBg;
  if (intensity === "Medium") return colors.goldBg;
  return colors.redBg;
}
