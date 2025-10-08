import { Link } from "react-router-dom";
import './index.css'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Incident Management System</h1>
        <nav className="space-x-4">
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
          <Link to="/incidents" className="text-blue-500 hover:underline">Incidents</Link>
          
        </nav>
      </div>
    </div>
  );
}
