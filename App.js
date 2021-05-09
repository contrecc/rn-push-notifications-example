import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
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
  const [pushToken, setPushToken] = useState();
  useEffect(() => {
    (async function checkPermissions() {
      try {
        const checkStatusObject = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );
        if (checkStatusObject.status !== "granted") {
          const askStatusObject = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
          );
          if (askStatusObject.status !== "granted") {
            throw new Error("Permission not granted for notifications");
          }
        }
        const response = await Notifications.getExpoPushTokenAsync();
        const token = response.data;
        setPushToken(token);
        console.log(token);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

  useEffect(() => {
    // Listener is called when a user interacts with a notification
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    // Listener is called when a notification is received while the app is running
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(notification);
      }
    );

    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  const triggerNotificationHandler = () => {
    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "My first local notification",
    //     body: "This is the first local notification we are sending!",
    //   },
    //   trigger: {
    //     seconds: 3,
    //   },
    // });
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: pushToken,
        data: {
          extraData: "Some extra data to send",
        },
        title: "Sent via the app",
        body: "This push notification was sent via the app",
      }),
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
