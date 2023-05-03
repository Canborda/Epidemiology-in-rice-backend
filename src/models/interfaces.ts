export interface IndexDataI {
  name: string;
  formula: any;
  visualizeOptions: VisualizeOptionsI
}

interface VisualizeOptionsI {
  min: number;
  max: number;
  palette: string[];
}

export interface ImagesResponseI {
  url: object;
  date: Date;
  bbox: number[][];
}