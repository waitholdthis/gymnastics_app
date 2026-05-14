import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronLeft, ChevronRight, Crown, Flame,
  Map, Rocket, Sparkles, Star, Trophy,
} from "lucide-react-native";

import { api, useMutation, useQuery } from "@/lib/demoData";
import { SafeAreaView, Spinner, Text } from "@/components/ui";
import { useAppTheme } from "@/lib/appTheme";
import { Entrance } from "@/components/cinematic/Entrance";

const APPARATUS_LIST = ["Vault", "Bars", "Beam", "Floor"] as const;
type Apparatus = typeof APPARATUS_LIST[number];
type SkillStatus = "working" | "mastered" | "competition_ready";

const APPARATUS_THEME: Record<Apparatus, {
  title: string;
  world: string;
  quest: string;
  color: string;
  icon: React.ReactNode;
  abbr: string;
}> = {
  Vault: {
    title: "Vault Launchpad",
    world: "Blast-Off World",
    quest: "Build speed, power, and a fearless stick landing.",
    color: "#F97316",
    icon: <Rocket size={20} color="#F97316" />,
    abbr: "VT",
  },
  Bars: {
    title: "Bars Orbit",
    world: "Sky Swing World",
    quest: "Connect shapes, swing tall, and unlock the golden kip.",
    color: "#3B82F6",
    icon: <Sparkles size={20} color="#3B82F6" />,
    abbr: "UB",
  },
  Beam: {
    title: "Beam Skyline",
    world: "Balance Castle",
    quest: "Travel the narrow path with courage and calm.",
    color: "#EC4899",
    icon: <Flame size={20} color="#EC4899" />,
    abbr: "BB",
  },
  Floor: {
    title: "Floor Arena",
    world: "Power Stage",
    quest: "Tumble, dance, and finish like the hero of the meet.",
    color: "#22C55E",
    icon: <Star size={20} color="#22C55E" />,
    abbr: "FX",
  },
};

