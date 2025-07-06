export const convertUtcToLocal = (data) => {
    if (!data || isNaN(new Date(data).getTime())) {
        return null;
    }
    const date = new Date(data);

    const day = String(date.getDate()).padStart(2, '0');

    // Array of month names to get MMM format
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = date.getMonth();
    const month = monthNames[monthIndex];

    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Get AM/PM format
    const amPM = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12; // Handle midnight (0 hours)

    const item = `${day}-${month}-${year} ${hours12}:${minutes}:${seconds} ${amPM}`;

    return item;
};



export function hasPermission(param, permissions) {
    // Check if the provided parameter exists in the object
    if (permissions.hasOwnProperty(param)) {
        const permission = permissions[param];
        // Check if at least one of the properties is true
        return permission.create || permission.read || permission.update || permission.delete;
    }
    return false;
}

export function hasActionPermission(param, permissions) {
    // Check if the provided parameter exists in the object
    if (permissions.hasOwnProperty(param)) {
        const permission = permissions[param];
        // Check if at least one of the properties is true
        return permission.create || permission.update || permission.delete;
    }
    return false;
}

export function hasEntityPermission(permissionType, entity, permissions) {
    // Check if the provided entity exists in the permissions object
    if (permissions.hasOwnProperty(entity)) {
        const permission = permissions[entity];
        // Check if the specified permission type is true
        return !!permission[permissionType];
    }
    return false;
}

export const redirectToLogin = () => {
    // console.log("in redirection");
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    // localStorage.removeItem("user_name");
    // localStorage.removeItem("permissions");
    // localStorage.removeItem("role");
    localStorage.clear();
    window.location.href = '/login';
}

export function camelToSentenceCase(str) {
    // Add a space before each uppercase letter except the first one
    const result = str.replace(/([A-Z])/g, ' $1');
    // Convert the entire string to lowercase and then capitalize the first letter
    return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
}