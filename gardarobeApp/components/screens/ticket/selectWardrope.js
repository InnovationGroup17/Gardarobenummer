import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { timestamp } from "../../../utilites/timestamp";
import { fetchFirestoreData } from "../../../database/firestoreApi";

const SelectWardrope = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [firestoreData, setFirestoreData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const collectionName = "WardrobeItem";
  const [BarData] = useState(route.params.BarData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFirestoreData(collectionName);
        setFirestoreData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    calculateTotal();
  }, [isFocused, collectionName]);

  // Calculate total price and total items
  calculateTotal = () => {
    let price = 0;
    let items = 0;
    firestoreData.forEach((wardrobe) => {
      price += wardrobe.price * wardrobe.amount;
      items += wardrobe.amount;

      if (wardrobe.amount > 0) {
        wardrobe.selected = true;
      } else {
        wardrobe.selected = false;
      }
    });
    setTotalPrice(price);
    setTotalItems(items);
  };

  // Handle select wardrobe
  const handleSelect = (wardrobe) => {
    const updatedWardrobeList = firestoreData.map((item) => {
      if (item.id === wardrobe.id) {
        item.selected = !item.selected;
        item.amount = item.selected ? 1 : 0;
      }
      return item;
    });
    setFirestoreData(updatedWardrobeList);
    calculateTotal();
  };

  // Handle amount change
  const handleAmountChange = (wardrobe, amount) => {
    const updatedWardrobeList = firestoreData.map((item) => {
      if (item.id === wardrobe.id) {
        item.amount = amount;
      }
      return item;
    });

    setFirestoreData(updatedWardrobeList);
    calculateTotal();
  };

  // Handle confirm
  const handleConfirm = () => {
    const selectedWardrobes = firestoreData.filter(
      (wardrobe) => wardrobe.selected
    );
    const ticketData = {
      selectedWardrobes,
      totalPrice,
      totalItems,
      BarData,
      active: true,
      ticketTime: timestamp(),
    };
    alert(
      "Du har valgt " + totalItems + " genstand(e) til " + totalPrice + " kr."
    );
    if (selectedWardrobes.length === 0) {
      Alert.alert("Fejl", "Du skal vælge mindst en garderobe");
      return;
    } else {
      navigation.navigate("Ticket", { ticketData });
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <CheckBox
          title={item.name}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={item.selected}
          onPress={() => handleSelect(item)}
        />
        <View style={styles.amountContainer}>
          <TouchableOpacity
            onPress={() => {
              if (item.amount > 0) {
                handleAmountChange(item, item.amount - 1);
              }
            }}
          >
            <MaterialIcons name="remove" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.amount}>{item.amount}</Text>
          <TouchableOpacity
            onPress={() => handleAmountChange(item, item.amount + 1)}
          >
            <MaterialIcons name="add" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <Text style={styles.WelcommeText}>Velkommen til {BarData.id.title}</Text>
      <FlatList
        data={firestoreData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Total: {totalPrice} kr.</Text>
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Bekræft</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  WelcommeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 10,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amount: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  footerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default SelectWardrope;
