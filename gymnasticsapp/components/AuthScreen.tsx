import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Lock, Mail, Sparkles, Trophy } from "lucide-react-native";

import { Button, Card, CardContent, Input, SafeAreaView, Spinner, Text } from "@/components/ui";
import { useAuthActions } from "@/lib/demoData";

type AuthMode = "signIn" | "signUp";

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
      setError(isSignUp ? "Enter an email and password to continue." : "Enter your email or username and password.");
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
    <SafeAreaView className="flex-1 bg-[#061528]">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}>
          <View className="mb-8 items-center">
            <View className="mb-5 h-20 w-20 items-center justify-center rounded-full border border-[#F6C453]/50 bg-[#F6C453]/20">
              <Trophy size={42} color="#F6C453" />
            </View>
            <Text className="text-[12px] font-black uppercase tracking-widest text-[#8FE7FF]">Welcome to</Text>
            <Text className="mt-1 text-5xl font-black text-[#F8FAFC]">AeroVault</Text>
            <Text className="mt-3 max-w-[320px] text-center text-sm leading-5 text-[#C7D2FE]">
              Create your family command account, then choose a username for your athlete journey.
            </Text>
          </View>

          <Card className="overflow-hidden rounded-[26px] border-[#F6C453]/25 bg-[#0B1F3D]">
            <View className="absolute right-[-36px] top-[-36px] h-28 w-28 rounded-full bg-[#F6C453]/15" />
            <View className="absolute bottom-[-42px] left-[-42px] h-28 w-28 rounded-full bg-[#8FE7FF]/10" />
            <CardContent className="gap-4 p-5">
              <View>
                <View className="mb-2 flex-row items-center gap-2">
                  <Sparkles size={16} color="#F6C453" />
                  <Text className="text-[11px] font-black uppercase tracking-widest text-[#F6C453]">
                    {isSignUp ? "Start the Quest" : "Return to Mission Control"}
                  </Text>
                </View>
                <Text className="text-2xl font-black text-[#F8FAFC]">
                  {isSignUp ? "Create your account" : "Sign in"}
                </Text>
              </View>

              <View>
                <Text className="mb-2 font-bold text-[#F8FAFC]">
                  {isSignUp ? "Email" : "Email or username"}
                </Text>
                <View className="flex-row items-center rounded-xl border border-[#8FE7FF]/20 bg-[#061528] px-3">
                  <Mail size={18} color="#8FE7FF" />
                  <Input
                    value={identifier}
                    onChangeText={setIdentifier}
                    placeholder={isSignUp ? "parent@example.com" : "parent@example.com or your_username"}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    className="flex-1 border-0 bg-transparent text-[#F8FAFC]"
                  />
                </View>
              </View>

              <View>
                <Text className="mb-2 font-bold text-[#F8FAFC]">Password</Text>
                <View className="flex-row items-center rounded-xl border border-[#8FE7FF]/20 bg-[#061528] px-3">
                  <Lock size={18} color="#8FE7FF" />
                  <Input
                    value={password}
                    onChangeText={setPassword}
                    placeholder="At least 6 characters"
                    secureTextEntry
                    autoComplete="password"
                    className="flex-1 border-0 bg-transparent text-[#F8FAFC]"
                  />
                </View>
              </View>

              {error ? <Text className="text-center text-sm font-bold text-[#F472B6]">{error}</Text> : null}

              <Button size="lg" className="mt-2 bg-[#F6C453]" onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <Spinner />
                ) : (
                  <Text className="font-black text-[#061528]">
                    {isSignUp ? "Create Account" : "Sign In"}
                  </Text>
                )}
              </Button>

              <View className="flex-row items-center justify-center">
                <Text className="text-sm text-[#C7D2FE]">
                  {isSignUp ? "Already enrolled?" : "New to AeroVault?"}
                </Text>
                <Button
                  variant="link"
                  onPress={() => {
                    setError("");
                    setMode(isSignUp ? "signIn" : "signUp");
                  }}
                >
                  <Text className="font-black text-[#8FE7FF]">
                    {isSignUp ? " Sign in" : " Create account"}
                  </Text>
                </Button>
              </View>

              <View className="rounded-2xl border border-[#65F4A3]/20 bg-[#65F4A3]/10 p-3">
                <Text className="text-xs font-bold leading-5 text-[#D1FAE5]">
                  Demo account: demo@gymparent.local / password
                </Text>
              </View>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