export default function SkillRoadmap() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const [selectedApparatus, setSelectedApparatus] = useState<Apparatus>("Bars");

  if (gymnast === undefined) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <Spinner />
      </View>
    );
  }
  if (gymnast === null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <Text style={{ color: colors.text }}>Gymnast not found</Text>
      </View>
    );
  }

  const theme = APPARATUS_THEME[selectedApparatus];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            height: 44,
            width: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 22,
            backgroundColor: colors.backBtnBg,
          }}
        >
          <ChevronLeft size={22} color={colors.backBtnIcon} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, color: colors.gold }}>
            Path to Podium
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "900", color: colors.text, letterSpacing: -0.5 }}>
            Quest Map
          </Text>
        </View>
        <View
          style={{
            height: 44,
            width: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 22,
            backgroundColor: colors.goldBg,
            borderWidth: 1,
            borderColor: colors.gold + "30",
          }}
        >
          <Map size={20} color={colors.gold} />
        </View>
      </View>

      {/* Cinematic hero card */}
      <View
        style={{
          marginHorizontal: 16,
          marginTop: 16,
          marginBottom: 12,
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: colors.hero,
          padding: 20,
        }}
      >
        {/* Gold glow */}
        <View
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: theme.color + "18",
          }}
        />

        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, color: colors.gold, marginBottom: 6 }}>
              {theme.world}
            </Text>
            <Text style={{ fontSize: 24, fontWeight: "900", color: colors.heroText, letterSpacing: -0.5, marginBottom: 8, lineHeight: 28 }}>
              {theme.title}
            </Text>
            <Text style={{ fontSize: 12, lineHeight: 18, color: colors.heroSubtext }}>{theme.quest}</Text>
          </View>
          <View
            style={{
              width: 52,
              height: 52,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              backgroundColor: "rgba(255,255,255,0.07)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            {theme.icon}
          </View>
        </View>

        <Text style={{ fontSize: 10, fontWeight: "700", marginTop: 14, color: colors.heroSubtext }}>
          Tap mission cards to advance · Training → Mastered → Podium Ready
        </Text>
      </View>

      {/* Apparatus selector */}
      <View style={{ marginBottom: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        >
          {APPARATUS_LIST.map((app) => {
            const isSelected = selectedApparatus === app;
            const appTheme = APPARATUS_THEME[app];
            return (
              <Pressable
                key={app}
                onPress={() => setSelectedApparatus(app)}
                style={{
                  minWidth: 90,
                  borderRadius: 16,
                  borderWidth: 1,
                  padding: 12,
                  backgroundColor: isSelected
                    ? appTheme.color + "14"
                    : colors.glass,
                  borderColor: isSelected ? appTheme.color + "60" : colors.border,
                }}
              >
                <View style={{ marginBottom: 6 }}>{appTheme.icon}</View>
                <Text style={{ fontWeight: "900", fontSize: 13, color: isSelected ? appTheme.color : colors.text }}>
                  {app}
                </Text>
                <Text style={{ fontSize: 9, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, color: colors.textMuted }}>
                  {appTheme.abbr}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <Entrance delay={0} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} keyboardShouldPersistTaps="handled">
          <QuestMap gymnastId={gymnast._id} apparatus={selectedApparatus} />
          <View style={{ height: 120 }} />
        </ScrollView>
      </Entrance>
    </SafeAreaView>
  );
}

function QuestMap({ gymnastId, apparatus }: { gymnastId: any; apparatus: Apparatus }) {
  const { colors } = useAppTheme();
  const skills = useQuery(api.gymnasts.getSkillsByApparatus, { apparatus });
  const achievements = useQuery(api.gymnasts.getAchievements, { gymnastId });
  const updateStatus = useMutation(api.gymnasts.updateSkillStatus);
  const theme = APPARATUS_THEME[apparatus];

  if (!skills || !achievements) {
    return <View style={{ paddingVertical: 40, alignItems: "center" }}><Spinner /></View>;
  }

  const getStatus = (skillId: any): SkillStatus =>
    achievements.find((a: any) => a.skillId === skillId)?.status || "working";

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
    <View style={{ gap: 14 }}>
      {/* Progress card */}
      <View
        style={{
          borderRadius: 20,
          padding: 16,
          backgroundColor: colors.glass,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <View>
            <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, color: colors.gold }}>
              Quest Power
            </Text>
            <Text style={{ fontSize: 26, fontWeight: "900", color: colors.text, letterSpacing: -1, marginTop: 2 }}>
              {progressPercent}%
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: colors.goldBg,
              borderWidth: 1,
              borderColor: colors.gold + "30",
            }}
          >
            <Trophy size={22} color={colors.gold} />
            <Text style={{ marginTop: 4, fontSize: 11, fontWeight: "900", color: colors.gold }}>
              {trophyCount}/{skills.length}
            </Text>
          </View>
        </View>

        <View style={{ height: 3, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.06)", marginBottom: 14 }}>
          <View
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              borderRadius: 99,
              backgroundColor: theme.color,
            }}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <MiniStat color={colors.textMuted} label="Training" value={counts.working} />
          <MiniStat color={colors.gold} label="Mastered" value={counts.mastered} />
          <MiniStat color={colors.green} label="Podium" value={counts.competition_ready} />
        </View>
      </View>

      {skills.length === 0 ? (
        <Text style={{ marginTop: 40, textAlign: "center", color: colors.textMuted }}>
          No quest nodes found for this world.
        </Text>
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
              onAdvance={() => advanceQuest(skill._id, status)}
            />
          );
        })
      )}
    </View>
  );
}

