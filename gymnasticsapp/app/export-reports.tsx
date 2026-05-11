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

const SHADOW = { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 };

export default function ExportReports() {
  const router = useRouter();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const wellness = useQuery(api.gymnasts.getLatestWellness, gymnast ? { gymnastId: gymnast._id } : "skip");
  const achievements = useQuery(api.gymnasts.getAchievements, gymnast ? { gymnastId: gymnast._id } : "skip");
  const meets = useQuery(api.gymnasts.getMeets, gymnast ? { gymnastId: gymnast._id } : "skip");

  if (gymnast === undefined)
    return <View className="flex-1 bg-white items-center justify-center"><Spinner /></View>;
  if (gymnast === null)
    return <View className="flex-1 bg-white items-center justify-center"><Text className="text-[#1A1A1A]">Gymnast not found</Text></View>;

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
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-4 pt-4 pb-3 flex-row items-center justify-between border-b border-[#E8E8E8]">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F0F0EE]"
          >
            <ChevronLeft size={22} color="#444444" />
          </Pressable>
          <View>
            <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843]">Privacy-First</Text>
            <Text className="text-2xl font-black text-[#1A1A1A]">Health Report</Text>
          </View>
        </View>
        <Pressable
          onPress={handleExport}
          className="h-11 w-11 items-center justify-center rounded-full bg-[#F0FDF4]"
        >
          <Share size={18} color="#16A34A" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        {/* Privacy Banner */}
        <View className="mt-4 mb-5 overflow-hidden rounded-2xl bg-[#1A1A2E] p-5">
          <View className="absolute top-0 right-0 h-36 w-36 rounded-full bg-[#16A34A]/10" />
          <View className="flex-row items-start gap-4">
            <View className="h-14 w-14 items-center justify-center rounded-xl bg-[#16A34A]/20">
              <ShieldCheck size={30} color="#16A34A" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-black uppercase tracking-widest text-[#16A34A] mb-1">
                Medical-Grade Privacy
              </Text>
              <Text className="text-xl font-black leading-6 text-white">
                For Physicians, PTs & Coaches
              </Text>
              <Text className="mt-2 text-xs leading-4 text-[#9999BB]">
                Watermarked export · Expiring share links · Role-based access · Encrypted in transit
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row gap-2 flex-wrap">
            <PrivacyPill icon={<Lock size={10} color="#16A34A" />} label="Encrypted" />
            <PrivacyPill icon={<ShieldCheck size={10} color="#16A34A" />} label="Guardian-Approved" />
            <PrivacyPill icon={<FileText size={10} color="#16A34A" />} label="Audit Logged" />
          </View>
        </View>

        {/* Athlete Profile */}
        <View className="mb-5 rounded-2xl bg-white p-4" style={SHADOW}>
          <SectionLabel label="Athlete Profile" />
          <View className="flex-row gap-4">
            <ProfileStat label="Name" value={gymnast.name} />
            <ProfileStat label="Level" value={gymnast.level} />
            <ProfileStat label="Club" value={gymnast.club} />
          </View>
        </View>

        {/* Workload & Recovery */}
        <ReportSection title="Workload & Recovery" icon={<Heart size={17} color="#BE185D" />} accentColor="#BE185D">
          {wellness ? (
            <>
              <View className="flex-row justify-between mb-4">
                <ReadingStat label="Soreness" value={`${wellness.soreness}/5`} color={wellness.soreness > 3 ? "#E54B4B" : "#16A34A"} />
                <ReadingStat label="Energy" value={`${wellness.energy}/5`} color="#1D5BB5" />
                <ReadingStat label="Mood" value={`${wellness.mood}/5`} color="#D4A843" />
                {readinessScore && (
                  <ReadingStat label="Readiness" value={`${readinessScore}/5`} color={readinessScore >= 4 ? "#16A34A" : readinessScore >= 3 ? "#D4A843" : "#E54B4B"} />
                )}
              </View>
              {wellness.soreness > 3 && (
                <View className="flex-row items-center gap-2 rounded-xl bg-[#FFF0F0] p-3 mb-3">
                  <AlertTriangle size={14} color="#E54B4B" />
                  <Text className="text-xs font-black text-[#E54B4B]">High soreness flagged — consider modified training.</Text>
                </View>
              )}
              {wellness.notes && (
                <Text className="text-xs italic leading-4 text-[#888888]">"{wellness.notes}"</Text>
              )}
            </>
          ) : (
            <Text className="text-sm italic text-[#888888]">No recent wellness data logged.</Text>
          )}
        </ReportSection>

        {/* High-Impact Milestones */}
        <ReportSection title="High-Impact Milestones" icon={<Activity size={17} color="#1D5BB5" />} accentColor="#1D5BB5">
          <Text className="text-[10px] font-black uppercase text-[#888888] mb-3">
            Skills achieved — load tracking for provider reference
          </Text>
          <View className="gap-2">
            {achievements?.slice(0, 4).map((ach: any) => (
              <View
                key={ach._id}
                className="flex-row items-center justify-between rounded-xl bg-[#F8F8F6] px-4 py-3"
              >
                <Text className="font-black text-sm text-[#1A1A1A]">{ach.skillName}</Text>
                <View className="flex-row items-center gap-2">
                  <View className="rounded-full px-2.5 py-1 bg-[#EFF6FF]">
                    <Text className="text-[10px] font-black uppercase text-[#1D5BB5]">{ach.apparatus}</Text>
                  </View>
                  <View
                    className="rounded-full px-2.5 py-1"
                    style={{ backgroundColor: ach.status === "competition_ready" ? "#F0FDF4" : "#FDF6E3" }}
                  >
                    <Text
                      className="text-[9px] font-black uppercase"
                      style={{ color: ach.status === "competition_ready" ? "#16A34A" : "#D4A843" }}
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
        <ReportSection title="Competition Exposure" icon={<Trophy size={17} color="#D4A843" />} accentColor="#D4A843">
          <View className="flex-row items-center justify-between mb-3 rounded-xl bg-[#F8F8F6] px-4 py-3">
            <Text className="font-black text-sm text-[#888888]">Total Meets Logged</Text>
            <Text className="text-2xl font-black text-[#D4A843]">{meets?.length ?? 0}</Text>
          </View>
          {meets?.[0] && (
            <View className="rounded-xl border border-[#FDF6E3] bg-[#FFFDF5] p-3">
              <Text className="text-[10px] font-black uppercase text-[#D4A843] mb-1">Latest Competition</Text>
              <Text className="font-black text-[#1A1A1A]">{meets[0].name}</Text>
              <Text className="text-xs text-[#888888]">{meets[0].date}</Text>
              {(meets[0].vaultScore || meets[0].barsScore || meets[0].beamScore || meets[0].floorScore) && (
                <Text className="text-xs text-[#888888] mt-1">
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
          className="mb-20 mt-2 overflow-hidden rounded-2xl bg-[#D4A843] py-4 flex-row items-center justify-center gap-3"
        >
          <Download size={20} color="#1A1A1A" />
          <Text className="font-black text-[#1A1A1A] text-base">Download Medical-Grade PDF</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843] mb-3">{label}</Text>
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
  return (
    <View className="mb-5">
      <View className="flex-row items-center gap-2 mb-3">
        {icon}
        <Text className="font-black text-base text-[#1A1A1A]">{title}</Text>
        <View className="flex-1 h-px ml-1 bg-[#E8E8E8]" />
      </View>
      <View className="rounded-2xl bg-white p-4" style={[SHADOW, { borderLeftWidth: 3, borderLeftColor: accentColor }]}>
        {children}
      </View>
    </View>
  );
}

function ReadingStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View className="items-center">
      <Text className="text-[10px] font-black uppercase text-[#888888] mb-1">{label}</Text>
      <Text className="text-xl font-black" style={{ color }}>{value}</Text>
    </View>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1">
      <Text className="text-[10px] font-black uppercase text-[#888888] mb-1">{label}</Text>
      <Text className="text-sm font-black text-[#1A1A1A]" numberOfLines={1}>{value}</Text>
    </View>
  );
}

function PrivacyPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View className="flex-row items-center gap-1 rounded-full border border-[#16A34A]/30 bg-[#F0FDF4] px-2.5 py-1">
      {icon}
      <Text className="text-[10px] font-black uppercase text-[#16A34A]">{label}</Text>
    </View>
  );
}
