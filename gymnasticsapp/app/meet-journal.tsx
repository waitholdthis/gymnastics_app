import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { api, useMutation, useQuery } from "@/lib/demoData";
import { Text, Input, SafeAreaView, Spinner } from "@/components/ui";
import { useRouter } from "expo-router";
import { Calendar, ChevronLeft, MessageSquare, Plus, Star, Trophy, X } from "lucide-react-native";
import { useAppTheme } from "@/lib/appTheme";
import { Entrance } from "@/components/cinematic/Entrance";

const APPARATUS_COLORS = {
  VT: { color: "#C2500A" },
  UB: { color: "#1D5BB5" },
  BB: { color: "#BE185D" },
  FX: { color: "#16A34A" },
};

export default function MeetJournal() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const meets = useQuery(api.gymnasts.getMeets, gymnast ? { gymnastId: gymnast._id } : "skip");
  const [isAdding, setIsAdding] = useState(false);

  if (gymnast === undefined || (gymnast !== null && meets === undefined))
    return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}><Spinner /></View>;
  if (gymnast === null)
    return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}><Text style={{ color: colors.text }}>Gymnast not found</Text></View>;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.bg }} edges={["top"]}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          borderBottomWidth: 1, borderBottomColor: colors.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              height: 44, width: 44, alignItems: "center", justifyContent: "center",
              borderRadius: 22, backgroundColor: colors.backBtnBg,
            }}
          >
            <ChevronLeft size={22} color={colors.backBtnIcon} />
          </Pressable>
          <View>
            <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, color: colors.gold }}>
              Competition Record
            </Text>
            <Text style={{ fontSize: 24, fontWeight: "900", color: colors.text, letterSpacing: -0.5 }}>
              Meet Journal
            </Text>
          </View>
        </View>
        {!isAdding && (
          <Pressable
            onPress={() => setIsAdding(true)}
            style={{
              height: 44, width: 44, alignItems: "center", justifyContent: "center",
              borderRadius: 22, backgroundColor: colors.gold,
            }}
          >
            <Plus size={20} color="#0A0A0E" />
          </Pressable>
        )}
      </View>

      <Entrance delay={0} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">
          {isAdding ? (
            <AddMeetForm gymnastId={gymnast._id} onCancel={() => setIsAdding(false)} />
          ) : meets?.length === 0 ? (
            <View className="items-center py-24">
              <View className="h-20 w-20 items-center justify-center rounded-full mb-5" style={{ backgroundColor: colors.goldBg }}>
                <Trophy size={40} color={colors.gold} />
              </View>
              <Text className="text-xl font-black mb-2" style={{ color: colors.text }}>No Meets Logged Yet</Text>
              <Text className="text-sm text-center leading-5" style={{ color: colors.textMuted }}>
                Log your first competition to start tracking personal wins and scores.
              </Text>
            </View>
          ) : (
            <View className="gap-5 pb-20">
              {meets?.map((meet: any) => (
                <MeetCard key={meet._id} meet={meet} />
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      </Entrance>
    </SafeAreaView>
  );
}

function MeetCard({ meet }: { meet: any }) {
  const { colors } = useAppTheme();
  const totalScore =
    (meet.vaultScore ?? 0) + (meet.barsScore ?? 0) + (meet.beamScore ?? 0) + (meet.floorScore ?? 0);
  const dateObj = new Date(meet.date);
  const month = dateObj.toLocaleDateString("en-US", { month: "short" });
  const day = dateObj.getDate();

  return (
    <View className="overflow-hidden rounded-2xl" style={[colors.shadow, { backgroundColor: colors.surface }]}>
      {/* Dark top strip */}
      <View className="px-5 py-4 flex-row items-start justify-between" style={{ backgroundColor: colors.hero }}>
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: colors.goldBg }}>
              <Text className="text-[10px] font-black uppercase" style={{ color: colors.gold }}>Competition</Text>
            </View>
          </View>
          <Text className="text-lg font-black" style={{ color: colors.heroText }}>{meet.name}</Text>
          <View className="flex-row items-center gap-1.5 mt-1">
            <Calendar size={11} color={colors.heroSubtext} />
            <Text className="text-[11px]" style={{ color: colors.heroSubtext }}>{meet.date}</Text>
          </View>
        </View>
        <View className="items-center rounded-2xl border border-white/20 px-3 py-2 min-w-[64px]">
          <Text className="text-xs font-bold uppercase" style={{ color: colors.heroSubtext }}>{month} {day}</Text>
          {totalScore > 0 && (
            <>
              <Text className="text-2xl font-black" style={{ color: colors.gold }}>{totalScore.toFixed(2)}</Text>
              <Text className="text-[9px] font-bold uppercase" style={{ color: colors.heroSubtext }}>Total AA</Text>
            </>
          )}
        </View>
      </View>

      <View className="p-4">
        {(meet.vaultScore || meet.barsScore || meet.beamScore || meet.floorScore) && (
          <View className="flex-row gap-2 mb-4">
            <ApparatusScore label="VT" score={meet.vaultScore} />
            <ApparatusScore label="UB" score={meet.barsScore} />
            <ApparatusScore label="BB" score={meet.beamScore} />
            <ApparatusScore label="FX" score={meet.floorScore} />
          </View>
        )}

        <View className="rounded-xl p-4 mb-3" style={{ borderWidth: 1, borderColor: colors.goldBg, backgroundColor: colors.goldBgLight }}>
          <View className="flex-row items-center gap-2 mb-2">
            <Star size={14} color={colors.gold} />
            <Text className="text-[10px] font-black uppercase" style={{ color: colors.gold }}>Personal Wins</Text>
          </View>
          <Text className="text-sm leading-5 italic" style={{ color: colors.textSecondary }}>"{meet.personalWins}"</Text>
        </View>

        {meet.coachFeedback && (
          <View className="flex-row items-start gap-2 px-1">
            <MessageSquare size={13} color={colors.blue} />
            <View className="flex-1">
              <Text className="text-[10px] font-black uppercase mb-1" style={{ color: colors.blue }}>Coach Note</Text>
              <Text className="text-xs leading-4" style={{ color: colors.textMuted }}>{meet.coachFeedback}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function ApparatusScore({ label, score }: { label: string; score?: number }) {
  const { colors } = useAppTheme();
  if (!score) return null;
  const apparatusColor = APPARATUS_COLORS[label as keyof typeof APPARATUS_COLORS]?.color ?? colors.textMuted;
  const apparatusBg = label === "VT" ? colors.orangeBg
    : label === "UB" ? colors.blueBg
    : label === "BB" ? colors.pinkBg
    : label === "FX" ? colors.greenBg
    : colors.bgSecondary;
  return (
    <View className="flex-1 items-center rounded-xl py-2" style={{ backgroundColor: apparatusBg }}>
      <Text className="text-[10px] font-black uppercase" style={{ color: apparatusColor }}>{label}</Text>
      <Text className="text-lg font-black" style={{ color: colors.text }}>{score.toFixed(3)}</Text>
    </View>
  );
}

function AddMeetForm({ gymnastId, onCancel }: { gymnastId: any; onCancel: () => void }) {
  const { colors } = useAppTheme();
  const addMeet = useMutation(api.gymnasts.addMeetEntry);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    vault: "",
    bars: "",
    beam: "",
    floor: "",
    wins: "",
    feedback: "",
  });

  const handleSubmit = async () => {
    if (!form.name || !form.wins) return;
    setLoading(true);
    try {
      await addMeet({
        gymnastId,
        name: form.name,
        date: form.date,
        vaultScore: form.vault ? parseFloat(form.vault) : undefined,
        barsScore: form.bars ? parseFloat(form.bars) : undefined,
        beamScore: form.beam ? parseFloat(form.beam) : undefined,
        floorScore: form.floor ? parseFloat(form.floor) : undefined,
        personalWins: form.wins,
        coachFeedback: form.feedback || undefined,
      });
      onCancel();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="pb-20">
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-xl font-black" style={{ color: colors.text }}>Log New Meet</Text>
        <Pressable onPress={onCancel} className="h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: colors.backBtnBg }}>
          <X size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      <FormSection label="Meet Name">
        <LightInput placeholder="e.g. Spring Invitational" value={form.name} onChangeText={(t: string) => setForm({ ...form, name: t })} />
      </FormSection>

      <FormSection label="Date (YYYY-MM-DD)">
        <LightInput placeholder="2026-05-18" value={form.date} onChangeText={(t: string) => setForm({ ...form, date: t })} />
      </FormSection>

      <FormSection label="Event Scores (optional)">
        <View className="flex-row gap-2">
          {[
            { label: "VT", key: "vault" as const },
            { label: "UB", key: "bars" as const },
            { label: "BB", key: "beam" as const },
            { label: "FX", key: "floor" as const },
          ].map(({ label, key }) => {
            const apparatusColor = APPARATUS_COLORS[label as keyof typeof APPARATUS_COLORS].color;
            return (
              <View key={key} className="flex-1">
                <Text className="text-[10px] font-black uppercase mb-1" style={{ color: apparatusColor }}>{label}</Text>
                <View className="rounded-xl py-2 px-2" style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
                  <Input
                    placeholder="0.000"
                    className="border-0 bg-transparent p-0 text-center text-sm font-bold h-8"
                    style={{ color: colors.text }}
                    keyboardType="numeric"
                    value={form[key]}
                    onChangeText={(t: string) => setForm({ ...form, [key]: t })}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </FormSection>

      <FormSection label="Personal Wins (required)">
        <View className="overflow-hidden rounded-xl border" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
          <Input
            placeholder="What are 2-3 personal wins? (e.g. stuck beam dismount, stayed focused)"
            multiline
            className="h-24 border-0 bg-transparent p-4"
            style={{ color: colors.text }}
            placeholderTextColor={colors.textDisabled}
            value={form.wins}
            onChangeText={(t: string) => setForm({ ...form, wins: t })}
          />
        </View>
        <Text className="mt-2 text-[10px] font-bold uppercase" style={{ color: colors.textMuted }}>Focus on effort, not just the score.</Text>
      </FormSection>

      <FormSection label="Coach Feedback (optional)">
        <View className="overflow-hidden rounded-xl border" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
          <Input
            placeholder="What did the coach say to work on next?"
            multiline
            className="h-20 border-0 bg-transparent p-4"
            style={{ color: colors.text }}
            placeholderTextColor={colors.textDisabled}
            value={form.feedback}
            onChangeText={(t: string) => setForm({ ...form, feedback: t })}
          />
        </View>
      </FormSection>

      <View className="flex-row gap-3 mt-4">
        <Pressable onPress={onCancel} className="flex-1 items-center rounded-xl py-4" style={{ borderWidth: 1, borderColor: colors.border }}>
          <Text className="font-black" style={{ color: colors.textMuted }}>Cancel</Text>
        </Pressable>
        <Pressable onPress={handleSubmit} disabled={loading} className="flex-[2] items-center rounded-xl py-4" style={{ backgroundColor: colors.gold }}>
          {loading ? <Spinner /> : <Text className="font-black" style={{ color: "#1A1A1A" }}>Save Meet Entry</Text>}
        </Pressable>
      </View>
    </View>
  );
}

function FormSection({ label, children }: { label: string; children: React.ReactNode }) {
  const { colors } = useAppTheme();
  return (
    <View className="mb-5">
      <Text className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: colors.gold }}>{label}</Text>
      {children}
    </View>
  );
}

function LightInput(props: any) {
  const { colors } = useAppTheme();
  return (
    <View className="overflow-hidden rounded-xl border" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
      <Input
        className="border-0 bg-transparent px-4 py-3"
        style={{ color: colors.text }}
        placeholderTextColor={colors.textDisabled}
        {...props}
      />
    </View>
  );
}
