import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { api, useAuthActions, useMutation, useQuery } from "@/lib/demoData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Text,
  Button,
  SafeAreaView,
  Badge,
  Spinner,
  Input,
} from "@/components/ui";
import { 
  Trophy,
  ShieldCheck,
  Activity,
  ChevronRight,
  Heart,
  GraduationCap,
  Users,
  FileText,
  Calendar as CalendarIcon,
  LogOut,
  Medal,
  PlayCircle,
  Lock,
  Map,
  Sparkles,
  TrendingUp,
  Award,
  Upload,
  Plus,
} from "lucide-react-native";

export default function Dashboard() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const user = useQuery(api.gymnasts.currentUser);

  if (gymnast === undefined || user === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Spinner size="large" />
      </View>
    );
  }

  if (gymnast === null) {
    return <CreateGymnastView user={user} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#061528]" edges={["top"]}>
      <ScrollView className="flex-1 px-4 py-6" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center gap-3">
            <View className="h-11 w-11 items-center justify-center rounded-full border border-[#F6C453]/50 bg-[#F6C453]/20">
              <Sparkles size={22} color="#F6C453" />
            </View>
            <View>
              <Text className="text-[11px] font-bold uppercase tracking-widest text-[#8FE7FF]">AeroVault Command</Text>
              <Text variant="h2" className="text-[#F8FAFC]">Maya Mission Control</Text>
            </View>
          </View>
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-full border-[#F6C453]/30 bg-[#0B1F3D]" onPress={() => signOut()}>
            <LogOut size={19} color="#F8FAFC" />
          </Button>
        </View>

        <View className="mb-5 overflow-hidden rounded-[26px] border border-[#F6C453]/30 bg-[#0B1F3D]">
          <View className="absolute right-[-42px] top-[-42px] h-36 w-36 rounded-full bg-[#F6C453]/20" />
          <View className="absolute bottom-[-52px] left-[-34px] h-32 w-32 rounded-full bg-[#8FE7FF]/10" />
          <View className="p-5">
            <View className="mb-5 flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="mb-1 text-[11px] font-bold uppercase tracking-widest text-[#F6C453]">Path to Podium</Text>
                <Text className="text-3xl font-black leading-9 text-[#F8FAFC]">Quest Arc: Kip Breakthrough</Text>
                <Text className="mt-2 text-sm leading-5 text-[#C7D2FE]">
                  {gymnast.name} is 68% through this week&apos;s bars arc. Next mission: connect cast, kip, and back hip circle with clean lines.
                </Text>
              </View>
              <View className="items-center rounded-2xl border border-[#F6C453]/30 bg-[#F6C453]/15 px-3 py-2">
                <Text className="text-2xl font-black text-[#F6C453]">420</Text>
                <Text className="text-[10px] font-bold uppercase text-[#F8FAFC]">Aero-Coins</Text>
              </View>
            </View>

            <View className="mb-5 h-3 overflow-hidden rounded-full bg-[#152B52]">
              <View className="h-full w-[68%] rounded-full bg-[#F6C453]" />
            </View>

            <View className="flex-row gap-3">
              <QuestNode label="Cast" state="Cleared" tone="gold" />
              <QuestNode label="Kip" state="In Quest" tone="cyan" />
              <QuestNode label="Connect" state="Locked" tone="pink" />
            </View>

            <Button className="mt-5 flex-row gap-2 bg-[#F6C453]" size="lg" onPress={() => router.push("/skill-roadmap")}>
              <Map size={19} color="#061528" />
              <Text className="font-black text-[#061528]">Open Podium Map</Text>
            </Button>
          </View>
        </View>

        <View className="mb-5 flex-row gap-3">
          <ScoutMetric icon={<TrendingUp size={18} color="#8FE7FF" />} value="+14%" label="Control Growth" />
          <ScoutMetric icon={<ShieldCheck size={18} color="#65F4A3" />} value="98" label="Safety Index" />
          <ScoutMetric icon={<Medal size={18} color="#F6C453" />} value="4" label="Mastery Badges" />
        </View>

        <EpicMomentCard gymnastId={gymnast._id} onViewAll={() => router.push("/epic-moment")} />

        <View className="mb-4 flex-row items-center justify-between px-1">
          <Text variant="h3" className="text-[#F8FAFC]">Badge Vault</Text>
          <Text className="text-xs font-bold uppercase text-[#8FE7FF]">Virtual Chalk earned</Text>
        </View>
        <AchievementList gymnastId={gymnast._id} />

        <Text variant="h3" className="mb-4 mt-8 px-1 text-[#F8FAFC]">Scout Dashboard</Text>
        <WellnessCard gymnastId={gymnast._id} />

        <View className="mb-28 mt-8 gap-3">
          <MissionCard icon={<GraduationCap size={22} color="#F6C453" />} title="Parent Academy" detail="Olympian-style scripts for tough practices." onPress={() => router.push("/parent-academy")} />
          <MissionCard icon={<Trophy size={22} color="#F6C453" />} title="Meet Journal" detail="Scores plus personal wins and confidence notes." onPress={() => router.push("/meet-journal")} />
          <MissionCard icon={<CalendarIcon size={22} color="#8FE7FF" />} title="Training Calendar" detail="Practices, meets, reminders, and recovery windows." onPress={() => router.push("/calendar")} />
          <MissionCard icon={<Activity size={22} color="#65F4A3" />} title="Recovery Lab" detail="Flexibility, fuel, soreness, and low-impact work." onPress={() => router.push("/recovery-lab")} />
          <MissionCard icon={<Users size={22} color="#F472B6" />} title="Coach Connection" detail="Goals, talking points, and shared feedback." onPress={() => router.push("/coach-connection")} />
          <MissionCard icon={<FileText size={22} color="#F8FAFC" />} title="Fort Knox Report" detail="Privacy-first export for providers and coaches." onPress={() => router.push("/export-reports")} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuestNode({ label, state, tone }: { label: string; state: string; tone: "gold" | "cyan" | "pink" }) {
  const color = tone === "gold" ? "#F6C453" : tone === "cyan" ? "#8FE7FF" : "#F472B6";

  return (
    <View className="flex-1 rounded-2xl border border-white/10 bg-[#061528]/70 p-3">
      <View className="mb-2 h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${color}26` }}>
        {state === "Locked" ? <Lock size={15} color={color} /> : <Award size={15} color={color} />}
      </View>
      <Text className="font-black text-[#F8FAFC]">{label}</Text>
      <Text className="text-[10px] font-bold uppercase" style={{ color }}>{state}</Text>
    </View>
  );
}

function ScoutMetric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <View className="flex-1 rounded-2xl border border-white/10 bg-[#0A1B33] p-3">
      <View className="mb-2">{icon}</View>
      <Text className="text-2xl font-black text-[#F8FAFC]">{value}</Text>
      <Text className="text-[10px] font-bold uppercase text-[#94A3B8]">{label}</Text>
    </View>
  );
}

function MissionCard({ icon, title, detail, onPress }: { icon: React.ReactNode; title: string; detail: string; onPress: () => void }) {
  return (
    <Button variant="ghost" className="h-auto flex-row items-center justify-between rounded-2xl border border-white/10 bg-[#0A1B33] p-4" onPress={onPress}>
      <View className="flex-1 flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-[#061528]">{icon}</View>
        <View className="flex-1">
          <Text className="font-black text-[#F8FAFC]">{title}</Text>
          <Text className="text-xs leading-4 text-[#94A3B8]">{detail}</Text>
        </View>
      </View>
      <ChevronRight size={18} color="#8FE7FF" />
    </Button>
  );
}

function AchievementList({ gymnastId }: { gymnastId: any }) {
  const achievements = useQuery(api.gymnasts.getAchievements, { gymnastId });

  if (!achievements) return <Spinner />;

  return (
    <View className="gap-3">
      {achievements.slice(0, 2).map((ach: any) => (
        <Card key={ach._id} className="border-[#F6C453]/20 bg-[#0A1B33]">
          <CardContent className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-4">
              <View className={`rounded-full p-2 ${getApparatusColor(ach.apparatus)}`}>
                <Trophy size={17} color="#FFFFFF" />
              </View>
              <View>
                <Text className="font-black text-[#F8FAFC]">{ach.skillName}</Text>
                <Text className="text-xs text-[#94A3B8]">{ach.apparatus} Quest Badge</Text>
              </View>
            </View>
            <Badge className={ach.status === 'competition_ready' ? 'border-[#F6C453]/30 bg-[#F6C453]/15' : 'border-[#8FE7FF]/30 bg-[#8FE7FF]/15'}>
              <Text className={ach.status === 'competition_ready' ? 'text-[10px] font-bold uppercase text-[#F6C453]' : 'text-[10px] font-bold uppercase text-[#8FE7FF]'}>
                {ach.status.replace('_', ' ')}
              </Text>
            </Badge>
          </CardContent>
        </Card>
      ))}
    </View>
  );
}

function WellnessCard({ gymnastId }: { gymnastId: any }) {
  const router = useRouter();
  const wellness = useQuery(api.gymnasts.getLatestWellness, { gymnastId });

  return (
    <Card className="border-[#65F4A3]/20 bg-[#0A1B33]">
      <CardContent className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row gap-2 items-center">
            <Heart size={20} color="#65F4A3" />
            <Text className="text-lg font-black text-[#F8FAFC]">Parent Scout Snapshot</Text>
          </View>
          <Text className="text-xs font-bold uppercase text-[#65F4A3]">Today</Text>
        </View>
        
        {wellness ? (
          <View className="flex-row justify-between px-2">
            <View className="items-center">
              <Text className="text-[10px] font-bold uppercase text-[#94A3B8]">Energy</Text>
              <Text className="text-lg font-black text-[#F8FAFC]">{wellness.energy}/5</Text>
            </View>
            <View className="items-center">
              <Text className="text-[10px] font-bold uppercase text-[#94A3B8]">Soreness</Text>
              <Text className="text-lg font-black text-[#F8FAFC]">{wellness.soreness}/5</Text>
            </View>
            <View className="items-center">
              <Text className="text-[10px] font-bold uppercase text-[#94A3B8]">Mood</Text>
              <Text className="text-lg font-black text-[#F8FAFC]">{wellness.mood}/5</Text>
            </View>
          </View>
        ) : (
          <Text className="italic text-[#94A3B8]">No wellness log for today yet.</Text>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-4 flex-row justify-between p-0"
          onPress={() => router.push("/wellness-checkin")}
        >
          <Text className="font-bold text-[#65F4A3]">Update Recovery Stats</Text>
          <ChevronRight size={16} color="#65F4A3" />
        </Button>
      </CardContent>
    </Card>
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
    <View className="mb-5 overflow-hidden rounded-2xl border border-[#8FE7FF]/20 bg-[#0A1B33] p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <PlayCircle size={20} color="#8FE7FF" />
          <Text className="font-black text-[#F8FAFC]">Epic Moment Reel</Text>
        </View>
        <Badge className="border-[#F6C453]/30 bg-[#F6C453]/15">
          <Text className="text-[10px] font-bold uppercase text-[#F6C453]">
            {reels?.length ?? 0} clip{(reels?.length ?? 0) !== 1 ? "s" : ""}
          </Text>
        </Badge>
      </View>

      {latestReel ? (
        <View className="aspect-video items-center justify-center overflow-hidden rounded-2xl border border-[#F6C453]/20 bg-[#111827]">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-[#F6C453]/20">
            <PlayCircle size={38} color="#F6C453" />
          </View>
          <Text className="mt-3 text-xs font-bold uppercase tracking-widest text-[#C7D2FE]">
            {latestReel.title}
          </Text>
        </View>
      ) : (
        <View className="aspect-video items-center justify-center rounded-2xl border border-dashed border-[#8FE7FF]/30 bg-[#061528]">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-[#8FE7FF]/10">
            <Upload size={26} color="#8FE7FF" />
          </View>
          <Text className="mt-3 text-xs font-bold uppercase tracking-widest text-[#94A3B8]">
            No clips yet
          </Text>
        </View>
      )}

      <View className="mt-3 flex-row gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 flex-row gap-1.5 rounded-xl border border-[#8FE7FF]/20 bg-[#8FE7FF]/10"
          onPress={handleQuickUpload}
          disabled={uploading}
        >
          {uploading ? <Spinner /> : <Plus size={14} color="#8FE7FF" />}
          <Text className="text-xs font-black text-[#8FE7FF]">{uploading ? "Uploading..." : "Add Clip"}</Text>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 flex-row gap-1.5 rounded-xl border border-[#F6C453]/20 bg-[#F6C453]/10"
          onPress={onViewAll}
        >
          <PlayCircle size={14} color="#F6C453" />
          <Text className="text-xs font-black text-[#F6C453]">View Vault</Text>
        </Button>
      </View>
    </View>
  );
}

function getApparatusColor(apparatus: string) {
  switch (apparatus) {
    case "Vault": return "bg-orange-500";
    case "Bars": return "bg-blue-500";
    case "Beam": return "bg-purple-500";
    case "Floor": return "bg-green-500";
    default: return "bg-slate-500";
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
    try {
      await createGymnast({ name, level, club });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#061528]" edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView className="flex-1 px-6 py-10" keyboardShouldPersistTaps="handled">
      <Text variant="h1" className="text-3xl mb-2 text-[#F8FAFC]">Welcome, {user?.username ?? "Gym Parent"}!</Text>
      <Text className="text-[#94A3B8] mb-8">Create a gymnast profile to get started.</Text>
      
      <Card>
        <CardHeader>
          <CardTitle>Gymnast Profile</CardTitle>
          <CardDescription>Enter gymnast details.</CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          <View>
            <Text className="mb-2 font-medium">Gymnast Name</Text>
            <Input placeholder="e.g. Maya" value={name} onChangeText={setName} />
          </View>
          <View>
            <Text className="mb-2 font-medium">Current Level</Text>
            <Input placeholder="e.g. Level 4" value={level} onChangeText={setLevel} />
          </View>
          <View>
            <Text className="mb-2 font-medium">Gym/Club Name</Text>
            <Input placeholder="e.g. Elite Gymnastics" value={club} onChangeText={setClub} />
          </View>
          
          <Button className="mt-4" onPress={handleSubmit} disabled={loading}>
            {loading ? <Spinner /> : <Text className="text-primary-foreground font-bold">Create Profile</Text>}
          </Button>
        </CardContent>
      </Card>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
