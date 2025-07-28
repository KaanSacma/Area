import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ZapListContext = createContext();

export const ZapListProvider = ({ children }) => {
    const [zapList, setZapList] = useState({});

    useEffect(() => {
        // Load data from AsyncStorage
        const loadData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('zapList');
                if (storedData) {
                    setZapList(JSON.parse(storedData));
                }
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        // Save data to AsyncStorage whenever zapList changes
        const saveData = async () => {
            try {
                await AsyncStorage.setItem('zapList', JSON.stringify(zapList));
            } catch (error) {
                console.error('Error saving data:', error);
            }
        };

        saveData();
    }, [zapList]);

    return (
        <ZapListContext.Provider value={{ zapList, setZapList }}>
            {children}
        </ZapListContext.Provider>
    );
};

export default ZapListContext;
