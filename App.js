import { StyleSheet, Text, View } from "react-native"; // <--- Buraya 'Text' ekledik!

export default function App() {
  return (
    <View style={styles.container}>
      {/* Artık Text'i kullanabilirsin */}
      <Text style={styles.welcomeText}>
        Campify Mobil Dünyasına Hoş Geldin! 🚀
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D6A4F", // Campify yeşili :)
  },
});
