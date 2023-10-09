import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import QRCodeGenerator from "../../../utilites/QRCodeGenerator";

export default function QRID() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [qrData, setQRData] = useState({}); // To store user data for the QR code
  //const [qrCodeKey, setQRCodeKey] = useState(""); Flyttet til QRCodeGenerator.js
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    // Set up the real-time listener for Firebase Authentication
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    if (user) {
      // Fetch user data from the Firebase Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
      const unsubscribeDB = onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        setUserData(userData);
      });

      // Return the cleanup functions
      return () => {
        unsubscribeAuth();
        unsubscribeDB();
      };
    }
  }, [auth, user, db]);

  // Regenerate QR code data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        const newData = {
          id: user.uid,
          email: user.email,
          displayName: userData?.displayName || "",
          age: userData?.age || "",
        };
        setQRData(newData);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, userData]);

  if (!user) {
    return (
      <View>
        <Text>Not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QRCodeGenerator value={JSON.stringify(qrData)} size={200} />
      <Text>Current UID: {user.uid}</Text>
      {userData && (
        <>
          <Text>Current displayName: {userData.displayName}</Text>
          <Text>Current Age: {userData.age}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "5%",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
});
