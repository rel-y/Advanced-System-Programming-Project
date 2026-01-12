export default async function CheckLogin(){
    const token = sessionStorage.getItem("jwt");
    if(!token){
        return false;
    }
    const res = await fetch("/api/users/isLoggedIn", {
        method: "GET",
        headers: { 
            Accept: "application/json",
            authorization: token ? `Bearer ${token}` : undefined
        }
    });
    return (await res.text()) === "true"
}
