export default function Loading() {
  return (
    <div className="loading-container flex flex-col items-center justify-center py-8">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-2 text-gray-400">Cargando...</p>
    </div>
  );
}