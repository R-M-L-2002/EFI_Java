import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';

const CreateUser = () => {
    const RegisterUser = async (values) => {
        const bodyRegisterUser = {
            username: values.username,
            password: values.password,
        };

        const response = await fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            body: JSON.stringify(bodyRegisterUser),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Usuario creado:', data);
        } else {
            const errorData = await response.json();
            console.error('Error al crear usuario:', errorData.message);
        }
    };

    const ValidationSchema = Yup.object().shape({
        username: Yup.string()
            .min(4, 'Nombre Usuario muy corto')
            .max(255, 'Nombre Usuario demasiado largo')
            .required('Se requiere nombre de Usuario'),
        password: Yup.string()
            .required('Se requiere contraseña')
            .min(4, 'Contraseña muy corta'),
    });

    return (
        <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={ValidationSchema}
            onSubmit={RegisterUser}
        >
            {({ values, errors, touched, handleChange, handleBlur, isValid }) => (
                <form onSubmit={(e) => { e.preventDefault(); RegisterUser(values); }}>
                    <div>
                        <input
                            type="text"
                            name="username"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}
                            placeholder="Nombre de usuario"
                        />
                        <ErrorMessage name="username" component="div" className="error" />
                    </div>

                    <div>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            placeholder="Contraseña"
                        />
                        <ErrorMessage name="password" component="div" className="error" />
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || !values.username || !values.password}
                    >
                        Aceptar
                    </button>
                </form>
            )}
        </Formik>
    );
};

export default CreateUser;
