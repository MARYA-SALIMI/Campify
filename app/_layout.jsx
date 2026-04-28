import AppNavigator from '../src/navigation/AppNavigator';

// Expo Router'ın kendi layout sistemi ve "explore" sekmesi bu dosya sayesinde
// devre dışı kalır. _layout.jsx doğrudan AppNavigator'ı döndürdüğünde
// expo-router herhangi bir route eşleştirmesi yapmaz; NavigationContainer
// ve tüm navigasyon kontrolü AppNavigator'a devredilir.
//
// ⚠️  app/ klasörü altında _layout.jsx dışında başka dosya BIRAKMAYINIZ.
//     (index.jsx, (tabs)/ klasörü vb.) Bu dosyalar varsa expo-router onları
//     da işlemeye çalışır ve "Unmatched Route" hatası yeniden çıkabilir.

export default AppNavigator;