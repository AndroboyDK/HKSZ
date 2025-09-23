import React, { createContext, useContext, useState } from 'react';


const RoleContext = createContext();


export const RoleProvider = ({ children }) => {
const [role, setRole] = useState('customer'); // 'customer' | 'provider'
const toggleRole = () => setRole(prev => (prev === 'customer' ? 'provider' : 'customer'));
return (
<RoleContext.Provider value={{ role, setRole, toggleRole }}>
{children}
</RoleContext.Provider>
);
};


export const useRole = () => useContext(RoleContext);