import React, {useEffect} from "react"
import CheckLogin from "../../logincheck";
import { useNavigate } from "react-router-dom";
import Sidebar from '../sideBar/SidebarComponent';
import TopBar from '../TopBar/TopBarComponent';
import FileList from '../file-and-folder-list/filesList';
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
        <div style={{zIndex: 1}}>
          <TopBar />
    </div>

  <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
    <Sidebar />

    <div className="hello"
      style={{
        flex: 1,
        minHeight: 0,
        
      }}
    >
      <FileList />
    </div>
  </div>
</div>


    );
}