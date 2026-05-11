import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import {
  Castle,
  ChevronLeft,
  Crown,
  Flame,
  Medal,
  Rocket,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react-native";

import { api, useMutation, useQuery } from "@/lib/demoData";
import { SafeAreaView, Spinner, Text } from "@/components/ui";
import { useAppTheme } from "@/lib/appTheme";

const APPARATUS_LIST = ["Vault", "Bars", "Beam", "Floor"] as const;
type Apparatus = typeof APPARATUS_LIST[number];
type SkillStatus = "working" | "mastered" | "competition_ready";

const APPARATUS_THEME: Record<Apparatus, {
  title: string;
  world: string;
  quest: string;
  color: string;
  emoji: string;
  icon: React.ReactNode;
}> = {
  Vault: {
    title: "Vault Launchpad",
    world: "Blast-Off World",
    quest: "Build speed, power, and a fearless stick landing.",
    color: "#C2500A",
    emoji: "🚀",
    icon: <Rocket size={22} color="#C2500A" />,
  },
  Bars: {
    title: "Bars Orbit",
    world: "Sky Swing World",
    quest: "Connect shapes, swing tall, and unlock the golden kip.",
    color: "#1D5BB5",
    emoji: "⭐",
    icon: <Sparkles size={22} color="#1D5BB5" />,
  },
  Beam: {
    title: "Beam Skyline",
    world: "Balance Castle",
    quest: "Travel the narrow path with courage and calm.",
    color: "#BE185D",
    emoji: "🏛️",
    icon: <Castle size={22} color="#BE185D" />,
  },
  Floor: {
    title: "Floor Arena",
    world: "Power Stage",
    quest: "Tumble, dance, and finish like the hero of the meet.",
    color: "#16A34A",
    emoji: "🎭",
    icon: <Flame size={22} color="#16A34A" />,
  },
};

function getApparatusBg(apparatus: Apparatus, colors: ReturnType<typeof useAppTheme>["colors"]) {
  switch (apparatus) {
    case "Vault": return colors.orangeBg;
    case "Bars": return colors.blueBg;
    case "Beam": return colors.pinkBg;
    case "Floor": return colors.greenBg;
  }
}

export default function SkillRoadmap() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const [selectedApparatus, setSelectedApparatus] = useState<Apparatus>("Bars");

  if (gymnast === undefined) return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}><Spinner /></View>;
  if (gymnast === null) return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}><Text style={{ color: colors.text }}>Gymnast not found</Text></View>;

  const theme = APPARATUS_THEME[selectedApparatus];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.bg }} edges={["top"]}>
      {/* Header */}
      <View className="px-4 pt-4 pb-3 flex-row items-center gap-3 border-b" style={{ borderColor: colors.border }}>
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.backBtnBg }}
        >
          <ChevronLeft size={22} color={colors.backBtnIcon} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.gold }}>Path to Podium</Text>
          <Text className="text-2xl font-black" style={{ color: colors.text }}>Quest Map</Text>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: colors.goldBg }}>
          <Text style={{ fontSize: 20 }}>🗺️</Text>
        </View>
      </View>

      {/* Hero card */}
      <View className="mx-4 mt-4 mb-3 overflow-hidden rounded-2xl p-5" style={{ backgroundColor: colors.hero }}>
        <View className="absolute top-0 right-0 h-28 w-28 rounded-full bg-[#D4A843]/10" />
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: colors.gold }}>
              {theme.world}
            </Text>
            <Text className="text-2xl font-black leading-tight mb-1" style={{ color: colors.heroText }}>{theme.title}</Text>
            <Text className="text-sm leading-5" style={{ color: colors.heroSubtext }}>{theme.quest}</Text>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Text style={{ fontSize: 24 }}>{theme.emoji}</Text>
          </View>
        </View>
        <Text className="text-xs font-bold mt-3" style={{ color: colors.heroSubtext }}>
          Tap mission cards to advance from training → mastered → podium ready.
        </Text>
      </View>

      {/* Apparatus selector */}
      <View className="mb-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
          {APPARATUS_LIST.map((app) => {
            const isSelected = selectedApparatus === app;
            const appTheme = APPARATUS_THEME[app];
            const apparatusBg = getApparatusBg(app, colors);
            return (
              <Pressable
                key={app}
                onPress={() => setSelectedApparatus(app)}
                className="min-w-[100px] rounded-2xl border p-3"
                style={{
                  backgroundColor: isSelected ? apparatusBg : colors.bgSecondary,
                  borderColor: isSelected ? appTheme.color : colors.border,
                }}
              >
                <Text style={{ fontSize: 20, marginBottom: 4 }}>{appTheme.emoji}</Text>
                <Text className="font-black" style={{ color: isSelected ? appTheme.color : colors.text }}>{app}</Text>
                <Text className="text-[10px] font-bold uppercase" style={{ color: colors.textMuted }}>{appTheme.world}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        <QuestMap gymnastId={gymnast._id} apparatus={selectedApparatus} />
        <View className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}

function QuestMap({ gymnastId, apparatus }: { gymnastId: any; apparatus: Apparatus }) {
  const { colors } = useAppTheme();
  const skills = useQuery(api.gymnasts.getSkillsByApparatus, { apparatus });
  const achievements = useQuery(api.gymnasts.getAchievements, { gymnastId });
  const updateStatus = useMutation(api.gymnasts.updateSkillStatus);
  const theme = APPARATUS_THEME[apparatus];
  const apparatusBg = getApparatusBg(apparatus, colors);

  if (!skills || !achievements) return <View className="py-10 items-center"><Spinner /></View>;

  const getStatus = (skillId: any): SkillStatus => {
    return achievements.find((a: any) => a.skillId === skillId)?.status || "working";
  };

  const counts = skills.reduce(
    (total: Record<SkillStatus, number>, skill: any) => {
      total[getStatus(skill._id)] += 1;
      return total;
    },
    { working: 0, mastered: 0, competition_ready: 0 }
  );
  const trophyCount = counts.mastered + counts.competition_ready;
  const progressPercent = skills.length > 0 ? Math.round((trophyCount / skills.length) * 100) : 0;

  const advanceQuest = async (skillId: any, currentStatus: SkillStatus) => {
    const nextStatus =
      currentStatus === "working" ? "mastered"
      : currentStatus === "mastered" ? "competition_ready"
      : "working";
    await updateStatus({ gymnastId, skillId, status: nextStatus });
  };

  return (
    <View className="gap-4">
      {/* Progress card */}
      <View className="rounded-2xl p-4" style={[colors.shadow, { backgroundColor: colors.surface }]}>
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.gold }}>Quest Power</Text>
            <Text className="text-2xl font-black" style={{ color: colors.text }}>{progressPercent}% complete</Text>
          </View>
          <View className="items-center rounded-2xl px-4 py-2" style={{ backgroundColor: colors.goldBg }}>
            <Trophy size={24} color={colors.gold} />
            <Text className="mt-1 text-xs font-black" style={{ color: colors.gold }}>{trophyCount}/{skills.length}</Text>
          </View>
        </View>
        <View className="h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: colors.bgTertiary }}>
          <View className="h-full rounded-full" style={{ width: `${progressPercent}%`, backgroundColor: colors.gold }} />
        </View>
        <View className="mt-4 flex-row gap-3">
          <MiniStat color={colors.textMuted} label="Training" value={counts.working} />
          <MiniStat color={colors.gold} label="Mastered" value={counts.mastered} />
          <MiniStat color={colors.green} label="Ready" value={counts.competition_ready} />
        </View>
      </View>

      {skills.length === 0 ? (
        <Text className="mt-10 text-center" style={{ color: colors.textMuted }}>No quest nodes found for this world.</Text>
      ) : (
        skills.map((skill: any, index: number) => {
          const status = getStatus(skill._id);
          return (
            <QuestNode
              key={skill._id}
              skill={skill}
              index={index}
              status={status}
              themeColor={theme.color}
              themeBg={apparatusBg}
              onAdvance={() => advanceQuest(skill._id, status)}
            />
          );
        })
      )}
    </View>
  );
}

function QuestNode({
  skill,
  index,
  status,
  themeColor,
  themeBg,
  onAdvance,
}: {
  skill: any;
  index: number;
  status: SkillStatus;
  themeColor: string;
  themeBg: string;
  onAdvance: () => void;
}) {
  const { colors } = useAppTheme();
  const isMastered = status === "mastered";
  const isReady = status === "competition_ready";

  const statusConfig = {
    working: { label: "Training", color: colors.textMuted, icon: <Star size={28} color={themeColor} />, bg: colors.bgSecondary, border: colors.border, actionLabel: "Claim Mastery Trophy", actionBg: colors.gold },
    mastered: { label: "Trophy", color: colors.gold, icon: <Trophy size={28} color={colors.gold} />, bg: colors.goldBg, border: colors.gold, actionLabel: "Make Podium Ready", actionBg: colors.green },
    competition_ready: { label: "Podium Ready", color: colors.green, icon: <Crown size={28} color={colors.green} />, bg: colors.greenBg, border: colors.green, actionLabel: "Reset Quest", actionBg: colors.textMuted },
  }[status];

  return (
    <View className={index % 2 === 0 ? "items-start" : "items-end"}>
      <View
        className="w-[92%] overflow-hidden rounded-2xl p-4"
        style={[colors.shadow, { backgroundColor: colors.surface, borderWidth: 1, borderColor: statusConfig.border + "60" }]}
      >
        <View className="flex-row items-start gap-3 mb-3">
          <View
            className="h-14 w-14 items-center justify-center rounded-xl"
            style={{ backgroundColor: statusConfig.bg }}
          >
            {statusConfig.icon}
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.gold }}>
              Mission {index + 1}
            </Text>
            <Text className="text-xl font-black leading-6" style={{ color: colors.text }}>{skill.name}</Text>
            <Text className="mt-0.5 text-xs font-bold uppercase" style={{ color: colors.textMuted }}>
              Level {skill.level} · {getLevelCategory(skill.level)}
            </Text>
          </View>
          <View
            className="rounded-full px-2.5 py-1"
            style={{ backgroundColor: statusConfig.bg }}
          >
            <Text className="text-[10px] font-black uppercase" style={{ color: statusConfig.color }}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <View className="mb-3 rounded-xl p-3" style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
          <Text className="text-xs font-bold leading-5" style={{ color: colors.textSecondary }}>
            {getQuestPrompt(status, skill.name)}
          </Text>
        </View>

        {/* Stage pills */}
        <View className="flex-row gap-2 mb-3">
          <StagePill label="Train" active={status === "working"} />
          <StagePill label="Master" active={status === "mastered"} gold />
          <StagePill label="Podium" active={status === "competition_ready"} green />
        </View>

        <Pressable
          onPress={onAdvance}
          className="items-center rounded-xl py-3.5"
          style={{ backgroundColor: statusConfig.actionBg }}
        >
          <Text className="font-black text-white">{statusConfig.actionLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function StagePill({ label, active, gold, green }: { label: string; active: boolean; gold?: boolean; green?: boolean }) {
  const { colors } = useAppTheme();
  const bg = active
    ? gold ? colors.gold : green ? colors.green : colors.textSecondary
    : colors.bgTertiary;
  const textColor = active ? "#FFFFFF" : colors.textDisabled;
  return (
    <View className="flex-1 items-center justify-center rounded-full px-2 py-2" style={{ backgroundColor: bg }}>
      <Text className="text-[10px] font-black uppercase" style={{ color: textColor }}>{label}</Text>
    </View>
  );
}

function MiniStat({ color, label, value }: { color: string; label: string; value: number }) {
  const { colors } = useAppTheme();
  return (
    <View className="flex-1 rounded-xl p-3" style={{ backgroundColor: colors.bgSecondary }}>
      <Text className="text-2xl font-black" style={{ color }}>{value}</Text>
      <Text className="text-[10px] font-bold uppercase" style={{ color: colors.textMuted }}>{label}</Text>
    </View>
  );
}

function getQuestPrompt(status: SkillStatus, skillName: string) {
  if (status === "working") return `Train ${skillName}, collect coach cues, and tap the button when this mission is mastered.`;
  if (status === "mastered") return `Trophy unlocked! Now polish ${skillName} until it feels ready for meet day.`;
  return `${skillName} is podium ready. This skill can shine in a routine.`;
}

function getLevelCategory(level: number) {
  if (level <= 3) return "Foundational";
  if (level <= 5) return "Compulsory";
  if (level === 6) return "Optional Bridge";
  if (level === 7) return "Intro Optional";
  if (level <= 9) return "Advanced Optional";
  return "Elite/Level 10";
}
