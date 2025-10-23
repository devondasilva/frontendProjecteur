import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // 1. Retrieve the base URL from environment variables (Vite standard)
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // 2. Use template literals to build the full, deployable URL
    axios.post(`${apiUrl}/register`, values)
        .then((res) => {
            // Handles successful response or server-sent error messages
            if (res.data.Status === 'Succes') {
                navigate('/login');
            } else {
                // Display the error message sent by the backend (e.g., 'Email already exists')
                alert(res.data.Error || 'Registration failed.');
            }
        })
        .catch((err) => {
            // 3. CRITICAL: Use .catch() to handle network errors or server connection failures
            console.error('Registration API request failed:', err);
            alert('Failed to connect to the server. Please try again later.');
        });
};

  return (
    <div className="flex justify-center mt-2.5">
      <div className="p-5 border rounded-md w-full max-w-sm">
        <h2 className="text-center text-2xl font-semibold mb-4">Sign-up</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-2.5 flex justify-between items-center">
            <label htmlFor="name" className="mr-2">Nom</label>
            <input
              type="text"
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              placeholder="Entrez votre nom"
              name="name"
              className="rounded-md border-none bg-gray-200 p-2 w-full"
            />
          </div>
          <div className="mb-2.5 flex justify-between items-center">
            <label htmlFor="email" className="mr-2">Email</label>
            <input
              type="email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              placeholder="Entrez votre adresse mail"
              name="email"
              className="rounded-md border-none bg-gray-200 p-2 w-full"
            />
          </div>
          <div className="mb-2.5 flex justify-between items-center">
            <label htmlFor="role" className="mr-2">Role</label>
            <select
              name="role"
              id="role"
              onChange={(e) => setValues({ ...values, role: e.target.value })}
              className="rounded-md border-none bg-gray-200 p-2 w-full"
            >
                <option value="" disabled selected>
                    Sélectionnez un rôle
                </option>
                <option value="Etudiant">Etudiant</option>
                <option value="Professeur">Professeur</option>
            </select>
          </div>
          <div className="mb-2.5 flex justify-between items-center">
            <label htmlFor="password" className="mr-2">Password</label>
            <input
              type="password"
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              placeholder="Entrez le mot de passe"
              name="password"
              className="rounded-md border-none bg-gray-200 p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="rounded-md border-none bg-blue-600 p-2 text-white text-left mb-2.5 w-full"
          >
            S'enregistrer
          </button>
          <Link
            to="/login"
            className="text-center block bg-gray-100 rounded-md p-2 text-blue-600 no-underline"
          >
            Déjà un compte
          </Link>
        </form>
      </div>
    </div>
  );
}