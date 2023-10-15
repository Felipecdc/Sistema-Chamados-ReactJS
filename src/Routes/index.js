
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Contexts/Auth'

import SignIn from '../Pages/SignIn';
import SignUp from '../Pages/SignUp';
import Dashboard from '../Pages/Dashboard';
import Profile from '../Pages/Profile';
import Customers from '../Pages/Customers';
import New from '../Pages/New';

import Privates from './Privates';

function RoutesApp() {
    const { signed } = useContext(AuthContext);

    return (
        <Routes>
            {signed ? (
                <Route path='/' element={<Navigate to="/dashboard" replace />} />
            ) : (
                <Route path='/' element={<SignIn />} />
            )}
            <Route path='/register' element={<SignUp />} />
            <Route path='/dashboard' element={<Privates> <Dashboard /> </Privates>} />
            <Route path='/profile' element={<Privates> <Profile/> </Privates>} />
            <Route path='/customers' element={<Privates> <Customers/> </Privates>} />
            <Route path='/new' element={<Privates> <New/> </Privates>} />
            <Route path='/new/:id' element={<Privates> <New/> </Privates>} />

        </Routes>
    );
}

export default RoutesApp;
