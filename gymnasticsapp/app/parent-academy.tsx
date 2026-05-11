import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { api, useQuery } from "@/lib/demoData";
import { Text, SafeAreaView, Spinner } from "@/components/ui";
import { useRouter } from "expo-router";
import { BookOpen, ChevronLeft, ChevronRight, GraduationCap, Lightbulb, MessageCircle } from "lucide-react-native";
import { useAppTheme } from "@/lib/appTheme";

const CATEGORY_THEME: Record<string, { color: string }> = {
  "After Practice": { color: "#1D5BB5" },
  "Fear & Anxiety":  { color: "#BE185D" },
  "Competition":     { color: "#D4A843" },
};

function getCategoryBg(category: string, colors: ReturnType<typeof useAppTheme>["colors"]): string {
  if (category === "After Practice") return colors.blueBg;
  if (category === "Fear & Anxiety") return colors.pinkBg;
  if (category === "Competition") return colors.goldBg;
  return colors.blueBg;
}

export default function ParentAcademy() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const content = useQuery(api.gymnasts.getAcademyContent);

  if (content === undefined)
    return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}><Spinner /></View>;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.bg }} edges={["top"]}>
      {/* Header */}
      <View
        className="px-4 pt-4 pb-3 flex-row items-center gap-3 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.backBtnBg }}
        >
          <ChevronLeft size={22} color={colors.backBtnIcon} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.gold }}>Mindset Playbook</Text>
          <Text className="text-2xl font-black" style={{ color: colors.text }}>Parent Academy</Text>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: colors.goldBg }}>
          <GraduationCap size={20} color={colors.gold} />
        </View>
      </View>

      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        {/* Hero Banner */}
        <View className="mt-4 mb-5 overflow-hidden rounded-2xl p-5" style={{ backgroundColor: colors.hero }}>
          <View className="absolute top-0 right-0 h-36 w-36 rounded-full bg-[#D4A843]/10" />
          <View className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/5" />
          <View className="flex-row items-start gap-4">
            <View className="h-14 w-14 items-center justify-center rounded-xl bg-[#D4A843]/20">
              <GraduationCap size={30} color={colors.gold} />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: colors.gold }}>
                Olympic Mindset Series
              </Text>
              <Text className="text-xl font-black leading-6" style={{ color: colors.heroText }}>
                Scripts for Tough Moments
              </Text>
              <Text className="mt-2 text-xs leading-4" style={{ color: colors.heroSubtext }}>
                What to say when it matters most — in the car, after falls, before big meets.
              </Text>
            </View>
          </View>
        </View>

        {content.length === 0 && (
          <View className="items-center py-20">
            <Text className="italic" style={{ color: colors.textMuted }}>Academy content loading...</Text>
          </View>
        )}

        <View className="gap-5 pb-28">
          {content.map((item: any) => (
            <AcademyCard key={item._id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AcademyCard({ item }: { item: any }) {
  const { colors } = useAppTheme();
  const [expanded, setExpanded] = useState(true);
  const theme = CATEGORY_THEME[item.category] ?? { color: "#1D5BB5" };
  const categoryBg = getCategoryBg(item.category, colors);

  return (
    <View className="overflow-hidden rounded-2xl" style={[colors.shadow, { backgroundColor: colors.surface }]}>
      <View className="p-4">
        <Pressable
          onPress={() => setExpanded(!expanded)}
          className="flex-row items-center justify-between mb-3"
        >
          <View className="flex-row items-center gap-2">
            <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: categoryBg }}>
              <Text className="text-[10px] font-black uppercase" style={{ color: theme.color }}>{item.category}</Text>
            </View>
            <BookOpen size={14} color={colors.textDisabled} />
          </View>
          <ChevronRight
            size={16}
            color={colors.textDisabled}
            style={{ transform: [{ rotate: expanded ? "90deg" : "0deg" }] }}
          />
        </Pressable>

        <Text className="text-lg font-black mb-3" style={{ color: colors.text }}>{item.title}</Text>

        {expanded && (
          <>
            {/* Scenario */}
            <View
              className="mb-3 rounded-xl p-4"
              style={{ backgroundColor: categoryBg, borderLeftWidth: 3, borderLeftColor: theme.color }}
            >
              <Text className="text-[10px] font-black uppercase mb-1.5" style={{ color: theme.color }}>The Scenario</Text>
              <Text className="text-sm italic leading-5" style={{ color: colors.textSecondary }}>{item.scenario}</Text>
            </View>

            {/* Script */}
            <View className="mb-3 rounded-xl p-4" style={{ backgroundColor: colors.hero, borderWidth: 1, borderColor: `${colors.hero}1A` }}>
              <View className="flex-row items-center gap-2 mb-2">
                <MessageCircle size={14} color={colors.gold} />
                <Text className="text-[11px] font-black uppercase" style={{ color: colors.gold }}>What to Say</Text>
              </View>
              <Text className="text-sm leading-6" style={{ color: colors.heroText }}>
                <Text style={{ color: colors.heroSubtext, fontSize: 12 }}>{"❝  "}</Text>
                {item.script}
                <Text style={{ color: colors.heroSubtext, fontSize: 12 }}>{"  ❞"}</Text>
              </Text>
            </View>

            {/* Mindset Tip */}
            <View
              className="rounded-xl p-4 flex-row gap-3"
              style={{ backgroundColor: colors.goldBgLight, borderWidth: 1, borderColor: colors.goldBg }}
            >
              <Lightbulb size={16} color={colors.gold} />
              <View className="flex-1">
                <Text className="text-[10px] font-black uppercase mb-1" style={{ color: colors.gold }}>Mindset Tip</Text>
                <Text className="text-xs leading-4" style={{ color: colors.textSecondary }}>{item.growthMindsetTip}</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
