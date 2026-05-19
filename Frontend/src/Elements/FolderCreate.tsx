import {useState} from "react";
import axios from "axios";
import type {FetchStructure} from "./ExplorerTypes";

type FolderCreateResponse = {
    allowed: boolean;
    notification?: string;
}

type FolderCreateProps = {
    closePopup: () => void;
    fetchStructure: FetchStructure;
    location?: string;
}

export function FolderCreate({closePopup, fetchStructure, location}: FolderCreateProps) {
    const [successNotification, setSuccessNotification] = useState("");
    const [failureNotification, setFailureNotification] = useState("");
    const [newFolderName, setNewFolderName] = useState("");

    const handleCreate = () => {
        setSuccessNotification("");
        setFailureNotification("");

        const formData = new FormData();
        formData.append("location", location ?? "");
        formData.append("folder_name", newFolderName);

        axios.post<FolderCreateResponse>("/api/create-folder", formData)
            .then(async (response) => {
                const data = response.data;
                if (data.allowed) {
                    setSuccessNotification("Folder created successfully");
                    await fetchStructure();
                    closePopup();
                } else {
                    setFailureNotification(data.notification ?? "Folder could not be created");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-white w-[90%] max-w-[400px] h-auto p-6 rounded-lg shadow-lg relative flex flex-col items-center shadow-gray-800 shadow-xl border border-gray-200">
                <button
                    className="cursor-pointer self-end mb-4 bg-gray-200 text-gray-500 font-bold border border-gray-500 px-3 py-1 rounded-lg"
                    onClick={closePopup}
                    type="button"
                >
                    X
                </button>
                <div className="w-full">
                    <p className="text-green-600 text-sm text-center mb-2">{successNotification}</p>
                    <p className="text-red-500 text-sm text-center mb-2">{failureNotification}</p>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Create Folder</h2>
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        name="folderName"
                        placeholder="Enter folder name"
                        required
                        type="text"
                        value={newFolderName}
                        onChange={(event) => setNewFolderName(event.target.value)}
                    />

                    <button
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        type="button"
                        onClick={handleCreate}
                        disabled={newFolderName.trim().length === 0}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
