import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { api, useMutation, useQuery } from "@/lib/demoData";
import { Text, Input, SafeAreaView, Spinner } from "@/components/ui";
import { useRouter } from "expo-router";
import {
  CheckCircle2,
  ChevronLeft,
  Circle,
  ClipboardList,
  MessageSquare,
  Plus,
  Target,
  Users,
} from "lucide-react-native";

export default function CoachConnection() {
  const router = useRouter();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const goals = useQuery(api.gymnasts.getGoals, gymnast ? { gymnastId: gymnast._id } : "skip");
  const notes = useQuery(api.gymnasts.getCoachNotes, gymnast ? { gymnastId: gymnast._id } : "skip");

  const addGoal = useMutation(api.gymnasts.addGoal);
  const toggleGoal = useMutation(api.gymnasts.toggleGoal);
  const addNote = useMutation(api.gymnasts.addCoachNote);

  const [newGoal, setNewGoal] = useState("");
  const [newNote, setNewNote] = useState("");

  if (gymnast === undefined || goals === undefined)
    return <View className="flex-1 bg-[#061528] items-center justify-center"><Spinner /></View>;
  if (gymnast === null)
    return <View className="flex-1 bg-[#061528] items-center justify-center"><Text className="text-[#F8FAFC]">Gymnast not found</Text></View>;

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    await addGoal({ gymnastId: gymnast._id, text: newGoal.trim(), category: "Technical" });
    setNewGoal("");
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    await addNote({ gymnastId: gymnast._id, note: newNote.trim() });
    setNewNote("");
  };

  const completedGoals = goals?.filter((g: any) => g.isAchieved).length ?? 0;
  const totalGoals = goals?.length ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-[#061528]" edges={["top"]}>
      <View className="px-4 pt-6 pb-4 flex-row items-center gap-3">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full bg-[#0B1F3D]"
        >
          <ChevronLeft size={22} color="#F8FAFC" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[11px] font-black uppercase tracking-widest text-[#F472B6]">Gym & Home</Text>
          <Text className="text-2xl font-black text-[#F8FAFC]">Coach Connection</Text>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-full border border-[#F472B6]/30 bg-[#F472B6]/10">
          <Users size={20} color="#F472B6" />
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        {/* Talking Points */}
        <View className="mb-6">
          <SectionHeader icon={<MessageSquare size={17} color="#F472B6" />} label="Suggested Talking Points" color="#F472B6" />
          <View className="gap-3">
            <TalkingPoint
              color="#F472B6"
              title="Technical Focus"
              question={`What's the one cue that helps ${gymnast.name} the most on her kip right now?`}
            />
            <TalkingPoint
              color="#8FE7FF"
              title="Wellness Adjustment"
              question="She's feeling some heel soreness today — can we focus on bars or low-impact landing drills?"
            />
            <TalkingPoint
              color="#F6C453"
              title="Motivation Check"
              question="How has her focus been during transitions between events today?"
            />
          </View>
        </View>

        {/* Goals */}
        <View className="mb-6">
          <SectionHeader icon={<Target size={17} color="#8FE7FF" />} label="Practice Goals" color="#8FE7FF" />
          {totalGoals > 0 && (
            <View className="mb-3 flex-row items-center gap-3 rounded-2xl border border-[#8FE7FF]/20 bg-[#0A1B33] px-4 py-3">
              <View className="flex-1 h-2 overflow-hidden rounded-full bg-[#061528]">
                <View
                  className="h-full rounded-full bg-[#8FE7FF]"
                  style={{ width: `${Math.round((completedGoals / totalGoals) * 100)}%` }}
                />
              </View>
              <Text className="text-[11px] font-black text-[#8FE7FF]">{completedGoals}/{totalGoals} cleared</Text>
            </View>
          )}

          <View className="flex-row gap-2 mb-3">
            <View className="flex-1 overflow-hidden rounded-2xl border border-[#8FE7FF]/20 bg-[#0A1B33]">
              <Input
                placeholder="Add a new practice goal..."
                value={newGoal}
                onChangeText={setNewGoal}
                className="border-0 bg-transparent px-4 py-3 text-[#F8FAFC]"
                placeholderTextColor="#4B6080"
                onSubmitEditing={handleAddGoal}
              />
            </View>
            <Pressable
              onPress={handleAddGoal}
              className="h-12 w-12 items-center justify-center rounded-2xl bg-[#8FE7FF]"
            >
              <Plus size={20} color="#061528" />
            </Pressable>
          </View>

          <View className="gap-2">
            {goals?.map((goal: any) => (
              <Pressable
                key={goal._id}
                onPress={() => toggleGoal({ goalId: goal._id, isAchieved: !goal.isAchieved })}
                className="flex-row items-center gap-3 rounded-2xl border p-4"
                style={{
                  borderColor: goal.isAchieved ? "#65F4A340" : "rgba(255,255,255,0.1)",
                  backgroundColor: goal.isAchieved ? "#102F2E" : "#0A1B33",
                }}
              >
                {goal.isAchieved ? (
                  <CheckCircle2 size={20} color="#65F4A3" />
                ) : (
                  <Circle size={20} color="#4B6080" />
                )}
                <Text
                  className="flex-1 text-sm font-bold"
                  style={{
                    color: goal.isAchieved ? "#65F4A3" : "#F8FAFC",
                    textDecorationLine: goal.isAchieved ? "line-through" : "none",
                  }}
                >
                  {goal.text}
                </Text>
                <View
                  className="rounded-full px-2 py-0.5"
                  style={{ backgroundColor: getCategoryColor(goal.category) + "25" }}
                >
                  <Text className="text-[9px] font-black uppercase" style={{ color: getCategoryColor(goal.category) }}>
                    {goal.category}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Coach Notes */}
        <View className="mb-10">
          <SectionHeader icon={<ClipboardList size={17} color="#F6C453" />} label="Coach Feedback Log" color="#F6C453" />

          <View className="mb-4">
            <View className="mb-2 overflow-hidden rounded-2xl border border-[#F6C453]/20 bg-[#0A1B33]">
              <Input
                placeholder="Record what the coach said today..."
                value={newNote}
                onChangeText={setNewNote}
                multiline
                className="h-20 border-0 bg-transparent p-4 text-[#F8FAFC]"
                placeholderTextColor="#4B6080"
              />
            </View>
            <Pressable
              onPress={handleAddNote}
              className="items-center rounded-2xl bg-[#F6C453] py-3"
            >
              <Text className="font-black text-[#061528]">Add Coach Note</Text>
            </Pressable>
          </View>

          <View className="gap-3">
            {notes?.map((note: any) => (
              <View
                key={note._id}
                className="rounded-2xl bg-[#0A1B33] p-4"
                style={{ borderWidth: 1, borderLeftWidth: 3, borderColor: "rgba(255,255,255,0.05)", borderLeftColor: "#F6C453" }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-[10px] font-black uppercase text-[#F6C453]">{note.date}</Text>
                  <Users size={12} color="#4B6080" />
                </View>
                <Text className="text-sm leading-5 text-[#C7D2FE]">{note.note}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="h-20" />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SectionHeader({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <View className="flex-row items-center gap-2 mb-3">
      {icon}
      <Text className="font-black text-base text-[#F8FAFC]">{label}</Text>
      <View className="flex-1 h-px ml-2" style={{ backgroundColor: `${color}25` }} />
    </View>
  );
}

function TalkingPoint({ title, question, color }: { title: string; question: string; color: string }) {
  return (
    <View
      className="rounded-2xl p-4"
      style={{ backgroundColor: `${color}12`, borderWidth: 1, borderColor: `${color}30` }}
    >
      <Text className="text-[10px] font-black uppercase mb-1.5" style={{ color }}>{title}</Text>
      <Text className="text-sm leading-5 italic text-[#C7D2FE]">"{question}"</Text>
    </View>
  );
}

function getCategoryColor(category: string) {
  if (category === "Technical") return "#8FE7FF";
  if (category === "Confidence") return "#F472B6";
  return "#65F4A3";
}
