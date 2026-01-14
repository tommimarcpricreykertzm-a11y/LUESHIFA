import React, { useEffect, useState, useRef } from 'react';

interface StalksVisualizerProps {
  total: number;
  splitIndex: number | null; // If null, all together. If number, split at that index.
  isAnimating: boolean;
  interactive?: boolean;
  onSplit?: (index: number) => void;
}

const StalksVisualizer: React.FC<StalksVisualizerProps> = ({
  total,
  splitIndex,
  isAnimating,
  interactive = false,
  onSplit
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Generate stable random offsets for the "hand-held" look
  const [offsets] = useState(() =>
    Array.from({ length: 50 }, () => ({
      y: Math.random() * 20 - 10,
      rotate: Math.random() * 4 - 2,
      heightVar: Math.random() * 10 - 5
    }))
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || splitIndex !== null || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    // Calculate percentage
    const percentage = Math.max(0, Math.min(1, x / width));

    // Map to index (ensure at least 2 on each side for visual logic)
    const rawIndex = Math.floor(percentage * total);
    // Clamp to ensure meaningful splits (e.g. not 0 or 49)
    const safeIndex = Math.max(2, Math.min(total - 2, rawIndex));

    setHoverIndex(safeIndex);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverIndex(null);
  };

  const handleClick = () => {
    if (!interactive || splitIndex !== null || hoverIndex === null || !onSplit) return;
    onSplit(hoverIndex);
    setHoverIndex(null);
  };

  // Determine the effective split point for rendering
  // If actual splitIndex exists (animation/result), use it.
  // Otherwise if hovering, use hoverIndex for preview.
  const visualSplitIndex = splitIndex !== null ? splitIndex : hoverIndex;

  const leftCount = visualSplitIndex !== null ? visualSplitIndex : total;
  const rightCount = visualSplitIndex !== null ? total - visualSplitIndex : 0;

  return (
    <div
      className={`relative h-64 w-full max-w-2xl mx-auto flex items-end justify-center perspective-1000 select-none`}
    >
      {/* Interaction Wrapper */}
      <div
        ref={containerRef}
        className={`relative z-10 pb-4 -mb-4 flex flex-col items-center justify-end w-fit mx-auto h-full ${interactive ? 'cursor-col-resize touch-none' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div
          className={`flex items-end justify-center transition-all duration-300 ease-out ${visualSplitIndex !== null ? 'gap-24' : 'gap-1'
            }`}
        >
          {/* Left Bundle */}
          <div className="flex items-end -space-x-1 relative transition-transform duration-500">
            {Array.from({ length: leftCount }).map((_, i) => (
              <div
                key={`l-${i}`}
                className="w-2 rounded-full bg-gradient-to-t from-bamboo-dark to-bamboo border-l border-white/20 shadow-sm transition-all duration-200 pointer-events-none"
                style={{
                  height: `${180 + offsets[i].heightVar}px`,
                  transform: `translateY(${offsets[i].y}px) rotate(${offsets[i].rotate}deg)`,
                  zIndex: i
                }}
              />
            ))}
          </div>

          {/* Right Bundle (only if split visually or actually) */}
          {visualSplitIndex !== null && (
            <div className="flex items-end -space-x-1 relative transition-transform duration-500">
              {Array.from({ length: rightCount }).map((_, i) => {
                const globalIndex = visualSplitIndex + i;
                // Safe access to offsets in case of array bounds issues, though total is fixed at 50/49
                const offset = offsets[globalIndex] || { y: 0, rotate: 0, heightVar: 0 };
                return (
                  <div
                    key={`r-${i}`}
                    className="w-2 rounded-full bg-gradient-to-t from-bamboo-dark to-bamboo border-l border-white/20 shadow-sm transition-all duration-200 pointer-events-none"
                    style={{
                      height: `${180 + offset.heightVar}px`,
                      transform: `translateY(${offset.y}px) rotate(${offset.rotate}deg)`,
                      zIndex: i
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Interaction Hint */}
        {interactive && hoverIndex !== null && splitIndex === null && (
          <div className="absolute bottom-[20px] text-xs text-stone-400 font-serif pointer-events-none animate-bounce flex flex-col items-center z-20">
            <span className="text-xl leading-none mb-1 text-accent">▲</span>
            <span className="bg-white/80 backdrop-blur px-2 py-1 rounded shadow-sm border border-stone-200 whitespace-nowrap">点击此处分策</span>
          </div>
        )}
      </div>

      {/* Table/Mat visual anchor */}
      <div className="absolute bottom-0 w-full h-4 bg-ink/5 blur-sm rounded-full pointer-events-none" />
    </div>
  );
};

export default StalksVisualizer;