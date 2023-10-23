import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import FriendsScreen from "./FriendsScreen";
import { useNavigation } from '@react-navigation/native';
import { dataGroups } from './historyData';

function GroupScreen({ route }) {
  const [myGroups, setMyGroups] = useState([]); // State variable for storing groups
  const navigation = useNavigation();

  if (!route.params || !route.params.selectedItems) {
    alert("You have not chosen any friends");
    navigation.navigate("FriendsScreen");
    return null;
  }

  const selectedItems = route.params.selectedItems;
  console.log(selectedItems);

  if (selectedItems.length === 0) {
    alert("You have not chosen any friends");
    navigation.navigate("FriendsScreen");
    return null;
  }

  // Function to create a new group with the selected items
  const createGroup = () => {
    const newGroup = {
      name: "My Best Friends", // You can customize the group name
      members: selectedItems,
    };

    setMyGroups([...myGroups, newGroup]);
    alert("New group created!"); // Optional alert to confirm group creation
  };
  
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>Selected Items:</Text>
      {selectedItems.map((item, index) => (
        <Text key={index} style={{ fontSize: 18, marginBottom: 6 }}>{item.name}</Text>
      ))}
      <Button title="Create Group" onPress={createGroup} />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>My Groups:</Text>
      {myGroups.map((group, groupIndex) => (
        <View key={groupIndex} style={{ backgroundColor: '#f2f2f2', padding: 12, marginBottom: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{group.name}</Text>
          {group.members.map((member, memberIndex) => (
            <Text key={memberIndex} style={{ fontSize: 16, marginTop: 6 }}>{member.name}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}


export default GroupScreen;