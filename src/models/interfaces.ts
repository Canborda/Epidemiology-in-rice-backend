export interface IndexDataI {
  name: string;
  formula: any;
  visualizeOptions: VisualizeOptionsI;
}

interface VisualizeOptionsI {
  min: number;
  max: number;
  palette: string[];
}

export interface PixelDataI {
  value: number;
  latitude: number;
  longitude: number;
}

export interface ImagesResponseI {
  url: string;
  date: Date;
  bbox: number[][];
}

export interface ValuesResponseI {
  pixels: PixelDataI[];
  mean: number;
}
