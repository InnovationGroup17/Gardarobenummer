import React from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";

function PaymentScreen({ navigation }) {
  // Dummy data for listen af Payment Terms
  const paymentTermsData = [
    { id: "1", term: "Net 30" },
    { id: "2", term: "Net 60" },
    { id: "3", term: "Net 90" },
    // Kan evt tilføje flere, hvis ønsket
  ];

  return (
    <View style={styles.container}>
      <Text>Welcome to Payment Terms!</Text>
      <Text>Here are some payment terms:</Text>

      {/* FlatList til at listen af payment terms */}
      <FlatList
        data={paymentTermsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.term}</Text>
          </View>
        )}
      />

      <Button
        title="Go Back"
        onPress={() => {
          // Navigere tilbage til forrige skræm
          navigation.goBack();
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default PaymentScreen;
