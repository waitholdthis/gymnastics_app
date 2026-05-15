import React, { useState } from "react";
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, View,
} from "react-native";
import { Lock, Mail, Trophy } from "lucide-react-native";

import { Input, SafeAreaView, Spinner, Text } from "@/components/ui";
import { useAuthActions } from "@/lib/demoData";

type AuthMode = "signIn" | "signUp";

const GOLD = "#D4AF37";
const OBSIDIAN = "#08080E";
const CHALK = "#F5F5F5";

export default function AuthScreen() {
  const { signIn, signUp } = useAuthActions();
  const [mode, setMode] = useState<AuthMode>("signUp");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "signUp";

  const handleSubmit = async () => {
    if (!identifier.trim() || !password) {
      setError(isSignUp ? "Enter an email and password to continue." : "Enter your credentials.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(identifier, password);
      } else {
        await signIn(identifier, password);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: OBSIDIAN }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Wordmark */}
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            {/* Gold radial glow */}
            <View
              style={{
                position: "absolute",
                top: -60,
                width: 280,
                height: 280,
                borderRadius: 140,
                backgroundColor: "rgba(212,175,55,0.12)",
              }}
            />

            <View
              style={{
                width: 80,
                height: 80,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 24,
                borderWidth: 1,
                borderColor: GOLD + "40",
                backgroundColor: GOLD + "14",
                marginBottom: 20,
              }}
            >
              <Trophy size={40} color={GOLD} />
            </View>

            <Text
              style={{
                fontSize: 9, fontWeight: "900", letterSpacing: 4,
                textTransform: "uppercase", color: GOLD, marginBottom: 6,
              }}
            >
              Welcome to
            </Text>
            <Text
              style={{
                fontSize: 44, fontWeight: "900", color: CHALK,
                letterSpacing: -1.5, lineHeight: 48,
              }}
            >
              The{" "}
              <Text
                style={{
                  fontSize: 44,
                  fontWeight: "900",
                  fontStyle: "italic",
                  lineHeight: 48,
                  color: GOLD,
                }}
              >
                Ascent
              </Text>
            </Text>
            <Text
              style={{
                marginTop: 12,
                maxWidth: 300,
                textAlign: "center",
                fontSize: 13,
                lineHeight: 20,
                color: "rgba(245,245,245,0.5)",
              }}
            >
              Where gymnastics meets precision. Skill maps, cinematic reels, and coach connections.
            </Text>
          </View>

          {/* Auth card */}
          <View
            style={{
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.09)",
              backgroundColor: "rgba(255,255,255,0.04)",
              padding: 24,
              overflow: "hidden",
            }}
          >
            {/* Decorative glow */}
            <View
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "rgba(212,175,55,0.12)",
              }}
            />

            <Text
              style={{
                fontSize: 9, fontWeight: "900", textTransform: "uppercase",
                letterSpacing: 2, color: GOLD, marginBottom: 6,
              }}
            >
              {isSignUp ? "Start the Quest" : "Return to Mission Control"}
            </Text>
            <Text
              style={{
                fontSize: 26, fontWeight: "900", color: CHALK,
                letterSpacing: -0.5, marginBottom: 24,
              }}
            >
              {isSignUp ? "Create your account" : "Sign in"}
            </Text>

            {/* Email field */}
            <View style={{ marginBottom: 14 }}>
              <Text
                style={{
                  fontSize: 10, fontWeight: "900", textTransform: "uppercase",
                  letterSpacing: 1, color: "rgba(245,245,245,0.55)", marginBottom: 8,
                }}
              >
                {isSignUp ? "Email" : "Email or username"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.09)",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  paddingHorizontal: 14,
                  gap: 10,
                }}
              >
                <Mail size={17} color="rgba(245,245,245,0.4)" />
                <Input
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder={isSignUp ? "parent@example.com" : "email or username"}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  style={{ flex: 1, color: "#000000", paddingVertical: 14 }}
                  placeholderTextColor="rgba(245,245,245,0.3)"
                />
              </View>
            </View>

            {/* Password field */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 10, fontWeight: "900", textTransform: "uppercase",
                  letterSpacing: 1, color: "rgba(245,245,245,0.55)", marginBottom: 8,
                }}
              >
                Password
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.09)",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  paddingHorizontal: 14,
                  gap: 10,
                }}
              >
                <Lock size={17} color="rgba(245,245,245,0.4)" />
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  secureTextEntry
                  autoComplete="password"
                  style={{ flex: 1, color: "#000000", paddingVertical: 14 }}
                  placeholderTextColor="rgba(245,245,245,0.3)"
                />
              </View>
            </View>

            {error ? (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#EF4444",
                  marginBottom: 16,
                }}
              >
                {error}
              </Text>
            ) : null}

            {/* Primary CTA */}
            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={{
                alignItems: "center",
                borderRadius: 12,
                paddingVertical: 16,
                backgroundColor: GOLD,
                marginBottom: 16,
              }}
            >
              {loading ? (
                <Spinner />
              ) : (
                <Text style={{ fontWeight: "900", fontSize: 15, color: OBSIDIAN }}>
                  {isSignUp ? "Begin Your Ascent" : "Sign In"}
                </Text>
              )}
            </Pressable>

            {/* Toggle mode */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <Text style={{ fontSize: 13, color: "rgba(245,245,245,0.45)" }}>
                {isSignUp ? "Already enrolled?" : "New to The Ascent?"}
              </Text>
              <Pressable
                onPress={() => { setError(""); setMode(isSignUp ? "signIn" : "signUp"); }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={{ fontSize: 13, fontWeight: "900", color: GOLD }}>
                  {isSignUp ? " Sign in" : " Create account"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Demo hint */}
          <View
            style={{
              marginTop: 16,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "rgba(34,197,94,0.2)",
              backgroundColor: "rgba(34,197,94,0.07)",
              padding: 14,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", lineHeight: 18, color: "rgba(34,197,94,0.8)" }}>
              Demo account: demo@gymparent.local / password
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
