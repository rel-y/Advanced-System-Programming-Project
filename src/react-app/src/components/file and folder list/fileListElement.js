import './fileListElement.css'
import fetchFromWebServer from '../../api';
function ListElement({ fileId, fileName, owner = "Unable to load user", size = "-", date, location, funcOnClick }) {
    if (location === 0) {
        location = "My Drive";
    }
    console.log("element: " + fileName + "owner:" + owner);
    const setStarredStatus = async () => {
        const response = await fetchFromWebServer(`http://localhost:8080/api/files/${fileId}`, {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                starred: true
            }),
            method: 'PATCH'
        });
    }
    return (
        <ul className="list-group list-group-horizontal lineHover-bg" onClick={() => funcOnClick()}>
            <li className="p-2 list-group-item text-truncate detailBox" style={{ width: "40%" }}>{fileName}</li>
            <li className="p-2 list-group-item detailBox" style={{ width: "15%" }}>{date}</li>
            <li className="p-2 list-group-item detailBox" style={{ width: "15%" }}>{owner}</li>
            <li className="p-2 list-group-item detailBox" style={{ width: "10%" }}>{size}</li>
            <li className="p-2 list-group-item detailBox" style={{ width: "15%" }}>{location}</li>
            <li className="p-2 list-group-item detailBox" style={{ width: "5%" }}>
                <button onClick={(e) => {
                    e.stopPropagation()
                    setStarredStatus()
                }}>&#9733; Star</button>
            </li>
            {/* <li className="p-2 list-group-item detailBox" style={{ width: "20%" }}>{location}</li> */}
        </ul>
    )
}

export default ListElement;