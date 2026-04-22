import React from "react";
// 1. Şemsiyemizi alıyoruz
import { AuthProvider } from "../../src/context/AuthContext";
// 2. Doğrudan test etmek istediğin sayfayı alıyoruz (Yolu kendi dosyana göre düzelt)
import TeamsScreen from "../../src/screens/teams/TeamsScreen";

export default function Index() {
  return (
    // Yönlendirmeleri aradan çıkarıp doğrudan sayfayı ekrana basıyoruz
    <AuthProvider>
      <TeamsScreen />
    </AuthProvider>
  );
}
