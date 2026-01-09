export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE'
}

export enum AppStage {
  Intro = 'INTRO',
  Sincerity = 'SINCERITY',
  Step1 = 'STEP_1',
  Step2 = 'STEP_2',
  Step3 = 'STEP_3',
  Result = 'RESULT'
}

export interface TrigramData {
  id: number;
  name: string;
  chineseName: string;
  nature: string;
  binary: string; // "111", "010" etc. Top to Bottom
}

export interface HexagramData {
  number: number;
  name: string;
  chineseName: string;
  upperTrigram: number;
  lowerTrigram: number;
}

export interface DivinationResult {
  upper: number;
  lower: number;
  movingLine: number; // 1-6
  hexagram: HexagramData;
}
