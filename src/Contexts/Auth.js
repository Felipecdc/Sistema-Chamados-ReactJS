import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../Services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SignIn from '../Pages/SignIn';

export const AuthContext = createContext({});

function AuthProvider({children}){

    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        async function LoadUser(){
            const StorageUser = localStorage.getItem('@ticketsPRO')

            if(StorageUser){
                setUser(JSON.parse(StorageUser))
                setLoading(false)
            }

            setLoading(false)
        }

        LoadUser();
    }, [])

    // Logar o User
    async function signIn(email, password){
        setLoadingAuth(true)
        await signInWithEmailAndPassword(auth, email, password)
        .then( async (value) => {
            let uid = value.user.uid;
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef)

            let data = {
                uid: uid,
                nome: docSnap.data().nome,
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl,
            }

            setUser(data)
            StorageUser(data)
            setLoadingAuth(false)
            toast.success('Bem-vindo(a) de volta!')
            navigate('/dashboard')
        })
        .catch((err) => {
            console.log(err)
            setLoadingAuth(false)
            toast.error('Ops, algo deu errado!')
        })
    }

    // Cadastrar um novo User
    async function signUp(name, email, password){
        setLoadingAuth(true)
        await createUserWithEmailAndPassword(auth, email, password)
        .then( async (value) => {
            let uid = value.user.uid;

            await setDoc(doc(db, 'users', uid), {
                nome: name,
                avatarUrl: null,
            })
            .then(() => {
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null
                }
                setUser(data)
                StorageUser(data)
                setLoadingAuth(false) 
                navigate('/dashboard')
                toast.success('Bem-vindo(a) ao sistema!')
            })
        })
        .catch((err) => {
            console.log(err)
            setLoadingAuth(false)
        })
    }  

    async function LogOut(){
        await signOut(auth);
        localStorage.removeItem('@ticketsPRO')
        setUser(null)
    }

    // Salvando local informações do User
    function StorageUser(data){
        localStorage.setItem('@ticketsPRO', JSON.stringify(data))
    } 

    return(
        <AuthContext.Provider
        value={{
            signed: !!user, //Boolean 
            user,
            setUser,
            signIn,
            signUp,
            loadingAuth,
            loading,
            LogOut,
            StorageUser,
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;