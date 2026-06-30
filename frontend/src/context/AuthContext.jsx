import { createContext, useContext, useEffect, useState } from "react";
import API_URL from "../services/api";

const AuthContext = createContext();

export function AuthProvider({children}){
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/auth/me`,
            {
            credentials: "include"
            }
        )
        .then (async res =>{
            if(res.status === 401)
            {
                setUser(null);
                return;
            }
            if(!res.ok)
                throw new Error();

            const data = await res.json();

            setUser(data);
        })
        .catch (err =>{
            console.error(err);
        })
        /*
        .then(res => {
            if(!res.ok)
                throw new Error();

            return res.json();
        })
        .then(data => {
            setUser(data);
        })
        .catch(() => {
            setUser(null);
        })*/ // wczesniejsze
        .finally(() => {
            setLoading(false);
        });

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading
            }}>{
                children
                }
            </AuthContext.Provider>
    );
}

export function useAuth()
{
    return useContext(AuthContext);
}