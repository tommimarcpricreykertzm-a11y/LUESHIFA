import { TrigramData, HexagramData } from './types';

export const TRIGRAMS: Record<number, TrigramData> = {
  1: { id: 1, name: "Heaven", chineseName: "乾", nature: "Sky", binary: "111" },
  2: { id: 2, name: "Lake", chineseName: "兑", nature: "Marsh", binary: "011" },
  3: { id: 3, name: "Fire", chineseName: "离", nature: "Fire", binary: "101" },
  4: { id: 4, name: "Thunder", chineseName: "震", nature: "Thunder", binary: "001" },
  5: { id: 5, name: "Wind", chineseName: "巽", nature: "Wind", binary: "110" },
  6: { id: 6, name: "Water", chineseName: "坎", nature: "Water", binary: "010" },
  7: { id: 7, name: "Mountain", chineseName: "艮", nature: "Mountain", binary: "100" },
  8: { id: 8, name: "Earth", chineseName: "坤", nature: "Earth", binary: "000" },
};

// Simplified map for looking up hexagram name by upper/lower trigram IDs
// In a full app, this would be a complete 64-item database.
// We will generate the Hexagram Structure dynamically, but we need names.
// Format: "UpperID-LowerID": { number: X, name: "..." }
export const HEXAGRAM_LOOKUP: Record<string, { number: number, name: string, chineseName: string }> = {
  "1-1": { number: 1, name: "The Creative", chineseName: "乾" },
  "8-8": { number: 2, name: "The Receptive", chineseName: "坤" },
  "6-4": { number: 3, name: "Difficulty at the Beginning", chineseName: "屯" },
  "7-6": { number: 4, name: "Youthful Folly", chineseName: "蒙" },
  "6-1": { number: 5, name: "Waiting", chineseName: "需" },
  "1-6": { number: 6, name: "Conflict", chineseName: "讼" },
  "8-6": { number: 7, name: "The Army", chineseName: "师" },
  "6-8": { number: 8, name: "Holding Together", chineseName: "比" },
  "5-1": { number: 9, name: "Small Taming", chineseName: "小畜" },
  "1-2": { number: 10, name: "Treading", chineseName: "履" },
  "8-1": { number: 11, name: "Peace", chineseName: "泰" },
  "1-8": { number: 12, name: "Standstill", chineseName: "否" },
  "1-3": { number: 13, name: "Fellowship", chineseName: "同人" },
  "3-1": { number: 14, name: "Great Possession", chineseName: "大有" },
  "8-7": { number: 15, name: "Modesty", chineseName: "谦" },
  "4-8": { number: 16, name: "Enthusiasm", chineseName: "豫" },
  "2-4": { number: 17, name: "Following", chineseName: "随" },
  "7-5": { number: 18, name: "Work on what has been spoiled", chineseName: "蛊" },
  "8-2": { number: 19, name: "Approach", chineseName: "临" },
  "5-8": { number: 20, name: "Contemplation", chineseName: "观" },
  "3-4": { number: 21, name: "Biting Through", chineseName: "噬嗑" },
  "7-3": { number: 22, name: "Grace", chineseName: "贲" },
  "7-8": { number: 23, name: "Splitting Apart", chineseName: "剥" },
  "8-4": { number: 24, name: "Return", chineseName: "复" },
  "1-4": { number: 25, name: "Innocence", chineseName: "无妄" },
  "7-1": { number: 26, name: "Great Taming", chineseName: "大畜" },
  "7-4": { number: 27, name: "Mouth Corners", chineseName: "颐" },
  "2-5": { number: 28, name: "Great Preponderance", chineseName: "大过" },
  "6-6": { number: 29, name: "The Abysmal", chineseName: "坎" },
  "3-3": { number: 30, name: "The Clinging", chineseName: "离" },
  "2-7": { number: 31, name: "Influence", chineseName: "咸" },
  "4-5": { number: 32, name: "Duration", chineseName: "恒" },
  "1-7": { number: 33, name: "Retreat", chineseName: "遯" },
  "4-1": { number: 34, name: "Great Power", chineseName: "大壮" },
  "3-8": { number: 35, name: "Progress", chineseName: "晋" },
  "8-3": { number: 36, name: "Darkening of the Light", chineseName: "明夷" },
  "5-3": { number: 37, name: "The Family", chineseName: "家人" },
  "3-2": { number: 38, name: "Opposition", chineseName: "睽" },
  "6-7": { number: 39, name: "Obstruction", chineseName: "蹇" },
  "4-6": { number: 40, name: "Deliverance", chineseName: "解" },
  "7-2": { number: 41, name: "Decrease", chineseName: "损" },
  "5-4": { number: 42, name: "Increase", chineseName: "益" },
  "2-1": { number: 43, name: "Breakthrough", chineseName: "夬" },
  "1-5": { number: 44, name: "Coming to Meet", chineseName: "姤" },
  "2-8": { number: 45, name: "Gathering Together", chineseName: "萃" },
  "8-5": { number: 46, name: "Pushing Upward", chineseName: "升" },
  "2-6": { number: 47, name: "Oppression", chineseName: "困" },
  "6-5": { number: 48, name: "The Well", chineseName: "井" },
  "2-3": { number: 49, name: "Revolution", chineseName: "革" },
  "3-5": { number: 50, name: "The Cauldron", chineseName: "鼎" },
  "4-4": { number: 51, name: "The Arousing", chineseName: "震" },
  "7-7": { number: 52, name: "Keeping Still", chineseName: "艮" },
  "5-7": { number: 53, name: "Development", chineseName: "渐" },
  "4-2": { number: 54, name: "The Marrying Maiden", chineseName: "归妹" },
  "4-3": { number: 55, name: "Abundance", chineseName: "丰" },
  "3-7": { number: 56, name: "The Wanderer", chineseName: "旅" },
  "5-5": { number: 57, name: "The Gentle", chineseName: "巽" },
  "2-2": { number: 58, name: "The Joyous", chineseName: "兑" },
  "5-6": { number: 59, name: "Dispersion", chineseName: "涣" },
  "6-2": { number: 60, name: "Limitation", chineseName: "节" },
  "5-2": { number: 61, name: "Inner Truth", chineseName: "中孚" },
  "4-7": { number: 62, name: "Small Preponderance", chineseName: "小过" },
  "6-3": { number: 63, name: "After Completion", chineseName: "既济" },
  "3-6": { number: 64, name: "Before Completion", chineseName: "未济" },
};

export const getHexagram = (upper: number, lower: number): HexagramData => {
  const key = `${upper}-${lower}`;
  const data = HEXAGRAM_LOOKUP[key] || { number: 0, name: "Unknown", chineseName: "?" };
  return {
    ...data,
    upperTrigram: upper,
    lowerTrigram: lower
  };
};