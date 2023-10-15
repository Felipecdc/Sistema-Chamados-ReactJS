import './header.css';
import { useContext } from 'react';
import { AuthContext } from '../../Contexts/Auth';
import { Link } from 'react-router-dom';
import avatarImg from '../../Assets/avatar.png';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';

export default function Header(){

    const { user } = useContext(AuthContext)

    return(
        <div className='sidebar'>
            <div>
                <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt='Foto do usuario' />
            </div>

            <Link to={'/dashboard'}>
                <FiHome color='#fff' size={24}/>
                Chamados
            </Link>
            <Link to={'/customers'}>
                <FiUser color='#fff' size={24}/>
                Clientes
            </Link>
            <Link to={'/profile'}>
                <FiSettings color='#fff' size={24}/>
                Perfil
            </Link>
        </div>
    )
}