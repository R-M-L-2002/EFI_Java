import { Fragment, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ToggleButton } from "primereact/togglebutton";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';  // Importar useNavigate

const UsersView = ({ loadingUsers, dataUsers, fetchUsers }) => {
    const navigate = useNavigate(); // Usar el hook useNavigate
    const token = JSON.parse(localStorage.getItem("token"));
    const [openDialogEditUser, setOpenDialogEditUser] = useState(false);
    const [editUser, setEditUser] = useState({});

    // Función para mostrar el estado de is_admin como "Sí" o "No"
    const bodyIsAdmin = (rowData) => {
        return rowData.is_admin ? <span>Si</span> : <span>No</span>;
    };

    const bodyActions = (rowData) => {
        return (
            <div>
                <Button
                    icon="pi pi-pencil"
                    label="Editar"
                    onClick={() => {
                        setEditUser(rowData); 
                        setOpenDialogEditUser(true);
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    label="Borrar"
                    onClick={() => onDeleteUser(rowData.id)}
                />
            </div>
        );
    };

    const ValidationSchema = Yup.object().shape({
        nombre_usuario: Yup.string()
            .required("Este campo es requerido")
            .max(50, "El nombre de usuario no debe ser mayor a 50 caracteres"),
    });

    // Función para editar el usuario
    const onEditUser = async (values) => {
        if (!editUser.id) {
            console.error("User ID is undefined");
            return;
        }

        const bodyEditUser = {
            nombre_usuario: values.nombre_usuario,
            is_admin: values.is_admin,
        };

        try {
            const response = await fetch(
                `http://localhost:5000/users/${editUser.id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(bodyEditUser),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                console.log("User updated successfully");
                setOpenDialogEditUser(false);
                fetchUsers(); // Actualizar la lista después de la edición
            } else {
                const errorData = await response.json(); 
                console.error("Error updating user:", response.statusText, errorData);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    // Función para eliminar el usuario
    const onDeleteUser = (userId) => {
        if (!userId) {
            console.error("User ID is undefined");
            return;
        }
        fetch(`http://localhost:5000/users/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (response.ok) {
                console.log("User deleted successfully");
                fetchUsers(); // Actualizar la lista después de la eliminación
            }
        })
        .catch((error) => console.error("Error deleting user:", error));
    };

    return (
        <Fragment>
            <h1>Usuarios</h1>
            <Button
                label="Agregar nuevo usuario"
                icon="pi pi-plus"
                onClick={() => navigate("/nuevo-usuario")}  // Usar navigate aquí
            />
            {loadingUsers ? (
                <ProgressSpinner />
            ) : (
                <DataTable value={dataUsers} tableStyle={{ minWidth: "50rem" }}>
                    <Column field="username" header="Nombre de usuario"></Column>
                    <Column
                        field="is_admin"
                        body={bodyIsAdmin}
                        header="¿Es administrador?"
                    ></Column>
                    <Column body={bodyActions} header="Acciones"></Column>
                </DataTable>
            )}
            <Dialog
                visible={openDialogEditUser}
                onHide={() => {
                    setOpenDialogEditUser(false);
                    setEditUser({});
                }}
                header="Editar usuario"
            >
                <Formik
                    initialValues={{
                        is_admin: editUser.is_admin || false,
                        nombre_usuario: editUser.username || "", 
                    }}
                    validationSchema={ValidationSchema}
                    enableReinitialize={true}
                    onSubmit={(values) => onEditUser(values)}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                        isValid,
                    }) => (
                        <form style={{ display: "inline-grid" }}>
                            <label>Nombre de usuario</label>
                            <input
                                type="text"
                                name="nombre_usuario"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.nombre_usuario}
                            />
                            {errors.nombre_usuario && touched.nombre_usuario && (
                                <div>{errors.nombre_usuario}</div>
                            )}

                            <label>¿Es administrador?</label>
                            <ToggleButton
                                name="is_admin"
                                checked={values.is_admin}
                                onChange={(e) => setFieldValue("is_admin", e.value)}
                                onLabel="Si"
                                offLabel="No"
                            />
                            <button
                                type="button"
                                onClick={() => onEditUser(values)}
                                disabled={!values.nombre_usuario || !isValid}
                            >
                                Modificar usuario
                            </button>
                        </form>
                    )}
                </Formik>
            </Dialog>
        </Fragment>
    );
};

export default UsersView;
