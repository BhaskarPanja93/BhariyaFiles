export type ExplorerItem = {
    name: string;
    path: string;
    parent?: string;
    created?: number;
    modified?: number;
    accessed?: number;
    size?: number;
    permission?: string;
    is_file?: boolean;
    is_dir?: boolean;
    children?: ExplorerItem[];
}

export type FetchStructure = () => Promise<void>;
