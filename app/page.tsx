'use client'

import { auth } from '@/utils/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'

export default function Home() {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    async function login() {
        try {
            console.log('login')
            const userCredentials = await signInWithEmailAndPassword(auth, email, password)
            console.log(userCredentials)
        } catch (error) {
            console.log(error)
        }
    }

    async function register() {
        try {
            console.log('register')
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
            console.log(userCredentials)
        } catch (error) {
            console.log(error)
        }
    }

    async function logout() {
        try {
            console.log('logout')
            await signOut(auth)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid
                console.log(uid, user)
                // ...
            } else {
                // User is signed out
                // ...
                console.log('signed out')
            }
        })
    }, [])
    return (
        <div>
            <h1>Home</h1>
            <button onClick={login}>Login</button>
            <button onClick={register}>Register</button>
            <button onClick={logout}>Logout</button>
            <input type="text" onChange={(e) => setEmail(e.target.value)} />
            <input type="text" onChange={(e) => setPassword(e.target.value)} />
        </div>
    )
}
