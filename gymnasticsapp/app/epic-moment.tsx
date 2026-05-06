import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Film,
  Play,
  Plus,
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

export default function EpicMoment() {
  const router = useRouter();
  const gymnast = useQuery(api.gymnasts.getGymnast);
  const reels = useQuery(api.gymnasts.getReels, gymnast ? { gymnastId: gymnast._id } : "skip");
  const addReel = useMutation(api.gymnasts.addReel);
  const deleteReel = useMutation(api.gymnasts.deleteReel);

  const [uploading, setUploading] = useState(false);
  const [activeReel, setActiveReel] = useState<string | null>(null);

  if (gymnast === undefined || reels === undefined)
    return <View className="flex-1 bg-[#061528] items-center justify-center"><Spinner /></View>;
  if (gymnast === null)
    return <View className="flex-1 bg-[#061528] items-center justify-center"><Text className="text-[#F8FAFC]">Gymnast not found</Text></View>;

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

      await addReel({
        gymnastId: gymnast._id,
        uri: asset.uri,
        title: "Epic Moment",
        duration: durationLabel,
      });
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

      await addReel({
        gymnastId: gymnast._id,
        uri: asset.uri,
        title: "Epic Moment",
        duration: durationLabel,
      });
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

  const handleRenameReel = (reelId: string, currentTitle: string) => {
    // In a real app this would open an inline edit or alert with a text input
    Alert.alert("Rename Reel", `Current name: "${currentTitle}"`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#061528]" edges={["top"]}>
      {/* Header */}
      <View className="px-4 pt-6 pb-4 flex-row items-center gap-3">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full bg-[#0B1F3D]"
        >
          <ChevronLeft size={22} color="#F8FAFC" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[11px] font-black uppercase tracking-widest text-[#F6C453]">Cinematic Vault</Text>
          <Text className="text-2xl font-black text-[#F8FAFC]">Epic Moment Reels</Text>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-full border border-[#F6C453]/30 bg-[#F6C453]/10">
          <Film size={20} color="#F6C453" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Upload Actions */}
        <View className="mb-5 flex-row gap-3">
          <UploadButton
            label="Upload Clip"
            sublabel="From camera roll"
            icon={<Upload size={20} color="#F6C453" />}
            color="#F6C453"
            loading={uploading}
            onPress={handlePickVideo}
          />
          <UploadButton
            label="Record Now"
            sublabel="Use camera"
            icon={<Clapperboard size={20} color="#8FE7FF" />}
            color="#8FE7FF"
            loading={false}
            onPress={handleRecordVideo}
          />
        </View>

        {/* Privacy Banner */}
        <View className="mb-5 flex-row items-start gap-3 rounded-2xl border border-[#65F4A3]/20 bg-[#65F4A3]/08 p-4">
          <View className="mt-0.5">
            <Film size={16} color="#65F4A3" />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-black uppercase text-[#65F4A3] mb-1">Fort Knox Privacy</Text>
            <Text className="text-xs leading-4 text-[#94A3B8]">
              All clips stay private by default. Sharing requires your approval and generates a watermarked, expiring link.
            </Text>
          </View>
        </View>

        {/* Empty State */}
        {reels.length === 0 && !uploading && (
          <View className="items-center py-16">
            <View className="h-24 w-24 items-center justify-center rounded-full border border-[#F6C453]/20 bg-[#F6C453]/10 mb-5">
              <Play size={44} color="#F6C453" />
            </View>
            <Text className="text-xl font-black text-[#F8FAFC] mb-2">No Reels Yet</Text>
            <Text className="text-sm text-center text-[#94A3B8] leading-5 max-w-[260px]">
              Upload your first Epic Moment — a stick landing, first kip, or beam salute.
            </Text>
          </View>
        )}

        {uploading && (
          <UploadingCard />
        )}

        {/* Reel List */}
        {reels.length > 0 && (
          <View className="mb-6">
            <Text className="text-[11px] font-black uppercase tracking-widest text-[#8FE7FF] mb-3">
              {reels.length} Clip{reels.length !== 1 ? "s" : ""} in Vault
            </Text>
            <View className="gap-4">
              {reels.map((reel: any) => (
                <ReelCard
                  key={reel._id}
                  reel={reel}
                  isActive={activeReel === reel._id}
                  onPlay={() => setActiveReel(activeReel === reel._id ? null : reel._id)}
                  onShare={handleShare}
                  onDelete={() => handleDelete(reel._id)}
                  onRename={() => handleRenameReel(reel._id, reel.title)}
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
  label,
  sublabel,
  icon,
  color,
  loading,
  onPress,
}: {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={loading}
      className="flex-1"
    >
      <Animated.View
        style={{ transform: [{ scale }] }}
        className="items-center rounded-2xl py-5 px-3"
        style={[
          { transform: [{ scale }] },
          {
            backgroundColor: `${color}15`,
            borderWidth: 1,
            borderColor: `${color}40`,
          },
        ]}
      >
        {loading ? <Spinner /> : icon}
        <Text className="font-black text-sm mt-2" style={{ color }}>{label}</Text>
        <Text className="text-[10px] font-bold uppercase text-[#94A3B8] mt-0.5">{sublabel}</Text>
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
    <View className="mb-4 overflow-hidden rounded-2xl border border-[#F6C453]/20 bg-[#0A1B33] p-4">
      <View className="flex-row items-center gap-3 mb-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#F6C453]/15">
          <Upload size={18} color="#F6C453" />
        </View>
        <View className="flex-1">
          <Text className="font-black text-[#F8FAFC]">Uploading to Vault...</Text>
          <Text className="text-xs text-[#94A3B8]">Encrypting and saving your clip</Text>
        </View>
      </View>
      <View className="h-2 overflow-hidden rounded-full bg-[#061528]">
        <Animated.View
          style={{ width, height: "100%", backgroundColor: "#F6C453", borderRadius: 99 }}
        />
      </View>
    </View>
  );
}

function ReelCard({
  reel,
  isActive,
  onPlay,
  onShare,
  onDelete,
  onRename,
}: {
  reel: any;
  isActive: boolean;
  onPlay: () => void;
  onShare: () => void;
  onDelete: () => void;
  onRename: () => void;
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(reel.title);

  const createdDate = new Date(reel.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View className="overflow-hidden rounded-[22px] border border-[#F6C453]/20 bg-[#0A1B33]">
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
            className="w-full items-center justify-center bg-[#061528]"
            style={{ aspectRatio: 16 / 9 }}
          >
            <View className="h-16 w-16 items-center justify-center rounded-full bg-[#F6C453]/20">
              <Play size={32} color="#F6C453" />
            </View>
            <Text className="mt-3 text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">
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
            <View className="flex-1 mr-2 overflow-hidden rounded-xl border border-[#F6C453]/30 bg-[#061528]">
              <Input
                value={title}
                onChangeText={setTitle}
                onSubmitEditing={() => setEditingTitle(false)}
                onBlur={() => setEditingTitle(false)}
                autoFocus
                className="border-0 bg-transparent px-3 py-2 text-[#F8FAFC] font-black"
              />
            </View>
          ) : (
            <Pressable onPress={() => setEditingTitle(true)} className="flex-1">
              <Text className="font-black text-[#F8FAFC] text-base">{title}</Text>
            </Pressable>
          )}
        </View>
        <Text className="text-[11px] text-[#94A3B8] mb-3">{createdDate}</Text>

        {/* Action Row */}
        <View className="flex-row gap-2">
          <Pressable
            onPress={onShare}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-xl py-2.5"
            style={{ backgroundColor: "#F6C45320", borderWidth: 1, borderColor: "#F6C45340" }}
          >
            <Share size={14} color="#F6C453" />
            <Text className="text-xs font-black text-[#F6C453]">Share</Text>
          </Pressable>
          <Pressable
            onPress={onDelete}
            className="h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: "#F472B620", borderWidth: 1, borderColor: "#F472B640" }}
          >
            <Trash2 size={14} color="#F472B6" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
