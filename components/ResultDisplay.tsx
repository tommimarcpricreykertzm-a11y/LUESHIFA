import React, { useMemo, useState } from 'react';
import { DivinationResult, HexagramData, TrigramData } from '../types';
import { TRIGRAMS, getHexagram } from '../constants';
import { ArrowRight, Camera, Check } from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas';

interface ResultDisplayProps {
  result: DivinationResult;
  question: string;
  onReset: () => void;
}

const HexagramView: React.FC<{
  lines: boolean[]; // true=yang, false=yin. Index 0 = Bottom Line (Line 1)
  info: HexagramData;
  highlightLine?: number; // 1-6, optional
  label: string;
  subLabel: string;
}> = ({ lines, info, highlightLine, label, subLabel }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Label Header */}
      <div className="mb-6 text-center">
        <div className="text-xs text-stone-400 font-bold tracking-[0.2em] uppercase mb-1">{label}</div>
        <div className="text-4xl font-display font-bold text-ink whitespace-nowrap">{info.chineseName}</div>
        <div className="text-lg text-stone-500 font-serif italic border-t border-stone-200 mt-1 pt-1">{info.name}</div>
      </div>

      {/* Hexagram Lines Structure */}
      <div className="flex gap-4 items-center">
        {/* Line Numbers */}
        <div className="flex flex-col-reverse justify-between h-64 py-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className={`text-xs font-serif ${num === highlightLine ? 'text-accent font-bold' : 'text-stone-300'}`}>
                    {num}
                </div>
            ))}
        </div>

        {/* The Bars */}
        <div className="flex flex-col-reverse justify-between h-64 w-40 py-1">
            {lines.map((isYang, index) => {
                const lineNum = index + 1;
                const isMoving = lineNum === highlightLine;
                
                // Style Logic:
                // Moving Line = Solid Fill (bg-accent)
                // Static Line = Hollow Outline (border-stone-600)
                const baseStyle = "h-full rounded-sm transition-all duration-500 box-border";
                const activeStyle = isMoving 
                    ? "bg-accent shadow-md opacity-100 border-none" 
                    : "bg-transparent border-2 border-stone-600 opacity-80";

                return (
                    <div key={index} className="w-full h-5 flex items-center justify-center relative">
                        {isYang ? (
                            // Yang Line (One Bar)
                            <div className={`w-full ${baseStyle} ${activeStyle}`} />
                        ) : (
                            // Yin Line (Two Segments)
                            <div className="w-full h-full flex justify-between">
                                <div className={`w-[42%] ${baseStyle} ${activeStyle}`} />
                                <div className={`w-[42%] ${baseStyle} ${activeStyle}`} />
                            </div>
                        )}

                        {/* Moving Line Indicator Dot - Right Side */}
                        {isMoving && (
                            <div className="absolute -right-6 w-2 h-2 bg-accent rounded-full animate-pulse flex items-center justify-center">
                                <div className="w-full h-full bg-accent rounded-full animate-ping opacity-20 absolute" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>

      <div className="mt-4 text-xs text-stone-400 font-serif tracking-widest text-center">
          {subLabel}
      </div>
    </div>
  );
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, question, onReset }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 1. Reconstruct Original Hexagram Lines (Bottom to Top)
  const originalStructure = useMemo(() => {
    const lower = TRIGRAMS[result.lower];
    const upper = TRIGRAMS[result.upper];
    
    // Binary "111" is Top-to-Bottom. split().map() gives [Top, Mid, Bot]
    // We want Bottom-to-Top array for rendering loop.
    const lowerArr = lower.binary.split('').map(b => b === '1').reverse(); 
    const upperArr = upper.binary.split('').map(b => b === '1').reverse();
    
    return [...lowerArr, ...upperArr];
  }, [result]);

  // 2. Calculate Transformed Hexagram (Flip the moving line)
  const transformedData = useMemo(() => {
    const newLines = [...originalStructure];
    const moveIdx = result.movingLine - 1; // 0-based index
    newLines[moveIdx] = !newLines[moveIdx]; // Flip bit

    // Convert back to Trigram IDs
    // Lines 0-2 = Lower, 3-5 = Upper
    // Need to convert [Bot, Mid, Top] -> Binary String "TopMidBot"
    const getBinary = (chunk: boolean[]) => [...chunk].reverse().map(b => b ? '1' : '0').join('');
    
    const lowerBin = getBinary(newLines.slice(0, 3));
    const upperBin = getBinary(newLines.slice(3, 6));

    const findId = (bin: string) => Object.values(TRIGRAMS).find(t => t.binary === bin)?.id || 1;

    const newLowerId = findId(lowerBin);
    const newUpperId = findId(upperBin);

    return {
        lines: newLines,
        hexagram: getHexagram(newUpperId, newLowerId)
    };
  }, [originalStructure, result.movingLine]);

  const handleScreenshot = async () => {
    const element = document.getElementById('capture-area');
    if (!element) return;
    
    try {
        setCopyStatus('idle');
        const canvas = await html2canvas(element, { 
            backgroundColor: '#fdfbf7',
            scale: 2 // Higher resolution
        });
        
        canvas.toBlob(async (blob: Blob | null) => {
            if (!blob) {
                setCopyStatus('error');
                return;
            }
            try {
                // Clipboard Item needs specific type
                const item = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([item]);
                setCopyStatus('success');
                setTimeout(() => setCopyStatus('idle'), 2000);
            } catch (err) {
                console.error("Clipboard write failed", err);
                setCopyStatus('error');
            }
        });
    } catch (e) {
        console.error("Screenshot failed", e);
        setCopyStatus('error');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
      
      {/* Capture Area Wrapper */}
      <div id="capture-area" className="w-full flex flex-col items-center bg-[#fdfbf7] p-8 rounded-3xl">
          {/* Title */}
          <div className="mb-8 md:mb-12 text-center space-y-2">
             <h2 className="text-2xl font-display font-bold text-ink">占断结果</h2>
             <p className="text-stone-500 font-serif text-sm">问: {question || "综合运势"}</p>
          </div>

          {/* Hexagrams Container - Force Row Layout */}
          <div className="w-auto flex flex-row items-center justify-center gap-4 md:gap-12 lg:gap-24 bg-white p-6 md:p-12 rounded-3xl shadow-xl border border-stone-200">
            
            {/* Original */}
            <div className="flex-shrink-0">
              <HexagramView 
                  lines={originalStructure}
                  info={result.hexagram}
                  highlightLine={result.movingLine}
                  label="本卦"
                  subLabel={`动爻：第 ${result.movingLine} 爻`}
              />
            </div>

            {/* Arrow Divider */}
            <div className="flex flex-col items-center justify-center text-stone-300 flex-shrink-0 px-2">
                <ArrowRight size={32} className="text-stone-400" />
                <div className="text-xs font-serif mt-2 uppercase tracking-widest hidden md:block">变</div>
            </div>

            {/* Transformed */}
            <div className="flex-shrink-0">
              <HexagramView 
                  lines={transformedData.lines}
                  info={transformedData.hexagram}
                  highlightLine={result.movingLine} // Still highlight where the change happened
                  label="之卦"
                  subLabel="变卦"
              />
            </div>
          </div>
          
          <div className="mt-8 text-xs text-stone-300 font-serif italic text-center">
            高岛易断 · 略筮法
          </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-4 items-center">
        <button 
          onClick={onReset}
          className="bg-ink text-white px-10 py-3 rounded-full hover:bg-stone-700 transition-all duration-300 font-display tracking-[0.2em] shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          重新起卦
        </button>

        <button 
          onClick={handleScreenshot}
          className={`px-6 py-3 rounded-full border border-stone-300 bg-white text-stone-600 hover:border-accent hover:text-accent transition-all duration-300 font-serif flex items-center gap-2 shadow-sm hover:shadow-md ${copyStatus === 'success' ? 'border-green-500 text-green-600' : ''}`}
        >
          {copyStatus === 'success' ? (
              <>
                 <Check size={18} />
                 <span>已复制到剪贴板</span>
              </>
          ) : copyStatus === 'error' ? (
              <span>复制失败，请手动截图</span>
          ) : (
              <>
                 <Camera size={18} />
                 <span>截图保存</span>
              </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;