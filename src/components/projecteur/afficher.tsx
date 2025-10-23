


import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../header';


interface Projecteur {
    id: number;
    marque: string;
    couleur: string;
    quantite: string;
}

interface ApiResponse {
    Status: string;
    Result?: Projecteur[]; // Result can be undefined
    Error?: string;
}
export default function Affichage() {

    const [data, setData] = useState<Projecteur[]>([]); // Explicitly set the type
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
    // 1. Récupérer l'URL de base depuis les variables d'environnement (Vite standard)
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    axios.get<ApiResponse>(`${apiUrl}/projecteur`) // 2. Utiliser l'interpolation de chaîne pour construire l'URL complète
        .then(res => {
            if (res.data.Status === "Succes") {
                setData(res.data.Result || []); 
                if (res.data.Result && res.data.Result.length > 0) {
                    console.log(res.data.Result[0]);
                }
            } else {
                setMessage(res.data.Error || '');
            }
        })
        .catch(err => {
            // Afficher l'erreur de manière plus informative pour le débogage
            console.error("Erreur lors de la récupération des projecteurs:", err);
            // Vous pourriez vouloir ajouter un setter d'erreur ici si vous en avez un (setError)
        });
}, []);



  return (
   
    <div>
      <div>
            
            <div className="flex " style={{ justifyContent: "center", marginTop: "50px" }}>
                <table style={{ border: "solid 1px", padding: "20px" }}>
                    <thead >
                        <tr  >
                            <th>Id</th>
                            <th>Marque</th>
                            <th>Couleur</th>
                            <th>Quantité</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((Projecteur, index) => (
                            <tr key={index}>
                                <td>{Projecteur.id}</td>
                                <td>{Projecteur.marque}</td>
                                <td>{Projecteur.couleur}</td>
                                <td>{Projecteur.quantite}</td>
                                <td>
                                    <button>Modifier</button>
                                    <button>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Link to="/projecteur/add">Ajouter un projecteur</Link>
            {message && <p style={{ textAlign: "center", color: "red" }}>{message}</p>}
        </div>
    </div>
  )
}
