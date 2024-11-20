import NewPasswordToken from "@/components/auth/NewPasswordToken"
import NewPasswordForm from "@/components/auth/NewPasswordForm"
import { useState } from "react"
import { ConfirmToken } from "@/types/index"

export default function NewPasswordView() {
    const [token, setToken] = useState<ConfirmToken['token']>('')
    const [isValidToken, setIsValidToken] = useState(false)
    return (
        <>
            <h1 className="text-center text-4xl font-black text-white">Restablecer tu contraseña</h1>
            <p className=" text-center text-xl font-light text-white mt-5">
                Coloca tu nueva contraseña {''}
                <span className=" text-fuchsia-500 font-bold"> y confirmala para poder iniciar sesion</span>
            </p>

            {!isValidToken ? 
                <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken}/> : 
                <NewPasswordForm token={token}/>
            }
        </>
    )
}
