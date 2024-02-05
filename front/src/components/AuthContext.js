import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { HttpGet, HttpPost } from '../services/HttpService';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const setLogined = (userData) => {
        setUser(userData);
    };

const setLogout = async () => {
    HttpPost('/api/v1/members/logout');
    sessionStorage.removeItem("username");
    
    setUser(null);



        setUser(null);
    };

    const isLogin = () => {
        return user !== null;
    };

    const isLogout = () => {
        return user === null;
    };

    const initAuth = async () => {
        try{
            const { data } = await axios.get("http://localhost:8090/api/v1/members/me", {
                withCredentials: true,
            });
            if (data) {
                setLogined(data.data.item);
            }
        }catch(e){}
        

        
    };
    const getUserNickname = () =>{
        return user ? user.nickname : null;
    }

    HttpGet("/api/v1/members/me")
    .then((data) => {
        console.log('memeber me ' + data)
        if(data){
            setLogined(data.item);
        }
    });


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
        <AuthContext.Provider value={{ user, setLogined, setLogout, isLogin, isLogout, getUserName, getUserPermissions, getUserId, getUserNickname }}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};
