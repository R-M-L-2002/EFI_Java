import { Formik } from "formik"
import * as Yup from 'yup'

const CreateUser = () => {

    const ValidationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Este campo es requerido')
            .min(5, 'El username debe tener minimo 5 caracteres')
            .max(50, 'El username no debe ser mayor a 50 caracteres'),
        password: Yup.string()
            .required('Este campo es requerido')
            .min(5, 'La contraseña debe tener minimo 5 caracteres')
            .max(50, 'La contraseña no debe ser mayor a 50 caracteres')
    })

    const token = JSON.parse(localStorage.getItem('token'))

    const RegisterUser = async (values) => {
        const bodyRegisterUser = {
            username: values.username,
            password: values.password
        };
    
        try {
            const response = await fetch('http://127.0.0.1:5000/users', {
                method: 'POST',
                body: JSON.stringify(bodyRegisterUser),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                // Manejo de error del backend
                console.error(data.error);
                alert(data.error); // Muestra el mensaje de error
            } else {
                console.log("Usuario creado:", data.user.username);
                alert("Usuario creado exitosamente");
            }
    
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error de conexión, intente nuevamente");
        }
    };
    

    return (
        <Formik
    initialValues={{ username: '', password: '' }}
    validationSchema={ValidationSchema}
    onSubmit={RegisterUser}
>
    {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isValid
    }) => (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
            />
            {errors.username && touched.username && errors.username}
            <input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
            />
            {errors.password && touched.password && errors.password}
            <button type="submit" className="submit-button" disabled={!isValid}>
                Crear usuario
            </button>
        </form>
    )}
</Formik>


    )

}

export default CreateUser