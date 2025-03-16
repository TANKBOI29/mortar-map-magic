
// Define the mortar positions from the map
export interface MortarPosition {
  id: string;
  name: string;
  x: number;
  y: number;
}

// Define the key locations from the map
export const mortarPositions: MortarPosition[] = [
  { id: "b2", name: "B2", x: 477, y: 64 },
  { id: "b3", name: "B3", x: 666, y: 64 },
  { id: "d3", name: "D3", x: 580, y: 316 }
];

// Map dimensions (based on the provided image)
export const MAP_WIDTH = 1187;
export const MAP_HEIGHT = 573;

// Calculate the angle between two points, adjusted for our coordinate system
export function calculateAngle(
  mortarX: number,
  mortarY: number,
  targetX: number,
  targetY: number
): number {
  // Calculate raw angle (in radians)
  let angle = Math.atan2(targetY - mortarY, targetX - mortarX);
  
  // Convert to degrees
  angle = angle * (180 / Math.PI);
  
  // Adjust angle to be relative to North (0 degrees)
  // Assuming y-axis is North-South and x-axis is East-West
  // Subtract 90 degrees to make North 0 degrees
  angle = angle - 90;
  
  // Normalize to 0-360 range
  if (angle < 0) {
    angle += 360;
  }
  
  // Invert direction to match standard compass (clockwise)
  angle = 360 - angle;
  
  return Math.round(angle);
}

// Calculate the distance between two points
export function calculateDistance(
  mortarX: number,
  mortarY: number,
  targetX: number,
  targetY: number
): number {
  const dx = targetX - mortarX;
  const dy = targetY - mortarY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Calculate the elevation (angle) needed based on distance
// This is a simplified model - would need to be calibrated for the actual game
export function calculateElevation(distance: number): number {
  // This is a simplistic approximation - would need to be tuned
  // Example: Linear model with distance
  // Assuming elevation is in degrees (45-85)
  const minElevation = 45;
  const maxElevation = 85;
  const maxRange = MAP_WIDTH * 0.8; // Calibrate this
  
  // Calculate elevation (higher for shorter distances)
  const elevationDelta = maxElevation - minElevation;
  const elevationPercent = Math.max(0, Math.min(1, 1 - (distance / maxRange)));
  const elevation = minElevation + (elevationDelta * elevationPercent);
  
  return Math.round(elevation);
}

// Calculate the full aiming solution
export interface AimingSolution {
  azimuth: number;   // Compass direction in degrees (0-360)
  elevation: number; // Vertical angle in degrees (45-85)
  distance: number;  // Distance in map units
  timeOfFlight: number; // Estimated time in seconds
}

export function calculateAimingSolution(
  mortarId: string,
  targetX: number,
  targetY: number
): AimingSolution {
  // Find the selected mortar position
  const mortarPosition = mortarPositions.find(pos => pos.id === mortarId);
  
  if (!mortarPosition) {
    throw new Error(`Mortar position ${mortarId} not found`);
  }
  
  const { x: mortarX, y: mortarY } = mortarPosition;
  
  // Calculate azimuth (compass direction)
  const azimuth = calculateAngle(mortarX, mortarY, targetX, targetY);
  
  // Calculate distance
  const distance = calculateDistance(mortarX, mortarY, targetX, targetY);
  
  // Calculate elevation
  const elevation = calculateElevation(distance);
  
  // Calculate estimated time of flight (simplified)
  // Higher elevations = longer flight times
  const timeOfFlight = (distance / 200) * (1 + (elevation - 45) / 40);
  
  return {
    azimuth,
    elevation,
    distance: Math.round(distance),
    timeOfFlight: parseFloat(timeOfFlight.toFixed(1))
  };
}

// Get the compass direction name from degrees
export function getCompassDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
