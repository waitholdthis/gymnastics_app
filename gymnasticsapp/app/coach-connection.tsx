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

const SHADOW = { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 };

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
    return <View className="flex-1 bg-white items-center justify-center"><Spinner /></View>;
  if (gymnast === null)
    return <View className="flex-1 bg-white items-center justify-center"><Text className="text-[#1A1A1A]">Gymnast not found</Text></View>;

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
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-4 pt-4 pb-3 flex-row items-center gap-3 border-b border-[#E8E8E8]">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full bg-[#F0F0EE]"
        >
          <ChevronLeft size={22} color="#444444" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843]">Gym & Home</Text>
          <Text className="text-2xl font-black text-[#1A1A1A]">Coach Connection</Text>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-full bg-[#FDF2F8]">
          <Users size={20} color="#BE185D" />
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">

          {/* Talking Points */}
          <View className="mb-6">
            <SectionHeader icon={<MessageSquare size={17} color="#BE185D" />} label="Suggested Talking Points" />
            <View className="gap-3">
              <TalkingPoint
                color="#BE185D"
                bg="#FDF2F8"
                title="Technical Focus"
                question={`What's the one cue that helps ${gymnast.name} the most on her kip right now?`}
              />
              <TalkingPoint
                color="#1D5BB5"
                bg="#EFF6FF"
                title="Wellness Adjustment"
                question="She's feeling some heel soreness today — can we focus on bars or low-impact landing drills?"
              />
              <TalkingPoint
                color="#D4A843"
                bg="#FDF6E3"
                title="Motivation Check"
                question="How has her focus been during transitions between events today?"
              />
            </View>
          </View>

          {/* Goals */}
          <View className="mb-6">
            <SectionHeader icon={<Target size={17} color="#1D5BB5" />} label="Practice Goals" />

            {totalGoals > 0 && (
              <View className="mb-3 rounded-2xl border border-[#E8E8E8] bg-white px-4 py-3 flex-row items-center gap-3" style={SHADOW}>
                <View className="flex-1 h-2 overflow-hidden rounded-full bg-[#F0F0EE]">
                  <View
                    className="h-full rounded-full bg-[#D4A843]"
                    style={{ width: `${Math.round((completedGoals / totalGoals) * 100)}%` }}
                  />
                </View>
                <Text className="text-[11px] font-black text-[#D4A843]">{completedGoals}/{totalGoals} cleared</Text>
              </View>
            )}

            <View className="flex-row gap-2 mb-3">
              <View className="flex-1 overflow-hidden rounded-xl border border-[#E8E8E8] bg-[#F8F8F6]">
                <Input
                  placeholder="Add a new practice goal..."
                  value={newGoal}
                  onChangeText={setNewGoal}
                  className="border-0 bg-transparent px-4 py-3 text-[#1A1A1A]"
                  placeholderTextColor="#BBBBBB"
                  onSubmitEditing={handleAddGoal}
                />
              </View>
              <Pressable
                onPress={handleAddGoal}
                className="h-12 w-12 items-center justify-center rounded-xl bg-[#D4A843]"
              >
                <Plus size={20} color="#1A1A1A" />
              </Pressable>
            </View>

            <View className="gap-2">
              {goals?.map((goal: any) => (
                <Pressable
                  key={goal._id}
                  onPress={() => toggleGoal({ goalId: goal._id, isAchieved: !goal.isAchieved })}
                  className="flex-row items-center gap-3 rounded-2xl bg-white p-4"
                  style={[SHADOW, { borderLeftWidth: 2, borderLeftColor: goal.isAchieved ? "#16A34A" : "#E8E8E8" }]}
                >
                  {goal.isAchieved ? (
                    <CheckCircle2 size={20} color="#16A34A" />
                  ) : (
                    <Circle size={20} color="#AAAAAA" />
                  )}
                  <Text
                    className="flex-1 text-sm font-bold"
                    style={{
                      color: goal.isAchieved ? "#16A34A" : "#1A1A1A",
                      textDecorationLine: goal.isAchieved ? "line-through" : "none",
                    }}
                  >
                    {goal.text}
                  </Text>
                  <View
                    className="rounded-full px-2 py-0.5"
                    style={{ backgroundColor: getCategoryColor(goal.category) + "20" }}
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
            <SectionHeader icon={<ClipboardList size={17} color="#D4A843" />} label="Coach Feedback Log" />

            <View className="mb-4">
              <View className="mb-2 overflow-hidden rounded-xl border border-[#E8E8E8] bg-[#F8F8F6]">
                <Input
                  placeholder="Record what the coach said today..."
                  value={newNote}
                  onChangeText={setNewNote}
                  multiline
                  className="h-20 border-0 bg-transparent p-4 text-[#1A1A1A]"
                  placeholderTextColor="#BBBBBB"
                />
              </View>
              <Pressable
                onPress={handleAddNote}
                className="items-center rounded-xl bg-[#D4A843] py-3"
              >
                <Text className="font-black text-[#1A1A1A]">Add Coach Note</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              {notes?.map((note: any) => (
                <View
                  key={note._id}
                  className="rounded-2xl bg-white p-4"
                  style={[SHADOW, { borderLeftWidth: 3, borderLeftColor: "#D4A843" }]}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-[10px] font-black uppercase text-[#D4A843]">{note.date}</Text>
                    <Users size={12} color="#AAAAAA" />
                  </View>
                  <Text className="text-sm leading-5 text-[#555555]">{note.note}</Text>
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

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View className="flex-row items-center gap-2 mb-3">
      {icon}
      <Text className="font-black text-base text-[#1A1A1A]">{label}</Text>
      <View className="flex-1 h-px bg-[#E8E8E8] ml-2" />
    </View>
  );
}

function TalkingPoint({ title, question, color, bg }: { title: string; question: string; color: string; bg: string }) {
  return (
    <View className="rounded-2xl p-4" style={{ backgroundColor: bg, borderLeftWidth: 3, borderLeftColor: color }}>
      <Text className="text-[10px] font-black uppercase mb-1.5" style={{ color }}>{title}</Text>
      <Text className="text-sm leading-5 italic text-[#555555]">"{question}"</Text>
    </View>
  );
}

function getCategoryColor(category: string) {
  if (category === "Technical") return "#1D5BB5";
  if (category === "Confidence") return "#BE185D";
  return "#16A34A";
}
