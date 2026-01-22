import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAppDispatch } from '../hooks/hooks';
import { setIsRegisteredUser } from '../features/Slicers/authSlice';
import { permissionService } from '../services/permissionServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useAppDispatch();

    // ---------- Safe localStorage parsing ----------
    const safeParse = (key, defaultValue) => {
        const stored = localStorage.getItem(key);
        try {
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (e) {
            console.error(`Failed to parse ${key} from localStorage`, e);
            return defaultValue;
        }
    };

    const [token, setToken] = useState(localStorage.getItem("token") || '');
    const [user, setUser] = useState(safeParse("user", ''));
    const [userName, setUserName] = useState(localStorage.getItem("user_name") || '');
    const [role, setRole] = useState(localStorage.getItem("role") || '');
    const [permissions, setPermissions] = useState(safeParse("permissions", {}));

    const authenticated = !!token;
    console.log("AuthContext - token:", token);
    console.log("AuthContext - authenticated:", authenticated);

    // ---------- Fetch permissions ----------
    const getPermissions = async (userId) => {
        if (!userId) return {};
        try {
            const res = await permissionService.getUserPermission(userId);
            return res.data || {};
        } catch (err) {
            console.error("Failed to fetch permissions", err);
            return {};
        }
    };

    useEffect(() => {
        const fetchPermissions = async () => {
            if (!authenticated) return;
            const permsFromServer = await getPermissions(user);
            setPermissions(permsFromServer);
            localStorage.setItem("permissions", JSON.stringify(permsFromServer));
        };

        // Only fetch if permissions are empty
        if (!permissions || Object.keys(permissions).length === 0) {
            fetchPermissions();
        }
    }, [authenticated]);

    // ---------- Remove unwanted fields ----------
    const removeFields = (obj, fieldsToRemove) => {
        const updatedObj = { ...obj };
        fieldsToRemove.forEach(field => delete updatedObj[field]);
        return updatedObj;
    };

    const updatedPermissions = removeFields(permissions, [
        "_id", "__v", "userId", "updated_by",
        "updated_at", "is_updated", "is_deleted", "created_at"
    ]);

    // ---------- Login ----------
    const login = (t, rt, u, n, r, p) => {
        console.log("AuthContext.login called with:", { t: !!t, rt: !!rt, u, n, r, p });
        if (!t || !rt || !u || !n || !r) {
            console.log("Login failed - missing essential parameters");
            return false;
        }

        const userRole = r[0]?.split("_")[1] || '';
        console.log("Setting token:", t);
        setToken(t);
        setUser(u);
        setUserName(n);
        setRole(userRole);
        setPermissions(p || {});

        localStorage.setItem("token", t);
        localStorage.setItem("refreshToken", rt);
        localStorage.setItem("user", JSON.stringify(u));
        localStorage.setItem("user_name", n);
        localStorage.setItem("role", userRole);
        localStorage.setItem("permissions", JSON.stringify(p || {}));

        dispatch(setIsRegisteredUser(true));
        console.log("Login completed successfully");
        return true;
    };

    // ---------- Logout ----------
    const logout = () => {
        localStorage.clear();
        dispatch(setIsRegisteredUser(false));
        setToken('');
        setUser('');
        setUserName('');
        setRole('');
        setPermissions({});
    };

    return (
        <AuthContext.Provider value={{
            authenticated,
            login,
            logout,
            token,
            user,
            role,
            userName,
            permissions: updatedPermissions,
            getPermissions
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
