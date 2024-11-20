import { Link, Navigate, Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Logo from "@/components/Logo"
import NavMenu from "@/components/NavMenu"
import { useAuth } from "@/hooks/useAuth"

export default function AppLayout() {

    const { data, isError, isLoading } = useAuth()

    if (isLoading) return 'Cargando....'
    if (isError) {
        return <Navigate to='/auth/login'></Navigate>
    }
    
    

    if(data) return (
        <>
            <header className="bg-gray-900 py-6">
                <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center">
                    <div className="w-64">
                        <Link to={'/'}>
                            <Logo/>
                        </Link>
                    </div>
                    <NavMenu 
                        name={data.name}
                    />
                </div>
            </header>

            <div className="mx-5">
                <section className="max-w-screen-2xl mx-auto mt-10">
                    <Outlet/>
                </section>
            </div>

            <footer className="p-5">
                <p className="text-center font-bold">
                    Todos los derechos reservados - {new Date().getFullYear()}
                </p>
            </footer>
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </>
    )
}
