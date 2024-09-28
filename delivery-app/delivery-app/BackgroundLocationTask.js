import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

// Define the task name
const BACKGROUND_LOCATION_TASK = 'background-location-task';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data: { locations }, error }) => {
  if (error) {
    console.error(error);
    return;
  }

  if (locations) {
    const location = locations[0];
    console.log('Background location:', location);
    // Handle location data (e.g., send to your server)
  }
});
