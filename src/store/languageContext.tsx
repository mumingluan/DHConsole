import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context state
interface LanguageContextState {
    language: string;
    setLanguage: (language: string) => void;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextState | undefined>(undefined);

// Create a provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<string>('en'); // Default language is English

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook to use the LanguageContext
export const useLanguageContext = (): LanguageContextState => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguageContext must be used within a LanguageProvider');
    }
    return context;
}; 