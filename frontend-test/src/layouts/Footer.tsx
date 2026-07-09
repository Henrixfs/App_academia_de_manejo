export default function Footer() {
  return (
    <footer className="footer mt-12 pt-8 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Academia de Manejo San Cristóbal VIP. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}