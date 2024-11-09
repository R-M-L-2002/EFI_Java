import { useState } from 'react'
import './App.css';
import MyButton from './components/MyButton';
import CreateUser from './components/User/createUser';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserContainer from './components/User/UserContainer';
import { Menubar } from 'primereact/menubar';
import LoginUser from './components/User/loginUser';
import MarcaContainer from './components/marca/MarcaContainer';
import CreateMarca from './components/marca/createMarca';

function App() {

  const items = [
    { label: 'Usuario', icon: 'pi pi-spin pi-cog', url: '/usuarios' },
    { label: 'Home', icon: 'pi pi-home', url: '/' },
    { label: 'inicio-sesion', icon: 'pi pi-user', url: '/inicio-sesion' },
    { label: 'marca', icon: 'pi pi-apple', url: '/marcas' }
  ]

  return (
    <BrowserRouter>
      <Menubar model={items} />
      <Routes>
        <Route path='/' element={<h2>Bienvenido a la página principal</h2>} /> {/* Ruta para el home */}
        <Route path='/usuarios' element={<UserContainer />} />
        <Route path='/nuevo-usuario' element={<CreateUser />} />
        <Route path='/inicio-sesion' element={<LoginUser />} />
        <Route path='/marcas' element={<MarcaContainer />} />
        <Route path='/nueva-marca' element={<CreateMarca/>} />
      </Routes>

    
    </BrowserRouter>
  )
}

export default App