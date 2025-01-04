import React, { createContext, useContext } from 'react';
import { db, auth } from './firebase';

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => (
    <FirebaseContext.Provider value={{ db, auth }}>
        {children}
    </FirebaseContext.Provider>
);

export const useFirebase = () => useContext(FirebaseContext);
