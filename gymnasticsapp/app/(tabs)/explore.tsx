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
import { useAppTheme } from "@/lib/appTheme";
import { Entrance } from "@/components/cinematic/Entrance";

const APPARATUS_LIST = ["Vault", "Bars", "Beam", "Floor"] as const;

const APPARATUS_THEME: Record<string, { color: string }> = {
  Vault: { color: "#C2500A" },
  Bars:  { color: "#1D5BB5" },
  Beam:  { color: "#BE185D" },
  Floor: { color: "#16A34A" },
};

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

function getApparatusBg(apparatus: string, colors: ReturnType<typeof useAppTheme>["colors"]): string {
  switch (apparatus) {
    case "Vault":  return colors.orangeBg;
    case "Bars":   return colors.blueBg;
    case "Beam":   return colors.pinkBg;
    case "Floor":  return colors.greenBg;
    default:       return colors.bgSecondary;
  }
}

export default function ExploreScreen() {
  const { colors } = useAppTheme();
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
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.bg }} edges={["top"]}>
      {/* Nav */}
      <View
        style={{
          flexDirection: "row", alignItems: "center", gap: 12,
          paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
          borderBottomWidth: 1, borderBottomColor: colors.border,
        }}
      >
        <View
          style={{
            width: 44, height: 44, alignItems: "center", justifyContent: "center",
            borderRadius: 22, backgroundColor: colors.goldBg,
            borderWidth: 1, borderColor: colors.gold + "30",
          }}
        >
          <Compass size={20} color={colors.gold} />
        </View>
        <View>
          <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2, color: colors.gold }}>
            Knowledge Hub
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "900", color: colors.text, letterSpacing: -0.5 }}>
            Atlas
          </Text>
        </View>
      </View>

      {/* Search */}
      <View
        className="mx-4 mt-3 mb-2 overflow-hidden rounded-xl border flex-row items-center px-3"
        style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border }}
      >
        <Search size={16} color={colors.textDisabled} />
        <Input
          placeholder="Search skills, terms, or rules..."
          className="flex-1 border-0 bg-transparent h-11"
          style={{ color: colors.text }}
          placeholderTextColor={colors.textDisabled}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <X size={16} color={colors.textDisabled} />
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
              backgroundColor: !selectedApparatus ? colors.goldBg : colors.bgSecondary,
              borderWidth: 1,
              borderColor: !selectedApparatus ? colors.gold : colors.border,
            }}
          >
            <Text className="font-black text-sm" style={{ color: !selectedApparatus ? colors.gold : colors.textMuted }}>
              All Gear
            </Text>
          </Pressable>
          {APPARATUS_LIST.map((app) => {
            const isSelected = selectedApparatus === app;
            const themeColor = APPARATUS_THEME[app].color;
            const themeBg = getApparatusBg(app, colors);
            return (
              <Pressable
                key={app}
                onPress={() => setSelectedApparatus(app)}
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: isSelected ? themeBg : colors.bgSecondary,
                  borderWidth: 1,
                  borderColor: isSelected ? themeColor : colors.border,
                }}
              >
                <Text className="font-black text-sm" style={{ color: isSelected ? themeColor : colors.textMuted }}>
                  {app}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <Entrance delay={0} style={{ flex: 1 }}>
      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        {searchQuery.length === 0 && !selectedApparatus ? (
          <IntroductionSection onNavigate={setActiveGuide} />
        ) : (
          <View className="gap-4 pb-28">
            {isLoading ? (
              <View className="py-10 items-center"><Spinner /></View>
            ) : filteredSkills.length === 0 && filteredGlossary.length === 0 ? (
              <View className="items-center py-20">
                <Text className="text-center" style={{ color: colors.textMuted }}>No matches found for "{searchQuery}"</Text>
              </View>
            ) : (
              <>
                {filteredGlossary.length > 0 && (
                  <View className="mb-2">
                    <SectionLabel label="Glossary Matches" />
                    {filteredGlossary.map((item, idx) => (
                      <View
                        key={`glossary-${idx}`}
                        className="mb-2 rounded-2xl p-4"
                        style={[
                          colors.shadow,
                          {
                            backgroundColor: colors.surface,
                            borderLeftWidth: 3,
                            borderLeftColor: colors.gold,
                            borderWidth: 1,
                            borderColor: colors.borderLight,
                          },
                        ]}
                      >
                        <Text className="font-black mb-1" style={{ color: colors.gold }}>{item.heading}</Text>
                        <Text className="text-xs leading-4" style={{ color: colors.textMuted }}>{item.body}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {filteredSkills.length > 0 && (
                  <View>
                    {filteredGlossary.length > 0 && <SectionLabel label="Skills" />}
                    {filteredSkills.map((skill: any) => {
                      const appThemeColor = APPARATUS_THEME[skill.apparatus]?.color ?? "#1D5BB5";
                      const appThemeBg = getApparatusBg(skill.apparatus, colors);
                      return (
                        <View
                          key={skill._id}
                          className="mb-3 rounded-2xl p-4"
                          style={[{ backgroundColor: colors.surface }, colors.shadow]}
                        >
                          <View className="flex-row items-start justify-between mb-2">
                            <View className="flex-1 pr-3">
                              <Text className="font-black text-base" style={{ color: colors.text }}>{skill.name}</Text>
                              <View className="flex-row items-center gap-2 mt-1">
                                <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: appThemeBg }}>
                                  <Text className="text-[10px] font-black uppercase" style={{ color: appThemeColor }}>{skill.apparatus}</Text>
                                </View>
                                <Text className="text-[10px] font-bold uppercase" style={{ color: colors.textDisabled }}>Level {skill.level}</Text>
                              </View>
                            </View>
                            <Pressable
                              onPress={() => handleWatchVideo(skill.name)}
                              className="h-10 w-10 items-center justify-center rounded-full"
                              style={{ backgroundColor: appThemeBg }}
                            >
                              <PlayCircle size={22} color={appThemeColor} />
                            </Pressable>
                          </View>
                          <Text className="text-xs leading-4" style={{ color: colors.textMuted }}>
                            Technical Focus: Proper shoulder alignment and core tension are key for this milestone.
                          </Text>
                          <Pressable
                            onPress={() => handleWatchVideo(skill.name)}
                            className="flex-row items-center gap-1 mt-2"
                          >
                            <Text className="text-xs font-black" style={{ color: appThemeColor }}>Watch Tutorial</Text>
                            <ExternalLink size={11} color={appThemeColor} />
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
      </Entrance>
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

function IntroductionSection({ onNavigate }: { onNavigate: (t: string) => void }) {
  const { colors } = useAppTheme();
  return (
    <View className="gap-5 pb-28">
      {/* Gym Dictionary — dark hero */}
      <View className="overflow-hidden rounded-2xl p-5" style={{ backgroundColor: colors.hero }}>
        <View style={{ position: "absolute", top: -16, right: -16, width: 120, height: 120, borderRadius: 60, backgroundColor: colors.goldGlow }} />
        <View className="flex-row items-center gap-3 mb-2">
          <BookOpen size={22} color={colors.gold} />
          <Text className="font-black text-lg" style={{ color: colors.heroText }}>The Gym Dictionary</Text>
        </View>
        <Text className="text-sm mb-4 leading-4" style={{ color: colors.heroSubtext }}>
          Confused by what the coach is saying? Learn the language of the gym floor.
        </Text>
        <Pressable
          onPress={() => onNavigate("Glossary")}
          className="flex-row items-center gap-2 self-start rounded-xl px-4 py-2.5"
          style={{ backgroundColor: colors.gold }}
        >
          <Text className="font-black" style={{ color: "#1A1A1A" }}>Browse Glossary</Text>
          <ChevronRight size={14} color="#1A1A1A" />
        </Pressable>
      </View>

      {/* Apparatus grid */}
      <View>
        <SectionLabel label="Technical Foundations" />
        <View className="flex-row flex-wrap gap-3">
          {APPARATUS_LIST.map((app) => {
            const themeColor = APPARATUS_THEME[app].color;
            const themeBg = getApparatusBg(app, colors);
            return (
              <Pressable
                key={app}
                onPress={() => onNavigate(app)}
                className="min-w-[44%] flex-1 rounded-2xl p-4"
                style={[{ backgroundColor: colors.surface }, colors.shadow]}
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl mb-2"
                  style={{ backgroundColor: themeBg }}
                >
                  <Text style={{ fontSize: 18 }}>{getApparatusEmoji(app)}</Text>
                </View>
                <Text className="font-black" style={{ color: colors.text }}>{app}</Text>
                <Text className="text-[10px] font-bold uppercase mt-0.5" style={{ color: themeColor }}>
                  Master the techniques
                </Text>
                <View className="flex-row items-center gap-1 mt-2">
                  <Text className="text-[10px] font-black uppercase" style={{ color: colors.gold }}>Open</Text>
                  <ChevronRight size={10} color={colors.gold} />
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
  const { colors } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl p-4"
      style={[{ backgroundColor: colors.surface }, colors.shadow]}
    >
      <View
        className="h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: colors.bgSecondary }}
      >
        <Text style={{ fontSize: 20 }}>{emoji}</Text>
      </View>
      <View className="flex-1">
        <Text className="font-black" style={{ color: colors.text }}>{title}</Text>
        <Text className="text-xs mt-0.5 leading-4" style={{ color: colors.textMuted }} numberOfLines={2}>{description}</Text>
      </View>
      <ChevronRight size={16} color={colors.gold} />
    </Pressable>
  );
}

function GuideDetailView({ title, onBack }: { title: string; onBack: () => void }) {
  const { colors } = useAppTheme();
  const content = GET_GUIDE_CONTENT(title);
  const isApparatus = APPARATUS_LIST.includes(title as any);
  const accentColor = isApparatus ? APPARATUS_THEME[title].color : colors.gold;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.bg }} edges={["top"]}>
      <View
        className="px-4 pt-4 pb-4 flex-row items-center gap-3 border-b"
        style={{ borderColor: colors.border }}
      >
        <Pressable
          onPress={onBack}
          className="h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.backBtnBg }}
        >
          <Text style={{ fontSize: 18, color: colors.backBtnIcon }}>←</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.gold }}>Guide</Text>
          <Text className="text-2xl font-black" style={{ color: colors.text }}>{title}</Text>
        </View>
      </View>
      <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">
        <View className="gap-4 pb-28">
          {content.map((section, idx) => (
            <View
              key={idx}
              className="rounded-2xl p-4"
              style={[
                colors.shadow,
                {
                  backgroundColor: colors.surface,
                  borderLeftWidth: 3,
                  borderLeftColor: accentColor,
                },
              ]}
            >
              <Text className="font-black mb-2" style={{ color: accentColor }}>{section.heading}</Text>
              <Text className="text-sm leading-5" style={{ color: colors.textSecondary }}>{section.body}</Text>
              {section.warning && (
                <View
                  className="flex-row items-start gap-2 mt-3 rounded-xl p-3"
                  style={{ backgroundColor: colors.redBg }}
                >
                  <Info size={14} color={colors.red} />
                  <Text className="text-xs font-bold flex-1 leading-4" style={{ color: colors.red }}>{section.warning}</Text>
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
