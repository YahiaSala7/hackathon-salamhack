declare module "leaflet" {
  export type LatLngExpression =
    | [number, number]
    | { lat: number; lng: number };
  export interface LeafletEvent {
    type: string;
    target: any;
  }
}

declare module "react-leaflet" {
  export interface MapContainerProps {
    center: LatLngExpression;
    zoom: number;
    style?: React.CSSProperties;
    attributionControl?: boolean;
    children?: React.ReactNode;
  }
}