function QuestNode({
  skill, index, status, themeColor, onAdvance,
}: {
  skill: any;
  index: number;
  status: SkillStatus;
  themeColor: string;
  onAdvance: () => void;
}) {
  const { colors } = useAppTheme();
  const isMastered = status === "mastered";
  const isReady = status === "competition_ready";

  const statusConfig = {
    working: {
      label: "Training",
      color: colors.textMuted,
      icon: <Star size={26} color={themeColor} />,
      border: colors.border,
      actionLabel: "Claim Mastery",
      actionBg: colors.gold,
      actionText: "#0A0A0E",
    },
    mastered: {
      label: "Mastered",
      color: colors.gold,
      icon: <Trophy size={26} color={colors.gold} />,
      border: colors.gold + "50",
      actionLabel: "Mark Podium Ready",
      actionBg: colors.green,
      actionText: "#0A0A0E",
    },
    competition_ready: {
      label: "Podium Ready",
      color: colors.green,
      icon: <Crown size={26} color={colors.green} />,
      border: colors.green + "50",
      actionLabel: "Reset to Training",
      actionBg: colors.glass,
      actionText: colors.textMuted,
    },
  }[status];

  return (
    <View style={{ alignItems: index % 2 === 0 ? "flex-start" : "flex-end" }}>
      <View
        style={{
          width: "94%",
          overflow: "hidden",
          borderRadius: 20,
          padding: 16,
          backgroundColor: colors.glass,
          borderWidth: 1,
          borderColor: statusConfig.border,
        }}
      >
        {/* Status accent strip */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: statusConfig.color,
            opacity: isReady ? 1 : isMastered ? 0.8 : 0.3,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />

        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14, marginTop: 4 }}>
          <View
            style={{
              width: 56,
              height: 56,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              backgroundColor: statusConfig.color + "14",
              borderWidth: 1,
              borderColor: statusConfig.color + "30",
            }}
          >
            {statusConfig.icon}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, color: colors.gold }}>
              Mission {index + 1}
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "900", color: colors.text, letterSpacing: -0.3, lineHeight: 24, marginTop: 2 }}>
              {skill.name}
            </Text>
            <Text style={{ fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, color: colors.textMuted, marginTop: 3 }}>
              Level {skill.level} · {getLevelCategory(skill.level)}
            </Text>
          </View>

          <View
            style={{
              borderRadius: 99,
              paddingHorizontal: 10,
              paddingVertical: 4,
              backgroundColor: statusConfig.color + "14",
              borderWidth: 1,
              borderColor: statusConfig.color + "30",
            }}
          >
            <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.5, color: statusConfig.color }}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {/* Quest prompt */}
        <View
          style={{
            marginBottom: 14,
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: "rgba(255,255,255,0.02)",
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "600", lineHeight: 18, color: colors.textSecondary }}>
            {getQuestPrompt(status, skill.name)}
          </Text>
        </View>

        {/* Stage pills */}
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
          <StagePill label="Train" active={status === "working"} activeColor={colors.textSecondary} />
          <StagePill label="Master" active={status === "mastered"} activeColor={colors.gold} />
          <StagePill label="Podium" active={status === "competition_ready"} activeColor={colors.green} />
        </View>

        <Pressable
          onPress={onAdvance}
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
            borderRadius: 12,
            paddingVertical: 13,
            backgroundColor: statusConfig.actionBg,
            borderWidth: status === "competition_ready" ? 1 : 0,
            borderColor: colors.border,
          }}
        >
          <Text style={{ fontWeight: "900", fontSize: 13, color: statusConfig.actionText }}>
            {statusConfig.actionLabel}
          </Text>
          {status !== "competition_ready" && (
            <ChevronRight size={14} color={statusConfig.actionText} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

function StagePill({
  label, active, activeColor,
}: {
  label: string;
  active: boolean;
  activeColor: string;
}) {
  const { colors } = useAppTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 99,
        paddingVertical: 7,
        backgroundColor: active ? activeColor + "20" : colors.glass,
        borderWidth: 1,
        borderColor: active ? activeColor + "50" : colors.border,
      }}
    >
      <Text
        style={{
          fontSize: 9,
          fontWeight: "900",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: active ? activeColor : colors.textDisabled,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function MiniStat({
  color, label, value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  const { colors } = useAppTheme();
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 12,
        padding: 12,
        backgroundColor: "rgba(255,255,255,0.03)",
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "900", color, letterSpacing: -0.5 }}>{value}</Text>
      <Text style={{ fontSize: 9, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, color: colors.textMuted, marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}

function getQuestPrompt(status: SkillStatus, skillName: string) {
  if (status === "working") return `Train ${skillName}, collect coach cues, and tap the button when this mission is mastered.`;
  if (status === "mastered") return `Trophy unlocked! Polish ${skillName} until it feels solid enough for meet day.`;
  return `${skillName} is podium ready. This skill is cleared to compete.`;
}

function getLevelCategory(level: number) {
  if (level <= 3) return "Foundational";
  if (level <= 5) return "Compulsory";
  if (level === 6) return "Optional Bridge";
  if (level === 7) return "Intro Optional";
  if (level <= 9) return "Advanced Optional";
  return "Elite / Level 10";
}
