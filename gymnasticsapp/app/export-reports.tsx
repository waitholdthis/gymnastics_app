import React from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { api, useQuery } from "@/lib/demoData";
import { Text, SafeAreaView, Spinner } from "@/components/ui";
import { useRouter } from "expo-router";
import {
  Activity,
  AlertTriangle,
  ChevronLeft,
  Download,
  FileText,
  Heart,
  Lock,
  Share,
  ShieldCheck,
  Trophy,
} from "lucide-react-native";
import { useAppTheme } from "@/lib/appTheme";

export default function ExportReports() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const wellness = useQuery(api.gymnasts.getLatestWellness, gymnast ? { gymnastId: gymnast._id } : "skip");
  const achievements = useQuery(api.gymnasts.getAchievements, gymnast ? { gymnastId: gymnast._id } : "skip");
  const meets = useQuery(api.gymnasts.getMeets, gymnast ? { gymnastId: gymnast._id } : "skip");

  if (gymnast === undefined)
    return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}><Spinner /></View>;
  if (gymnast === null)
    return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}><Text style={{ color: colors.text }}>Gymnast not found</Text></View>;

  const handleExport = () => {
    Alert.alert(
      "Fort Knox Report Ready",
      "Generating encrypted PDF for provider sharing... Watermarked and privacy-safe.",
      [{ text: "OK" }]
    );
  };

  const readinessScore = wellness
    ? Math.round(((6 - wellness.soreness) + wellness.energy + wellness.mood) / 3)
    : null;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.bg }} edges={["top"]}>
      {/* Header */}
      <View
        className="px-4 pt-4 pb-3 flex-row items-center justify-between border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.backBtnBg }}
          >
            <ChevronLeft size={22} color={colors.backBtnIcon} />
          </Pressable>
          <View>
            <Text className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.gold }}>Privacy-First</Text>
            <Text className="text-2xl font-black" style={{ color: colors.text }}>Health Report</Text>
          </View>
        </View>
        <Pressable
          onPress={handleExport}
          className="h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.greenBg }}
        >
          <Share size={18} color={colors.green} />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        {/* Privacy Banner */}
        <View className="mt-4 mb-5 overflow-hidden rounded-2xl p-5" style={{ backgroundColor: colors.hero }}>
          <View className="absolute top-0 right-0 h-36 w-36 rounded-full bg-[#16A34A]/10" />
          <View className="flex-row items-start gap-4">
            <View className="h-14 w-14 items-center justify-center rounded-xl bg-[#16A34A]/20">
              <ShieldCheck size={30} color={colors.green} />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: colors.green }}>
                Medical-Grade Privacy
              </Text>
              <Text className="text-xl font-black leading-6" style={{ color: colors.heroText }}>
                For Physicians, PTs & Coaches
              </Text>
              <Text className="mt-2 text-xs leading-4" style={{ color: colors.heroSubtext }}>
                Watermarked export · Expiring share links · Role-based access · Encrypted in transit
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row gap-2 flex-wrap">
            <PrivacyPill icon={<Lock size={10} color={colors.green} />} label="Encrypted" />
            <PrivacyPill icon={<ShieldCheck size={10} color={colors.green} />} label="Guardian-Approved" />
            <PrivacyPill icon={<FileText size={10} color={colors.green} />} label="Audit Logged" />
          </View>
        </View>

        {/* Athlete Profile */}
        <View className="mb-5 rounded-2xl p-4" style={[colors.shadow, { backgroundColor: colors.surface }]}>
          <SectionLabel label="Athlete Profile" />
          <View className="flex-row gap-4">
            <ProfileStat label="Name" value={gymnast.name} />
            <ProfileStat label="Level" value={gymnast.level} />
            <ProfileStat label="Club" value={gymnast.club} />
          </View>
        </View>

        {/* Workload & Recovery */}
        <ReportSection title="Workload & Recovery" icon={<Heart size={17} color={colors.pink} />} accentColor={colors.pink}>
          {wellness ? (
            <>
              <View className="flex-row justify-between mb-4">
                <ReadingStat label="Soreness" value={`${wellness.soreness}/5`} color={wellness.soreness > 3 ? colors.red : colors.green} />
                <ReadingStat label="Energy" value={`${wellness.energy}/5`} color={colors.blue} />
                <ReadingStat label="Mood" value={`${wellness.mood}/5`} color={colors.gold} />
                {readinessScore && (
                  <ReadingStat label="Readiness" value={`${readinessScore}/5`} color={readinessScore >= 4 ? colors.green : readinessScore >= 3 ? colors.gold : colors.red} />
                )}
              </View>
              {wellness.soreness > 3 && (
                <View className="flex-row items-center gap-2 rounded-xl p-3 mb-3" style={{ backgroundColor: colors.redBg }}>
                  <AlertTriangle size={14} color={colors.red} />
                  <Text className="text-xs font-black" style={{ color: colors.red }}>High soreness flagged — consider modified training.</Text>
                </View>
              )}
              {wellness.notes && (
                <Text className="text-xs italic leading-4" style={{ color: colors.textMuted }}>"{wellness.notes}"</Text>
              )}
            </>
          ) : (
            <Text className="text-sm italic" style={{ color: colors.textMuted }}>No recent wellness data logged.</Text>
          )}
        </ReportSection>

        {/* High-Impact Milestones */}
        <ReportSection title="High-Impact Milestones" icon={<Activity size={17} color={colors.blue} />} accentColor={colors.blue}>
          <Text className="text-[10px] font-black uppercase mb-3" style={{ color: colors.textMuted }}>
            Skills achieved — load tracking for provider reference
          </Text>
          <View className="gap-2">
            {achievements?.slice(0, 4).map((ach: any) => (
              <View
                key={ach._id}
                className="flex-row items-center justify-between rounded-xl px-4 py-3"
                style={{ backgroundColor: colors.bgSecondary }}
              >
                <Text className="font-black text-sm" style={{ color: colors.text }}>{ach.skillName}</Text>
                <View className="flex-row items-center gap-2">
                  <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: colors.blueBg }}>
                    <Text className="text-[10px] font-black uppercase" style={{ color: colors.blue }}>{ach.apparatus}</Text>
                  </View>
                  <View
                    className="rounded-full px-2.5 py-1"
                    style={{ backgroundColor: ach.status === "competition_ready" ? colors.greenBg : colors.goldBg }}
                  >
                    <Text
                      className="text-[9px] font-black uppercase"
                      style={{ color: ach.status === "competition_ready" ? colors.green : colors.gold }}
                    >
                      {ach.status.replace("_", " ")}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ReportSection>

        {/* Competition Exposure */}
        <ReportSection title="Competition Exposure" icon={<Trophy size={17} color={colors.gold} />} accentColor={colors.gold}>
          <View className="flex-row items-center justify-between mb-3 rounded-xl px-4 py-3" style={{ backgroundColor: colors.bgSecondary }}>
            <Text className="font-black text-sm" style={{ color: colors.textMuted }}>Total Meets Logged</Text>
            <Text className="text-2xl font-black" style={{ color: colors.gold }}>{meets?.length ?? 0}</Text>
          </View>
          {meets?.[0] && (
            <View
              className="rounded-xl p-3"
              style={{ backgroundColor: colors.goldBgLight, borderWidth: 1, borderColor: colors.goldBg }}
            >
              <Text className="text-[10px] font-black uppercase mb-1" style={{ color: colors.gold }}>Latest Competition</Text>
              <Text className="font-black" style={{ color: colors.text }}>{meets[0].name}</Text>
              <Text className="text-xs" style={{ color: colors.textMuted }}>{meets[0].date}</Text>
              {(meets[0].vaultScore || meets[0].barsScore || meets[0].beamScore || meets[0].floorScore) && (
                <Text className="text-xs mt-1" style={{ color: colors.textMuted }}>
                  AA:{" "}
                  {(
                    (meets[0].vaultScore ?? 0) +
                    (meets[0].barsScore ?? 0) +
                    (meets[0].beamScore ?? 0) +
                    (meets[0].floorScore ?? 0)
                  ).toFixed(3)}
                </Text>
              )}
            </View>
          )}
        </ReportSection>

        {/* Export CTA */}
        <Pressable
          onPress={handleExport}
          className="mb-20 mt-2 overflow-hidden rounded-2xl py-4 flex-row items-center justify-center gap-3"
          style={{ backgroundColor: colors.gold }}
        >
          <Download size={20} color="#1A1A1A" />
          <Text className="font-black text-base" style={{ color: "#1A1A1A" }}>Download Medical-Grade PDF</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ label }: { label: string }) {
  const { colors } = useAppTheme();
  return (
    <Text className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: colors.gold }}>{label}</Text>
  );
}

