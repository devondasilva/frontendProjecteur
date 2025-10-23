


import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../header';


interface Action {
    id: number;
    user_id: number;
    projecteur_id: string;
    date_retrait: string;
    date_depot: string;
}

interface ApiResponse {
    Status: string;
    Result?: Action[]; // Result can be undefined
    Error?: string;
}
export default function AfficherAction() {

    const [data, setData] = useState<Action[]>([]); // Explicitly set the type
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
    // 1. Récupérer l'URL de base depuis les variables d'environnement (Vite standard)
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // 2. Utiliser l'interpolation de chaîne pour construire l'URL complète
    axios.get<ApiResponse>(`${apiUrl}/action`) 
        .then(res => {
            console.log(res.data);
            if (res.data.Status === "Succes") {
                setData(res.data.Result || []); 
                if (res.data.Result && res.data.Result.length > 0) {
                    console.log(res.data.Result[0]);
                }
            } else {
                setMessage(res.data.Error || 'Erreur lors du chargement.');
            }
        })
        .catch(err => {
            // Gérer les erreurs de réseau ou d'Axios de manière plus informative
            console.error("Erreur lors de la récupération des actions:", err);
            // Vous pouvez ajouter une notification utilisateur ici (ex: setError('Connexion impossible'))
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
                            <th>User_id</th>
                            <th>projecteur_id</th>
                            <th>Date_retrait</th>
                            <th>Date_depot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((Action, index) => (
                            <tr key={index}>
                                <td>{Action.id}</td>
                                <td>{Action.user_id}</td>
                                <td>{Action.projecteur_id}</td>
                                <td>{Action.date_retrait}</td>
                                <td>{Action.date_depot}</td> 
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
