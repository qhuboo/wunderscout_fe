
export default function Page() {
  return (
    <main className="p-2 flex-1 flex flex-row border-2 border-red-500">
      // Desktop layout
      <div>
        <div className="border-2 border-amber-400 flex-2">
          This is the left side.
        </div>
        <div className="border-2 border-blue-300 flex-5">
          This is the right side.
        </div>
      </div>
    </main>
  );
}
