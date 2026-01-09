import React, { useState, useRef } from 'react';
import { AppStage, Gender, DivinationResult } from './types';
import { getHexagram } from './constants';
import StalksVisualizer from './components/StalksVisualizer';
import ResultDisplay from './components/ResultDisplay';
import { Wind, Circle, Hand, CheckCircle2 } from 'lucide-react';

// Total stalks used in calculation (Tai Chi removed)
const ACTIVE_STALKS = 49;

export default function App() {
  const [stage, setStage] = useState<AppStage>(AppStage.Intro);
  const [gender, setGender] = useState<Gender>(Gender.Male);
  const [question, setQuestion] = useState('');
  
  // Animation/Logic state
  const [stalksSplit, setStalksSplit] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  // Replaced detailed calc display with simple state
  const [isRecorded, setIsRecorded] = useState(false);
  
  // Results
  const [step1Val, setStep1Val] = useState<number | 0>(0);
  const [step2Val, setStep2Val] = useState<number | 0>(0);
  const [step3Val, setStep3Val] = useState<number | 0>(0);

  const performSplit = (modulus: number, nextStage: AppStage | null, manualLeftCount?: number) => {
    if (isAnimating) return;

    // STRICT ENFORCEMENT: Manual input required.
    if (manualLeftCount === undefined) {
        return;
    }

    setIsAnimating(true);
    setIsRecorded(false);

    // The manualLeftCount comes directly from the pixel coordinate of the user's click
    const leftCount = manualLeftCount; 
    setStalksSplit(leftCount);

    // Calculation logic based on Takashima method (Recorded in background)
    let targetPileCount = leftCount;
    if (stage === AppStage.Step2) {
        targetPileCount = ACTIVE_STALKS - leftCount; // Right pile for Step 2
    }

    let remainder = targetPileCount % modulus;
    if (remainder === 0) remainder = modulus;
    
    // Store result
    if (stage === AppStage.Step1) setStep1Val(remainder);
    if (stage === AppStage.Step2) setStep2Val(remainder);
    if (stage === AppStage.Step3) setStep3Val(remainder);

    // Delay for animation
    setTimeout(() => {
      setIsRecorded(true); // Show momentary success state
      
      setTimeout(() => {
        setIsAnimating(false);
        setIsRecorded(false);
        if (nextStage) {
          setStalksSplit(null); // Reset visual
          setStage(nextStage);
        } else {
          // Finished
          setStage(AppStage.Result);
        }
      }, 1000); // Quick transition
    }, 1500); 
  };

  const getResult = (): DivinationResult => {
    let upper = 0;
    let lower = 0;

    if (gender === Gender.Male) {
      upper = step1Val; // First split determines Upper
      lower = step2Val; // Second split determines Lower
    } else {
      lower = step1Val; // First split determines Lower
      upper = step2Val; // Second split determines Upper
    }

    return {
      upper,
      lower,
      movingLine: step3Val,
      hexagram: getHexagram(upper, lower)
    };
  };

  const resetApp = () => {
    setStage(AppStage.Intro);
    setStalksSplit(null);
    setStep1Val(0);
    setStep2Val(0);
    setStep3Val(0);
    setQuestion('');
  };

  // --- RENDER HELPERS ---

  const renderIntro = () => (
    <div className="max-w-xl mx-auto text-center space-y-10 animate-fade-in p-6">
      <div className="space-y-4">
        <h1 className="text-5xl font-display text-ink">略筮法</h1>
        <p className="text-stone-500 font-serif text-lg tracking-wide uppercase">高岛易断 · Takashima Ekidan</p>
      </div>
      
      <div className="bg-white/80 p-8 rounded-lg shadow-md border border-stone-200 space-y-6">
        <p className="text-stone-700 font-serif leading-relaxed">
          此法为日本明治时期易学大师高岛嘉右卫门所创之“略筮法”。
          您将亲自通过鼠标移动分策，模拟真实的筮竹演算。
          每一卦，皆由您的手亲自定夺，绝无虚假随机。
        </p>
        
        <div className="space-y-2 text-left">
          <label className="block text-sm font-bold text-stone-500 uppercase tracking-widest">心中所问之事 (可选)</label>
          <input 
            type="text" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="例如：此项目投资是否可行？"
            className="w-full bg-paper border border-stone-300 p-3 rounded font-serif focus:outline-none focus:border-bamboo transition-colors"
          />
        </div>

        <div className="space-y-4">
           <label className="block text-sm font-bold text-stone-500 uppercase tracking-widest">选择阴阳 (问卦者性别)</label>
           <div className="grid grid-cols-2 gap-4">
             <button 
               onClick={() => setGender(Gender.Male)}
               className={`p-4 border rounded transition-all font-display ${gender === Gender.Male ? 'bg-ink text-white border-ink' : 'border-stone-300 text-stone-400 hover:border-ink'}`}
             >
               男 / 阳 (Male)
             </button>
             <button 
               onClick={() => setGender(Gender.Female)}
               className={`p-4 border rounded transition-all font-display ${gender === Gender.Female ? 'bg-ink text-white border-ink' : 'border-stone-300 text-stone-400 hover:border-ink'}`}
             >
               女 / 阴 (Female)
             </button>
           </div>
           <p className="text-xs text-stone-400 italic text-center mt-2">
             注：高岛筮法中，男性先定上卦后定下卦；女性先定下卦后定上卦。
           </p>
        </div>
      </div>

      <button 
        onClick={() => setStage(AppStage.Sincerity)}
        className="bg-accent text-white px-10 py-4 rounded shadow-lg hover:bg-red-700 transition-all transform hover:scale-105 font-display tracking-widest text-lg"
      >
        进入筮室
      </button>
    </div>
  );

  const renderSincerity = () => (
    <div className="max-w-xl mx-auto text-center space-y-12 animate-fade-in py-12">
      <div className="space-y-4">
        <h2 className="text-4xl font-display text-ink">至诚</h2>
        <p className="text-stone-600 font-serif italic">"至诚之道，可以前知。"</p>
      </div>
      
      <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
         <div className="absolute inset-0 bg-bamboo/20 rounded-full animate-ping opacity-75"></div>
         <div className="relative bg-white p-6 rounded-full shadow-xl border border-stone-100">
            <Wind className="w-10 h-10 text-bamboo-dark" />
         </div>
      </div>

      <p className="text-stone-700 font-serif text-lg leading-relaxed px-4">
        请摒除杂念，全神贯注于所问之事。<br/>
        我们将使用四十九策进行推演。<br/>
        <span className="text-accent font-bold">请相信您的直觉，每一次分策都是天意的体现。</span>
      </p>

      <button 
        onClick={() => setStage(AppStage.Step1)}
        className="border-b-2 border-ink pb-1 hover:text-accent hover:border-accent transition-colors font-display text-xl uppercase tracking-widest mt-8"
      >
        开始分策
      </button>
    </div>
  );

  const renderActionStage = (title: string, subtitle: string, stepNumber: number) => {
    // Determine the handler for the current step
    const handleSplit = (index: number) => {
        if (stepNumber === 1) performSplit(8, AppStage.Step2, index);
        if (stepNumber === 2) performSplit(8, AppStage.Step3, index);
        if (stepNumber === 3) performSplit(6, null, index);
    };

    return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between min-h-[60vh] py-8">
      
      <div className="text-center space-y-2">
        <h2 className="text-sm font-bold text-stone-400 uppercase tracking-[0.3em]">第 {stepNumber} 步 (共 3 步)</h2>
        <h3 className="text-3xl font-display text-ink">{title}</h3>
        <p className="text-stone-500 font-serif italic">{subtitle}</p>
      </div>

      <div className="w-full my-8">
        <StalksVisualizer 
          total={ACTIVE_STALKS} 
          splitIndex={stalksSplit} 
          isAnimating={isAnimating} 
          interactive={!isAnimating}
          onSplit={handleSplit}
        />
      </div>

      <div className="h-20 flex items-center justify-center w-full">
        {isAnimating ? (
            <div className="flex flex-col items-center justify-center gap-2 animate-fade-in">
                {isRecorded ? (
                     <div className="flex items-center gap-2 text-accent font-display tracking-widest text-lg">
                        <CheckCircle2 size={24} />
                        <span>天机已定</span>
                     </div>
                ) : (
                    <div className="text-stone-400 font-serif italic">
                        正在感应...
                    </div>
                )}
            </div>
        ) : (
            <div className="text-stone-500 font-serif bg-white/50 px-6 py-4 rounded-full border border-stone-200 flex flex-col items-center gap-1 shadow-sm animate-pulse">
               <div className="flex items-center gap-2">
                 <Hand size={18} />
                 <span>请用鼠标左右滑动竹策</span>
               </div>
               <span className="text-xs text-stone-400">点击任意位置确认您的选择</span>
            </div>
        )}
      </div>

      <div className="text-xs text-stone-300 uppercase tracking-widest mt-8">
        {stepNumber === 1 ? (gender === Gender.Male ? "定上卦" : "定下卦") : ""}
        {stepNumber === 2 ? (gender === Gender.Male ? "定下卦" : "定上卦") : ""}
        {stepNumber === 3 ? "定唯一的动爻" : ""}
      </div>
    </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#fdfbf7] flex flex-col">
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none wood-texture z-0"></div>

      <header className="relative z-10 p-6 flex justify-between items-center border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-ink">
          <Circle size={16} fill="currentColor" className="text-accent" />
          <span className="font-display font-bold tracking-widest">高岛易断</span>
        </div>
        {stage !== AppStage.Intro && stage !== AppStage.Result && (
           <div className="text-xs font-serif text-stone-400">
              所问: {question || "未言之事"}
           </div>
        )}
      </header>

      <main className="relative z-10 flex-grow flex flex-col justify-center">
        {stage === AppStage.Intro && renderIntro()}
        {stage === AppStage.Sincerity && renderSincerity()}
        
        {stage === AppStage.Step1 && renderActionStage("初变", "分天象，定八卦", 1)}
        {stage === AppStage.Step2 && renderActionStage("二变", "分地象，成重卦", 2)}
        {stage === AppStage.Step3 && renderActionStage("三变", "观其变，定动爻", 3)}

        {stage === AppStage.Result && (
          <ResultDisplay 
            result={getResult()} 
            question={question}
            onReset={resetApp}
          />
        )}
      </main>

      <footer className="relative z-10 p-4 text-center text-xs text-stone-400 font-serif border-t border-stone-200/50">
        基于高岛嘉右卫门 (1832–1914) 易断法
      </footer>
    </div>
  );
}