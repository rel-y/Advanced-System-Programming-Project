function fetchFromWebServer(url, request){
    const token = sessionStorage.getItem("jwt");
    return fetch(url, {
        ...request,
        headers: {
            ...request.headers,
            authorization: token ? `Bearer ${token}` : undefined
        }
    });
}

export default fetchFromWebServer;