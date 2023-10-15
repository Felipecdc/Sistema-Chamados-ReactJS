import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { FiUser } from 'react-icons/fi';

import Header from "../../Components/Header";
import Title from "../../Components/Title";

import { db } from '../../Services/firebaseConnection';
import { addDoc, collection } from 'firebase/firestore';

export default function Customers(){

    const [nome, setNome] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [endereco, setEndereco] = useState('')

    async function handleRegister(e){
        e.preventDefault();
        if(nome !== '' && cnpj !== '' && endereco !== ''){
            await addDoc(collection(db, 'customers'), {
                nomeFantasia: nome,
                cnpj: cnpj,
                endereco: endereco
            })
            .then(() => {
                setNome('')
                setCnpj('')
                setEndereco('')
                toast.success('Empresa registrada!')
            })
            .catch((err) => {
                console.log(err)
                toast.error('Erro ao fazer o cadastro!')
            })
        }else{
            toast.error('Preencha todos os campos!')
        }
    }

    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name="Clientes">
                    <FiUser size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Nome fantasia</label>
                        <input 
                        type='text' 
                        placeholder='Nome da empresa'
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        />
                        <label>CNPJ</label>
                        <input 
                        type='text' 
                        placeholder='Digite o CNPJ'
                        value={cnpj}
                        onChange={e => setCnpj(e.target.value)}
                        />
                        <label>Endereço</label>
                        <input 
                        type='text' 
                        placeholder='Endereço da empresa'
                        value={endereco}
                        onChange={e => setEndereco(e.target.value)}
                        />
                        <button type='submit'>Cadastar</button>
                    </form>
                </div>
            </div>

        </div>
    )
}