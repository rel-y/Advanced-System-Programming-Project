export default async function CheckLogin(){
    const token = sessionStorage.getItem("jwt");
    if(!token){
        return false;
    }
    const res = await fetch("/api/users/isLoggedIn", {
        method: "POST",
        headers: { 
            Accept: "application/json",
            authorization: token ? `Bearer ${token}` : undefined
        }
    });
    return (await res.text()) === "true"
}
