import axios from 'axios';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Header from '../header';

interface Projecteur {
    id: number;
    marque: string;
    couleur: string;
    quantite: string;
}

interface Utilisateur {
    id: number;
    name: string;
}

interface ApiResponse<T> {
    Status: string;
    Result?: T[];
    Error?: string;
}

function Add() {
    const [projecteurs, setProjecteurs] = useState<Projecteur[]>([]);
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
    const [message, setMessage] = useState<string>('');
    const [values, setValues] = useState({
        user_id: '',
        projecteur_id: '',
        date_retrait: '',
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // 1. Récupérer l'URL de base depuis les variables d'environnement (Vite standard)
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    console.log(values);
    
    // 2. Utiliser l'interpolation de chaîne pour construire l'URL complète
    axios.post(`${apiUrl}/action/add`, values)
        .then(res => {
            if (res.data.Status === "Succes") {
                console.log(res.data);
                navigate("/");
            } else {
                // Utilisation de setMessage pour afficher l'erreur dans l'interface utilisateur
                setMessage(res.data.Error || 'Une erreur est survenue.');
                console.log(res.data);
            }
        })
        .catch(err => {
            // Utilisation de setError pour gérer les erreurs réseau/serveur
            setError('Une erreur est survenue lors de l\'ajout de l\'action. Vérifiez votre connexion.');
            console.error("Erreur réseau/Axios:", err);
        });
};

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        console.log("useEffect called"); // Ajout d'un log
        Promise.all([
            axios.get<ApiResponse<Projecteur>>("http://localhost:8081/projecteur"),
            axios.get<ApiResponse<Utilisateur>>("http://localhost:8081/users")
        ])
        .then(([projecteursRes, utilisateursRes]) => {
            console.log("API responses received"); // Ajout d'un log
            console.log("Projecteurs response:", projecteursRes);
            console.log("Utilisateurs response:", utilisateursRes);
                if (projecteursRes.data.Status === "Succes" && utilisateursRes.data.Status === "Succes") {
                    setProjecteurs(projecteursRes.data.Result || []);
                    setUtilisateurs(utilisateursRes.data.Result || []);
                } else {
                    setMessage(projecteursRes.data.Error || utilisateursRes.data.Error || 'Erreur lors du chargement des données.');
                }
            })
            .catch(err => {
                setError('Une erreur est survenue lors du chargement des données.');
                console.log(err);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <div>
                 {message && <Alert severity="error">{message}</Alert>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="user_id">Utilisateur</label>
                    <select name="user_id" id="user_id" onChange={handleChange} value={values.user_id}>
                    <option value="">Sélectionner un utilisateur</option>
                    {utilisateurs.map((utilisateur) => (
                        <option key={utilisateur.id} value={utilisateur.id}>
                        {utilisateur.name}
                        </option>
                    ))}
                    </select>

                    <label htmlFor="projecteur_id">Projecteur</label>
                    <select name="projecteur_id" id="projecteur_id" onChange={handleChange} value={values.projecteur_id}>
                    <option value="">Sélectionner un projecteur</option>
                    {projecteurs.map((projecteur) => (
                        <option key={projecteur.id} value={projecteur.id}>
                        {projecteur.marque}
                        </option>
                    ))}
                    </select>

                <label htmlFor="date_retrait">Date de retrait</label>
                <input type="date" name="date_retrait" id="date_retrait" onChange={handleChange} value={values.date_retrait} />

                <button type="submit">Ajouter l'action</button>
            </form>
        </div>
    );
}

export default Add;