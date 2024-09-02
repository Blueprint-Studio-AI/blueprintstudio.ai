import { GestureContextValue } from "../../GestureContext";

const THRESHOLD = 100;

export function checkTouchThreshold(
    x: number,
    y: number,
    { goUp, goLeft, goRight, goDown }: Pick<GestureContextValue, 'goUp' | 'goLeft' | 'goRight' | 'goDown' >
) {  
    if (Math.abs(x) > Math.abs(y)) {
        //Horizontal movement
        if (x > THRESHOLD) {
            goLeft();
        } else if (x < -THRESHOLD) {
            goRight();
        }
    } else {
        //Vertical movement
        if (y > THRESHOLD) {
            goUp();
        } else if (y < -THRESHOLD) {
            goDown();
        }
    }
}