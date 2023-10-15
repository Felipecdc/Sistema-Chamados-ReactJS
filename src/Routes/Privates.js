import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/Auth';

export default function Privates({children}){

    const { signed, loading } = useContext(AuthContext)

    if(loading){
        return(
            <div></div>
        ) 
    }

    if(!signed){
        return <Navigate to="/"/>
    }

    return children;
}