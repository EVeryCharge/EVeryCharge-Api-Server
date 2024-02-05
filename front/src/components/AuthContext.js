import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);

const setLogined = (userData) => {
    setUser(userData);
};

const setLogout = async () => {
    const data = await axios.post('https://api.eitcharge.site/api/v1/members/logout');
    console.log(data);
    sessionStorage.removeItem("username");
    
    setUser(null);
};

const isLogin = () => {
    return user !== null;
};

const isLogout = () => {
    return user === null;   
};

const initAuth = async () => {
    //처음 마운트 될때 api 요청으로 런타임 오류 방지하기 위한 로직
    const sessionUsername = sessionStorage.getItem("username");
    if(sessionUsername === null || sessionUsername === undefined || sessionUsername === "") {
        return;
    }

    const { data } = await axios.get("https://api.eitcharge.site/api/v1/members/me");
    if (data) {
        setLogined(data.data.item);
    }
};

const getUserName = () => {
    return user ? user.username : null;
};

const getUserPermissions = () => {
return user ? user.authorities : [];
};

const getUserId = () => {
    return user ? user.id : null;
};

//useEffect는 컴포넌트 마운트 될때 한번 실행됨
useEffect(() => {
    initAuth();
}, []);

return (
    <AuthContext.Provider value={{ user, setLogined, setLogout, isLogin, isLogout, getUserName, getUserPermissions, getUserId  }}>
        {children}
    </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};
