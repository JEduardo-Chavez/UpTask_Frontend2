import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import {useForm} from 'react-hook-form'
import { useMutation } from "@tanstack/react-query"
import ProjectForm from "@/components/projects/ProjectForm"
import { ProjectFormData } from "@/types/index"
import { createProject } from "@/api/ProjectAPI"

export default function CreateProjectView() {

    const initialValues : ProjectFormData = {
        projectName: "",
        clientName: "",
        description: ""
    }

    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues:initialValues})

    const navigate = useNavigate()

    const {mutate} = useMutation({
        mutationFn: createProject,
        onError: () => {

        },
        onSuccess: (data) => {
            toast.success(data)
            navigate('/')
        }
    })

    const handleForm = (formData : ProjectFormData) => mutate(formData)

    return (
        <>
        <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold">Crear Proyecto</h1>
            <p className="mt-2 text-2xl font-light text-gray-500">Crea un nuevo proyecto llenando el siguiente fomrulario</p>
            <nav className="my-6">
                <Link className="bg-purple-500 hover:bg-purple-600 transition-colors cursor-pointer px-8 py-3 text-lg font-bold text-white rounded-md" to={'/'}>
                Mis Proyectos
                </Link>
            </nav>

            <form 
                className=" bg-white mt-10 p-10 shadow-lg rounded-lg"
                onSubmit={handleSubmit(handleForm)}
                noValidate
            >
                <ProjectForm
                    register={register}
                    errors={errors}
                />

                <input 
                    type="submit"
                    value='Crear Proyecto'
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 p-3 w-full cursor-pointer transition-colors text-white font-bold uppercase" 
                />

            </form>

        </div>
        </>
    )
}
