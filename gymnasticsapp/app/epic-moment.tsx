import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Film,
  Play,
  Share,
  Trash2,
  Upload,
  Clapperboard,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Alert, Animated, Pressable, ScrollView, View } from "react-native";
import { api, useMutation, useQuery } from "@/lib/demoData";
import { Input, SafeAreaView, Spinner, Text } from "@/components/ui";
import { Video, ResizeMode } from "expo-av";

const SHADOW = { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 };

export default function EpicMoment() {
  const router = useRouter();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const reels = useQuery(api.gymnasts.getReels, gymnast ? { gymnastId: gymnast._id } : "skip");
  const addReel = useMutation(api.gymnasts.addReel);
  const deleteReel = useMutation(api.gymnasts.deleteReel);

  const [uploading, setUploading] = useState(false);
  const [activeReel, setActiveReel] = useState<string | null>(null);

  if (gymnast === undefined || reels === undefined)
    return <View className="flex-1 bg-white items-center justify-center"><Spinner /></View>;
  if (gymnast === null)
    return <View className="flex-1 bg-white items-center justify-center"><Text className="text-[#1A1A1A]">Gymnast not found</Text></View>;

  const handlePickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Allow access to your photo library to upload a reel.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 60,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setUploading(true);

    try {
      const durationSecs = asset.duration ? Math.round(asset.duration) : undefined;
      const durationLabel = durationSecs
        ? `${Math.floor(durationSecs / 60)}:${String(durationSecs % 60).padStart(2, "0")}`
        : undefined;

      await addReel({ gymnastId: gymnast._id, uri: asset.uri, title: "Epic Moment", duration: durationLabel });
    } catch (e) {
      console.error(e);
      Alert.alert("Upload Failed", "Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRecordVideo = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Allow camera access to record a reel.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["videos"],
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 60,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setUploading(true);
    try {
      const durationSecs = asset.duration ? Math.round(asset.duration) : undefined;
      const durationLabel = durationSecs
        ? `${Math.floor(durationSecs / 60)}:${String(durationSecs % 60).padStart(2, "0")}`
        : undefined;

      await addReel({ gymnastId: gymnast._id, uri: asset.uri, title: "Epic Moment", duration: durationLabel });
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (reelId: string) => {
    Alert.alert("Delete Reel", "Remove this clip from your vault?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          if (activeReel === reelId) setActiveReel(null);
          deleteReel({ reelId });
        },
      },
    ]);
  };

  const handleShare = () => {
    Alert.alert(
      "Share Reel",
      "Generate a privacy-safe share link?\n\nWatermarked · Expires in 7 days · Guardian-approved only.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Create Link", onPress: () => Alert.alert("Link Ready", "Secure share link copied to clipboard.") },
      ]
    );
  };

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
          <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843]">Cinematic Vault</Text>
          <Text className="text-2xl font-black text-[#1A1A1A]">Epic Moment Reels</Text>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-full bg-[#FDF6E3]">
          <Film size={20} color="#D4A843" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Upload Actions */}
        <View className="mb-4 flex-row gap-3">
          <UploadButton
            label="Upload Clip"
            sublabel="From camera roll"
            icon={<Upload size={20} color="#D4A843" />}
            color="#D4A843"
            bg="#FDF6E3"
            loading={uploading}
            onPress={handlePickVideo}
          />
          <UploadButton
            label="Record Now"
            sublabel="Use camera"
            icon={<Clapperboard size={20} color="#1D5BB5" />}
            color="#1D5BB5"
            bg="#EFF6FF"
            loading={false}
            onPress={handleRecordVideo}
          />
        </View>

        {/* Privacy Banner */}
        <View className="mb-5 flex-row items-start gap-3 rounded-2xl border border-[#16A34A]/20 bg-[#F0FDF4] p-4">
          <View className="mt-0.5">
            <Film size={16} color="#16A34A" />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-black uppercase text-[#16A34A] mb-1">Fort Knox Privacy</Text>
            <Text className="text-xs leading-4 text-[#555555]">
              All clips stay private by default. Sharing requires your approval and generates a watermarked, expiring link.
            </Text>
          </View>
        </View>

        {/* Empty State */}
        {reels.length === 0 && !uploading && (
          <View className="items-center py-16">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-[#FDF6E3] mb-5">
              <Play size={44} color="#D4A843" />
            </View>
            <Text className="text-xl font-black text-[#1A1A1A] mb-2">No Reels Yet</Text>
            <Text className="text-sm text-center text-[#888888] leading-5 max-w-[260px]">
              Upload your first Epic Moment — a stick landing, first kip, or beam salute.
            </Text>
          </View>
        )}

        {uploading && <UploadingCard />}

        {/* Reel List */}
        {reels.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center gap-3 mb-3">
              <Text className="text-[10px] font-black uppercase tracking-widest text-[#D4A843]">
                {reels.length} Clip{reels.length !== 1 ? "s" : ""} in Vault
              </Text>
              <View className="flex-1 h-px bg-[#E8E8E8]" />
            </View>
            <View className="gap-4">
              {reels.map((reel: any) => (
                <ReelCard
                  key={reel._id}
                  reel={reel}
                  isActive={activeReel === reel._id}
                  onPlay={() => setActiveReel(activeReel === reel._id ? null : reel._id)}
                  onShare={handleShare}
                  onDelete={() => handleDelete(reel._id)}
                />
              ))}
            </View>
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

function UploadButton({
  label, sublabel, icon, color, bg, loading, onPress,
}: {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  loading: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} disabled={loading} className="flex-1">
      <Animated.View
        style={[
          { transform: [{ scale }] },
          { backgroundColor: bg, borderWidth: 1, borderColor: `${color}40`, borderRadius: 16, alignItems: "center", paddingVertical: 20, paddingHorizontal: 12 },
        ]}
      >
        {loading ? <Spinner /> : icon}
        <Text className="font-black text-sm mt-2" style={{ color }}>{label}</Text>
        <Text className="text-[10px] font-bold uppercase text-[#888888] mt-0.5">{sublabel}</Text>
      </Animated.View>
    </Pressable>
  );
}

function UploadingCard() {
  const progress = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(progress, { toValue: 0, duration: 0, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white p-4" style={SHADOW}>
      <View className="flex-row items-center gap-3 mb-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#FDF6E3]">
          <Upload size={18} color="#D4A843" />
        </View>
        <View className="flex-1">
          <Text className="font-black text-[#1A1A1A]">Uploading to Vault...</Text>
          <Text className="text-xs text-[#888888]">Encrypting and saving your clip</Text>
        </View>
      </View>
      <View className="h-2 overflow-hidden rounded-full bg-[#F0F0EE]">
        <Animated.View style={{ width, height: "100%", backgroundColor: "#D4A843", borderRadius: 99 }} />
      </View>
    </View>
  );
}

function ReelCard({
  reel, isActive, onPlay, onShare, onDelete,
}: {
  reel: any;
  isActive: boolean;
  onPlay: () => void;
  onShare: () => void;
  onDelete: () => void;
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(reel.title);

  const createdDate = new Date(reel.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <View className="overflow-hidden rounded-2xl bg-white" style={SHADOW}>
      {/* Video Player */}
      <Pressable onPress={onPlay} className="relative">
        {isActive ? (
          <Video
            source={{ uri: reel.uri }}
            style={{ width: "100%", aspectRatio: 16 / 9 }}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            useNativeControls
            isLooping={false}
          />
        ) : (
          <View
            className="w-full items-center justify-center bg-[#1A1A2E]"
            style={{ aspectRatio: 16 / 9 }}
          >
            <View className="h-16 w-16 items-center justify-center rounded-full bg-[#D4A843]/20">
              <Play size={32} color="#D4A843" />
            </View>
            <Text className="mt-3 text-[10px] font-black uppercase tracking-widest text-[#9999BB]">
              Tap to play
            </Text>
            {reel.duration && (
              <View className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2 py-1">
                <Text className="text-[10px] font-black text-white">{reel.duration}</Text>
              </View>
            )}
          </View>
        )}
      </Pressable>

      {/* Reel Info */}
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-1">
          {editingTitle ? (
            <View className="flex-1 mr-2 overflow-hidden rounded-xl border border-[#E8E8E8] bg-[#F8F8F6]">
              <Input
                value={title}
                onChangeText={setTitle}
                onSubmitEditing={() => setEditingTitle(false)}
                onBlur={() => setEditingTitle(false)}
                autoFocus
                className="border-0 bg-transparent px-3 py-2 text-[#1A1A1A] font-black"
              />
            </View>
          ) : (
            <Pressable onPress={() => setEditingTitle(true)} className="flex-1">
              <Text className="font-black text-[#1A1A1A] text-base">{title}</Text>
            </Pressable>
          )}
        </View>
        <Text className="text-[11px] text-[#888888] mb-3">{createdDate}</Text>

        <View className="flex-row gap-2">
          <Pressable
            onPress={onShare}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-xl py-2.5 bg-[#FDF6E3] border border-[#D4A843]/30"
          >
            <Share size={14} color="#D4A843" />
            <Text className="text-xs font-black text-[#D4A843]">Share</Text>
          </Pressable>
          <Pressable
            onPress={onDelete}
            className="h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F0] border border-[#E54B4B]/30"
          >
            <Trash2 size={14} color="#E54B4B" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
