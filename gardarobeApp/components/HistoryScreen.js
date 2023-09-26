import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Importer dataene fra vores hardcoded liste historyData.js
import { DATA } from './historyData';

function HistoryScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Welcome to History Screen!</Text>
      <Text>Here you can see your History for your visits</Text>

      {/* FlatList for at vise data fra historyData.js */}
      <FlatList
        data={DATA}
        keyExtractor={(item, index) => index.toString()} // Use the index as the key
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item}</Text>
          </View>
        )}
      />

      <Button
        title="Go Back"
        onPress={() => {
          // Navigate back to the previous screen
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default HistoryScreen;
