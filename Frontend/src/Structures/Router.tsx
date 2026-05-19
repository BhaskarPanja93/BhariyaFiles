import {Route, Routes} from 'react-router';

import Homepage from "./Homepage.tsx";

export default function Router() {
    return (
        <Routes>
            <Route path="*" element={<Homepage />} />
        </Routes>
    )
}
