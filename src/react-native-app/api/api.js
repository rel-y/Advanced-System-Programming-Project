let jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im8yIiwidG9rZW5WZXJzaW9uIjoxLCJpYXQiOjE3Njg5ODQyOTB9.wkrw3OvZDg-R8yYNWDpTMdrd8NWBf20yQ0DxOSU-7UU";
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