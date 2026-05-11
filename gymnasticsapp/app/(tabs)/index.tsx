import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { api, useAuthActions, useMutation, useQuery } from "@/lib/demoData";
import { Text, SafeAreaView, Spinner, Input } from "@/components/ui";
import { Trophy, ChevronRight, Heart, LogOut, PlayCircle, Upload } from "lucide-react-native";

const SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 8,
  elevation: 3,
};

export default function Dashboard() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const user = useQuery(api.gymnasts.currentUser);

  if (gymnast === undefined || user === undefined) {
    return <View className="flex-1 items-center justify-center bg-white"><Spinner /></View>;
  }

  if (gymnast === null) {
    return <CreateGymnastView user={user} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* ── Nav Bar ── */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#E8E8E8] bg-white">
        <View>
          <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843]">AeroVault</Text>
          <Text className="text-xl font-black text-[#1A1A1A]">{gymnast.name}</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1.5 rounded-full bg-[#FDF6E3] px-3 py-1.5">
            <Text className="text-sm">🪙</Text>
            <Text className="text-xs font-black text-[#D4A843]">420</Text>
          </View>
          <Pressable onPress={() => signOut()} className="h-10 w-10 items-center justify-center rounded-full bg-[#F0F0EE]">
            <LogOut size={17} color="#555555" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View className="bg-[#1A1A2E] px-5 pt-8 pb-8">
          <View className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#D4A843]/10" />
          <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843] mb-2">
            Path to Podium
          </Text>
          <Text className="text-[32px] font-black leading-tight text-white mb-3">
            Quest Arc:{"\n"}Kip Breakthrough
          </Text>
          <Text className="text-sm leading-5 text-[#9999BB] mb-5">
            {gymnast.name} is 68% through this week's bars arc. Next mission: connect cast, kip, and back hip circle with clean lines.
          </Text>
          <View className="h-2.5 overflow-hidden rounded-full bg-white/10 mb-6">
            <View className="h-full w-[68%] rounded-full bg-[#D4A843]" />
          </View>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => router.push("/skill-roadmap")}
              className="flex-1 items-center rounded-xl bg-[#D4A843] py-3.5"
            >
              <Text className="font-black text-[#1A1A1A]">Open Podium Map</Text>
            </Pressable>
            <Pressable
              className="items-center rounded-xl border border-white/20 px-5 py-3.5"
            >
              <Text className="font-black text-white">Badges</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Trust Badges ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="border-b border-[#E8E8E8]"
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
        >
          {[
            { emoji: "🏅", label: gymnast.level },
            { emoji: "🏋️", label: gymnast.club },
            { emoji: "⭐", label: "4 Badges Earned" },
            { emoji: "✅", label: "Competition Ready" },
            { emoji: "📅", label: "Active Season" },
          ].map((b) => (
            <View key={b.label} className="flex-row items-center gap-1.5 rounded-full border border-[#E8E8E8] bg-[#F8F8F6] px-3 py-1.5">
              <Text style={{ fontSize: 13 }}>{b.emoji}</Text>
              <Text className="text-xs font-bold text-[#555555]">{b.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── Stats Row ── */}
        <View className="flex-row border-b border-[#E8E8E8] bg-[#F8F8F6]">
          <StatCell value="+14%" label="Control Growth" color="#27AE60" />
          <View className="w-px bg-[#E8E8E8]" />
          <StatCell value="98" label="Safety Index" color="#2980B9" />
          <View className="w-px bg-[#E8E8E8]" />
          <StatCell value="4" label="Mastery Badges" color="#D4A843" />
        </View>

        {/* ── Epic Moment Reel ── */}
        <View className="px-4 pt-6 pb-2">
          <EpicMomentCard gymnastId={gymnast._id} onViewAll={() => router.push("/epic-moment")} />
        </View>

        {/* ── Achievement Snapshot ── */}
        <View className="px-4 pt-4 pb-2">
          <SectionHeader label="Recent Achievements" />
          <AchievementList gymnastId={gymnast._id} />
        </View>

        {/* ── Wellness Snapshot ── */}
        <View className="px-4 pt-4 pb-2">
          <WellnessCard gymnastId={gymnast._id} />
        </View>

        {/* ── Feature Grid ── */}
        <View className="bg-[#F8F8F6] mt-4 px-4 pt-6 pb-4">
          <SectionHeader label="Your Training Hub" />
          <View className="flex-row flex-wrap gap-3">
            <FeatureCard icon="🎓" title="Parent Academy" detail="Mindset scripts for tough moments" onPress={() => router.push("/parent-academy")} />
            <FeatureCard icon="🏆" title="Meet Journal" detail="Scores, wins & confidence notes" onPress={() => router.push("/meet-journal")} />
            <FeatureCard icon="📅" title="Training Calendar" detail="Practices, meets & reminders" onPress={() => router.push("/calendar")} />
            <FeatureCard icon="💪" title="Recovery Lab" detail="Flexibility, fuel & focus" onPress={() => router.push("/recovery-lab")} />
            <FeatureCard icon="🤝" title="Coach Connection" detail="Goals & shared feedback" onPress={() => router.push("/coach-connection")} />
            <FeatureCard icon="📄" title="Health Report" detail="Privacy-first provider export" onPress={() => router.push("/export-reports")} />
          </View>
        </View>

        <View className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function StatCell({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View className="flex-1 items-center py-4">
      <Text className="text-2xl font-black" style={{ color }}>{value}</Text>
      <Text className="text-[10px] font-bold uppercase text-[#999999] mt-0.5 text-center">{label}</Text>
    </View>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-3 mb-4">
      <Text className="text-lg font-black text-[#1A1A1A]">{label}</Text>
      <View className="flex-1 h-px bg-[#E8E8E8]" />
    </View>
  );
}

function FeatureCard({ icon, title, detail, onPress }: { icon: string; title: string; detail: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 min-w-[44%] rounded-2xl bg-white p-4"
      style={SHADOW}
    >
      <Text style={{ fontSize: 26, marginBottom: 8 }}>{icon}</Text>
      <Text className="font-black text-[#1A1A1A] text-sm mb-1">{title}</Text>
      <Text className="text-xs text-[#999999] leading-4">{detail}</Text>
      <View className="flex-row items-center gap-1 mt-3">
        <Text className="text-[10px] font-black uppercase text-[#D4A843]">Open</Text>
        <ChevronRight size={10} color="#D4A843" />
      </View>
    </Pressable>
  );
}

function EpicMomentCard({ gymnastId, onViewAll }: { gymnastId: any; onViewAll: () => void }) {
  const reels = useQuery(api.gymnasts.getReels, { gymnastId });
  const addReel = useMutation(api.gymnasts.addReel);
  const [uploading, setUploading] = useState(false);
  const latestReel = reels?.[0] ?? null;

  const handleQuickUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Allow photo library access to upload a reel.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 60,
    });
    if (result.canceled || !result.assets?.[0]) return;
    setUploading(true);
    try {
      await addReel({ gymnastId, uri: result.assets[0].uri, title: "Epic Moment" });
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="overflow-hidden rounded-2xl bg-[#1A1A2E]" style={SHADOW}>
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <PlayCircle size={18} color="#D4A843" />
            <Text className="font-black text-white">Epic Moment Reel</Text>
          </View>
          <View className="rounded-full bg-[#D4A843]/20 px-2.5 py-1">
            <Text className="text-[10px] font-black uppercase text-[#D4A843]">
              {reels?.length ?? 0} clip{(reels?.length ?? 0) !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        <View className="aspect-video items-center justify-center overflow-hidden rounded-xl bg-white/5 border border-white/10">
          {latestReel ? (
            <>
              <View className="h-14 w-14 items-center justify-center rounded-full bg-[#D4A843]/20">
                <PlayCircle size={32} color="#D4A843" />
              </View>
              <Text className="mt-2 text-xs font-bold uppercase tracking-widest text-[#9999BB]">{latestReel.title}</Text>
            </>
          ) : (
            <>
              <View className="h-14 w-14 items-center justify-center rounded-full bg-white/10">
                <Upload size={24} color="#9999BB" />
              </View>
              <Text className="mt-2 text-xs font-bold uppercase tracking-widest text-[#9999BB]">No clips yet</Text>
            </>
          )}
        </View>

        <View className="mt-3 flex-row gap-2">
          <Pressable
            onPress={handleQuickUpload}
            disabled={uploading}
            className="flex-1 items-center rounded-xl border border-white/20 py-3"
          >
            {uploading ? <Spinner /> : <Text className="text-xs font-black text-white">+ Add Clip</Text>}
          </Pressable>
          <Pressable
            onPress={onViewAll}
            className="flex-1 items-center rounded-xl bg-[#D4A843] py-3"
          >
            <Text className="text-xs font-black text-[#1A1A1A]">View Vault</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function AchievementList({ gymnastId }: { gymnastId: any }) {
  const achievements = useQuery(api.gymnasts.getAchievements, { gymnastId });
  if (!achievements) return <Spinner />;

  return (
    <View className="gap-3">
      {achievements.slice(0, 2).map((ach: any) => (
        <View key={ach._id} className="flex-row items-center gap-3 rounded-2xl bg-white p-4" style={SHADOW}>
          <View className={`h-11 w-11 items-center justify-center rounded-xl ${getApparatusColor(ach.apparatus)}`}>
            <Trophy size={18} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="font-black text-[#1A1A1A]">{ach.skillName}</Text>
            <Text className="text-xs text-[#999999]">{ach.apparatus} · Quest Badge</Text>
          </View>
          <View className={`rounded-full px-2.5 py-1 ${ach.status === "competition_ready" ? "bg-[#FDF6E3]" : "bg-[#F0F0EE]"}`}>
            <Text className={`text-[10px] font-black uppercase ${ach.status === "competition_ready" ? "text-[#D4A843]" : "text-[#555555]"}`}>
              {ach.status.replace("_", " ")}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function WellnessCard({ gymnastId }: { gymnastId: any }) {
  const router = useRouter();
  const wellness = useQuery(api.gymnasts.getLatestWellness, { gymnastId });

  return (
    <View className="overflow-hidden rounded-2xl bg-white" style={SHADOW}>
      <View className="border-b border-[#E8E8E8] px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Heart size={16} color="#27AE60" />
          <Text className="font-black text-[#1A1A1A]">Scout Snapshot</Text>
        </View>
        <Text className="text-xs font-bold text-[#27AE60] uppercase">Today</Text>
      </View>
      <View className="p-4">
        {wellness ? (
          <View className="flex-row justify-around mb-3">
            {[
              { label: "Energy", val: wellness.energy, color: "#2980B9" },
              { label: "Soreness", val: wellness.soreness, color: "#C0392B" },
              { label: "Mood", val: wellness.mood, color: "#D4A843" },
            ].map((m) => (
              <View key={m.label} className="items-center">
                <Text className="text-2xl font-black" style={{ color: m.color }}>{m.val}<Text className="text-sm text-[#999999]">/5</Text></Text>
                <Text className="text-[10px] font-bold uppercase text-[#999999] mt-0.5">{m.label}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-sm italic text-[#999999] mb-3">No check-in today yet.</Text>
        )}
        <Pressable
          onPress={() => router.push("/wellness-checkin")}
          className="flex-row items-center justify-center gap-2 rounded-xl border border-[#E8E8E8] py-3"
        >
          <Text className="text-sm font-black text-[#555555]">Update Recovery Stats</Text>
          <ChevronRight size={14} color="#555555" />
        </Pressable>
      </View>
    </View>
  );
}

function getApparatusColor(apparatus: string) {
  switch (apparatus) {
    case "Vault": return "bg-orange-500";
    case "Bars":  return "bg-blue-500";
    case "Beam":  return "bg-purple-500";
    case "Floor": return "bg-green-500";
    default:      return "bg-slate-400";
  }
}

function CreateGymnastView({ user }: { user: any }) {
  const createGymnast = useMutation(api.gymnasts.createGymnast);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [club, setClub] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !level || !club) return;
    setLoading(true);
    try { await createGymnast({ name, level, club }); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView className="flex-1 px-5 py-10" keyboardShouldPersistTaps="handled">
          <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843] mb-2">Welcome</Text>
          <Text className="text-3xl font-black text-[#1A1A1A] mb-2">{user?.username ?? "Gym Parent"}!</Text>
          <Text className="text-[#999999] mb-8 leading-5">Create your gymnast's profile to unlock the full AeroVault experience.</Text>

          <View className="gap-4 mb-6">
            {[
              { label: "Gymnast Name", key: "name", placeholder: "e.g. Maya", val: name, set: setName },
              { label: "Current Level", key: "level", placeholder: "e.g. Level 4", val: level, set: setLevel },
              { label: "Gym / Club Name", key: "club", placeholder: "e.g. Summit Gymnastics", val: club, set: setClub },
            ].map((f) => (
              <View key={f.key}>
                <Text className="text-xs font-black uppercase text-[#555555] mb-1.5">{f.label}</Text>
                <View className="overflow-hidden rounded-xl border border-[#E8E8E8] bg-[#F8F8F6]">
                  <Input
                    placeholder={f.placeholder}
                    value={f.val}
                    onChangeText={f.set}
                    className="border-0 bg-transparent px-4 py-3.5 text-[#1A1A1A]"
                    placeholderTextColor="#BBBBBB"
                  />
                </View>
              </View>
            ))}
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            className="items-center rounded-xl bg-[#D4A843] py-4"
          >
            {loading ? <Spinner /> : <Text className="font-black text-[#1A1A1A]">Create Profile</Text>}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
