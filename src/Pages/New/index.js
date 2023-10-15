import { useState, useContext, useEffect } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

import Header from "../../Components/Header";
import Title from "../../Components/Title";

import { AuthContext } from '../../Contexts/Auth';
import { db } from '../../Services/firebaseConnection';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc} from 'firebase/firestore';

import { useParams, useNavigate } from 'react-router-dom';

import './new.css';
const listRef = collection(db, 'customers');

export default function New(){

    const [loadingCustomer, setLoadingCustomer] = useState(true)
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const { id } = useParams()

    const [customers, setCustomers] = useState([])
    const [customerSelected, setCustomerSelected] = useState(0)
    const [complemento, setComplemento] = useState('')
    const [assunto, setAssunto] = useState('Suporte')
    const [status, setStatus] = useState('Aberto')
    const [idCustomer, setIdCustomer] = useState(false)

    useEffect(() => {
        async function loadingCustomers(){
            const query = await getDocs(listRef)
            .then((snapshot) => {
                let lista = [];
                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia,
                    })
                })
                if(snapshot.docs.size === 0){
                    console.log('Nenhuma empresa encontrada')
                    setCustomers([ {id:'1', nomeFantasia: 'FREELA'} ])
                    setLoadingCustomer(false)
                    return;
                }
                setCustomers(lista)
                setLoadingCustomer(false)
                if(id){
                    loadId(lista);
                }
            })
            .catch((err) => {
                console.log(err)
                setLoadingCustomer(false)
                setCustomers([ {id:'1', nomeFantasia: 'FREELA'} ])
            })
        }
        loadingCustomers();
    }, [id])

    async function loadId(lista){
        const docRef = doc(db, "chamados", id);
        await getDoc(docRef)
        .then((snapshot) => {
          setAssunto(snapshot.data().assunto)
          setStatus(snapshot.data().status)
          setComplemento(snapshot.data().complemento);
    
    
          let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
          setCustomerSelected(index);
          setIdCustomer(true);
    
        })
        .catch((error) => {
          console.log(error);
          setIdCustomer(false);
        })
      }

    function handleOptionChange(e){
        setStatus(e.target.value);
    }

    function handleChangeSelect(e){
        setAssunto(e.target.value)
        console.log(e.target.value)
    }

    function handleChangeCustomer(e){
        setCustomerSelected(e.target.value)
        console.log(e.target.value)
    }

    async function handleRegister(e){
        e.preventDefault()
        if(idCustomer){
            const docRef = doc(db, 'chamados', id)
            await updateDoc(docRef, {
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(() => {
                toast.info('Chamado atualizado com sucesso!')
                setComplemento('')
                setCustomerSelected(0)
                navigate('/dashboard')
            })
            .catch((err) => {
                toast.error('Ops, erro ao tentar atualizar!')
                console.log(err)
            })
            return;
        }
        await addDoc(collection(db, 'chamados'), {
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
        .then(() => {
            toast.success('Chamado registrado!')
            setComplemento('')
            setCustomerSelected(0)
        })
        .catch((err) => {
            console.log(err)
            toast.error('Ops, erro ao registar!')
        })
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name={id ? 'Editando Chamado' : 'Novo Chamado'}>
                    <FiPlusCircle size={25}/>
                </Title>
                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Cliente</label>
                        {
                            loadingCustomer ? (
                                <input type='text' disabled={true} value="Carregando..."/>
                            ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    {
                                        customers.map(( item, index ) => {
                                            return(
                                                <option key={index} value={index}>
                                                    {item.nomeFantasia}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            )
                        }
                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option key={1} value="suporte">Suporte</option>
                            <option key={1} value="visita tecnica">Visita Tecnica</option>
                            <option key={1} value="Financeiro">Financeiro</option>
                        </select>
                        <label>Status</label>
                        <div className='status'>
                            <input
                            type='radio'
                            name='radio'
                            value='Aberto'
                            onChange={handleOptionChange}
                            checked={status === 'Aberto'}
                            />
                            <span>Aberto</span>
                            <input
                            type='radio'
                            name='radio'
                            value='Progresso'
                            onChange={handleOptionChange}
                            checked={status === 'Progresso'}
                            />
                            <span>Progresso</span>
                            <input
                            type='radio'
                            name='radio'
                            value='Atendido'
                            onChange={handleOptionChange}
                            checked={status === 'Atendido'}
                            />
                            <span>Atendido</span>
                        </div>
                        <label>Complemento</label>
                        <textarea
                        type="text"
                        placeholder='Descreva o seu problema (opicional).'
                        value={complemento}
                        onChange={e => setComplemento(e.target.value)}
                        />
                        <button type='submit'>Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
} 