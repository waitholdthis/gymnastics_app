import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { api, useMutation, useQuery } from "@/lib/demoData";
import { Text, Input, SafeAreaView, Spinner } from "@/components/ui";
import { useRouter } from "expo-router";
import { Calendar, ChevronLeft, MessageSquare, Plus, Star, Trophy, X } from "lucide-react-native";

const SHADOW = { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 };

const APPARATUS_COLORS = {
  VT: { color: "#C2500A", bg: "#FFF0E8" },
  UB: { color: "#1D5BB5", bg: "#EFF6FF" },
  BB: { color: "#BE185D", bg: "#FDF2F8" },
  FX: { color: "#16A34A", bg: "#F0FDF4" },
};

export default function MeetJournal() {
  const router = useRouter();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const meets = useQuery(api.gymnasts.getMeets, gymnast ? { gymnastId: gymnast._id } : "skip");
  const [isAdding, setIsAdding] = useState(false);

  if (gymnast === undefined || (gymnast !== null && meets === undefined))
    return <View className="flex-1 bg-white items-center justify-center"><Spinner /></View>;
  if (gymnast === null)
    return <View className="flex-1 bg-white items-center justify-center"><Text className="text-[#1A1A1A]">Gymnast not found</Text></View>;

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
            <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843]">Competition Record</Text>
            <Text className="text-2xl font-black text-[#1A1A1A]">Meet Journal</Text>
          </View>
        </View>
        {!isAdding && (
          <Pressable
            onPress={() => setIsAdding(true)}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#D4A843]"
          >
            <Plus size={20} color="#1A1A1A" />
          </Pressable>
        )}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">
          {isAdding ? (
            <AddMeetForm gymnastId={gymnast._id} onCancel={() => setIsAdding(false)} />
          ) : meets?.length === 0 ? (
            <View className="items-center py-24">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-[#FDF6E3] mb-5">
                <Trophy size={40} color="#D4A843" />
              </View>
              <Text className="text-xl font-black text-[#1A1A1A] mb-2">No Meets Logged Yet</Text>
              <Text className="text-sm text-center text-[#888888] leading-5">
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
    </SafeAreaView>
  );
}

function MeetCard({ meet }: { meet: any }) {
  const totalScore =
    (meet.vaultScore ?? 0) + (meet.barsScore ?? 0) + (meet.beamScore ?? 0) + (meet.floorScore ?? 0);
  const dateObj = new Date(meet.date);
  const month = dateObj.toLocaleDateString("en-US", { month: "short" });
  const day = dateObj.getDate();

  return (
    <View className="overflow-hidden rounded-2xl bg-white" style={SHADOW}>
      {/* Gold top strip */}
      <View className="bg-[#1A1A2E] px-5 py-4 flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="rounded-full px-2.5 py-1 bg-[#D4A843]/20">
              <Text className="text-[10px] font-black uppercase text-[#D4A843]">Competition</Text>
            </View>
          </View>
          <Text className="text-lg font-black text-white">{meet.name}</Text>
          <View className="flex-row items-center gap-1.5 mt-1">
            <Calendar size={11} color="#9999BB" />
            <Text className="text-[11px] text-[#9999BB]">{meet.date}</Text>
          </View>
        </View>
        <View className="items-center rounded-2xl border border-white/20 px-3 py-2 min-w-[64px]">
          <Text className="text-xs font-bold uppercase text-[#9999BB]">{month} {day}</Text>
          {totalScore > 0 && (
            <>
              <Text className="text-2xl font-black text-[#D4A843]">{totalScore.toFixed(2)}</Text>
              <Text className="text-[9px] font-bold uppercase text-[#9999BB]">Total AA</Text>
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

        <View className="rounded-xl border border-[#FDF6E3] bg-[#FFFDF5] p-4 mb-3">
          <View className="flex-row items-center gap-2 mb-2">
            <Star size={14} color="#D4A843" />
            <Text className="text-[10px] font-black uppercase text-[#D4A843]">Personal Wins</Text>
          </View>
          <Text className="text-sm leading-5 text-[#555555] italic">"{meet.personalWins}"</Text>
        </View>

        {meet.coachFeedback && (
          <View className="flex-row items-start gap-2 px-1">
            <MessageSquare size={13} color="#1D5BB5" />
            <View className="flex-1">
              <Text className="text-[10px] font-black uppercase text-[#1D5BB5] mb-1">Coach Note</Text>
              <Text className="text-xs text-[#888888] leading-4">{meet.coachFeedback}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function ApparatusScore({ label, score }: { label: string; score?: number }) {
  if (!score) return null;
  const theme = APPARATUS_COLORS[label as keyof typeof APPARATUS_COLORS] ?? { color: "#888888", bg: "#F8F8F6" };
  return (
    <View className="flex-1 items-center rounded-xl py-2" style={{ backgroundColor: theme.bg }}>
      <Text className="text-[10px] font-black uppercase" style={{ color: theme.color }}>{label}</Text>
      <Text className="text-lg font-black text-[#1A1A1A]">{score.toFixed(3)}</Text>
    </View>
  );
}

function AddMeetForm({ gymnastId, onCancel }: { gymnastId: any; onCancel: () => void }) {
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
        <Text className="text-xl font-black text-[#1A1A1A]">Log New Meet</Text>
        <Pressable onPress={onCancel} className="h-11 w-11 items-center justify-center rounded-full bg-[#F0F0EE]">
          <X size={18} color="#555555" />
        </Pressable>
      </View>

      <FormSection label="Meet Name">
        <LightInput placeholder="e.g. Spring Invitational" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />
      </FormSection>

      <FormSection label="Date (YYYY-MM-DD)">
        <LightInput placeholder="2026-05-18" value={form.date} onChangeText={(t) => setForm({ ...form, date: t })} />
      </FormSection>

      <FormSection label="Event Scores (optional)">
        <View className="flex-row gap-2">
          {[
            { label: "VT", key: "vault" as const },
            { label: "UB", key: "bars" as const },
            { label: "BB", key: "beam" as const },
            { label: "FX", key: "floor" as const },
          ].map(({ label, key }) => {
            const theme = APPARATUS_COLORS[label as keyof typeof APPARATUS_COLORS];
            return (
              <View key={key} className="flex-1">
                <Text className="text-[10px] font-black uppercase mb-1" style={{ color: theme.color }}>{label}</Text>
                <View className="rounded-xl border border-[#E8E8E8] py-2 px-2 bg-[#F8F8F6]">
                  <Input
                    placeholder="0.000"
                    className="border-0 bg-transparent p-0 text-center text-[#1A1A1A] text-sm font-bold h-8"
                    keyboardType="numeric"
                    value={form[key]}
                    onChangeText={(t) => setForm({ ...form, [key]: t })}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </FormSection>

      <FormSection label="Personal Wins (required)">
        <View className="overflow-hidden rounded-xl border border-[#E8E8E8] bg-[#F8F8F6]">
          <Input
            placeholder="What are 2-3 personal wins? (e.g. stuck beam dismount, stayed focused)"
            multiline
            className="h-24 border-0 bg-transparent p-4 text-[#1A1A1A]"
            placeholderTextColor="#BBBBBB"
            value={form.wins}
            onChangeText={(t) => setForm({ ...form, wins: t })}
          />
        </View>
        <Text className="mt-2 text-[10px] font-bold uppercase text-[#888888]">Focus on effort, not just the score.</Text>
      </FormSection>

      <FormSection label="Coach Feedback (optional)">
        <View className="overflow-hidden rounded-xl border border-[#E8E8E8] bg-[#F8F8F6]">
          <Input
            placeholder="What did the coach say to work on next?"
            multiline
            className="h-20 border-0 bg-transparent p-4 text-[#1A1A1A]"
            placeholderTextColor="#BBBBBB"
            value={form.feedback}
            onChangeText={(t) => setForm({ ...form, feedback: t })}
          />
        </View>
      </FormSection>

      <View className="flex-row gap-3 mt-4">
        <Pressable onPress={onCancel} className="flex-1 items-center rounded-xl border border-[#E8E8E8] py-4">
          <Text className="font-black text-[#888888]">Cancel</Text>
        </Pressable>
        <Pressable onPress={handleSubmit} disabled={loading} className="flex-[2] items-center rounded-xl bg-[#D4A843] py-4">
          {loading ? <Spinner /> : <Text className="font-black text-[#1A1A1A]">Save Meet Entry</Text>}
        </Pressable>
      </View>
    </View>
  );
}

function FormSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="mb-5">
      <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843] mb-2">{label}</Text>
      {children}
    </View>
  );
}

function LightInput(props: any) {
  return (
    <View className="overflow-hidden rounded-xl border border-[#E8E8E8] bg-[#F8F8F6]">
      <Input
        className="border-0 bg-transparent px-4 py-3 text-[#1A1A1A]"
        placeholderTextColor="#BBBBBB"
        {...props}
      />
    </View>
  );
}
