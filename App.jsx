import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const App = () => {
  const [sudokuBox, setSudokoBox] = useState([
    { items: "", id: 1 },
    { items: "", id: 2 },
    { items: "", id: 3 },
    { items: "", id: 4 },
    { items: "", id: 5 },
    { items: "", id: 6 },
    { items: "", id: 7 },
    { items: "", id: 8 },
    { items: "", id: 9 },
  ])
  const [switchCondition, setCondition] = useState(true)

  const handleUserEnter = (index) => {
    const data = [...sudokuBox];
    if (switchCondition) {
      data[index].items = "X";
      setSudokoBox(data)
      setCondition(false)
    } else {
      data[index].items = "O";
      setSudokoBox(data)
      setCondition(true)
    }
    if (data[0].items === "X" || data[0].items === "O" && data[1].items === "X" || data[1].items === "O" && data[2].items === "X" || data[2].items === "O" && data[3].items === "X" || data[3].items === "O" && data[4].items === "X" || data[4].items === "O" && data[5].items === "X" || data[5].items === "O" && data[6].items === "X" || data[6].items === "O" && data[7].items === "X" || data[7].items === "O" && data[8].items === "X" || data[8].items === "O") {
      return console.log("true")
    }
    // const winningCryteria = data.filter((index,el) => {
    //   if (el.items === "X" ||el.items === "O") return true
    // })
    // console.log(winningCryteria, "true")
  }

  useEffect(() => {

  }, [])

  return (
    <SafeAreaView style={Styles.Container} >
      <View style={{ height: "50%", }} >
        <FlatList
          numColumns={3}
          data={sudokuBox}
          contentContainerStyle={{ justifyContent: "center", alignSelf: "center" }}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity key={item.id} activeOpacity={0.7} style={Styles.item} onPress={() => handleUserEnter(index)} >
                <Text style={Styles.itemText}>{item.items}</Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#ffff",
    justifyContent: "center",
    alignItems: "center",
  },
  item: {

    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderWidth: 2,
    borderColor: "black"
  },
  itemText: {
    color: '#000',
    fontSize: 30,
    fontWeight: "900"
  },
});

export default App;
