import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import {
  Award,
  Castle,
  ChevronLeft,
  Circle,
  Crown,
  Flame,
  Lock,
  Map,
  Medal,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  WandSparkles,
} from "lucide-react-native";

import { api, useMutation, useQuery } from "@/lib/demoData";
import { Badge, Button, Card, CardContent, SafeAreaView, Spinner, Text } from "@/components/ui";

const APPARATUS_LIST = ["Vault", "Bars", "Beam", "Floor"] as const;
type Apparatus = typeof APPARATUS_LIST[number];
type SkillStatus = "working" | "mastered" | "competition_ready";

const APPARATUS_THEME: Record<Apparatus, {
  title: string;
  world: string;
  quest: string;
  color: string;
  glow: string;
  icon: React.ReactNode;
}> = {
  Vault: {
    title: "Vault Launchpad",
    world: "Blast-Off World",
    quest: "Build speed, power, and a fearless stick landing.",
    color: "#FB923C",
    glow: "bg-orange-500/20",
    icon: <Rocket size={22} color="#FB923C" />,
  },
  Bars: {
    title: "Bars Orbit",
    world: "Sky Swing World",
    quest: "Connect shapes, swing tall, and unlock the golden kip.",
    color: "#8FE7FF",
    glow: "bg-cyan-300/20",
    icon: <Sparkles size={22} color="#8FE7FF" />,
  },
  Beam: {
    title: "Beam Skyline",
    world: "Balance Castle",
    quest: "Travel the narrow path with courage and calm.",
    color: "#F472B6",
    glow: "bg-pink-400/20",
    icon: <Castle size={22} color="#F472B6" />,
  },
  Floor: {
    title: "Floor Arena",
    world: "Power Stage",
    quest: "Tumble, dance, and finish like the hero of the meet.",
    color: "#65F4A3",
    glow: "bg-emerald-300/20",
    icon: <Flame size={22} color="#65F4A3" />,
  },
};

