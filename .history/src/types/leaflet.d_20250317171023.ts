declare module "leaflet" {
  export type LatLngExpression =
    | [number, number]
    | { lat: number; lng: number };
  export interface LeafletEvent {
    type: string;
    target: any;
  }
}
