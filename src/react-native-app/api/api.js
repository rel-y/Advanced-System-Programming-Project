function fetchFromWebServer(url, request){
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im8yIiwidG9rZW5WZXJzaW9uIjoxLCJpYXQiOjE3Njg4MTI5MzB9.R-NarmoYAQFImeK-Hv9rGJiOEGhNzO8uGpWWTuUnwz8";
    //replace this with whatever you do 
    
    return fetch(url, {
        ...request,
        headers: {
            ...request.headers,
            authorization: token ? `Bearer ${token}` : undefined
        }
    });
}

export default fetchFromWebServer;