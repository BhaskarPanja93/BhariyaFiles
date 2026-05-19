import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router";


export default function Homepage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [, setFileUploadVisible] = useState(false);
    const [, setFolderCreateVisible] = useState(false);

    useEffect(() => {

    }, [location]);

    return (
        <div>
            <div className="text-sm text-gray-600 mb-4">
                <span onClick={() => navigate("/")} className="cursor-pointer">
                    Home
                </span>
                {location.pathname
                    .split("/")
                    .filter(Boolean)
                    .map((segment, index, arr) => {
                            const path = "/" + arr.slice(0, index + 1).join("/");
                            return (
                                <span key={path} onClick={() => navigate(path)} className="cursor-pointer">
                                {" > "}{decodeURIComponent(segment)}
                            </span>);
                        }
                    )
                }
            </div>
            <div className="w-full flex justify-end mb-4 space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setFileUploadVisible(true)}>Upload File</button>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => setFolderCreateVisible(true)}>Create Folder</button>
            </div>

            <div id="folderSection" className="mb-6">
                <div id="folders" className="space-y-2">

                </div>
            </div>

            <div id="fileSection">
                <div id="files" className="space-y-2">

                </div>
            </div>
        </div>
    )
}