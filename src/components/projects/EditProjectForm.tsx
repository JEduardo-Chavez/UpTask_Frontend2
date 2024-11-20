import { Link, useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import { Project, ProjectFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProject } from "@/api/ProjectAPI";
import { toast } from "react-toastify";

type EditProjectFormProps = {
    data : ProjectFormData,
    projectId: Project['_id']
}

export default function EditProjectForm({data, projectId} : EditProjectFormProps) {
    
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: {
        projectName: data.projectName,
        clientName: data.clientName,
        description: data.description
    }})
    
    
    const { mutate } = useMutation({
        mutationFn: UpdateProject,
        onError: (error) => {
            toast.error(error.message)
        }, onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['projects']})
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]})
            toast.success(data)
            navigate('/')
        }
    })
    
    const handleForm = (formData : ProjectFormData) => {
        const data = {
            formData,
            projectId
        }

        mutate(data)
    }
    
    return (
        <>
        <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold">Editar Proyecto</h1>
            <p className="mt-2 text-2xl font-light text-gray-500">Actualiza la informacion del proyecto llenando el siguiente fomrulario</p>
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
                    value='Guardar cambios'
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 p-3 w-full cursor-pointer transition-colors text-white font-bold uppercase" 
                />

            </form>

        </div>
        </>
    )
}
