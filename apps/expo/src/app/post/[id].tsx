import { SafeAreaView, Text, View } from "react-native";
import { Stack, useGlobalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { trpc } from "~/utils/api";

export default function Post() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const { data } = useQuery(trpc.post.byId.queryOptions({ id }));

  if (!data) return null;

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: data.title }} />
      <View className="p-4 h-full w-full">
        <Text className="py-2 text-3xl font-bold text-primary">{data.title}</Text>
        <Text className="py-4 text-foreground">{data.content}</Text>
      </View>
    </SafeAreaView>
  );
}
