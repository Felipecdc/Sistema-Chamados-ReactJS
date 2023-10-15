import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Contexts/Auth';
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import Header from '../../Components/Header';
import Title from '../../Components/Title';
import Modal from '../../Components/Modal';

import { db } from '../../Services/firebaseConnection';
import { format } from 'date-fns';
import { collection, getDocs, orderBy, limit, startAfter, query } from 'firebase/firestore'

import './dashboard.css'

const listRef = collection(db, "chamados")

export default function Dashboard(){
  const [chamados, setChamados] = useState([])
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false)
  const [lastDoc, setLastDoc] = useState()
  const [loadingMore, setLoadingMore] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [detail, setDetail] = useState({})


  useEffect(() => {
    async function loadChamados(){
      const q = query(listRef, orderBy('created', 'desc'), limit(5));
      const querySnapshot = await getDocs(q)
      setChamados([]);
      await updateState(querySnapshot)
      setLoading(false);
    }
    loadChamados();
    return () => { }
  }, [])

    async function updateState(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0;
        if(!isCollectionEmpty){
            let lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({
                  id: doc.id,
                  assunto: doc.data().assunto,
                  cliente: doc.data().cliente,
                  clienteId: doc.data().clienteId,
                  created: doc.data().created,
                  createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                  status: doc.data().status,
                  complemento: doc.data().complemento,
                })
              })

            const lastdoc = querySnapshot.docs[querySnapshot.docs.length - 1]

            setChamados(chamados => [...chamados, ...lista])
            setLastDoc(lastdoc)
            setLoadingMore(false)
        }else{
            setIsEmpty(true)
            setLoadingMore(false)
        }
    }

    if(loading){
        return(
            <div>
                <Header/>
                <div className='content'>
                    <Title name="Dashboard">
                        <FiMessageSquare size={25}/>
                    </Title> 
                    <div className='container dashboard'>
                        <span>Buscando chamados</span>
                    </div>               
                </div>
            </div>
        )
    }

    async function handleMore(){
        setLoadingMore(true)

        const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDoc), limit(5));
        const querySnapshot = await getDocs(q)
        await updateState(querySnapshot)
    }

    function toggleModal(item){
        setShowModal(!showModal)
        setDetail(item)
    }

    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name="Dashboard">
                    <FiMessageSquare size={25}/>
                </Title>
                <>
                {
                    chamados.length === 0 ? (
                        <div className='container dashboard'>
                            <span>
                                Nenhum chamado encontrado...
                            </span>
                            <Link className='new' to='/new'>
                                <FiPlus color='#fff' size={25}/>
                                Novo chamado
                            </Link>
                        </div>
                    ) : (
                        <>
                        <Link className='new' to='/new'>
                            <FiPlus color='#fff' size={25}/>
                            Novo chamado
                        </Link>
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Assunto</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Cadastrado em</th>
                                    <th scope="col">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    chamados.map(( item, index ) => {
                                        return(
                                            <tr key={index}>
                                                <td data-label="Cliente">{item.cliente}</td>
                                                <td data-label="Assunto">{item.assunto}</td>
                                                <td data-label="Status">
                                                    <span className='badge' style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td data-label="Cadastrado">{item.createdFormat}</td>
                                                <td data-label="#">
                                                    <button onClick={() => toggleModal(item)} className='action' style={{backgroundColor:'#3583f6'}}>
                                                        <FiSearch size={17} color='#fff'/>
                                                    </button>
                                                    <Link to={`/new/${item.id}`} className='action' style={{backgroundColor:'#f6a935'}}>
                                                        <FiEdit2 size={17} color='#fff'/>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {loadingMore && <h3>Buscando mais chamados</h3>}
                        {!loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}>Buscar mais</button>}
                        </>
                    )
                }

                </>
            </div>
            {showModal && (
                <Modal
                conteudo={detail}
                close={() => setShowModal(!showModal)}
                />
            )}
        </div>
    )
}