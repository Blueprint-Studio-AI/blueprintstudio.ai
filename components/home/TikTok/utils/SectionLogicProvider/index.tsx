import { ReactNode, useContext, createContext, createRef } from "react";
import { motionValue } from "framer-motion";
import { PROJECT_NAMES } from "../../content/projects";
import { useSectionLogicFunction, UseSectionLogicReturn } from "./useSectionLogicFunction";

interface SectionLogicContextType extends UseSectionLogicReturn {
    PROJECT_NAMES: string[];
    loading: boolean;
}

const defaultContext: SectionLogicContextType = {
    activeSection: 0,
    combinedY: motionValue(0),
    containerRef: createRef<HTMLDivElement>(),
    setSnapLock: () => {},
    PROJECT_NAMES: [],
    loading: true
}

const SectionLogicContext = createContext<SectionLogicContextType>(defaultContext);

export default function SectionLogicProvider({ children }: { children: ReactNode }) {

    const { activeSection, combinedY, containerRef, setSnapLock } = useSectionLogicFunction(PROJECT_NAMES.length);

    const value: SectionLogicContextType = {
        activeSection,
        combinedY,
        containerRef,
        PROJECT_NAMES,
        loading: false,
        setSnapLock,
    }

    return (
        <SectionLogicContext.Provider value={value}>
            { children }
        </SectionLogicContext.Provider>
    )
}

export function useSectionLogic() {
    // useSectionLogic must be used within SectionLogicProvider
    return useContext(SectionLogicContext);
}