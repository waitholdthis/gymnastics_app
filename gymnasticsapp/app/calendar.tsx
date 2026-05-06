import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { api, useMutation, useQuery } from "@/lib/demoData";
import { Text, Input, SafeAreaView, Spinner, Switch, Label } from "@/components/ui";
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

export default function CalendarScreen() {
  const router = useRouter();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const schedules = useQuery(api.gymnasts.getSchedules, gymnast ? { gymnastId: gymnast._id } : "skip");
  const [isAdding, setIsAdding] = useState(false);

  if (gymnast === undefined || (gymnast !== null && schedules === undefined))
    return <View className="flex-1 bg-[#061528] items-center justify-center"><Spinner /></View>;
  if (gymnast === null)
    return <View className="flex-1 bg-[#061528] items-center justify-center"><Text className="text-[#F8FAFC]">Gymnast not found</Text></View>;

  const upcomingMeets = schedules?.filter((s: any) => s.type === "meet") ?? [];
  const practices = schedules?.filter((s: any) => s.type === "practice") ?? [];

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
            <Text className="text-[11px] font-black uppercase tracking-widest text-[#8FE7FF]">Season Schedule</Text>
            <Text className="text-2xl font-black text-[#F8FAFC]">Training Calendar</Text>
          </View>
        </View>
        {!isAdding && (
          <Pressable
            onPress={() => setIsAdding(true)}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#8FE7FF]"
          >
            <Plus size={20} color="#061528" />
          </Pressable>
        )}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        {isAdding ? (
          <AddScheduleForm gymnastId={gymnast._id} onCancel={() => setIsAdding(false)} />
        ) : schedules?.length === 0 ? (
          <View className="items-center py-24">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-[#8FE7FF]/10 mb-5">
              <CalendarIcon size={40} color="#8FE7FF" />
            </View>
            <Text className="text-xl font-black text-[#F8FAFC] mb-2">Schedule is Clear</Text>
            <Text className="text-sm text-center text-[#94A3B8] leading-5">
              Add a practice or meet to start building your season timeline.
            </Text>
          </View>
        ) : (
          <View className="pb-20 gap-6">
            {upcomingMeets.length > 0 && (
              <View>
                <View className="flex-row items-center gap-2 mb-3">
                  <View className="h-2 w-2 rounded-full bg-[#F6C453]" />
                  <Text className="text-[11px] font-black uppercase tracking-widest text-[#F6C453]">Competition Dates</Text>
                </View>
                <View className="gap-3">
                  {upcomingMeets.map((item: any) => (
                    <ScheduleCard key={item._id} item={item} />
                  ))}
                </View>
              </View>
            )}

            {practices.length > 0 && (
              <View>
                <View className="flex-row items-center gap-2 mb-3">
                  <View className="h-2 w-2 rounded-full bg-[#8FE7FF]" />
                  <Text className="text-[11px] font-black uppercase tracking-widest text-[#8FE7FF]">Training Sessions</Text>
                </View>
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

function ScheduleCard({ item }: { item: any }) {
  const isMeet = item.type === "meet";
  const accentColor = isMeet ? "#F6C453" : "#8FE7FF";
  const bgColor = isMeet ? "#2F2810" : "#0A1B33";
  const borderColor = isMeet ? "#F6C45340" : "#8FE7FF30";

  const dateObj = new Date(item.date);
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
  const month = dateObj.toLocaleDateString("en-US", { month: "short" });
  const dayNum = dateObj.getDate();

  return (
    <View
      className="overflow-hidden rounded-[22px] p-4 flex-row gap-4"
      style={{ backgroundColor: bgColor, borderWidth: 1, borderColor }}
    >
      <View
        className="items-center justify-center rounded-2xl px-3 py-2 min-w-[52px]"
        style={{ backgroundColor: `${accentColor}20` }}
      >
        <Text className="text-[10px] font-black uppercase" style={{ color: accentColor }}>{dayName}</Text>
        <Text className="text-2xl font-black" style={{ color: accentColor }}>{dayNum}</Text>
        <Text className="text-[10px] font-black uppercase" style={{ color: accentColor }}>{month}</Text>
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <View
            className="rounded-full px-2 py-0.5"
            style={{ backgroundColor: `${accentColor}25` }}
          >
            <Text className="text-[9px] font-black uppercase" style={{ color: accentColor }}>
              {isMeet ? "Competition" : "Practice"}
            </Text>
          </View>
          {item.reminderEnabled ? (
            <Bell size={12} color={accentColor} />
          ) : (
            <BellOff size={12} color="#4B6080" />
          )}
        </View>
        <Text className="text-base font-black text-[#F8FAFC] mb-1">{item.title}</Text>
        <View className="flex-row items-center gap-1">
          <Clock size={11} color="#94A3B8" />
          <Text className="text-[11px] text-[#94A3B8]">{item.startTime} – {item.endTime}</Text>
        </View>
        {item.location && (
          <View className="flex-row items-center gap-1 mt-1">
            <MapPin size={11} color="#94A3B8" />
            <Text className="text-[11px] text-[#94A3B8] flex-1" numberOfLines={1}>{item.location}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function AddScheduleForm({ gymnastId, onCancel }: { gymnastId: any; onCancel: () => void }) {
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

  return (
    <View className="pb-20">
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-xl font-black text-[#F8FAFC]">Add Event</Text>
        <Pressable onPress={onCancel} className="h-11 w-11 items-center justify-center rounded-full bg-[#0A1B33]">
          <X size={18} color="#94A3B8" />
        </Pressable>
      </View>

      <FormSection label="Event Type">
        <View className="flex-row gap-2">
          {(["practice", "meet"] as const).map((type) => (
            <Pressable
              key={type}
              onPress={() => setForm({ ...form, type })}
              className="flex-1 items-center py-3 rounded-2xl"
              style={{
                backgroundColor: form.type === type ? (type === "meet" ? "#F6C453" : "#8FE7FF") : "#0A1B33",
                borderWidth: 1,
                borderColor: form.type === type ? "transparent" : "rgba(255,255,255,0.1)",
              }}
            >
              <Text className="font-black capitalize" style={{ color: form.type === type ? "#061528" : "#94A3B8" }}>
                {type === "meet" ? "Competition" : "Practice"}
              </Text>
            </Pressable>
          ))}
        </View>
      </FormSection>

      <FormSection label="Event Title">
        <DarkInput
          placeholder={isMeet ? "States Invitational" : "Team Practice"}
          value={form.title}
          onChangeText={(t: string) => setForm({ ...form, title: t })}
          accentColor={isMeet ? "#F6C453" : "#8FE7FF"}
        />
      </FormSection>

      <FormSection label="Date (YYYY-MM-DD)">
        <DarkInput
          placeholder="2026-05-18"
          value={form.date}
          onChangeText={(t: string) => setForm({ ...form, date: t })}
          accentColor={isMeet ? "#F6C453" : "#8FE7FF"}
        />
      </FormSection>

      <FormSection label="Time Window">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-[10px] font-black uppercase text-[#94A3B8] mb-1">Start</Text>
            <DarkInput
              placeholder="16:00"
              value={form.startTime}
              onChangeText={(t: string) => setForm({ ...form, startTime: t })}
              accentColor={isMeet ? "#F6C453" : "#8FE7FF"}
            />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-black uppercase text-[#94A3B8] mb-1">End</Text>
            <DarkInput
              placeholder="19:00"
              value={form.endTime}
              onChangeText={(t: string) => setForm({ ...form, endTime: t })}
              accentColor={isMeet ? "#F6C453" : "#8FE7FF"}
            />
          </View>
        </View>
      </FormSection>

      <FormSection label="Location (optional)">
        <DarkInput
          placeholder="Main Gym Floor"
          value={form.location}
          onChangeText={(t: string) => setForm({ ...form, location: t })}
          accentColor={isMeet ? "#F6C453" : "#8FE7FF"}
        />
      </FormSection>

      <View className="flex-row items-center justify-between mb-6 rounded-2xl border border-white/10 bg-[#0A1B33] p-4">
        <View>
          <Text className="font-black text-[#F8FAFC]">Enable Reminder</Text>
          <Text className="text-[11px] text-[#94A3B8]">Notify me before this event</Text>
        </View>
        <Switch
          checked={form.reminderEnabled}
          onCheckedChange={(val) => setForm({ ...form, reminderEnabled: val })}
        />
      </View>

      <View className="flex-row gap-3">
        <Pressable
          onPress={onCancel}
          className="flex-1 items-center rounded-2xl border border-white/10 py-4"
        >
          <Text className="font-black text-[#94A3B8]">Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          className="flex-[2] items-center rounded-2xl py-4"
          style={{ backgroundColor: isMeet ? "#F6C453" : "#8FE7FF" }}
        >
          {loading ? <Spinner /> : <Text className="font-black text-[#061528]">Save Event</Text>}
        </Pressable>
      </View>
    </View>
  );
}

function FormSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="mb-4">
      <Text className="text-[11px] font-black uppercase tracking-widest text-[#8FE7FF] mb-2">{label}</Text>
      {children}
    </View>
  );
}

function DarkInput({ accentColor = "#8FE7FF", ...props }: any) {
  return (
    <View
      className="overflow-hidden rounded-2xl bg-[#0A1B33]"
      style={{ borderWidth: 1, borderColor: `${accentColor}25` }}
    >
      <Input
        className="border-0 bg-transparent px-4 py-3 text-[#F8FAFC]"
        placeholderTextColor="#4B6080"
        {...props}
      />
    </View>
  );
}
