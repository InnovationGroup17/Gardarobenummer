import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

function ProfileScreen() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Set up the real-time listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Return the cleanup function
    return () => unsubscribe();
  }, [auth]);

  const handleLogOut = async () => {
    await signOut(auth).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  if (!user) {
    return (
      <View>
        <Text>Not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Current user: {user.email}</Text>
      <Text>Current UID: {user.uid}</Text>
      <Text>Current displayName: {user.displayName}</Text>
      <Text>Current Age: {user.age}</Text>
      {console.log(user)}
      <Button onPress={handleLogOut} title="Log out" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: "5%",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
});

export default ProfileScreen;
