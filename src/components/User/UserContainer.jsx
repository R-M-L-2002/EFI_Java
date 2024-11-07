import { useState, useEffect } from "react";
import UsersView from "./UserView";
import { useNavigate } from 'react-router-dom';

const UserContainer = () => {
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const navigate = useNavigate();

    // Verificar si el token existe antes de usarlo
    const token = localStorage.getItem('token');
    console.log('Token', token);
    useEffect(() => {
        if (!token) {
            navigate('/inicio-sesion');
            return;
        }

        const getDataUsers = async () => {
            try {
                const response = await fetch("http://localhost:5000/users", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    console.log("Error en la consulta");
                    return;
                }

                const data = await response.json();
                setData(data);
            } catch (error) {
                console.log("Error en la API", error);
            } finally {
                setLoadingData(false);
            }
        };

        getDataUsers();
    }, [token, navigate]); // Dependencia en `token` y `navigate` para ejecutar solo cuando cambie el token

    return <UsersView loadingData={loadingData} data={data} />;
};

export default UserContainer;
