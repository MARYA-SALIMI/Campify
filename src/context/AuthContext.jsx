import React, { createContext, useState, useContext } from 'react';

// Context oluşturuyoruz
const AuthContext = createContext();

// Provider bileşeni
export const AuthProvider = ({ children }) => {
    // Marya kendi sistemini kurana kadar sistemi kandırıyoruz :)
    // Sanki sen uygulamaya çoktan giriş yapmışsın gibi varsayıyoruz.
    const [user, setUser] = useState({
        _id: 'sinem-test-id-123', // Test için sahte bir ID
        name: 'Sinem Havan',
        username: 'sinemhvn'
    });

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// İstediğimiz dosyada kolayca çağırmak için hook
export const useAuth = () => {
    return useContext(AuthContext);
};