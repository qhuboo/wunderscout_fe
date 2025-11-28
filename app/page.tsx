import ThreeScene from "./components/ThreeScene";

export default function Page() {
  return (
    <div className="p-2 flex-1 border-3 border-dashed border-red-500">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[30%_70%] h-full min-h-0 border-4 border-dotted border-emerald-800">
        <div className="grid grid-rows-[auto_auto_1fr] border-2 border-amber-400">
          <div className="border-1 border-dashed border-white">Item 1</div>
          <div className="border-1 border-dashed border-white">Item 2</div>
          <div className="border-1 border-dashed border-white">Item 3</div>
        </div>
        <div className="grid grid-rows-[1fr_7fr_auto] border-2 border-blue-300">
          <div className="border-1 border-dashed border-white">Item 1</div>
          <div className="relative overflow-hidden min-h-0 border-1 border-dashed border-white">
            <ThreeScene />
          </div>
          <div className="border-1 border-dashed border-white">Item 3</div>
        </div>
      </div>
      {/* Mobile Layout */}
      <div className="lg:hidden h-full border-2 border-white">
        <div className="grid grid-rows-[1fr_7fr_auto] h-full">
          <div className="border-1 border-dashed border-white">Item 1</div>
          <div className="overflow-hidden min-h-0 border-1 border-dashed border-white">
            <ThreeScene />
          </div>
          <div className="border-1 border-dashed border-white">Item 3</div>
        </div>
      </div>
    </div>
  );
}