function ReportSection({
  title, icon, accentColor, children,
}: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  children: React.ReactNode;
}) {
  const { colors } = useAppTheme();
  return (
    <View className="mb-5">
      <View className="flex-row items-center gap-2 mb-3">
        {icon}
        <Text className="font-black text-base" style={{ color: colors.text }}>{title}</Text>
        <View className="flex-1 h-px ml-1" style={{ backgroundColor: colors.border }} />
      </View>
      <View
        className="rounded-2xl p-4"
        style={[colors.shadow, { backgroundColor: colors.surface, borderLeftWidth: 3, borderLeftColor: accentColor }]}
      >
        {children}
      </View>
    </View>
  );
}

function ReadingStat({ label, value, color }: { label: string; value: string; color: string }) {
  const { colors } = useAppTheme();
  return (
    <View className="items-center">
      <Text className="text-[10px] font-black uppercase mb-1" style={{ color: colors.textMuted }}>{label}</Text>
      <Text className="text-xl font-black" style={{ color }}>{value}</Text>
    </View>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return (
    <View className="flex-1">
      <Text className="text-[10px] font-black uppercase mb-1" style={{ color: colors.textMuted }}>{label}</Text>
      <Text className="text-sm font-black" numberOfLines={1} style={{ color: colors.text }}>{value}</Text>
    </View>
  );
}

function PrivacyPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  const { colors } = useAppTheme();
  return (
    <View
      className="flex-row items-center gap-1 rounded-full px-2.5 py-1"
      style={{ borderWidth: 1, borderColor: `${colors.green}4D`, backgroundColor: colors.greenBg }}
    >
      {icon}
      <Text className="text-[10px] font-black uppercase" style={{ color: colors.green }}>{label}</Text>
    </View>
  );
}
