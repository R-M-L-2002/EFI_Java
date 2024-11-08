import { Formik } from "formik";
import * as Yup from 'yup';

const LoginUser = () => {

    const onLoginUser = async (values) => {
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password
                })
            });

            if (!response.ok) {
                console.log('Error en la solicitud', response.status);  
                const errorData = await response.json();  
                console.log('Error de login:', errorData.msg);
                return;
            }

            const data = await response.json();  
            console.log('Token recibido:', data.access_token);

            // Almacenar el token en localStorage
            localStorage.setItem('token', data.access_token);
        } catch (error) {
            console.error('Hubo un error en el login:', error);  
        }
    };

    const ValidationSchema = Yup.object().shape({
        password: Yup.string()
            .required('Este es un campo requerido.')
            .min(4, 'Mínimo 4 caracteres.'),
        username: Yup.string()
            .min(4, 'Mínimo 4 caracteres.')
            .max(25, 'Máximo 25 caracteres.')
            .required('Este es un campo requerido.')
    });

    return (
        <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={ValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onLoginUser(values);
                setSubmitting(false); // Esto asegura que el formulario no quede en estado de "enviando"
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isValid,
                handleSubmit,
            }) => (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.username}
                    />
                    {errors.username && touched.username && <div>{errors.username}</div>}
                    
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                    />
                    {errors.password && touched.password && <div>{errors.password}</div>}
                    
                    <button 
                        type="submit"
                        disabled={!isValid}
                    >
                        Iniciar sesión
                    </button>
                </form>
            )}
        </Formik>
    );
};

export default LoginUser;
