import { useState, useEffect, Fragment } from 'react'

import UsersView from './UserView';

const UsersContainer = () => {
    const [dataUsers, setDataUsers] = useState([]),
        [loadingUsers, setLoadingUsers] = useState(true);

    const token = JSON.parse(localStorage.getItem('token'))

    const getDataUsers = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/users",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
            console.log("response", response)
            if (!response.ok) {
                console.log("Hubo un error en la peticion")
            }

            const results = await response.json()
            setDataUsers(results)
        } catch (error) {
            console.log("Hubo un error en la api ", error)
        } finally {
            setLoadingUsers(false)
        }
    }

    console.log("dataUsers", dataUsers)

    useEffect(() => {
        getDataUsers()
    }, [])

    return (
        <UsersView loadingUsers={loadingUsers} dataUsers={dataUsers} />
    )

}

export default UsersContainer