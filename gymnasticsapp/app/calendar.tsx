import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { api, useMutation, useQuery } from "@/lib/demoData";
import { Text, Input, SafeAreaView, Spinner, Switch } from "@/components/ui";
import { useRouter } from "expo-router";
import {
  Bell,
  BellOff,
  Calendar as CalendarIcon,
  ChevronLeft,
  Clock,
  MapPin,
  Plus,
  X,
} from "lucide-react-native";
import { useAppTheme } from "@/lib/appTheme";

export default function CalendarScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const schedules = useQuery(api.gymnasts.getSchedules, gymnast ? { gymnastId: gymnast._id } : "skip");
  const [isAdding, setIsAdding] = useState(false);

  if (gymnast === undefined || (gymnast !== null && schedules === undefined))
    return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}><Spinner /></View>;
  if (gymnast === null)
    return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}><Text style={{ color: colors.text }}>Gymnast not found</Text></View>;

  const upcomingMeets = schedules?.filter((s: any) => s.type === "meet") ?? [];
  const practices = schedules?.filter((s: any) => s.type === "practice") ?? [];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.bg }} edges={["top"]}>
      {/* Header */}
      <View className="px-4 pt-4 pb-3 flex-row items-center justify-between border-b" style={{ borderColor: colors.border }}>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.backBtnBg }}
          >
            <ChevronLeft size={22} color={colors.backBtnIcon} />
          </Pressable>
          <View>
            <Text className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.gold }}>Season Schedule</Text>
            <Text className="text-2xl font-black" style={{ color: colors.text }}>Training Calendar</Text>
          </View>
        </View>
        {!isAdding && (
          <Pressable
            onPress={() => setIsAdding(true)}
            className="h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.gold }}
          >
            <Plus size={20} color="#1A1A1A" />
          </Pressable>
        )}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">
          {isAdding ? (
            <AddScheduleForm gymnastId={gymnast._id} onCancel={() => setIsAdding(false)} />
          ) : schedules?.length === 0 ? (
            <View className="items-center py-24">
              <View className="h-20 w-20 items-center justify-center rounded-full mb-5" style={{ backgroundColor: colors.blueBg }}>
                <CalendarIcon size={40} color={colors.blue} />
              </View>
              <Text className="text-xl font-black mb-2" style={{ color: colors.text }}>Schedule is Clear</Text>
              <Text className="text-sm text-center leading-5" style={{ color: colors.textMuted }}>
                Add a practice or meet to start building your season timeline.
              </Text>
            </View>
          ) : (
            <View className="pb-20 gap-6">
              {upcomingMeets.length > 0 && (
                <View>
                  <SectionLabel label="Competition Dates" />
                  <View className="gap-3">
                    {upcomingMeets.map((item: any) => (
                      <ScheduleCard key={item._id} item={item} />
                    ))}
                  </View>
                </View>
              )}

              {practices.length > 0 && (
                <View>
                  <SectionLabel label="Training Sessions" />
                  <View className="gap-3">
                    {practices.map((item: any) => (
                      <ScheduleCard key={item._id} item={item} />
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SectionLabel({ label }: { label: string }) {
  const { colors } = useAppTheme();
  return (
    <View className="flex-row items-center gap-3 mb-3">
      <Text className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.gold }}>{label}</Text>
      <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
    </View>
  );
}

function ScheduleCard({ item }: { item: any }) {
  const { colors } = useAppTheme();
  const isMeet = item.type === "meet";
  const accentColor = isMeet ? colors.gold : colors.blue;
  const accentBg = isMeet ? colors.goldBg : colors.blueBg;

  const dateObj = new Date(item.date);
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
  const month = dateObj.toLocaleDateString("en-US", { month: "short" });
  const dayNum = dateObj.getDate();

  return (
    <View
      className="overflow-hidden rounded-2xl flex-row gap-4 p-4"
      style={[colors.shadow, { backgroundColor: colors.surface, borderLeftWidth: 3, borderLeftColor: accentColor }]}
    >
      <View
        className="items-center justify-center rounded-xl px-3 py-2 min-w-[52px]"
        style={{ backgroundColor: accentBg }}
      >
        <Text className="text-[10px] font-black uppercase" style={{ color: accentColor }}>{dayName}</Text>
        <Text className="text-2xl font-black" style={{ color: accentColor }}>{dayNum}</Text>
        <Text className="text-[10px] font-black uppercase" style={{ color: accentColor }}>{month}</Text>
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: accentBg }}>
            <Text className="text-[9px] font-black uppercase" style={{ color: accentColor }}>
              {isMeet ? "Competition" : "Practice"}
            </Text>
          </View>
          {item.reminderEnabled ? (
            <Bell size={12} color={accentColor} />
          ) : (
            <BellOff size={12} color={colors.textDisabled} />
          )}
        </View>
        <Text className="text-base font-black mb-1" style={{ color: colors.text }}>{item.title}</Text>
        <View className="flex-row items-center gap-1">
          <Clock size={11} color={colors.textMuted} />
          <Text className="text-[11px]" style={{ color: colors.textMuted }}>{item.startTime} – {item.endTime}</Text>
        </View>
        {item.location && (
          <View className="flex-row items-center gap-1 mt-1">
            <MapPin size={11} color={colors.textMuted} />
            <Text className="text-[11px] flex-1" style={{ color: colors.textMuted }} numberOfLines={1}>{item.location}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function AddScheduleForm({ gymnastId, onCancel }: { gymnastId: any; onCancel: () => void }) {
  const { colors } = useAppTheme();
  const addSchedule = useMutation(api.gymnasts.addSchedule);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "practice" as "practice" | "meet",
    date: new Date().toISOString().split("T")[0],
    startTime: "16:00",
    endTime: "19:00",
    location: "",
    reminderEnabled: true,
  });

  const handleSubmit = async () => {
    if (!form.title || !form.date) return;
    setLoading(true);
    try {
      await addSchedule({
        gymnastId,
        title: form.title,
        type: form.type,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location || undefined,
        reminderEnabled: form.reminderEnabled,
      });
      if (form.type === "meet" && form.reminderEnabled) {
        Alert.alert("Reminder Set", `We'll remind you about ${form.title} on ${form.date}.`);
      }
      onCancel();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isMeet = form.type === "meet";
  const accentColor = isMeet ? colors.gold : colors.blue;

  return (
    <View className="pb-20">
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-xl font-black" style={{ color: colors.text }}>Add Event</Text>
        <Pressable onPress={onCancel} className="h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: colors.backBtnBg }}>
          <X size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      <FormSection label="Event Type">
        <View className="flex-row gap-2">
          {(["practice", "meet"] as const).map((type) => {
            const isSelected = form.type === type;
            const bg = isSelected ? (type === "meet" ? colors.gold : colors.blue) : colors.bgSecondary;
            const textColor = isSelected ? (type === "meet" ? "#1A1A1A" : "#FFFFFF") : colors.textMuted;
            return (
              <Pressable
                key={type}
                onPress={() => setForm({ ...form, type })}
                className="flex-1 items-center py-3 rounded-xl"
                style={{ backgroundColor: bg, borderWidth: 1, borderColor: isSelected ? "transparent" : colors.border }}
              >
                <Text className="font-black capitalize" style={{ color: textColor }}>
                  {type === "meet" ? "Competition" : "Practice"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </FormSection>

      <FormSection label="Event Title">
        <LightInput
          placeholder={isMeet ? "States Invitational" : "Team Practice"}
          value={form.title}
          onChangeText={(t: string) => setForm({ ...form, title: t })}
        />
      </FormSection>

      <FormSection label="Date (YYYY-MM-DD)">
        <LightInput
          placeholder="2026-05-18"
          value={form.date}
          onChangeText={(t: string) => setForm({ ...form, date: t })}
        />
      </FormSection>

      <FormSection label="Time Window">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-[10px] font-black uppercase mb-1" style={{ color: colors.textMuted }}>Start</Text>
            <LightInput
              placeholder="16:00"
              value={form.startTime}
              onChangeText={(t: string) => setForm({ ...form, startTime: t })}
            />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-black uppercase mb-1" style={{ color: colors.textMuted }}>End</Text>
            <LightInput
              placeholder="19:00"
              value={form.endTime}
              onChangeText={(t: string) => setForm({ ...form, endTime: t })}
            />
          </View>
        </View>
      </FormSection>

      <FormSection label="Location (optional)">
        <LightInput
          placeholder="Main Gym Floor"
          value={form.location}
          onChangeText={(t: string) => setForm({ ...form, location: t })}
        />
      </FormSection>

      <View className="flex-row items-center justify-between mb-6 rounded-2xl p-4" style={[colors.shadow, { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }]}>
        <View>
          <Text className="font-black" style={{ color: colors.text }}>Enable Reminder</Text>
          <Text className="text-[11px]" style={{ color: colors.textMuted }}>Notify me before this event</Text>
        </View>
        <Switch
          checked={form.reminderEnabled}
          onCheckedChange={(val) => setForm({ ...form, reminderEnabled: val })}
        />
      </View>

      <View className="flex-row gap-3">
        <Pressable onPress={onCancel} className="flex-1 items-center rounded-xl py-4" style={{ borderWidth: 1, borderColor: colors.border }}>
          <Text className="font-black" style={{ color: colors.textMuted }}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          className="flex-[2] items-center rounded-xl py-4"
          style={{ backgroundColor: accentColor }}
        >
          {loading ? <Spinner /> : <Text className="font-black" style={{ color: isMeet ? "#1A1A1A" : "#FFFFFF" }}>Save Event</Text>}
        </Pressable>
      </View>
    </View>
  );
}

function FormSection({ label, children }: { label: string; children: React.ReactNode }) {
  const { colors } = useAppTheme();
  return (
    <View className="mb-4">
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
