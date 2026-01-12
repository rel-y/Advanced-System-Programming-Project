import React, {useEffect} from "react"
import CheckLogin from "../../logincheck";
import { useNavigate } from "react-router-dom";
import Sidebar from '../sideBar/SidebarComponent';
import TopBar from '../TopBar/TopBarComponent';
export default function MainPage(){
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
        const res = await CheckLogin();
        if (!res) navigate("/api/users/login");
        })();
    }, [navigate]);

    return(
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <TopBar />
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          <Sidebar />

          <div style={{ flex: 1, padding: "24px", overflow: "auto" }}>
          </div>
        </div>
      </div>

    );
}