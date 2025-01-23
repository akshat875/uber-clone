// Function to get token from localStorage
export const getToken = () => localStorage.getItem('token');

// Function to set token in localStorage
export const setToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    }
};

// Function to remove token from localStorage
export const removeToken = () => {
    localStorage.removeItem('token');
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};
