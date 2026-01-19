let jwtToken = null;
function setToken(token){
    jwtToken = token;
}

function fetchFromWebServer(url, request){
    return fetch(url, {
        ...request,
        headers: {
            ...request.headers,
            authorization: jwtToken ? `Bearer ${jwtToken}` : undefined
        }
    });
}

module.exports = {fetchFromWebServer, setToken};