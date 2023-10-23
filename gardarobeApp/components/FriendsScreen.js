import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function FriendsScreen() {
  const navigation = useNavigation(); // Får adgang til at navigere 

  //Fiktiv database med eksempler på venner
  const [data, setData] = useState([
    { id: 1, name: 'Anna', selected: false }, //En ven med unikt id og startværdi som false
    { id: 2, name: 'Tobias', selected: false },
    { id: 3, name: 'Emil', selected: false },
    { id: 4, name: 'Kasper', selected: false },
    { id: 5, name: 'Anders', selected: false },
  ]);

  //Når brugeren ønsker at søge efter en person
  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = data.filter(item =>
    //Bruger property name, som filter for søgefunktionen
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //Opdater søgning, når der indtastes
  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  //Skifter status for brugeren, alt efter om den er valgt eller ikke
  const toggleSelection = (id) => {
    const updatedData = data.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setData(updatedData);
  };

  //Bruger navigation, til at sende brugeren videre til Group Screen, med de valgte venner
  const handleForward = () => {
    const selectedItems = data.filter(item => item.selected);
    navigation.navigate('GroupScreen', { selectedItems });
  };

  //Searchbar og Selected + Deselected items
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search after a friend"
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

//Styling af view
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
