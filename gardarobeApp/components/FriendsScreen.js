import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function FriendsScreen() {
  const navigation = useNavigation(); // Access the navigation object using useNavigation

  //Indsæt fiktiv database 
  const [data, setData] = useState([
    { id: 1, name: 'Anna', selected: false },
    { id: 2, name: 'Tobias', selected: false },
    { id: 3, name: 'Emil', selected: false },
    { id: 4, name: 'Kasper', selected: false },
    { id: 5, name: 'Anders', selected: false },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const toggleSelection = (id) => {
    const updatedData = data.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setData(updatedData);
  };

  const handleForward = () => {
    const selectedItems = data.filter(item => item.selected);
    navigation.navigate('GroupScreen', { selectedItems });
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Button
              title={item.selected ? 'Deselect' : 'Select'}
              onPress={() => toggleSelection(item.id)}
            />
            <Text>{item.name}</Text>
          </View>
        )}
      />
      <Button title="Forward Data" onPress={handleForward} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default FriendsScreen;
