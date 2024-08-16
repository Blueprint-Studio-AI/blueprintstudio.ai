import { Lethargy } from 'lethargy-ts';
import { GestureData, HandlerProps, InputType } from '../types';
import { useState } from 'react';

//Handling scroll data is a bitch because the browser automatically adds "inertia" values
//so the data doesn't come in clean. Here we use lethargy-ts package to classify scroll
//events as intentional vs browser simulated.

//However, it's def not perfect, but will prob work for big swipes.
//In the future, if we want to add slow swipe support, we'll need to classify the swipe intensity
//and then use lethargy with the proper sensativity settings.

//This prob won't fit perfect in the event processing pipeline :')

//Big scroll settings
const lethargy = new Lethargy({
    sensitivity: 2,
    delay: 20,
    increasingDeltasThreshold: 12,
  });

//sensitivity - Specifies the minimum value for wheelDelta for it to register as a valid scroll event.
//Because the tail of the curve has low wheelDelta values, this will stop them from registering as valid
//scroll events.

//delay - If there was a pause of this amount of milliseconds between two events,
//the current event is assumed to be user-triggered.

//increasingDeltasThreshold - If wheelDelta has been increasing for this amount of
//consecutive events, the current event is assumed to be user-triggered.

let accumulatorX = 0;
let accumulatorY = 0;
let gestureTimeout: NodeJS.Timeout | null = null;

function handleScroll(event: WheelEvent, props: HandlerProps): void {
    const isIntentional = lethargy.check(event);

    if (isIntentional) {
        accumulatorX += event.deltaX;
        accumulatorY += event.deltaY;

        const gestureData: GestureData = {
            x: accumulatorX,
            y: accumulatorY,
            isActive: true
        };

        props.onGestureChange(gestureData);
        props.activeInput('wheel');

        // Reset the gesture timeout
        if (gestureTimeout) clearTimeout(gestureTimeout);
        gestureTimeout = setTimeout(() => completeGesture(props), 150); // Adjust timeout as needed
    }
}

function completeGesture(props: HandlerProps): void {
// Emit "gesture complete" event with final values
const finalGestureData: GestureData = {
    x: accumulatorX,
    y: accumulatorY,
    isActive: false
};
props.onGestureChange(finalGestureData);

// Reset accumulators
accumulatorX = 0;
accumulatorY = 0;
}

export function setupScrollHandler(container: HTMLElement, props: HandlerProps) {
    const scrollHandler = (event: WheelEvent) => handleScroll(event, props);
  
    container.addEventListener('wheel', scrollHandler);
  
    return () => {
      container.removeEventListener('wheel', scrollHandler);
    }
  }