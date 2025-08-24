import InnerContainer from "./InnerContainer";
import OuterContainer from "./OuterContainer";

export default function Background() {
    return (
        <div className="
            absolute inset-x-0 -top-[200px] -bottom-[200px] -z-10 pointer-events-none
            flex-1 flex justify-center items-center flex-col
            px-6
            sm:px-[60px]
        ">
            <OuterContainer className="h-full custom:line--r custom:line--l" direction="row">
                <div className="line-dash-y" />
                <InnerContainer className="h-full" />
                <div className="line-dash-y" />
            </OuterContainer>
        </div>
    )
}