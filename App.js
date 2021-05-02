import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

// Configuration to let OS know what to do with a notification when the app is running in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    (async function checkPermissions() {
      const checkStatusObject = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      if (checkStatusObject.status !== "granted") {
        const askStatusObject = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        if (askStatusObject.status !== "granted") {
          alert("You must give permission in order to see notifications.");
          return;
        }
      }
    })();
  }, []);
  const triggerNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first local notification",
        body: "This is the first local notification we are sending!",
      },
      trigger: {
        seconds: 3,
      },
    });
  };
  return (
    <View style={styles.container}>
      <Button
        title="Trigger Notification"
        onPress={triggerNotificationHandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
