import React, { useState } from "react";
import { Alert, Linking, Platform, Pressable, ScrollView, View } from "react-native";
import { api, useQuery } from "@/lib/demoData";
import { Text, Input, SafeAreaView, Spinner } from "@/components/ui";
import {
  BookOpen,
  ChevronRight,
  Compass,
  ExternalLink,
  Info,
  PlayCircle,
  Search,
  X,
} from "lucide-react-native";

const APPARATUS_LIST = ["Vault", "Bars", "Beam", "Floor"] as const;

const APPARATUS_THEME: Record<string, { color: string; bg: string }> = {
  Vault: { color: "#C2500A", bg: "#FFF0E8" },
  Bars:  { color: "#1D5BB5", bg: "#EFF6FF" },
  Beam:  { color: "#BE185D", bg: "#FDF2F8" },
  Floor: { color: "#16A34A", bg: "#F0FDF4" },
};

const SHADOW = { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 };

const GET_GUIDE_CONTENT = (title: string) => {
  const normalizedTitle = title.trim();
  switch (normalizedTitle) {
    case "Glossary": return [
      { heading: "Salto", body: "A complete flip in the air without touching the ground with hands." },
      { heading: "Amplitude", body: "The height or 'bigness' of a skill. Judges look for high flight in releases and vaults." },
      { heading: "Stick", body: "Landing a skill without moving your feet at all. Worth a major bonus in scores!" },
      { heading: "Kip", body: "The foundational mounting skill for bars. Often the hardest skill for beginners to master." },
      { heading: "Series", body: "Two or more skills performed in immediate succession. In beam, a 'flight series' is required." },
      { heading: "Dismount", body: "The final skill to exit an apparatus. Points are often lost here for steps or lack of control." },
      { heading: "Layout", body: "Body position where the gymnast is fully extended — straight legs, long body." },
      { heading: "Pike", body: "Legs straight, body bent at the hips, forming an 'L' shape." },
      { heading: "Tuck", body: "Knees pulled into the chest and back rounded — the most compact rotation shape." },
      { heading: "Connection", body: "Skills back-to-back without pause. Judges award Connection Value (CV) bonus points." },
      { heading: "Giant", body: "A full 360° rotation around the high bar with the body fully extended." },
      { heading: "Execution", body: "How well a skill is performed. Straight legs, pointed toes. Most deductions come from here." },
      { heading: "Neutral Deduction", body: "Penalties for things outside specific skills — stepping out of bounds, going over time." },
    ];
    case "Home Safety Rules": return [
      { heading: "Conditioning Only", body: "Home should be for strength, flexibility, and recovery. Never try skills that require a spotter or mats.", warning: "Practicing kips or handsprings on furniture can cause serious spinal injuries." },
      { heading: "Surface Safety", body: "Basic rolls should only be done on professional-grade gymnastics mats, never on hardwood or thin carpet." },
      { heading: "No Outdoor Trampolines", body: "Backyard trampolines lack the tension and safety pits of gym equipment.", warning: "Attempting flips blindly on home trampolines is a common cause of neck injuries." },
      { heading: "Supervision Required", body: "A parent should always be present during home conditioning to ensure proper form and safety." },
    ];
    case "Grips & Gear 101": return [
      { heading: "When to Get Grips", body: "Typically once a gymnast is in Level 3 or 4 and training 6+ hours a week." },
      { heading: "Proper Sizing", body: "Ask your coach to size them. Grips that are too long can 'lock up' on the bar — dangerous." },
      { heading: "Chalk Use", body: "Chalk reduces friction and sweat. Too much chalk can actually cause more rips." },
      { heading: "Wristbands", body: "Long cotton wristbands worn under grips prevent the leather from chafing the skin." },
      { heading: "Grip Brushes", body: "A small wire brush roughens up leather when it gets too smooth from chalk build-up." },
    ];
    case "Understanding Deductions": return [
      { heading: "Point Toes", body: "Every time a gymnast flexes their feet when they should be pointed — typically a 0.1 deduction." },
      { heading: "Bent Arms/Legs", body: "0.1 to 0.3 depending on severity. Straight lines are the goal!" },
      { heading: "Fall from Apparatus", body: "A major 0.5 deduction. If she gets back up within 30-45 seconds, she can finish." },
      { heading: "Extra Swings", body: "On bars, taking an extra 'empty' swing to build momentum is a 0.1 deduction." },
      { heading: "Step on Landing", body: "A small step is 0.1, a large step is 0.2. Multiple steps can add up to 0.3 or more." },
      { heading: "Out of Bounds", body: "Stepping outside the white line on floor exercise is a 0.1 neutral deduction." },
    ];
    case "Vault": return [
      { heading: "The Run", body: "Speed is the engine of a good vault. Gymnasts should accelerate all the way to the board." },
      { heading: "The Pre-Flight", body: "The moment from the board to the vault table. Body position must be tight." },
      { heading: "Repulsion", body: "The quick push off the table using the shoulders, not bending the arms." },
    ];
    case "Bars": return [
      { heading: "Casting", body: "The foundational movement for all bar skills. Aim for a straight line to handstand." },
      { heading: "Grip Changes", body: "Switching from over-grip to under-grip for skills like giants or front circles." },
      { heading: "The Hollow Body", body: "Essential shape for bars — ribs in, pelvis tucked, and core engaged." },
    ];
    case "Beam": return [
      { heading: "Square Shoulders", body: "Keeping shoulders and hips square to the beam is key for balance." },
      { heading: "Spotting", body: "Looking at the end of the beam to maintain orientation during skills." },
      { heading: "Precision Landings", body: "Landing with one foot in front of the other maximizes stability on the 4-inch surface." },
    ];
    case "Floor": return [
      { heading: "Tumbling Passes", body: "A series of acrobatic skills across the floor. Must include different directions." },
      { heading: "Artistry", body: "How the gymnast expresses the music through dance and choreography." },
      { heading: "Corner Prep", body: "The moment in the corner before a pass where the gymnast resets focus and lunges." },
    ];
    default: return [{ heading: "Coming Soon", body: "This guide is being updated by our consultants." }];
  }
};

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApparatus, setSelectedApparatus] = useState<string | null>(null);
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  const allSkillsRaw = useQuery(
    api.gymnasts.getSkillsByApparatus,
    selectedApparatus ? { apparatus: selectedApparatus as any } : {}
  );
  const allSkills = allSkillsRaw ?? [];
  const isLoading = allSkillsRaw === undefined;
  const glossaryItems = GET_GUIDE_CONTENT("Glossary");

  const filteredSkills = Array.isArray(allSkills)
    ? allSkills.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const filteredGlossary =
    searchQuery.length > 0
      ? glossaryItems.filter(
          (item) =>
            item.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.body.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  const handleWatchVideo = (skillName: string) => {
    const searchUrl = `https://www.youtube.com/results?search_query=gymnastics+${skillName.replace(/\s+/g, "+")}+tutorial`;
    if (Platform.OS === "web") {
      Linking.openURL(searchUrl);
      return;
    }
    Alert.alert("Watch Tutorial", `Open a tutorial for ${skillName}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Watch Now", onPress: () => Linking.openURL(searchUrl) },
    ]);
  };

  if (activeGuide) {
    return <GuideDetailView title={activeGuide} onBack={() => setActiveGuide(null)} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Nav */}
      <View className="flex-row items-center gap-3 px-4 pt-4 pb-3 border-b border-[#E8E8E8]">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#FDF6E3]">
          <Compass size={20} color="#D4A843" />
        </View>
        <View>
          <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843]">Knowledge Hub</Text>
          <Text className="text-xl font-black text-[#1A1A1A]">Atlas</Text>
        </View>
      </View>

      {/* Search */}
      <View className="mx-4 mt-3 mb-2 overflow-hidden rounded-xl border border-[#E8E8E8] bg-[#F8F8F6] flex-row items-center px-3">
        <Search size={16} color="#AAAAAA" />
        <Input
          placeholder="Search skills, terms, or rules..."
          className="flex-1 border-0 bg-transparent h-11 text-[#1A1A1A]"
          placeholderTextColor="#BBBBBB"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <X size={16} color="#AAAAAA" />
          </Pressable>
        )}
      </View>

      {/* Filter chips */}
      <View className="mb-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
        >
          <Pressable
            onPress={() => setSelectedApparatus(null)}
            className="rounded-full px-4 py-2"
            style={{
              backgroundColor: !selectedApparatus ? "#FDF6E3" : "#F8F8F6",
              borderWidth: 1,
              borderColor: !selectedApparatus ? "#D4A843" : "#E8E8E8",
            }}
          >
            <Text className="font-black text-sm" style={{ color: !selectedApparatus ? "#D4A843" : "#888888" }}>
              All Gear
            </Text>
          </Pressable>
          {APPARATUS_LIST.map((app) => {
            const isSelected = selectedApparatus === app;
            const theme = APPARATUS_THEME[app];
            return (
              <Pressable
                key={app}
                onPress={() => setSelectedApparatus(app)}
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: isSelected ? theme.bg : "#F8F8F6",
                  borderWidth: 1,
                  borderColor: isSelected ? theme.color : "#E8E8E8",
                }}
              >
                <Text className="font-black text-sm" style={{ color: isSelected ? theme.color : "#888888" }}>
                  {app}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        {searchQuery.length === 0 && !selectedApparatus ? (
          <IntroductionSection onNavigate={setActiveGuide} />
        ) : (
          <View className="gap-4 pb-28">
            {isLoading ? (
              <View className="py-10 items-center"><Spinner /></View>
            ) : filteredSkills.length === 0 && filteredGlossary.length === 0 ? (
              <View className="items-center py-20">
                <Text className="text-[#888888] text-center">No matches found for "{searchQuery}"</Text>
              </View>
            ) : (
              <>
                {filteredGlossary.length > 0 && (
                  <View className="mb-2">
                    <SectionLabel label="Glossary Matches" />
                    {filteredGlossary.map((item, idx) => (
                      <View
                        key={`glossary-${idx}`}
                        className="mb-2 rounded-2xl bg-white p-4"
                        style={[SHADOW, { borderLeftWidth: 3, borderLeftColor: "#D4A843", borderWidth: 1, borderColor: "#F0F0EE" }]}
                      >
                        <Text className="font-black text-[#D4A843] mb-1">{item.heading}</Text>
                        <Text className="text-xs text-[#888888] leading-4">{item.body}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {filteredSkills.length > 0 && (
                  <View>
                    {filteredGlossary.length > 0 && <SectionLabel label="Skills" />}
                    {filteredSkills.map((skill: any) => {
                      const appTheme = APPARATUS_THEME[skill.apparatus] ?? { color: "#1D5BB5", bg: "#EFF6FF" };
                      return (
                        <View
                          key={skill._id}
                          className="mb-3 rounded-2xl bg-white p-4"
                          style={SHADOW}
                        >
                          <View className="flex-row items-start justify-between mb-2">
                            <View className="flex-1 pr-3">
                              <Text className="font-black text-[#1A1A1A] text-base">{skill.name}</Text>
                              <View className="flex-row items-center gap-2 mt-1">
                                <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: appTheme.bg }}>
                                  <Text className="text-[10px] font-black uppercase" style={{ color: appTheme.color }}>{skill.apparatus}</Text>
                                </View>
                                <Text className="text-[10px] font-bold uppercase text-[#AAAAAA]">Level {skill.level}</Text>
                              </View>
                            </View>
                            <Pressable
                              onPress={() => handleWatchVideo(skill.name)}
                              className="h-10 w-10 items-center justify-center rounded-full"
                              style={{ backgroundColor: appTheme.bg }}
                            >
                              <PlayCircle size={22} color={appTheme.color} />
                            </Pressable>
                          </View>
                          <Text className="text-xs text-[#888888] leading-4">
                            Technical Focus: Proper shoulder alignment and core tension are key for this milestone.
                          </Text>
                          <Pressable
                            onPress={() => handleWatchVideo(skill.name)}
                            className="flex-row items-center gap-1 mt-2"
                          >
                            <Text className="text-xs font-black" style={{ color: appTheme.color }}>Watch Tutorial</Text>
                            <ExternalLink size={11} color={appTheme.color} />
                          </Pressable>
                        </View>
                      );
                    })}
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-3 mb-3">
      <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843]">{label}</Text>
      <View className="flex-1 h-px bg-[#E8E8E8]" />
    </View>
  );
}

function IntroductionSection({ onNavigate }: { onNavigate: (t: string) => void }) {
  return (
    <View className="gap-5 pb-28">
      {/* Gym Dictionary — dark hero */}
      <View className="overflow-hidden rounded-2xl bg-[#1A1A2E] p-5">
        <View className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#D4A843]/10" />
        <View className="flex-row items-center gap-3 mb-2">
          <BookOpen size={22} color="#D4A843" />
          <Text className="font-black text-lg text-white">The Gym Dictionary</Text>
        </View>
        <Text className="text-sm text-[#9999BB] mb-4 leading-4">
          Confused by what the coach is saying? Learn the language of the gym floor.
        </Text>
        <Pressable
          onPress={() => onNavigate("Glossary")}
          className="flex-row items-center gap-2 self-start rounded-xl bg-[#D4A843] px-4 py-2.5"
        >
          <Text className="font-black text-[#1A1A1A]">Browse Glossary</Text>
          <ChevronRight size={14} color="#1A1A1A" />
        </Pressable>
      </View>

      {/* Apparatus grid */}
      <View>
        <SectionLabel label="Technical Foundations" />
        <View className="flex-row flex-wrap gap-3">
          {APPARATUS_LIST.map((app) => {
            const theme = APPARATUS_THEME[app];
            return (
              <Pressable
                key={app}
                onPress={() => onNavigate(app)}
                className="min-w-[44%] flex-1 rounded-2xl bg-white p-4"
                style={SHADOW}
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl mb-2"
                  style={{ backgroundColor: theme.bg }}
                >
                  <Text style={{ fontSize: 18 }}>{getApparatusEmoji(app)}</Text>
                </View>
                <Text className="font-black text-[#1A1A1A]">{app}</Text>
                <Text className="text-[10px] font-bold uppercase mt-0.5" style={{ color: theme.color }}>
                  Master the techniques
                </Text>
                <View className="flex-row items-center gap-1 mt-2">
                  <Text className="text-[10px] font-black uppercase text-[#D4A843]">Open</Text>
                  <ChevronRight size={10} color="#D4A843" />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Essential Guides */}
      <View>
        <SectionLabel label="Essential Guides" />
        <View className="gap-2">
          <GuideItem
            title="Grips & Gear 101"
            description="When does your gymnast need grips? How to size them correctly."
            emoji="🧤"
            onPress={() => onNavigate("Grips & Gear 101")}
          />
          <GuideItem
            title="Understanding Deductions"
            description="Why did she lose points? A breakdown of common judging cues."
            emoji="📋"
            onPress={() => onNavigate("Understanding Deductions")}
          />
          <GuideItem
            title="Home Safety Rules"
            description="What skills should NEVER be practiced at home without a coach."
            emoji="🛡️"
            onPress={() => onNavigate("Home Safety Rules")}
          />
        </View>
      </View>
    </View>
  );
}

function GuideItem({ title, description, emoji, onPress }: {
  title: string;
  description: string;
  emoji: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl bg-white p-4"
      style={SHADOW}
    >
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#F8F8F6]">
        <Text style={{ fontSize: 20 }}>{emoji}</Text>
      </View>
      <View className="flex-1">
        <Text className="font-black text-[#1A1A1A]">{title}</Text>
        <Text className="text-xs text-[#888888] mt-0.5 leading-4" numberOfLines={2}>{description}</Text>
      </View>
      <ChevronRight size={16} color="#D4A843" />
    </Pressable>
  );
}

function GuideDetailView({ title, onBack }: { title: string; onBack: () => void }) {
  const content = GET_GUIDE_CONTENT(title);
  const isApparatus = APPARATUS_LIST.includes(title as any);
  const appTheme = isApparatus ? APPARATUS_THEME[title] : null;
  const accentColor = appTheme?.color ?? "#D4A843";

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="px-4 pt-4 pb-4 flex-row items-center gap-3 border-b border-[#E8E8E8]">
        <Pressable
          onPress={onBack}
          className="h-11 w-11 items-center justify-center rounded-full bg-[#F0F0EE]"
        >
          <Text style={{ fontSize: 18 }}>←</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843]">Guide</Text>
          <Text className="text-2xl font-black text-[#1A1A1A]">{title}</Text>
        </View>
      </View>
      <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">
        <View className="gap-4 pb-28">
          {content.map((section, idx) => (
            <View
              key={idx}
              className="rounded-2xl bg-white p-4"
              style={[SHADOW, { borderLeftWidth: 3, borderLeftColor: accentColor }]}
            >
              <Text className="font-black mb-2" style={{ color: accentColor }}>{section.heading}</Text>
              <Text className="text-sm text-[#555555] leading-5">{section.body}</Text>
              {section.warning && (
                <View className="flex-row items-start gap-2 mt-3 rounded-xl bg-[#FFF0F0] p-3">
                  <Info size={14} color="#E54B4B" />
                  <Text className="text-xs text-[#E54B4B] font-bold flex-1 leading-4">{section.warning}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getApparatusEmoji(apparatus: string) {
  switch (apparatus) {
    case "Vault": return "🚀";
    case "Bars":  return "⭐";
    case "Beam":  return "🏛️";
    case "Floor": return "🎭";
    default: return "🏅";
  }
}
