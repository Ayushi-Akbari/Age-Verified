import React, { createContext, useState, useContext } from 'react';

const VerificationContext = createContext();

export const useVerification = () => {
    return useContext(VerificationContext);
};

export const VerificationProvider = ({ children }) => {
    const [verificationData, setVerificationData] = useState(null);

    const setData = (data) => {
        setVerificationData(data);
    };

    return (
        <VerificationContext.Provider value={{ verificationData, setData }}>
            {children}
        </VerificationContext.Provider>
    );
};
