import React, { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { io } from 'socket.io-client';

const initialCondition = [
  { items: "", id: 1 },
  { items: "", id: 2 },
  { items: "", id: 3 },
  { items: "", id: 4 },
  { items: "", id: 5 },
  { items: "", id: 6 },
  { items: "", id: 7 },
  { items: "", id: 8 },
  { items: "", id: 9 },
];

const App = () => {
  const [sudokuBox, setSudokuBox] = useState(initialCondition);
  const [switchCondition, setCondition] = useState(true);

  // Connect to the server using socket.io
  const socket = io("http://192.168.0.103:3000"); // Ensure the IP matches your server's IP

  useEffect(() => {
    // Listen for updates from the server
    socket.on("game_update", (updatedBoard) => {
      setSudokuBox(updatedBoard.board);
      setCondition(updatedBoard.switchCondition);
    });

    // Listen for winner updates from the server
    socket.on("game_winner", (winner) => {
      handleWinner(winner);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUserEnter = (index) => {
    const data = [...sudokuBox];

    // Update the game state locally
    if (switchCondition && (data[index].items !== "O")) {
      data[index].items = "X";
      setCondition(false);
    } else if (!switchCondition && (data[index].items !== "X")) {
      data[index].items = "O";
      setCondition(true);
    }

    setSudokuBox(data);

    // Send the updated state to the server
    socket.emit("game_update", { board: data, switchCondition: !switchCondition });
  };

  const handleWinner = (winner) => {
    Alert.alert('Tie Take Toe', `${winner}`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK', onPress: () => {
          const resetBoard = initialCondition.map(box => ({ ...box, items: "" }));
          setSudokuBox(resetBoard);
          setCondition(true);

          // Notify server to reset the game
          socket.emit("reset_game", { board: resetBoard, switchCondition: true });
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: "50%" }}>
        <Text style={styles.title}>X Starts First</Text>
        <FlatList
          numColumns={3}
          data={sudokuBox}
          contentContainerStyle={{ justifyContent: "center", alignSelf: "center" }}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity key={item.id} activeOpacity={0.7} style={styles.item} onPress={() => handleUserEnter(index)}>
                <Text style={styles.itemText}>{item.items}</Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    color: "#000",
    fontWeight: "800",
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderWidth: 2,
    borderColor: "black",
  },
  itemText: {
    color: '#000',
    fontSize: 30,
    fontWeight: "900",
  },
});

export default App;
