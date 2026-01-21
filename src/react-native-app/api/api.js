let jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im8yIiwidG9rZW5WZXJzaW9uIjoxLCJpYXQiOjE3NjkwMDk0NTd9.H_-A57m5wdGK0BzesnovsLXZxX75HnDWt7ahd30KR4w";
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