import { GestureData } from "../../types";

const BUFFER_SIZE = 5;
const MAX_TIME_DIFFERENCE = 1000; // 1 second, adjust as needed

interface BufferItem {
  data: GestureData | null;
  direction: string | null;
  timestamp: number;
}

let dataBuffer: BufferItem[] = [];
let lastLoggedData: string | null = null;
let logCounter = 0;

export function doubleScrollHandler(currentData: GestureData | null, direction: string | null) {
  if (!currentData) return;

  const currentTime = Date.now();
  const currentDataString = JSON.stringify(currentData);

  // Clear old data
  dataBuffer = dataBuffer.filter(item => currentTime - item.timestamp < MAX_TIME_DIFFERENCE);

  if (currentDataString !== lastLoggedData) {
    dataBuffer.push({ data: currentData, direction, timestamp: currentTime });

    if (dataBuffer.length > BUFFER_SIZE) {
      dataBuffer.shift();
    }

    console.log('New scroll data:', { 
      currentData, 
      direction, 
      bufferSize: dataBuffer.length 
    });

    lastLoggedData = currentDataString;

    // Analyze for potential double scroll
    if (dataBuffer.length >= 3) {
      const [previousPrevious, previous, current] = dataBuffer.slice(-3);
      if (previousPrevious && previous && current) {
        const dip = previous.data!.y < previousPrevious.data!.y && current.data!.y > previous.data!.y;
        const timeOk = (current.timestamp - previousPrevious.timestamp) < MAX_TIME_DIFFERENCE;
        if (dip && previous.direction === current.direction && timeOk) {
          console.log('Potential double scroll detected in direction:', current.direction);
        }
      }
    }

    // Log buffer contents periodically
    logCounter++;
    if (logCounter % 5 === 0) {
      console.log('Buffer snapshot:');
      dataBuffer.forEach((item, index) => {
        console.log(`  ${index}: ${JSON.stringify(item)}`);
      });
    }
  }
}