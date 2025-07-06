import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAppDispatch } from '../hooks/hooks';
import { setIsRegisteredUser } from '../features/Slicers/authSlice';
import { permissionService } from '../services/permissionServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useAppDispatch();
    const [token, setToken] = useState(localStorage.getItem("token") || '');
    const [user, setUser] = useState(localStorage.getItem("user") || '');
    const [userName, setUserName] = useState(localStorage.getItem("user_name") || '');
    const [role, setRole] = useState(localStorage.getItem("role") || '');

    const getPermissions = async () => {
        try {
            if (user) {
                let permissions = await permissionService.getUserPermission(user);
                return permissions.data;
            }
        } catch (error) {
            console.error("Failed to fetch permissions", error);
            return null;
        }
    };

    const [permissions, setPermissions] = useState(() => {
        const storedPermissions = localStorage.getItem("permissions");
        return storedPermissions ? JSON.parse(storedPermissions) : {};
    });

    useEffect(() => {
        const fetchPermissions = async () => {
            const permissionsFromServer = await getPermissions();
            if (permissionsFromServer != null) {
                setPermissions(permissionsFromServer);
            }
            localStorage.setItem("permissions", JSON.stringify(permissionsFromServer));
        };
        if (authenticated || permissions == undefined) {
            fetchPermissions();
        }
    }, []);

    // console.log("permissions in auth", permissions)
    const authenticated = !!token;

    function removeFields(obj, fieldsToRemove) {
        const updatedObj = { ...obj };
        fieldsToRemove.forEach(field => {
            delete updatedObj[field];
        });
        return updatedObj;
    }

    const login = (t, rt, u, n, r, p) => {
        if (t && rt && u && n && r && p) {
            const role = r[0].split("_")[1];
            setToken(t);
            setUserName(n);
            setUser(u);
            setPermissions(p);
            setRole(role);
            // console.log(r);
            localStorage.setItem("token", t);
            localStorage.setItem("refreshToken", rt);
            localStorage.setItem("user", u);
            localStorage.setItem("user_name", n);
            localStorage.setItem("role", role);
            localStorage.setItem("permissions", JSON.stringify(p));
            dispatch(setIsRegisteredUser(true));
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.clear();
        dispatch(setIsRegisteredUser(false));
        setToken('');
        setUser('');
        setUserName('');
        setPermissions({});
    };

    const updatedPermissions = removeFields(permissions, ["_id", "__v", "userId", "updated_by", "updated_at", "is_updated", "is_deleted", "created_at"]);

    return (
        <AuthContext.Provider value={{ authenticated, login, logout, token, user, role, userName, permissions: updatedPermissions, getPermissions }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
