import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { api, useQuery } from "@/lib/demoData";
import { Text, SafeAreaView, Spinner } from "@/components/ui";
import { useRouter } from "expo-router";
import { BookOpen, ChevronLeft, ChevronRight, GraduationCap, Lightbulb, MessageCircle } from "lucide-react-native";

const SHADOW = { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 };

const CATEGORY_THEME: Record<string, { color: string; bg: string }> = {
  "After Practice": { color: "#1D5BB5", bg: "#EFF6FF" },
  "Fear & Anxiety":  { color: "#BE185D", bg: "#FDF2F8" },
  "Competition":     { color: "#D4A843", bg: "#FDF6E3" },
};

export default function ParentAcademy() {
  const router = useRouter();
  const content = useQuery(api.gymnasts.getAcademyContent);

  if (content === undefined)
    return <View className="flex-1 bg-white items-center justify-center"><Spinner /></View>;

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
          <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843]">Mindset Playbook</Text>
          <Text className="text-2xl font-black text-[#1A1A1A]">Parent Academy</Text>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-full bg-[#FDF6E3]">
          <GraduationCap size={20} color="#D4A843" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        {/* Hero Banner */}
        <View className="mt-4 mb-5 overflow-hidden rounded-2xl bg-[#1A1A2E] p-5">
          <View className="absolute top-0 right-0 h-36 w-36 rounded-full bg-[#D4A843]/10" />
          <View className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/5" />
          <View className="flex-row items-start gap-4">
            <View className="h-14 w-14 items-center justify-center rounded-xl bg-[#D4A843]/20">
              <GraduationCap size={30} color="#D4A843" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843] mb-1">
                Olympic Mindset Series
              </Text>
              <Text className="text-xl font-black leading-6 text-white">
                Scripts for Tough Moments
              </Text>
              <Text className="mt-2 text-xs leading-4 text-[#9999BB]">
                What to say when it matters most — in the car, after falls, before big meets.
              </Text>
            </View>
          </View>
        </View>

        {content.length === 0 && (
          <View className="items-center py-20">
            <Text className="text-[#888888] italic">Academy content loading...</Text>
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
  const [expanded, setExpanded] = useState(true);
  const theme = CATEGORY_THEME[item.category] ?? { color: "#1D5BB5", bg: "#EFF6FF" };

  return (
    <View className="overflow-hidden rounded-2xl bg-white" style={SHADOW}>
      <View className="p-4">
        <Pressable
          onPress={() => setExpanded(!expanded)}
          className="flex-row items-center justify-between mb-3"
        >
          <View className="flex-row items-center gap-2">
            <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: theme.bg }}>
              <Text className="text-[10px] font-black uppercase" style={{ color: theme.color }}>{item.category}</Text>
            </View>
            <BookOpen size={14} color="#AAAAAA" />
          </View>
          <ChevronRight
            size={16}
            color="#AAAAAA"
            style={{ transform: [{ rotate: expanded ? "90deg" : "0deg" }] }}
          />
        </Pressable>

        <Text className="text-lg font-black text-[#1A1A1A] mb-3">{item.title}</Text>

        {expanded && (
          <>
            {/* Scenario */}
            <View
              className="mb-3 rounded-xl p-4"
              style={{ backgroundColor: theme.bg, borderLeftWidth: 3, borderLeftColor: theme.color }}
            >
              <Text className="text-[10px] font-black uppercase mb-1.5" style={{ color: theme.color }}>The Scenario</Text>
              <Text className="text-sm italic leading-5 text-[#555555]">{item.scenario}</Text>
            </View>

            {/* Script */}
            <View className="mb-3 rounded-xl border border-[#1A1A2E]/10 bg-[#1A1A2E] p-4">
              <View className="flex-row items-center gap-2 mb-2">
                <MessageCircle size={14} color="#D4A843" />
                <Text className="text-[11px] font-black uppercase text-[#D4A843]">What to Say</Text>
              </View>
              <Text className="text-sm leading-6 text-white">
                <Text className="text-[#9999BB] text-xs">❝  </Text>
                {item.script}
                <Text className="text-[#9999BB] text-xs">  ❞</Text>
              </Text>
            </View>

            {/* Mindset Tip */}
            <View className="rounded-xl border border-[#FDF6E3] bg-[#FFFDF5] p-4 flex-row gap-3">
              <Lightbulb size={16} color="#D4A843" />
              <View className="flex-1">
                <Text className="text-[10px] font-black uppercase text-[#D4A843] mb-1">Mindset Tip</Text>
                <Text className="text-xs leading-4 text-[#555555]">{item.growthMindsetTip}</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
