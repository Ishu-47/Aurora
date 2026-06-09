import { createContext, useContext, useState, } from "react";

const AuthContext = createContext();
export function AuthProvider({
    children,
}) {
    const [user, setUser] =
        useState(
            JSON.parse(
                localStorage.getItem(
                    "user"
                )
            )
        );

    const login = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ email: data.email, username: data.username, }));

        setUser({
            email: data.email,
            username: data.username,
        });
    };

    const logout = () => {
        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth =
    () =>
        useContext(AuthContext);