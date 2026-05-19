import {useState} from "react";
import type {ExplorerItem} from "./ExplorerTypes";

type FileDisplayProps = {
    item: ExplorerItem;
};

function formatBytes(bytes?: number) {
    if (!bytes) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB", "TB"];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${parseFloat((bytes / Math.pow(1024, exponent)).toFixed(2))} ${units[exponent]}`;
}

function formatTime(timestamp?: number) {
    if (!timestamp) return "Unknown";
    return new Date(timestamp * 1000).toLocaleString();
}

export function FileDisplay({item}: FileDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/api/download/${item.path}`);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <div
            onClick={() => window.open(`/api/download/${item.path}`)}
            className="flex justify-between items-center bg-green-50 hover:bg-green-100 shadow rounded-md p-4 transition cursor-pointer gap-4"
        >
            <div className="flex items-center space-x-2 min-w-0">
                <span className="text-green-500">{"\uD83D\uDCC4"}</span>
                <div className="min-w-0">
                    <div className="font-medium text-gray-700 truncate">{item.name}</div>
                </div>
            </div>
            <div className="text-xs text-gray-600 flex items-center justify-end space-x-4 text-right flex-wrap">
                <span>Created: {formatTime(item.created)}</span>
                <span>Modified: {formatTime(item.modified ?? item.created)}</span>
                <span>Accessed: {formatTime(item.accessed ?? item.created)}</span>
                <span>Size: {formatBytes(item.size)}</span>
                <span>Perm: {item.permission ?? "Unknown"}</span>
                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        void handleCopy();
                    }}
                    className="ml-2 px-2 py-1 bg-transparent cursor-pointer rounded text-gray-700 font-bold text-sm transition"
                >
                    {copied ? "Copied!" : `${"\uD83D\uDD17"} Share`}
                </button>
            </div>
        </div>
    );
}
