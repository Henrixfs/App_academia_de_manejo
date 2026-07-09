import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">404</h1>
      <p className="text-gray-400 mb-6">Página no encontrada</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
}