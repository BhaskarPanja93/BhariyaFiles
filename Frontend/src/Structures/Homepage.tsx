import {Fragment, useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import axios from "axios";
import {FileDisplay} from "../Elements/FileDisplay";
import {FileUpload} from "../Elements/FileUpload";
import {FolderCreate} from "../Elements/FolderCreate";
import {FolderDisplay} from "../Elements/FolderDisplay";
import type {ExplorerItem} from "../Elements/ExplorerTypes";

type ApiStructure = ExplorerItem | ExplorerItem[];

function normalizeStructure(structure: ApiStructure): ExplorerItem {
    if (Array.isArray(structure)) {
        return {
            name: "Home",
            path: "",
            is_dir: true,
            children: structure,
        };
    }

    return structure;
}


export default function Homepage() {
    const {"*": wildcardPath = ""} = useParams();
    const navigate = useNavigate();

    const [fileUploadVisible, setFileUploadVisible] = useState(false);
    const [folderCreateVisible, setFolderCreateVisible] = useState(false);
    const [structure, setStructure] = useState<ExplorerItem | null>(null);
    const [currentNode, setCurrentNode] = useState<ExplorerItem | null>(null);

    const fetchStructure = useCallback(async () => {
        try {
            const response = await axios.get<ApiStructure>("/api/all-files");
            setStructure(normalizeStructure(response.data));
        } catch (error) {
            console.error("Error fetching structure:", error);
        }
    }, []);

    useEffect(() => {
        void fetchStructure();
    }, [fetchStructure]);

    useEffect(() => {
        if (!structure) return;

        const urlSegments = wildcardPath ? wildcardPath.split("/").filter(Boolean) : [];
        let current: ExplorerItem | undefined = structure;

        for (const segment of urlSegments) {
            current = current.children?.find((item) => item.name === segment);
            if (!current) {
                console.error("Path not found");
                navigate("/", {replace: true});
                return;
            }

            if (current.is_file) {
                window.location.href = `/api/download/${current.path}`;
                navigate(`/${current.parent ?? ""}`, {replace: true});
                return;
            }
        }

        setCurrentNode(current);
    }, [navigate, structure, wildcardPath]);

    return (
        <div>
            {fileUploadVisible && (
                <FileUpload
                    closePopup={() => setFileUploadVisible(false)}
                    fetchStructure={fetchStructure}
                    location={wildcardPath}
                />
            )}
            {folderCreateVisible && (
                <FolderCreate
                    closePopup={() => setFolderCreateVisible(false)}
                    fetchStructure={fetchStructure}
                    location={wildcardPath}
                />
            )}

            <div id="breadcrumb" className="text-sm text-gray-600 mb-4">
                <span onClick={() => navigate("/")} className="cursor-pointer">
                    Home
                </span>
                {wildcardPath
                    .split("/")
                    .filter(Boolean)
                    .map((segment, index, segments) => {
                        const path = `/${segments.slice(0, index + 1).join("/")}`;
                        return (
                            <Fragment key={path}>
                                {" > "}
                                <span onClick={() => navigate(path)} className="cursor-pointer">
                                    {decodeURIComponent(segment)}
                                </span>
                            </Fragment>
                        );
                    })}
            </div>
            <div className="w-full flex justify-end mb-4 space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setFileUploadVisible(true)}>Upload File</button>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => setFolderCreateVisible(true)}>Create Folder</button>
            </div>

            <div id="folderSection" className="mb-6">
                <div id="folders" className="space-y-2">
                    {currentNode?.children
                        ?.filter((item) => item.is_dir)
                        .map((item) => <FolderDisplay key={item.path} item={item}/>)}
                </div>
            </div>

            <div id="fileSection">
                <div id="files" className="space-y-2">
                    {currentNode?.children
                        ?.filter((item) => item.is_file)
                        .map((item) => <FileDisplay key={item.path} item={item}/>)}
                </div>
            </div>
        </div>
    )
}