export default function SkillRoadmap() {
  const router = useRouter();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const [selectedApparatus, setSelectedApparatus] = useState<Apparatus>("Bars");

  if (gymnast === undefined) return <Spinner />;
  if (gymnast === null) return <Text>Gymnast not found</Text>;

  const theme = APPARATUS_THEME[selectedApparatus];

  return (
    <SafeAreaView className="flex-1 bg-[#061528]" edges={["top"]}>
      <View className="px-4 pb-4 pt-6">
        <View className="mb-5 flex-row items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-[#0B1F3D]" onPress={() => router.back()}>
            <ChevronLeft size={22} color="#F8FAFC" />
          </Button>
          <View className="flex-1">
            <Text className="text-[11px] font-black uppercase tracking-widest text-[#F6C453]">Path to Podium</Text>
            <Text className="text-3xl font-black text-[#F8FAFC]">Quest Map</Text>
          </View>
          <View className="h-11 w-11 items-center justify-center rounded-full bg-[#F6C453]/20">
            <Map size={21} color="#F6C453" />
          </View>
        </View>

        <View className="overflow-hidden rounded-[26px] border border-white/10 bg-[#0B1F3D] p-5">
          <View className={`absolute right-[-38px] top-[-38px] h-32 w-32 rounded-full ${theme.glow}`} />
          <View className="mb-4 flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-[11px] font-black uppercase tracking-widest" style={{ color: theme.color }}>
                {theme.world}
              </Text>
              <Text className="mt-1 text-3xl font-black leading-9 text-[#F8FAFC]">{theme.title}</Text>
              <Text className="mt-2 text-sm leading-5 text-[#C7D2FE]">{theme.quest}</Text>
            </View>
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#061528]">
              {theme.icon}
            </View>
          </View>
          <Text className="text-xs font-bold uppercase text-[#94A3B8]">
            Tap mission cards to move from training to mastered to podium ready.
          </Text>
        </View>
      </View>

      <View className="mb-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
          {APPARATUS_LIST.map((app) => {
            const isSelected = selectedApparatus === app;
            const appTheme = APPARATUS_THEME[app];

            return (
              <Pressable
                key={app}
                onPress={() => setSelectedApparatus(app)}
                className={`min-w-[116px] rounded-2xl border p-3 ${
                  isSelected ? "border-[#F6C453] bg-[#F6C453]/15" : "border-white/10 bg-[#0A1B33]"
                }`}
              >
                <View className="mb-2">{appTheme.icon}</View>
                <Text className={isSelected ? "font-black text-[#F6C453]" : "font-black text-[#F8FAFC]"}>{app}</Text>
                <Text className="text-[10px] font-bold uppercase text-[#94A3B8]">{appTheme.world}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        <QuestMap gymnastId={gymnast._id} apparatus={selectedApparatus} />
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

function QuestMap({ gymnastId, apparatus }: { gymnastId: any; apparatus: Apparatus }) {
  const skills = useQuery(api.gymnasts.getSkillsByApparatus, { apparatus });
  const achievements = useQuery(api.gymnasts.getAchievements, { gymnastId });
  const updateStatus = useMutation(api.gymnasts.updateSkillStatus);
  const theme = APPARATUS_THEME[apparatus];

  if (!skills || !achievements) return <Spinner />;

  const getStatus = (skillId: any): SkillStatus => {
    return achievements.find((achievement: any) => achievement.skillId === skillId)?.status || "working";
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
      currentStatus === "working"
        ? "mastered"
        : currentStatus === "mastered"
          ? "competition_ready"
          : "working";

    await updateStatus({
      gymnastId,
      skillId,
      status: nextStatus,
    });
  };

  return (
    <View className="gap-4">
      <Card className="border-[#F6C453]/20 bg-[#0A1B33]">
        <CardContent className="p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Text className="text-[11px] font-black uppercase tracking-widest text-[#F6C453]">Quest Power</Text>
              <Text className="text-2xl font-black text-[#F8FAFC]">{progressPercent}% complete</Text>
            </View>
            <View className="items-center rounded-2xl bg-[#F6C453]/15 px-4 py-2">
              <Trophy size={24} color="#F6C453" />
              <Text className="mt-1 text-xs font-black text-[#F6C453]">{trophyCount}/{skills.length}</Text>
            </View>
          </View>
          <View className="h-3 overflow-hidden rounded-full bg-[#061528]">
            <View className="h-full rounded-full bg-[#F6C453]" style={{ width: `${progressPercent}%` }} />
          </View>
          <View className="mt-4 flex-row gap-3">
            <MiniStat color="#8FE7FF" label="Training" value={counts.working} />
            <MiniStat color="#F6C453" label="Mastered" value={counts.mastered} />
            <MiniStat color="#65F4A3" label="Ready" value={counts.competition_ready} />
          </View>
        </CardContent>
      </Card>

      {skills.length === 0 ? (
        <Text className="mt-10 text-center text-[#94A3B8]">No quest nodes found for this world.</Text>
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
  skill,
  index,
  status,
  themeColor,
  onAdvance,
}: {
  skill: any;
  index: number;
  status: SkillStatus;
  themeColor: string;
  onAdvance: () => void;
}) {
  const isMastered = status === "mastered";
  const isReady = status === "competition_ready";
  const isTrophy = isMastered || isReady;
  const cardBorder = isReady ? "border-[#65F4A3]/50" : isMastered ? "border-[#F6C453]/50" : "border-white/10";
  const cardBg = isReady ? "bg-[#102F2E]" : isMastered ? "bg-[#2F2810]" : "bg-[#0A1B33]";

  return (
    <View className={index % 2 === 0 ? "items-start" : "items-end"}>
      <Card className={`w-[92%] overflow-hidden rounded-[28px] ${cardBorder} ${cardBg}`}>
        <View className="absolute right-[-34px] top-[-34px] h-28 w-28 rounded-full opacity-30" style={{ backgroundColor: themeColor }} />
        <CardContent className="p-4">
          <View className="mb-4 flex-row items-start justify-between gap-3">
            <View className="flex-row flex-1 items-center gap-3">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#061528]">
                {isReady ? (
                  <Crown size={31} color="#65F4A3" />
                ) : isMastered ? (
                  <Trophy size={31} color="#F6C453" />
                ) : (
                  <WandSparkles size={28} color={themeColor} />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-[10px] font-black uppercase tracking-widest" style={{ color: themeColor }}>
                  Mission {index + 1}
                </Text>
                <Text className="text-xl font-black leading-6 text-[#F8FAFC]">{skill.name}</Text>
                <Text className="mt-1 text-xs font-bold uppercase text-[#94A3B8]">
                  Level {skill.level} • {getLevelCategory(skill.level)}
                </Text>
              </View>
            </View>
            <QuestBadge status={status} />
          </View>

          <View className="mb-4 rounded-2xl border border-white/10 bg-[#061528]/70 p-3">
            <Text className="text-xs font-bold leading-5 text-[#C7D2FE]">
              {getQuestPrompt(status, skill.name)}
            </Text>
          </View>

          <View className="flex-row gap-2">
            <StagePill label="Train" active={status === "working"} icon={<Circle size={14} color={status === "working" ? "#061528" : "#94A3B8"} />} />
            <StagePill label="Master" active={status === "mastered"} icon={<Trophy size={14} color={status === "mastered" ? "#061528" : "#94A3B8"} />} />
            <StagePill label="Podium" active={status === "competition_ready"} icon={<Medal size={14} color={status === "competition_ready" ? "#061528" : "#94A3B8"} />} />
          </View>

          <Button
            size="lg"
            className={`mt-4 flex-row gap-2 ${isReady ? "bg-[#65F4A3]" : isMastered ? "bg-[#F6C453]" : "bg-[#8FE7FF]"}`}
            onPress={onAdvance}
          >
            {isReady ? <ShieldCheck size={18} color="#061528" /> : isTrophy ? <Award size={18} color="#061528" /> : <Star size={18} color="#061528" />}
            <Text className="font-black text-[#061528]">{getActionLabel(status)}</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}

function QuestBadge({ status }: { status: SkillStatus }) {
  const config = {
    working: { label: "Training", color: "#8FE7FF", bg: "bg-[#8FE7FF]/15", icon: <Lock size={12} color="#8FE7FF" /> },
    mastered: { label: "Trophy", color: "#F6C453", bg: "bg-[#F6C453]/15", icon: <Trophy size={12} color="#F6C453" /> },
    competition_ready: { label: "Podium Ready", color: "#65F4A3", bg: "bg-[#65F4A3]/15", icon: <Crown size={12} color="#65F4A3" /> },
  }[status];

  return (
    <Badge className={`border-transparent ${config.bg}`}>
      <View className="flex-row items-center gap-1">
        {config.icon}
        <Text className="text-[10px] font-black uppercase" style={{ color: config.color }}>
          {config.label}
        </Text>
      </View>
    </Badge>
  );
}

function StagePill({ label, active, icon }: { label: string; active: boolean; icon: React.ReactNode }) {
  return (
    <View className={`flex-1 flex-row items-center justify-center gap-1 rounded-full px-2 py-2 ${active ? "bg-[#F6C453]" : "bg-[#061528]"}`}>
      {icon}
      <Text className={active ? "text-[10px] font-black uppercase text-[#061528]" : "text-[10px] font-black uppercase text-[#94A3B8]"}>
        {label}
      </Text>
    </View>
  );
}

function MiniStat({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <View className="flex-1 rounded-2xl bg-[#061528] p-3">
      <Text className="text-2xl font-black" style={{ color }}>{value}</Text>
      <Text className="text-[10px] font-bold uppercase text-[#94A3B8]">{label}</Text>
    </View>
  );
}

function getActionLabel(status: SkillStatus) {
  if (status === "working") return "Claim Mastery Trophy";
  if (status === "mastered") return "Make Podium Ready";
  return "Reset Quest";
}

function getQuestPrompt(status: SkillStatus, skillName: string) {
  if (status === "working") {
    return `Train ${skillName}, collect coach cues, and tap the button when this mission is mastered.`;
  }

  if (status === "mastered") {
    return `Trophy unlocked! Now polish ${skillName} until it feels ready for meet day.`;
  }

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
