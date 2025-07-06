import { getUserLogin, registerUser } from "./MockApi";
// import { getUserLogin, registerUser } from "./mockApi";
import { fetchApi } from "./utils";

export const authService = {
    registerUser: async (name, phone, email, password) => {
        try {
            // const res = await fetchApi("register", "POST", {
            //     name: name,
            //     phone: phone,
            //     email: email,
            //     password: password,
            // });
            localStorage.setItem("user", JSON.stringify({
                name: name,
                phone: phone,
                email: email,
                password: password,
            }));

            const res = registerUser(name, phone, email, password);

            return res;
        } catch (error) {
            return error;
        }
    },
    updateUserPassword: async (currentPassword, newPassword) => {
        try {
            const res = await fetchApi("auth/update-password", "POST", {
                currentPassword: currentPassword,
                newPassword: newPassword,
            });
            // const res = getUserLogin(email, password);

            return res;
        } catch (error) {
            console.log(error);
        }
    },
    loginUser: async (email, password) => {
        try {
            const res = await fetchApi("auth/signin", "POST", {
                email: email,
                password: password,
            });
            // const res = getUserLogin(email, password);

            return res;
        } catch (error) {
            console.log(error);
        }
    },
    logout: async () => {
        try {
            // const res = await fetchApi("logout", "DELETE", undefined, { Accept: 'application/json', Authorization: 'Bearer 123' });
            // localStorage.removeItem("token");
            localStorage.clear();
            return res;
        } catch (error) {
            return error;
        }
    },
};


