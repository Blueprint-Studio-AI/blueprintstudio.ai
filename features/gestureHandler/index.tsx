import { ReactNode } from "react";
import { GestureContext, gestureContextValue } from "./GestureContext";
import Handlers from './Handlers';

export default function GestureHandler({ children }: {children: ReactNode}) {
    return (
        <GestureContext.Provider value={gestureContextValue}>
            <Handlers>
                {children}
            </Handlers>
        </GestureContext.Provider>
    );
}