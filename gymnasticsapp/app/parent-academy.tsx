import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { api, useQuery } from "@/lib/demoData";
import { Text, SafeAreaView, Spinner } from "@/components/ui";
import { useRouter } from "expo-router";
import { BookOpen, ChevronLeft, ChevronRight, GraduationCap, Lightbulb, MessageCircle } from "lucide-react-native";

const CATEGORY_COLOR: Record<string, string> = {
  "After Practice": "#8FE7FF",
  "Fear & Anxiety":  "#F472B6",
  "Competition":     "#F6C453",
};

export default function ParentAcademy() {
  const router = useRouter();
  const content = useQuery(api.gymnasts.getAcademyContent);

  if (content === undefined)
    return <View className="flex-1 bg-[#061528] items-center justify-center"><Spinner /></View>;

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
          <Text className="text-[11px] font-black uppercase tracking-widest text-[#F6C453]">Mindset Playbook</Text>
          <Text className="text-2xl font-black text-[#F8FAFC]">Parent Academy</Text>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-full border border-[#F6C453]/30 bg-[#F6C453]/10">
          <GraduationCap size={20} color="#F6C453" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        {/* Hero Banner */}
        <View className="mb-6 overflow-hidden rounded-[26px] border border-[#F6C453]/20 bg-[#0B1F3D] p-5">
          <View className="absolute right-[-42px] top-[-42px] h-36 w-36 rounded-full bg-[#F6C453]/10" />
          <View className="absolute bottom-[-32px] left-[-24px] h-24 w-24 rounded-full bg-[#8FE7FF]/08" />
          <View className="flex-row items-start gap-4">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#061528]">
              <GraduationCap size={30} color="#F6C453" />
            </View>
            <View className="flex-1">
              <Text className="text-[11px] font-black uppercase tracking-widest text-[#F6C453] mb-1">
                Olympic Mindset Series
              </Text>
              <Text className="text-xl font-black leading-6 text-[#F8FAFC]">
                Scripts for Tough Moments
              </Text>
              <Text className="mt-2 text-xs leading-4 text-[#94A3B8]">
                What to say when it matters most — in the car, after falls, before big meets.
              </Text>
            </View>
          </View>
        </View>

        {content.length === 0 && (
          <View className="items-center py-20">
            <Text className="text-[#94A3B8] italic">Academy content loading...</Text>
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
  const accentColor = CATEGORY_COLOR[item.category] ?? "#8FE7FF";

  return (
    <View
      className="overflow-hidden rounded-[22px] bg-[#0A1B33]"
      style={{ borderWidth: 1, borderColor: `${accentColor}30` }}
    >
      <View className="absolute right-[-28px] top-[-28px] h-24 w-24 rounded-full" style={{ backgroundColor: `${accentColor}10` }} />

      <View className="p-4">
        <Pressable
          onPress={() => setExpanded(!expanded)}
          className="flex-row items-center justify-between mb-3"
        >
          <View className="flex-row items-center gap-2">
            <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: `${accentColor}20` }}>
              <Text className="text-[10px] font-black uppercase" style={{ color: accentColor }}>{item.category}</Text>
            </View>
            <BookOpen size={14} color="#4B6080" />
          </View>
          <ChevronRight
            size={16}
            color="#4B6080"
            style={{ transform: [{ rotate: expanded ? "90deg" : "0deg" }] }}
          />
        </Pressable>

        <Text className="text-lg font-black text-[#F8FAFC] mb-3">{item.title}</Text>

        {expanded && (
          <>
            {/* Scenario */}
            <View
              className="mb-3 rounded-2xl p-4"
              style={{ backgroundColor: "#061528", borderLeftWidth: 3, borderLeftColor: accentColor, borderWidth: 1, borderColor: `${accentColor}20` }}
            >
              <Text className="text-[10px] font-black uppercase mb-1.5" style={{ color: accentColor }}>The Scenario</Text>
              <Text className="text-sm italic leading-5 text-[#C7D2FE]">{item.scenario}</Text>
            </View>

            {/* Script */}
            <View className="mb-3 rounded-2xl border border-[#F8FAFC]/10 bg-[#152B52] p-4">
              <View className="flex-row items-center gap-2 mb-2">
                <MessageCircle size={14} color="#F8FAFC" />
                <Text className="text-[11px] font-black uppercase text-[#F8FAFC]">What to Say</Text>
              </View>
              <Text className="text-sm leading-6 text-[#F8FAFC]">
                <Text className="text-[#94A3B8] text-xs">❝  </Text>
                {item.script}
                <Text className="text-[#94A3B8] text-xs">  ❞</Text>
              </Text>
            </View>

            {/* Mindset Tip */}
            <View className="rounded-2xl border border-[#F6C453]/20 bg-[#F6C453]/08 p-4 flex-row gap-3">
              <Lightbulb size={16} color="#F6C453" />
              <View className="flex-1">
                <Text className="text-[10px] font-black uppercase text-[#F6C453] mb-1">Mindset Tip</Text>
                <Text className="text-xs leading-4 text-[#C7D2FE]">{item.growthMindsetTip}</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
