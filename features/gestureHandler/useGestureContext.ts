// @/features/GestureHandler/index.ts

import { useContext } from "react";
import { GestureContext } from "./GestureContext";

export function useGestureContext() {
    const context = useContext(GestureContext);
    if (context === null) {
        throw new Error('useGestureContext must be used within an GestureContextProvider');
    }
    return context;
}