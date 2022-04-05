import { createContext, FC, useContext, useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { app } from "../persistence/firebase";

interface IAuth {
    user: User & { isRoot: boolean } | null,
    token?: string | null,
    login: () => void,
    logout: () => void,
}

const auth = getAuth(app);

const AuthContext = createContext<IAuth>({
    user: null, login: () => {}, logout: () => {}
});

const AuthProvider: FC = ({ children }) => {

    const [user, setUser ] = useState<User & { isRoot: boolean } | null>(null);
    const [token, setToken ] = useState<string | null>(null);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                if (user.emailVerified && ['@mind.inf.br','bioma.ind.br','simbiose-agro.com.br'].some(email => user.email?.includes(email))) {
                    if (window.localStorage) {
                        const { email, accessToken } = user as any;
                        window.localStorage.setItem(`goexper-central-lancamentos`, JSON.stringify({email, token: accessToken }));
                        setToken(accessToken);
                    }
                    const userPermited = { ...user, isRoot: ['maas@mind.inf.br','scheila@bioma.ind.br','alidio@bioma.ind.br'].some(email => user.email?.includes(email)) }
                    setUser(userPermited);
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        })

        return unsubscribe;
    }, []);

    const login = async () => {
        try {
            await signInWithPopup(auth, new GoogleAuthProvider())
        } catch (error) {
            console.error(error);
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AuthContext.Provider value={{
            user, token, login, logout
        }}>
            { children }
        </AuthContext.Provider>
    )
};

const useAuth = () => useContext(AuthContext);

function getToken() {
    const userData = window.localStorage.getItem(`goexper-central-lancamentos`);
    if (userData == null) return '';
    const { token } = JSON.parse(userData);
    return token;
}

export { AuthProvider, useAuth, getToken }