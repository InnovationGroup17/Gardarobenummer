import React from 'react';
import { View, Text } from 'react-native';
import FriendsScreen from "./FriendsScreen";
import { useNavigation } from '@react-navigation/native'; 
import { dataGroups } from './historyData';

function GroupScreen({ route }) {
    if (!route.params || !route.params.selectedItems) {
        alert("You have not chosen any friends");
        const navigation = useNavigation();
        navigation.navigate("FriendsScreen");
        return null; // or return some fallback UI
    }

    const selectedItems = route.params.selectedItems;
    console.log(selectedItems);
    if(selectedItems.length===0){
        alert("You have not chosen any friends");
        const navigation = useNavigation();
        navigation.navigate("FriendsScreen");
        return null
    }
    return (
        <View>
            <Text>Selected Items:</Text>
            {selectedItems.map((item, index) => (
                <Text key={index}>{item.name}</Text>
            ))}
        </View>
    );
}


export default GroupScreen;
