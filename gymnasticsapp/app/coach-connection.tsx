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
import { useAppTheme } from "@/lib/appTheme";

export default function CoachConnection() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const goals = useQuery(api.gymnasts.getGoals, gymnast ? { gymnastId: gymnast._id } : "skip");
  const notes = useQuery(api.gymnasts.getCoachNotes, gymnast ? { gymnastId: gymnast._id } : "skip");

  const addGoal = useMutation(api.gymnasts.addGoal);
  const toggleGoal = useMutation(api.gymnasts.toggleGoal);
  const addNote = useMutation(api.gymnasts.addCoachNote);

  const [newGoal, setNewGoal] = useState("");
  const [newNote, setNewNote] = useState("");

  if (gymnast === undefined || goals === undefined)
    return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}><Spinner /></View>;
  if (gymnast === null)
    return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}><Text style={{ color: colors.text }}>Gymnast not found</Text></View>;

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
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.bg }} edges={["top"]}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
          flexDirection: "row", alignItems: "center", gap: 12,
          borderBottomWidth: 1, borderBottomColor: colors.border,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            height: 44, width: 44, alignItems: "center", justifyContent: "center",
            borderRadius: 22, backgroundColor: colors.backBtnBg,
          }}
        >
          <ChevronLeft size={22} color={colors.backBtnIcon} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, color: colors.gold }}>
            Gym & Home
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "900", color: colors.text, letterSpacing: -0.5 }}>
            Coach Connection
          </Text>
        </View>
        <View
          style={{
            height: 44, width: 44, alignItems: "center", justifyContent: "center",
            borderRadius: 22, backgroundColor: colors.pinkBg,
            borderWidth: 1, borderColor: colors.pink + "30",
          }}
        >
          <Users size={20} color={colors.pink} />
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">

          {/* Talking Points */}
          <View className="mb-6">
            <SectionHeader icon={<MessageSquare size={17} color={colors.pink} />} label="Suggested Talking Points" />
            <View className="gap-3">
              <TalkingPoint
                color={colors.pink}
                bg={colors.pinkBg}
                title="Technical Focus"
                question={`What's the one cue that helps ${gymnast.name} the most on her kip right now?`}
              />
              <TalkingPoint
                color={colors.blue}
                bg={colors.blueBg}
                title="Wellness Adjustment"
                question="She's feeling some heel soreness today — can we focus on bars or low-impact landing drills?"
              />
              <TalkingPoint
                color={colors.gold}
                bg={colors.goldBg}
                title="Motivation Check"
                question="How has her focus been during transitions between events today?"
              />
            </View>
          </View>

          {/* Goals */}
          <View className="mb-6">
            <SectionHeader icon={<Target size={17} color={colors.blue} />} label="Practice Goals" />

            {totalGoals > 0 && (
              <View
                className="mb-3 rounded-2xl px-4 py-3 flex-row items-center gap-3"
                style={[colors.shadow, { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }]}
              >
                <View className="flex-1 h-2 overflow-hidden rounded-full" style={{ backgroundColor: colors.bgTertiary }}>
                  <View
                    className="h-full rounded-full"
                    style={{ width: `${Math.round((completedGoals / totalGoals) * 100)}%`, backgroundColor: colors.gold }}
                  />
                </View>
                <Text className="text-[11px] font-black" style={{ color: colors.gold }}>{completedGoals}/{totalGoals} cleared</Text>
              </View>
            )}

            <View className="flex-row gap-2 mb-3">
              <View
                className="flex-1 overflow-hidden rounded-xl"
                style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgSecondary }}
              >
                <Input
                  placeholder="Add a new practice goal..."
                  value={newGoal}
                  onChangeText={setNewGoal}
                  className="border-0 bg-transparent px-4 py-3"
                  style={{ color: colors.text }}
                  placeholderTextColor={colors.textDisabled}
                  onSubmitEditing={handleAddGoal}
                />
              </View>
              <Pressable
                onPress={handleAddGoal}
                className="h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: colors.gold }}
              >
                <Plus size={20} color="#1A1A1A" />
              </Pressable>
            </View>

            <View className="gap-2">
              {goals?.map((goal: any) => (
                <Pressable
                  key={goal._id}
                  onPress={() => toggleGoal({ goalId: goal._id, isAchieved: !goal.isAchieved })}
                  className="flex-row items-center gap-3 rounded-2xl p-4"
                  style={[colors.shadow, { backgroundColor: colors.surface, borderLeftWidth: 2, borderLeftColor: goal.isAchieved ? colors.green : colors.border }]}
                >
                  {goal.isAchieved ? (
                    <CheckCircle2 size={20} color={colors.green} />
                  ) : (
                    <Circle size={20} color={colors.textDisabled} />
                  )}
                  <Text
                    className="flex-1 text-sm font-bold"
                    style={{
                      color: goal.isAchieved ? colors.green : colors.text,
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
            <SectionHeader icon={<ClipboardList size={17} color={colors.gold} />} label="Coach Feedback Log" />

            <View className="mb-4">
              <View
                className="mb-2 overflow-hidden rounded-xl"
                style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgSecondary }}
              >
                <Input
                  placeholder="Record what the coach said today..."
                  value={newNote}
                  onChangeText={setNewNote}
                  multiline
                  className="h-20 border-0 bg-transparent p-4"
                  style={{ color: colors.text }}
                  placeholderTextColor={colors.textDisabled}
                />
              </View>
              <Pressable
                onPress={handleAddNote}
                className="items-center rounded-xl py-3"
                style={{ backgroundColor: colors.gold }}
              >
                <Text className="font-black" style={{ color: "#1A1A1A" }}>Add Coach Note</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              {notes?.map((note: any) => (
                <View
                  key={note._id}
                  className="rounded-2xl p-4"
                  style={[colors.shadow, { backgroundColor: colors.surface, borderLeftWidth: 3, borderLeftColor: colors.gold }]}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-[10px] font-black uppercase" style={{ color: colors.gold }}>{note.date}</Text>
                    <Users size={12} color={colors.textDisabled} />
                  </View>
                  <Text className="text-sm leading-5" style={{ color: colors.textSecondary }}>{note.note}</Text>
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
  const { colors } = useAppTheme();
  return (
    <View className="flex-row items-center gap-2 mb-3">
      {icon}
      <Text className="font-black text-base" style={{ color: colors.text }}>{label}</Text>
      <View className="flex-1 h-px ml-2" style={{ backgroundColor: colors.border }} />
    </View>
  );
}

function TalkingPoint({ title, question, color, bg }: { title: string; question: string; color: string; bg: string }) {
  const { colors } = useAppTheme();
  return (
    <View className="rounded-2xl p-4" style={{ backgroundColor: bg, borderLeftWidth: 3, borderLeftColor: color }}>
      <Text className="text-[10px] font-black uppercase mb-1.5" style={{ color }}>{title}</Text>
      <Text className="text-sm leading-5 italic" style={{ color: colors.textSecondary }}>"{question}"</Text>
    </View>
  );
}

function getCategoryColor(category: string) {
  if (category === "Technical") return "#1D5BB5";
  if (category === "Confidence") return "#BE185D";
  return "#16A34A";
}
