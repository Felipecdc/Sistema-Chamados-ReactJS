import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import Header from "../../Components/Header";
import Title from "../../Components/Title";

import { FiSettings, FiUpload } from "react-icons/fi";
import avatar from '../../Assets/avatar.png';
import { AuthContext } from '../../Contexts/Auth';

import { db, storage } from '../../Services/firebaseConnection';
import { doc, updateDoc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import './profile.css'

export default function Profile(){

    const { user, StorageUser, setUser, LogOut } = useContext(AuthContext)

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [imageAvatar, setImageAvatar] = useState(null)
    const [nome, setNome] = useState(user && user.nome)
    const [email, setEmail] = useState(user && user.email)

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0]
            
            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image)
                setAvatarUrl(URL.createObjectURL(image))
            }else{
                toast.warn('Envie uma do tipo PNG ou JPEG')
                setImageAvatar(null)
                return
            }
        }
    }

    async function handleUpload(){
        const currentUid = user.uid;
        
        const uploadref = ref(storage, `images/${currentUid}/${imageAvatar.nome}`)
        const uploadtask = uploadBytes(uploadref, imageAvatar)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref).then( async (downloadURL) => {
                let urlfoto = downloadURL;
                const docref = doc(db, 'users', user.uid)
                await updateDoc(docref, {
                    avatarUrl: urlfoto,
                    nome: nome 
                })
                .then(() => {
                    let data = {
                        ...user,
                        nome: nome,
                        avatarUrl: urlfoto
                    }

                    setUser(data)
                    StorageUser(data)
                    setImageAvatar(null)
                    toast.success('Nome e avatar atualizados com sucesso!')
                })
            })
        })
    }

    async function handlesubmit(e){
        e.preventDefault();
        if(imageAvatar === null && nome !== user.nome){
            const docref = doc(db, 'users', user.uid)
            await updateDoc(docref, {
                nome: nome
            })
            .then(() => {
                let data = {
                    ...user,
                    nome: nome
                }
                setUser(data)
                StorageUser(data)
                toast.success(`Nome atualizado com sucesso!`)
            })
        }else if(nome !== user.nome && imageAvatar !== null){
            handleUpload()
        }else if(imageAvatar !== null && nome === user.nome){
            const currentUid = user.uid;

            const uploadref = ref(storage, `images/${currentUid}/${imageAvatar.nome}`)
            const uploadImg = uploadBytes(uploadref, imageAvatar)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then( async (downloadURL) => {
                    let urlfoto = downloadURL;
                    const docref = doc(db, 'users', user.uid)
                    await updateDoc(docref, {
                        avatarUrl: urlfoto
                    })
                    .then(() => {
                        let data = {
                            ...user,
                            avatarUrl: urlfoto
                        }

                        setUser(data)
                        StorageUser(data)
                        setImageAvatar(null)
                        toast.success(`Avatar atualizado com sucesso!`)
                    })
                })
            })
        }
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name={'Minha conta'}>
                    <FiSettings size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handlesubmit}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#fff" size={25}/>
                            </span>
                            <input type="file" accept="image/*"  onChange={handleFile}/><br/>
                            {
                                avatarUrl === null ? (
                                    <img src={avatar} alt='Foto de perfil' width={250} height={250}/>
                                ) : (
                                    <img src={avatarUrl} alt='Foto de perfil' width={250} height={250}/>
                                )
                            }
                        </label>

                        <label>Nome</label>
                        <input type='text' value={nome} onChange={e => setNome(e.target.value)}/>

                        <label>Email</label>
                        <input type='text' value={email} disabled={true}/>

                        <button type='submit'>Salvar</button>

                    </form>

                </div>

                <div className='container'>
                    <button className='logout-btn' onClick={() => LogOut()}>Sair</button>
                </div>

            </div>
        </div>
    )
}