export default function DetectionAnalytics() {
  return (
    <div className="flex flex-row">
      <div className="">
        <div className="flex flex-col h-full bg-black p-1 font-mono uppercase tracking-wider text-[#d1d1d1] border border-[#333]">
          <div className="bg-[#d4a017] px-2 py-0.5 text-[10px] font-bold text-black">
            <span>Scoreboard</span>
          </div>

          <div className="flex-1 flex items-center justify-between px-10 py-6 bg-[#0a0a0a] border-x border-b border-[#333]">
            <div className="text-center">
              <div className="text-[10px] text-[#899499] mb-1 tracking-[0.2em]">
                ATL
              </div>
              <div className="text-6xl font-black text-[#22d3ee] leading-none drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                2
              </div>
            </div>

            <div className="mx-6 flex flex-col gap-2 opacity-15">
              <div className="w-1.5 h-1.5 bg-[#d1d1d1] rotate-45"></div>
              <div className="w-1.5 h-1.5 bg-[#d1d1d1] rotate-45"></div>
              <div className="w-1.5 h-1.5 bg-[#d1d1d1] rotate-45"></div>
            </div>

            <div className="text-center">
              <div className="text-[10px] text-[#899499] mb-1 tracking-[0.2em]">
                NYC
              </div>
              <div className="text-6xl font-black text-[#d1d1d1] leading-none">
                1
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-[#333] border-x border-b border-[#333] bg-black text-[10px]">
            <div className="px-3 py-2 flex justify-between items-center">
              <span className="text-[#555]">TIME</span>
              <span className="text-[#22d3ee]">74:12</span>
            </div>
            <div className="px-3 py-2 flex justify-between items-center text-right">
              <span className="text-[#555] ml-2">LOC</span>
              <span className="text-[#d1d1d1]">ATL_ARENA</span>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="flex flex-col h-full bg-black p-1 font-mono uppercase tracking-wider text-[#d1d1d1] border border-[#333]">
          {/* Header */}
          <div className="bg-[#d4a017] px-2 py-0.5 text-[10px] font-bold text-black flex justify-between">
            <span>Analysis Report</span>
            <span>v8.2.1-sorting</span>
          </div>

          {/* Main Score (e.g. Total Players or Key Metric) */}
          <div className="flex-1 flex items-center justify-between px-10 py-4 bg-[#0a0a0a] border-x border-b border-[#333]">
            <div className="text-center">
              <div className="text-[10px] text-[#899499] mb-1">Detections</div>
              <div className="text-5xl font-black text-[#22d3ee]">22</div>
            </div>
            <div className="mx-6 text-[#333] text-xl font-bold">//</div>
            <div className="text-center">
              <div className="text-[10px] text-[#899499] mb-1">Confidence</div>
              <div className="text-5xl font-black text-white">
                94<span className="text-xl">%</span>
              </div>
            </div>
          </div>

          {/* WunderScout System Metadata */}
          <div className="grid grid-cols-3 divide-x divide-[#333] border-x border-b border-[#333] bg-black text-[9px]">
            <div className="px-2 py-2">
              <span className="text-[#555] block">Inference</span>
              <span className="text-[#22d3ee]">14.2ms</span>
            </div>
            <div className="px-2 py-2 text-center">
              <span className="text-[#555] block">Tracking</span>
              <span className="text-white">DeepSORT</span>
            </div>
            <div className="px-2 py-2 text-right">
              <span className="text-[#555] block">Worker</span>
              <span className="text-white">EC2-G4DN</span>
            </div>
          </div>

          {/* Technical Secondary Footer */}
          <div className="grid grid-cols-2 border-x border-b border-[#333] bg-[#0a0a0a] text-[8px]">
            <div className="px-2 py-1.5 text-[#555]">
              Stream:{" "}
              <span className="text-[#899499]">S3://PROCESSED/VID_001.MP4</span>
            </div>
            <div className="px-2 py-1.5 text-right text-[#555]">
              Points: <span className="text-[#899499]">124,512</span>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="flex flex-col h-full bg-black p-1 font-mono uppercase tracking-wider text-[#d1d1d1] border border-[#333]">
          {/* Header */}
          <div className="bg-[#d4a017] px-2 py-0.5 text-[10px] font-bold text-black flex justify-between">
            <span>Spatial Analytics</span>
            <span>Layer_03</span>
          </div>

          {/* Movement Metrics */}
          <div className="flex-1 flex items-center justify-between px-10 py-5 bg-[#0a0a0a] border-x border-b border-[#333]">
            <div className="text-center">
              <div className="text-[10px] text-[#899499] mb-1">Avg Speed</div>
              <div className="text-4xl font-black text-[#22d3ee]">
                6.4<span className="text-lg">m/s</span>
              </div>
            </div>

            <div className="mx-4 flex flex-col gap-1 opacity-20">
              <div className="w-1 h-1 bg-[#22d3ee]"></div>
              <div className="w-1 h-1 bg-[#22d3ee]"></div>
              <div className="w-1 h-1 bg-[#22d3ee]"></div>
            </div>

            <div className="text-center">
              <div className="text-[10px] text-[#899499] mb-1">Distance</div>
              <div className="text-4xl font-black text-white">
                8.2<span className="text-lg">km</span>
              </div>
            </div>
          </div>

          {/* Tracking Integrity Stats */}
          <div className="grid grid-cols-2 divide-x divide-[#333] border-x border-b border-[#333] bg-black text-[9px]">
            <div className="px-3 py-2">
              <span className="text-[#555] block italic">
                Occlusion Recovery
              </span>
              <span className="text-[#22d3ee]">98.2% Success</span>
            </div>
            <div className="px-3 py-2 text-right">
              <span className="text-[#555] block italic">Active Tracklets</span>
              <span className="text-white font-bold">1,402 Units</span>
            </div>
          </div>

          {/* Processing Load Metadata */}
          <div className="px-3 py-1.5 bg-[#0a0a0a] border-x border-b border-[#333] flex justify-between items-center text-[8px] text-[#444]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-900 rounded-full animate-pulse"></span>
              <span>Postgres_Sync: Complete</span>
            </div>
            <span>Buffer: 0.00ms</span>
          </div>
        </div>
      </div>
      <div className="">
        <div className="flex flex-col h-full bg-black p-1 font-mono uppercase tracking-wider text-[#d1d1d1] border border-[#333]">
          {/* Header */}
          <div className="bg-[#d4a017] px-2 py-0.5 text-[10px] font-bold text-black flex justify-between">
            <span>Timestamp Protocol</span>
            <span>S3_ARCHIVE</span>
          </div>

          <div className="flex-1 bg-[#0a0a0a] border-x border-b border-[#333] px-4 py-3 min-w-[280px]">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[10px] text-[#555]">Processed_On</span>
              <span className="text-sm font-bold text-white tracking-normal">
                JAN_29_2026
              </span>
            </div>
            <div className="flex justify-between items-baseline border-t border-[#1a1a1a] pt-2">
              <span className="text-[10px] text-[#555]">Completion_Time</span>
              <span className="text-sm font-bold text-[#22d3ee] tracking-normal">
                00:14:02 UTC
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-[#333] border-x border-b border-[#333] bg-black text-[9px]">
            <div className="px-3 py-2">
              <span className="text-[#444] block text-[8px]">JOB_ID</span>
              <span className="text-[#899499] break-all">WS-9921-X</span>
            </div>
            <div className="px-3 py-2 text-right">
              <span className="text-[#444] block text-[8px]">REGION</span>
              <span className="text-[#899499]">AWS-USE1-B</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-2 py-1 bg-[#0a0a0a] border-x border-b border-[#333] text-[8px] text-[#333]">
            <div className="w-1.5 h-1.5 bg-[#22d3ee]/30 rounded-full"></div>
            <span>Metadata Hash: 7f82...1a9e</span>
          </div>
        </div>
      </div>
    </div>
  );
}
