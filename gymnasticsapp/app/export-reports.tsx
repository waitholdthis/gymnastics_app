import React from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { api, useQuery } from "@/lib/demoData";
import { Text, SafeAreaView, Spinner, Badge } from "@/components/ui";
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

export default function ExportReports() {
  const router = useRouter();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const wellness = useQuery(api.gymnasts.getLatestWellness, gymnast ? { gymnastId: gymnast._id } : "skip");
  const achievements = useQuery(api.gymnasts.getAchievements, gymnast ? { gymnastId: gymnast._id } : "skip");
  const meets = useQuery(api.gymnasts.getMeets, gymnast ? { gymnastId: gymnast._id } : "skip");

  if (gymnast === undefined)
    return <View className="flex-1 bg-[#061528] items-center justify-center"><Spinner /></View>;
  if (gymnast === null)
    return <View className="flex-1 bg-[#061528] items-center justify-center"><Text className="text-[#F8FAFC]">Gymnast not found</Text></View>;

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
    <SafeAreaView className="flex-1 bg-[#061528]" edges={["top"]}>
      <View className="px-4 pt-6 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#0B1F3D]"
          >
            <ChevronLeft size={22} color="#F8FAFC" />
          </Pressable>
          <View>
            <Text className="text-[11px] font-black uppercase tracking-widest text-[#65F4A3]">Privacy-First</Text>
            <Text className="text-2xl font-black text-[#F8FAFC]">Fort Knox Report</Text>
          </View>
        </View>
        <Pressable
          onPress={handleExport}
          className="h-11 w-11 items-center justify-center rounded-full border border-[#65F4A3]/30 bg-[#65F4A3]/10"
        >
          <Share size={18} color="#65F4A3" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        {/* Privacy Banner */}
        <View className="mb-6 overflow-hidden rounded-[26px] border border-[#65F4A3]/20 bg-[#0B1F3D] p-5">
          <View className="absolute right-[-42px] top-[-42px] h-36 w-36 rounded-full bg-[#65F4A3]/08" />
          <View className="flex-row items-start gap-4">
            <View className="h-14 w-14 items-center justify-center rounded-2xl border border-[#65F4A3]/30 bg-[#061528]">
              <ShieldCheck size={30} color="#65F4A3" />
            </View>
            <View className="flex-1">
              <Text className="text-[11px] font-black uppercase tracking-widest text-[#65F4A3] mb-1">
                Medical-Grade Privacy
              </Text>
              <Text className="text-xl font-black leading-6 text-[#F8FAFC]">
                For Physicians, PTs & Coaches
              </Text>
              <Text className="mt-2 text-xs leading-4 text-[#94A3B8]">
                Watermarked export · Expiring share links · Role-based access · Encrypted in transit
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row gap-2">
            <PrivacyPill icon={<Lock size={10} color="#65F4A3" />} label="Encrypted" />
            <PrivacyPill icon={<ShieldCheck size={10} color="#65F4A3" />} label="Guardian-Approved" />
            <PrivacyPill icon={<FileText size={10} color="#65F4A3" />} label="Audit Logged" />
          </View>
        </View>

        {/* Athlete Summary */}
        <View className="mb-5 rounded-[22px] border border-white/10 bg-[#0A1B33] p-4">
          <Text className="text-[11px] font-black uppercase tracking-widest text-[#8FE7FF] mb-3">Athlete Profile</Text>
          <View className="flex-row gap-4">
            <ProfileStat label="Name" value={gymnast.name} />
            <ProfileStat label="Level" value={gymnast.level} />
            <ProfileStat label="Club" value={gymnast.club} />
          </View>
        </View>

        {/* Workload & Recovery */}
        <ReportSection
          title="Workload & Recovery"
          icon={<Heart size={17} color="#F472B6" />}
          accentColor="#F472B6"
        >
          {wellness ? (
            <>
              <View className="flex-row justify-between mb-4">
                <ReadingStat label="Soreness" value={`${wellness.soreness}/5`} color={wellness.soreness > 3 ? "#F472B6" : "#65F4A3"} />
                <ReadingStat label="Energy" value={`${wellness.energy}/5`} color="#8FE7FF" />
                <ReadingStat label="Mood" value={`${wellness.mood}/5`} color="#F6C453" />
                {readinessScore && (
                  <ReadingStat label="Readiness" value={`${readinessScore}/5`} color={readinessScore >= 4 ? "#65F4A3" : readinessScore >= 3 ? "#F6C453" : "#F472B6"} />
                )}
              </View>
              {wellness.soreness > 3 && (
                <View className="flex-row items-center gap-2 rounded-xl bg-[#F472B6]/10 p-3 mb-3">
                  <AlertTriangle size={14} color="#F472B6" />
                  <Text className="text-xs font-black text-[#F472B6]">High soreness flagged — consider modified training.</Text>
                </View>
              )}
              {wellness.notes && (
                <Text className="text-xs italic leading-4 text-[#94A3B8]">"{wellness.notes}"</Text>
              )}
            </>
          ) : (
            <Text className="text-sm italic text-[#94A3B8]">No recent wellness data logged.</Text>
          )}
        </ReportSection>

        {/* High-Impact Milestones */}
        <ReportSection
          title="High-Impact Milestones"
          icon={<Activity size={17} color="#8FE7FF" />}
          accentColor="#8FE7FF"
        >
          <Text className="text-[10px] font-black uppercase text-[#94A3B8] mb-3">
            Skills achieved — load tracking for provider reference
          </Text>
          <View className="gap-2">
            {achievements?.slice(0, 4).map((ach: any) => (
              <View
                key={ach._id}
                className="flex-row items-center justify-between rounded-xl bg-[#061528] px-4 py-3"
              >
                <Text className="font-black text-sm text-[#F8FAFC]">{ach.skillName}</Text>
                <View className="flex-row items-center gap-2">
                  <Badge className="border-[#8FE7FF]/20 bg-[#8FE7FF]/10">
                    <Text className="text-[10px] font-black uppercase text-[#8FE7FF]">{ach.apparatus}</Text>
                  </Badge>
                  <Badge
                    className={ach.status === "competition_ready"
                      ? "border-[#65F4A3]/20 bg-[#65F4A3]/10"
                      : "border-[#F6C453]/20 bg-[#F6C453]/10"
                    }
                  >
                    <Text
                      className="text-[9px] font-black uppercase"
                      style={{ color: ach.status === "competition_ready" ? "#65F4A3" : "#F6C453" }}
                    >
                      {ach.status.replace("_", " ")}
                    </Text>
                  </Badge>
                </View>
              </View>
            ))}
          </View>
        </ReportSection>

        {/* Competition Exposure */}
        <ReportSection
          title="Competition Exposure"
          icon={<Trophy size={17} color="#F6C453" />}
          accentColor="#F6C453"
        >
          <View className="flex-row items-center justify-between mb-3 rounded-xl bg-[#061528] px-4 py-3">
            <Text className="font-black text-sm text-[#94A3B8]">Total Meets Logged</Text>
            <Text className="text-2xl font-black text-[#F6C453]">{meets?.length ?? 0}</Text>
          </View>
          {meets?.[0] && (
            <View className="rounded-xl border border-[#F6C453]/20 p-3">
              <Text className="text-[10px] font-black uppercase text-[#F6C453] mb-1">Latest Competition</Text>
              <Text className="font-black text-[#F8FAFC]">{meets[0].name}</Text>
              <Text className="text-xs text-[#94A3B8]">{meets[0].date}</Text>
              {(meets[0].vaultScore || meets[0].barsScore || meets[0].beamScore || meets[0].floorScore) && (
                <Text className="text-xs text-[#94A3B8] mt-1">
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
          className="mb-20 mt-2 overflow-hidden rounded-2xl bg-[#65F4A3] py-4 flex-row items-center justify-center gap-3"
        >
          <Download size={20} color="#061528" />
          <Text className="font-black text-[#061528] text-base">Download Medical-Grade PDF</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function ReportSection({
  title,
  icon,
  accentColor,
  children,
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
        <Text className="font-black text-base text-[#F8FAFC]">{title}</Text>
        <View className="flex-1 h-px ml-1" style={{ backgroundColor: `${accentColor}25` }} />
      </View>
      <View
        className="rounded-[22px] bg-[#0A1B33] p-4"
        style={{ borderWidth: 1, borderColor: `${accentColor}25` }}
      >
        {children}
      </View>
    </View>
  );
}

function ReadingStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View className="items-center">
      <Text className="text-[10px] font-black uppercase text-[#94A3B8] mb-1">{label}</Text>
      <Text className="text-xl font-black" style={{ color }}>{value}</Text>
    </View>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1">
      <Text className="text-[10px] font-black uppercase text-[#94A3B8] mb-1">{label}</Text>
      <Text className="text-sm font-black text-[#F8FAFC]" numberOfLines={1}>{value}</Text>
    </View>
  );
}

function PrivacyPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View className="flex-row items-center gap-1 rounded-full border border-[#65F4A3]/20 bg-[#65F4A3]/10 px-2.5 py-1">
      {icon}
      <Text className="text-[10px] font-black uppercase text-[#65F4A3]">{label}</Text>
    </View>
  );
}
