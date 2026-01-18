function fetchFromWebServer(url, request){
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im8yIiwidG9rZW5WZXJzaW9uIjoxLCJpYXQiOjE3Njg3NDcwOTh9.hFf6AUTxot6AsczkdIxPYXM1OALJ4LUtR2_-bDwQh3A";
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