import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { api, useMutation, useQuery } from "@/lib/demoData";
import { Text, Input, SafeAreaView, Spinner, Badge } from "@/components/ui";
import { useRouter } from "expo-router";
import {
  Calendar,
  ChevronLeft,
  MessageSquare,
  Plus,
  Star,
  Trophy,
  X,
} from "lucide-react-native";

export default function MeetJournal() {
  const router = useRouter();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const meets = useQuery(api.gymnasts.getMeets, gymnast ? { gymnastId: gymnast._id } : "skip");
  const [isAdding, setIsAdding] = useState(false);

  if (gymnast === undefined || (gymnast !== null && meets === undefined))
    return <View className="flex-1 bg-[#061528] items-center justify-center"><Spinner /></View>;
  if (gymnast === null)
    return <View className="flex-1 bg-[#061528] items-center justify-center"><Text className="text-[#F8FAFC]">Gymnast not found</Text></View>;

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
            <Text className="text-[11px] font-black uppercase tracking-widest text-[#F6C453]">Competition Record</Text>
            <Text className="text-2xl font-black text-[#F8FAFC]">Meet Journal</Text>
          </View>
        </View>
        {!isAdding && (
          <Pressable
            onPress={() => setIsAdding(true)}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F6C453]"
          >
            <Plus size={20} color="#061528" />
          </Pressable>
        )}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        {isAdding ? (
          <AddMeetForm gymnastId={gymnast._id} onCancel={() => setIsAdding(false)} />
        ) : meets?.length === 0 ? (
          <View className="items-center py-24">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-[#F6C453]/10 mb-5">
              <Trophy size={40} color="#F6C453" />
            </View>
            <Text className="text-xl font-black text-[#F8FAFC] mb-2">No Meets Logged Yet</Text>
            <Text className="text-sm text-center text-[#94A3B8] leading-5">
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
    <View className="overflow-hidden rounded-[26px] border border-[#F6C453]/20 bg-[#0B1F3D]">
      <View className="absolute right-[-42px] top-[-42px] h-36 w-36 rounded-full bg-[#F6C453]/10" />

      <View className="p-5">
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <Badge className="border-[#F6C453]/30 bg-[#F6C453]/15">
                <Text className="text-[10px] font-black uppercase text-[#F6C453]">Competition</Text>
              </Badge>
            </View>
            <Text className="text-xl font-black text-[#F8FAFC]">{meet.name}</Text>
            <View className="flex-row items-center gap-1.5 mt-1">
              <Calendar size={11} color="#94A3B8" />
              <Text className="text-[11px] text-[#94A3B8]">{meet.date}</Text>
            </View>
          </View>
          <View className="items-center rounded-2xl border border-[#F6C453]/30 bg-[#061528] px-3 py-2 min-w-[64px]">
            <Text className="text-xs font-bold uppercase text-[#94A3B8]">{month} {day}</Text>
            {totalScore > 0 && (
              <>
                <Text className="text-2xl font-black text-[#F6C453]">{totalScore.toFixed(2)}</Text>
                <Text className="text-[9px] font-bold uppercase text-[#94A3B8]">Total AA</Text>
              </>
            )}
          </View>
        </View>

        {(meet.vaultScore || meet.barsScore || meet.beamScore || meet.floorScore) && (
          <View className="flex-row gap-2 mb-4">
            <ApparatusScore label="VT" score={meet.vaultScore} color="#FB923C" />
            <ApparatusScore label="UB" score={meet.barsScore} color="#8FE7FF" />
            <ApparatusScore label="BB" score={meet.beamScore} color="#F472B6" />
            <ApparatusScore label="FX" score={meet.floorScore} color="#65F4A3" />
          </View>
        )}

        <View className="rounded-2xl border border-[#F6C453]/20 bg-[#061528] p-4 mb-3">
          <View className="flex-row items-center gap-2 mb-2">
            <Star size={14} color="#F6C453" />
            <Text className="text-[10px] font-black uppercase text-[#F6C453]">Personal Wins</Text>
          </View>
          <Text className="text-sm leading-5 text-[#C7D2FE] italic">"{meet.personalWins}"</Text>
        </View>

        {meet.coachFeedback && (
          <View className="flex-row items-start gap-2 px-1">
            <MessageSquare size={13} color="#8FE7FF" />
            <View className="flex-1">
              <Text className="text-[10px] font-black uppercase text-[#8FE7FF] mb-1">Coach Note</Text>
              <Text className="text-xs text-[#94A3B8] leading-4">{meet.coachFeedback}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function ApparatusScore({ label, score, color }: { label: string; score?: number; color: string }) {
  if (!score) return null;
  return (
    <View className="flex-1 items-center rounded-2xl bg-[#061528] py-2" style={{ borderWidth: 1, borderColor: `${color}40` }}>
      <Text className="text-[10px] font-black uppercase" style={{ color }}>{label}</Text>
      <Text className="text-lg font-black text-[#F8FAFC]">{score.toFixed(3)}</Text>
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
        <Text className="text-xl font-black text-[#F8FAFC]">Log New Meet</Text>
        <Pressable onPress={onCancel} className="h-11 w-11 items-center justify-center rounded-full bg-[#0A1B33]">
          <X size={18} color="#94A3B8" />
        </Pressable>
      </View>

      <FormSection label="Meet Name">
        <DarkInput
          placeholder="e.g. Spring Invitational"
          value={form.name}
          onChangeText={(t) => setForm({ ...form, name: t })}
        />
      </FormSection>

      <FormSection label="Date (YYYY-MM-DD)">
        <DarkInput
          placeholder="2026-05-18"
          value={form.date}
          onChangeText={(t) => setForm({ ...form, date: t })}
        />
      </FormSection>

      <FormSection label="Event Scores (optional)">
        <View className="flex-row gap-2">
          {[
            { label: "VT", key: "vault" as const, color: "#FB923C" },
            { label: "UB", key: "bars" as const, color: "#8FE7FF" },
            { label: "BB", key: "beam" as const, color: "#F472B6" },
            { label: "FX", key: "floor" as const, color: "#65F4A3" },
          ].map(({ label, key, color }) => (
            <View key={key} className="flex-1">
              <Text className="text-[10px] font-black uppercase mb-1" style={{ color }}>{label}</Text>
              <View className="rounded-xl border py-2 px-2 bg-[#0A1B33]" style={{ borderColor: `${color}30` }}>
                <Input
                  placeholder="0.000"
                  className="border-0 bg-transparent p-0 text-center text-[#F8FAFC] text-sm font-bold h-8"
                  keyboardType="numeric"
                  value={form[key]}
                  onChangeText={(t) => setForm({ ...form, [key]: t })}
                />
              </View>
            </View>
          ))}
        </View>
      </FormSection>

      <FormSection label="Personal Wins (required)">
        <View className="overflow-hidden rounded-2xl border border-[#F6C453]/20 bg-[#0A1B33]">
          <Input
            placeholder="What are 2-3 personal wins? (e.g. stuck beam dismount, stayed focused)"
            multiline
            className="h-24 border-0 bg-transparent p-4 text-[#F8FAFC]"
            placeholderTextColor="#4B6080"
            value={form.wins}
            onChangeText={(t) => setForm({ ...form, wins: t })}
          />
        </View>
        <Text className="mt-2 text-[10px] font-bold uppercase text-[#94A3B8]">Focus on effort, not just the score.</Text>
      </FormSection>

      <FormSection label="Coach Feedback (optional)">
        <View className="overflow-hidden rounded-2xl border border-[#8FE7FF]/20 bg-[#0A1B33]">
          <Input
            placeholder="What did the coach say to work on next?"
            multiline
            className="h-20 border-0 bg-transparent p-4 text-[#F8FAFC]"
            placeholderTextColor="#4B6080"
            value={form.feedback}
            onChangeText={(t) => setForm({ ...form, feedback: t })}
          />
        </View>
      </FormSection>

      <View className="flex-row gap-3 mt-4">
        <Pressable
          onPress={onCancel}
          className="flex-1 items-center rounded-2xl border border-white/10 py-4"
        >
          <Text className="font-black text-[#94A3B8]">Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          className="flex-[2] items-center rounded-2xl bg-[#F6C453] py-4"
        >
          {loading ? <Spinner /> : <Text className="font-black text-[#061528]">Save Meet Entry</Text>}
        </Pressable>
      </View>
    </View>
  );
}

function FormSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="mb-5">
      <Text className="text-[11px] font-black uppercase tracking-widest text-[#8FE7FF] mb-2">{label}</Text>
      {children}
    </View>
  );
}

function DarkInput(props: any) {
  return (
    <View className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A1B33]">
      <Input
        className="border-0 bg-transparent px-4 py-3 text-[#F8FAFC]"
        placeholderTextColor="#4B6080"
        {...props}
      />
    </View>
  );
}
