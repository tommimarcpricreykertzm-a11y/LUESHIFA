import { GoogleGenAI } from "@google/genai";
import { DivinationResult } from "../types";
import { TRIGRAMS } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const interpretHexagram = async (result: DivinationResult, question: string): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "错误：未配置 API Key。请检查您的设置。";
  }

  const upper = TRIGRAMS[result.upper];
  const lower = TRIGRAMS[result.lower];
  
  const prompt = `
    你现在扮演“圣断”高岛嘉右卫门（Takashima Kaemon），这位日本明治时期的易学大师以将《易经》应用于商业、政治决策而闻名。
    
    用户刚刚使用了你的“略筮法”进行起卦。
    
    【背景信息】
    用户所问之事： "${question || "综合运势"}"
    
    【卦象结果】
    本卦： ${result.hexagram.chineseName}卦 （${upper.chineseName}上${lower.chineseName}下）
    动爻： 第 ${result.movingLine} 爻
    
    【你的任务】
    请用中文提供一段简明、决断、切中要害的判词。
    1. **卦义简述**：简要解释本卦的核心含义。
    2. **动爻决断（核心）**：高岛略筮法极其看重唯一的动爻。请重点解释该动爻的爻辞及其在当前局势下的指引。
    3. **具体建议**：给出明确的行动指南（如：进取/退守，买入/卖出，可行/不可行）。
    4. **语气风格**：保持严肃、诚恳、充满智慧的语气（体现“至诚”）。
    
    【输出格式】
    请使用清晰的 HTML 标签 (<h3>, <p>, <ul>) 进行排版，以便在网页上美观显示。不要使用 Markdown 代码块包裹。
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return response.text || "神灵默然，请稍后再试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "无法感应天机 (API Error)";
  }
};