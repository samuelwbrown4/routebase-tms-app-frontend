async function refreshToken(setAuth , navigate){
    const API_URL = import.meta.env.VITE_API_URL;
    
    const response = await fetch(`${API_URL}/api/users/refresh`, {
        method: 'POST',
        credentials: 'include'
    });

    if (!response.ok) {
        setAuth(null);
        navigate('/')
        return null;
    }

    const result = await response.json();
    setAuth(result.token);
    return result.token;
};

export default refreshToken;