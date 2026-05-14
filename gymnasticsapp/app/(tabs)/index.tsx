"use client";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View,
} from "react-native";
import { useRouter } from "expo-router";
import { api, useAuthActions, useMutation, useQuery } from "@/lib/demoData";
import { Text, SafeAreaView, Spinner, Input } from "@/components/ui";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import {
  ArrowRight, Building2, CalendarCheck, CalendarDays,
  ChevronRight, Coins, Dumbbell, FileText, GraduationCap,
  Handshake, Heart, LogOut, Map, Medal, Moon, PlayCircle,
  Star, Sun, Trophy, Upload,
} from "lucide-react-native";
import { useAppTheme } from "@/lib/appTheme";
import { AppColors } from "@/lib/appTheme";
import Animated, {
  useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { GoldThread } from "@/components/cinematic/GoldThread";
import { GoldOrb } from "@/components/cinematic/GoldOrb";
import { Entrance } from "@/components/cinematic/Entrance";

export default function Dashboard() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const user = useQuery(api.gymnasts.currentUser);
  const { colors, isDark, toggleTheme } = useAppTheme();

  if (gymnast === undefined || user === undefined) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <Spinner />
      </View>
    );
  }

  if (gymnast === null) return <CreateGymnastView user={user} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      {/* ── Nav Bar ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.bg,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "900",
              letterSpacing: 3,
              textTransform: "uppercase",
              color: colors.gold,
            }}
          >
            The Ascent
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "900", color: colors.text, letterSpacing: -0.5 }}>
            {gymnast.name}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {/* Quest Power pill */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderRadius: 99,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: colors.goldBg,
              borderWidth: 1,
              borderColor: colors.gold + "30",
            }}
          >
            <Coins size={12} color={colors.gold} />
            <Text style={{ fontSize: 11, fontWeight: "900", color: colors.gold }}>420</Text>
          </View>

          <Pressable
            onPress={toggleTheme}
            accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
            accessibilityRole="button"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={{
              height: 40, width: 40, alignItems: "center", justifyContent: "center",
              borderRadius: 20, backgroundColor: colors.backBtnBg,
            }}
          >
            {isDark
              ? <Sun size={16} color={colors.backBtnIcon} />
              : <Moon size={16} color={colors.backBtnIcon} />}
          </Pressable>

          <Pressable
            onPress={() => signOut()}
            accessibilityLabel="Sign out"
            accessibilityRole="button"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={{
              height: 40, width: 40, alignItems: "center", justifyContent: "center",
              borderRadius: 20, backgroundColor: colors.backBtnBg,
            }}
          >
            <LogOut size={16} color={colors.backBtnIcon} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Cinematic Hero ── */}
        <View style={{ backgroundColor: colors.hero, paddingHorizontal: 20, paddingTop: 28, paddingBottom: 28, overflow: "hidden" }}>
          {/* Animated pulsing gold orbs */}
          <GoldOrb size={240} color={colors.goldGlow} style={{ top: -60, right: -60 }} delay={0} duration={3500} />
          <GoldOrb size={140} color="rgba(212,175,55,0.06)" style={{ bottom: -30, left: 20 }} delay={800} duration={4200} />
          <GoldOrb size={70} color="rgba(212,175,55,0.09)" style={{ top: 55, left: -15 }} delay={1600} duration={5000} />

          {/* Gold thread SVG — draws itself on load */}
          <GoldThread />

          {/* Eyebrow pill */}
          <Entrance delay={200}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginBottom: 14,
                alignSelf: "flex-start",
                borderRadius: 99,
                borderWidth: 1,
                borderColor: colors.gold + "30",
                paddingHorizontal: 12,
                paddingVertical: 5,
                backgroundColor: colors.goldBg,
              }}
            >
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: colors.gold }} />
              <Text style={{ fontSize: 9, fontWeight: "900", letterSpacing: 2, textTransform: "uppercase", color: colors.gold }}>
                Active Quest Arc
              </Text>
            </View>
          </Entrance>

          <Entrance delay={340}>
            <Text style={{ fontSize: 30, fontWeight: "900", color: colors.heroText, lineHeight: 34, marginBottom: 10, letterSpacing: -0.5 }}>
              Kip{"\n"}Breakthrough
            </Text>
          </Entrance>

          <Entrance delay={460}>
            <Text style={{ fontSize: 13, lineHeight: 20, color: colors.heroSubtext, marginBottom: 20, maxWidth: 280 }}>
              {gymnast.name} is 68% through this week's bars arc. Next: connect cast, kip, and back hip circle.
            </Text>
          </Entrance>

          {/* Animated progress bar */}
          <Entrance delay={580}>
            <AnimatedProgressBar progress={68} color={colors.gold} />
          </Entrance>

          {/* CTAs */}
          <Entrance delay={700}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <AnimatedPressable
                onPress={() => router.push("/skill-roadmap")}
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                  borderRadius: 12,
                  paddingVertical: 14,
                  backgroundColor: colors.gold,
                }}
              >
                <Text style={{ fontWeight: "900", fontSize: 13, color: "#0A0A0E" }}>Open Quest Map</Text>
                <ArrowRight size={14} color="#0A0A0E" />
              </AnimatedPressable>
              <AnimatedPressable
                style={{
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.15)",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "900", fontSize: 13, color: colors.heroText }}>Badges</Text>
              </AnimatedPressable>
            </View>
          </Entrance>

          {/* Cinematic bottom gradient fade */}
          <LinearGradient
            colors={["transparent", colors.hero]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 36,
              pointerEvents: "none",
            } as any}
          />
        </View>

        {/* ── Trust badges scroll ── */}
        <Entrance delay={80} style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
        >
          {[
            { icon: <Medal size={12} color={colors.gold} />, label: gymnast.level },
            { icon: <Building2 size={12} color={colors.textSecondary} />, label: gymnast.club },
            { icon: <Star size={12} color={colors.gold} />, label: "4 Badges Earned" },
            { icon: <CalendarCheck size={12} color={colors.green} />, label: "Active Season" },
          ].map((b) => (
            <View
              key={b.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                borderRadius: 99,
                borderWidth: 1,
                paddingHorizontal: 12,
                paddingVertical: 7,
                backgroundColor: colors.glass,
                borderColor: colors.border,
              }}
            >
              {b.icon}
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textSecondary }}>{b.label}</Text>
            </View>
          ))}
        </ScrollView>
        </Entrance>

        {/* ── Stats Row ── */}
        <Entrance delay={160}>
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: colors.bgSecondary,
          }}
        >
          <StatCell value="+14%" label="Control Growth" color={colors.green} />
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <StatCell value="98" label="Safety Index" color={colors.blue} />
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <StatCell value="4" label="Mastery Badges" color={colors.gold} />
        </View>
        </Entrance>

        {/* ── Epic Moment ── */}
        <Entrance delay={280}>
        <View style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 }}>
          <EpicMomentCard
            gymnastId={gymnast._id}
            onViewAll={() => router.push("/epic-moment")}
          />
        </View>
        </Entrance>

        {/* ── Recent Achievements ── */}
        <Entrance delay={380}>
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
          <SectionHeader label="Recent Achievements" />
          <AchievementList gymnastId={gymnast._id} />
        </View>
        </Entrance>

        {/* ── Wellness Snapshot ── */}
        <Entrance delay={460}>
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
          <WellnessCard
            gymnastId={gymnast._id}
            onPress={() => router.push("/wellness-checkin")}
          />
        </View>
        </Entrance>

        {/* ── Feature Grid ── */}
        <Entrance delay={540}>
        <View style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16, marginTop: 8 }}>
          <SectionHeader label="Training Hub" />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            <FeatureCard
              icon={<Map size={24} color={colors.gold} />}
              title="Quest Map"
              detail="Skill progression tracker"
              accent={colors.gold}
              onPress={() => router.push("/skill-roadmap")}
            />
            <FeatureCard
              icon={<GraduationCap size={24} color={colors.pink} />}
              title="Parent Academy"
              detail="Mindset scripts for tough moments"
              accent={colors.pink}
              onPress={() => router.push("/parent-academy")}
            />
            <FeatureCard
              icon={<Trophy size={24} color={colors.gold} />}
              title="Meet Journal"
              detail="Scores, wins & notes"
              accent={colors.gold}
              onPress={() => router.push("/meet-journal")}
            />
            <FeatureCard
              icon={<CalendarDays size={24} color={colors.blue} />}
              title="Calendar"
              detail="Practices & meets"
              accent={colors.blue}
              onPress={() => router.push("/calendar")}
            />
            <FeatureCard
              icon={<Dumbbell size={24} color={colors.green} />}
              title="Recovery Lab"
              detail="Flexibility, fuel & focus"
              accent={colors.green}
              onPress={() => router.push("/recovery-lab")}
            />
            <FeatureCard
              icon={<Handshake size={24} color={colors.blue} />}
              title="Coach Connect"
              detail="Goals & shared feedback"
              accent={colors.blue}
              onPress={() => router.push("/coach-connection")}
            />
            <FeatureCard
              icon={<FileText size={24} color={colors.textMuted} />}
              title="Health Report"
              detail="Privacy-first export"
              accent={colors.textMuted}
              onPress={() => router.push("/export-reports")}
            />
          </View>
        </View>
        </Entrance>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function AnimatedProgressBar({ progress, color }: { progress: number; color: string }) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(
      900,
      withTiming(progress, {
        duration: 1400,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      })
    );
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%` as any,
  }));

  return (
    <View style={{ height: 3, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.08)", marginBottom: 20 }}>
      <Animated.View style={[{ height: "100%", borderRadius: 99, backgroundColor: color }, barStyle]} />
    </View>
  );
}

function StatCell({ value, label, color }: { value: string; label: string; color: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={{ flex: 1, alignItems: "center", paddingVertical: 18 }}>
      <Text style={{ fontSize: 26, fontWeight: "900", color, letterSpacing: -1 }}>{value}</Text>
      <Text style={{ fontSize: 9, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginTop: 2, textAlign: "center", color: colors.textMuted }}>
        {label}
      </Text>
    </View>
  );
}

function SectionHeader({ label }: { label: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, color: colors.gold }}>
        {label}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
    </View>
  );
}

function FeatureCard({
  icon, title, detail, accent, onPress,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  accent: string;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <AnimatedPressable
      onPress={onPress}
      style={{
        flex: 1,
        minWidth: "44%",
        backgroundColor: colors.glass,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 16,
        overflow: "hidden",
      }}
    >
      {/* Thin gold accent strip at top */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: accent,
          opacity: 0.5,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      />
      <View style={{ marginBottom: 10, marginTop: 4 }}>{icon}</View>
      <Text style={{ fontWeight: "900", fontSize: 13, color: colors.text, marginBottom: 3 }}>{title}</Text>
      <Text style={{ fontSize: 11, lineHeight: 16, color: colors.textMuted }}>{detail}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 12 }}>
        <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1, color: accent }}>
          Open
        </Text>
        <ChevronRight size={9} color={accent} />
      </View>
    </AnimatedPressable>
  );
}

function EpicMomentCard({
  gymnastId, onViewAll,
}: {
  gymnastId: any;
  onViewAll: () => void;
}) {
  const { colors } = useAppTheme();
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
    <View
      style={{
        overflow: "hidden",
        borderRadius: 20,
        backgroundColor: colors.glass,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <PlayCircle size={17} color={colors.gold} />
            <Text style={{ fontWeight: "900", color: colors.text, fontSize: 14 }}>Cinematic Vault</Text>
          </View>
          <View
            style={{
              borderRadius: 99,
              paddingHorizontal: 10,
              paddingVertical: 4,
              backgroundColor: colors.goldBg,
              borderWidth: 1,
              borderColor: colors.gold + "30",
            }}
          >
            <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", color: colors.gold }}>
              {reels?.length ?? 0} clip{(reels?.length ?? 0) !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        {/* Thumbnail */}
        <View
          style={{
            aspectRatio: 16 / 9,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.hero,
          }}
        >
          {/* Grid overlay */}
          <View
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.04,
            }}
          />
          {latestReel ? (
            <>
              <View
                style={{
                  width: 60,
                  height: 60,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 30,
                  backgroundColor: colors.goldBg,
                }}
              >
                <PlayCircle size={30} color={colors.gold} />
              </View>
              <Text style={{ marginTop: 8, fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5, color: colors.heroSubtext }}>
                {latestReel.title}
              </Text>
            </>
          ) : (
            <>
              <View
                style={{
                  width: 60,
                  height: 60,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 30,
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              >
                <Upload size={22} color={colors.textMuted} />
              </View>
              <Text style={{ marginTop: 8, fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5, color: colors.heroSubtext }}>
                No clips yet
              </Text>
            </>
          )}
        </View>

        <View style={{ marginTop: 12, flexDirection: "row", gap: 10 }}>
          <Pressable
            onPress={handleQuickUpload}
            disabled={uploading}
            style={{
              flex: 1,
              alignItems: "center",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              paddingVertical: 12,
            }}
          >
            {uploading
              ? <Spinner />
              : <Text style={{ fontSize: 12, fontWeight: "900", color: colors.text }}>+ Add Clip</Text>}
          </Pressable>
          <Pressable
            onPress={onViewAll}
            style={{
              flex: 1,
              alignItems: "center",
              borderRadius: 12,
              paddingVertical: 12,
              backgroundColor: colors.gold,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "900", color: "#0A0A0E" }}>Open Vault</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function AchievementList({ gymnastId }: { gymnastId: any }) {
  const { colors } = useAppTheme();
  const achievements = useQuery(api.gymnasts.getAchievements, { gymnastId });
  if (!achievements) return <Spinner />;

  return (
    <View style={{ gap: 10 }}>
      {achievements.slice(0, 2).map((ach: any) => (
        <View
          key={ach._id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            borderRadius: 16,
            padding: 14,
            backgroundColor: colors.glass,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              height: 44,
              width: 44,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              ...getApparatusColor(ach.apparatus, colors),
            }}
          >
            <Trophy size={18} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "900", fontSize: 13, color: colors.text }}>{ach.skillName}</Text>
            <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>
              {ach.apparatus} · Quest Badge
            </Text>
          </View>
          <View
            style={{
              borderRadius: 99,
              paddingHorizontal: 10,
              paddingVertical: 4,
              backgroundColor: ach.status === "competition_ready" ? colors.goldBg : colors.glass,
              borderWidth: 1,
              borderColor: ach.status === "competition_ready" ? colors.gold + "40" : colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: ach.status === "competition_ready" ? colors.gold : colors.textSecondary,
              }}
            >
              {ach.status.replace("_", " ")}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function WellnessCard({
  gymnastId, onPress,
}: {
  gymnastId: any;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  const wellness = useQuery(api.gymnasts.getLatestWellness, { gymnastId });

  return (
    <View
      style={{
        overflow: "hidden",
        borderRadius: 20,
        backgroundColor: colors.glass,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Heart size={15} color={colors.green} />
          <Text style={{ fontWeight: "900", fontSize: 13, color: colors.text }}>Scout Snapshot</Text>
        </View>
        <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1, color: colors.green }}>
          Today
        </Text>
      </View>

      <View style={{ padding: 16 }}>
        {wellness ? (
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 14 }}>
            {[
              { label: "Energy", val: wellness.energy, color: colors.blue },
              { label: "Soreness", val: wellness.soreness, color: colors.red },
              { label: "Mood", val: wellness.mood, color: colors.gold },
            ].map((m) => (
              <View key={m.label} style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 26, fontWeight: "900", color: m.color, letterSpacing: -1 }}>
                  {m.val}
                  <Text style={{ fontSize: 13, color: colors.textMuted }}>/5</Text>
                </Text>
                <Text style={{ fontSize: 9, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2, color: colors.textMuted }}>
                  {m.label}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ fontSize: 13, fontStyle: "italic", marginBottom: 14, color: colors.textMuted }}>
            No check-in today yet.
          </Text>
        )}

        <AnimatedPressable
          onPress={onPress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: 12,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "900", color: colors.textSecondary }}>
            Update Recovery Stats
          </Text>
          <ChevronRight size={13} color={colors.textSecondary} />
        </AnimatedPressable>
      </View>
    </View>
  );
}

function getApparatusColor(apparatus: string, colors: AppColors): { backgroundColor: string } {
  switch (apparatus) {
    case "Vault":  return { backgroundColor: colors.orange };
    case "Bars":   return { backgroundColor: colors.blue };
    case "Beam":   return { backgroundColor: colors.pink };
    case "Floor":  return { backgroundColor: colors.green };
    default:       return { backgroundColor: colors.textMuted };
  }
}

function CreateGymnastView({ user }: { user: any }) {
  const { colors } = useAppTheme();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }} keyboardShouldPersistTaps="handled">
          <Text style={{ fontSize: 9, fontWeight: "900", letterSpacing: 3, textTransform: "uppercase", color: colors.gold, marginBottom: 8 }}>
            Welcome to The Ascent
          </Text>
          <Text style={{ fontSize: 32, fontWeight: "900", color: colors.text, marginBottom: 8, letterSpacing: -0.5 }}>
            {user?.username ?? "Champion"}
          </Text>
          <Text style={{ marginBottom: 36, lineHeight: 22, color: colors.textMuted, fontSize: 14 }}>
            Build your athlete profile to unlock the full Ascent experience.
          </Text>

          <View style={{ gap: 16, marginBottom: 24 }}>
            {[
              { label: "Gymnast Name", placeholder: "e.g. Maya", val: name, set: setName },
              { label: "Current Level", placeholder: "e.g. Level 4", val: level, set: setLevel },
              { label: "Gym / Club", placeholder: "e.g. Summit Gymnastics", val: club, set: setClub },
            ].map((f) => (
              <View key={f.label}>
                <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, color: colors.textSecondary }}>
                  {f.label}
                </Text>
                <View
                  style={{
                    overflow: "hidden",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.glass,
                  }}
                >
                  <Input
                    placeholder={f.placeholder}
                    value={f.val}
                    onChangeText={f.set}
                    style={{ color: colors.text, paddingHorizontal: 16, paddingVertical: 14 }}
                    placeholderTextColor={colors.textDisabled}
                  />
                </View>
              </View>
            ))}
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={{
              alignItems: "center",
              borderRadius: 12,
              paddingVertical: 16,
              backgroundColor: colors.gold,
            }}
          >
            {loading
              ? <Spinner />
              : <Text style={{ fontWeight: "900", fontSize: 15, color: "#0A0A0E" }}>Begin Your Ascent</Text>}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
