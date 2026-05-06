import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { api, useMutation } from "@/lib/demoData";
import { 
  Text, 
  Button, 
  Input, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  Spinner,
  SafeAreaView
} from "@/components/ui";
import { UserCircle } from "lucide-react-native";

export default function ProfileSetup() {
  const updateProfile = useMutation(api.gymnasts.updateProfile);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username) {
      setError("Please choose a username");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await updateProfile({ username });
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
          <View className="items-center mb-10">
            <UserCircle size={80} className="text-primary mb-4" />
            <Text variant="h1" className="text-3xl text-center font-bold">Create your username</Text>
            <Text className="text-muted-foreground text-center mt-2">
              This is the name you will use inside AeroVault after signing in with your email and password.
            </Text>
          </View>

          <Card>
            <CardHeader>
              <CardTitle>Profile Setup</CardTitle>
              <CardDescription>Your email and password are set. Choose a username next.</CardDescription>
            </CardHeader>
            <CardContent className="gap-4">
              <View>
                <Text className="mb-2 font-medium">Username</Text>
                <Input 
                  placeholder="gym_dad_2024"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {error ? (
                <Text className="text-destructive text-sm font-medium text-center">{error}</Text>
              ) : null}

              <Button 
                size="lg" 
                className="mt-2" 
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? <Spinner className="text-primary-foreground" /> : (
                  <Text className="text-primary-foreground font-bold">Complete Setup</Text>
                )}
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
