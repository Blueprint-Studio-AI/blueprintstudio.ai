import InnerContainer from "./InnerContainer";
import OuterContainer from "./OuterContainer";

export default function Background() {
    return (
        <div className="
            fixed inset-x-0 -top-[200px] -bottom-[200px] -z-10 pointer-events-none
            flex-1 flex justify-center items-center flex-col
            px-6
            sm:px-[60px]
        ">
            <OuterContainer className="h-full line--r line--l flex-row">
                {/* <div className="bg-red-400 h-full w-1" /> */}
                {/* <InnerContainer className="h-full bg-blue-500" /> */}
                {/* <div className="bg-red-400 h-full w-1" /> */}
                {/* <div className="w-10 h-10 bg-red-500" />
                <div className="w-10 h-10 bg-blue-500" /> */}
            </OuterContainer>
        </div>
    )
}