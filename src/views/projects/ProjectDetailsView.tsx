import { getFullProject } from "@/api/ProjectAPI";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import AddTaskModal from "../../components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TasksList";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/Utils/policies";
import { useMemo } from "react";

export default function ProjectDetailsView() {

    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!
    
    const { data:user, isLoading:authLoading } = useAuth()
    const { data, isLoading, isError } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getFullProject(projectId) 
      })
    //resvisar que se puede editar para pasarlo por props a los sigs
    const canEdit = useMemo( () => data?.manager === user?._id, [data, user])

    if (isLoading && authLoading) return 'Cargando..'
    if (isError) return <Navigate to='/' />
    if (data && user?._id) return (
    <>
        <h1 className="text-5xl font-bold text-center">{data.projectName}</h1>
        <p className="text-center mt-2 text-2xl font-light">{data.description}</p>

        <nav className="flex my-5 gap-3">
        {isManager(data.manager, user._id) && (
            <>
                <button
                    type="button"
                    className="bg-purple-500 hover:bg-purple-600 px-10 py-3 text-white font-bold text-xl cursor-pointer transition-colors rounded-md"
                    onClick={ ()=> navigate('?newTask=true')}
                >
                    Agregar Tarea
                </button>
                <Link
                    className="bg-fuchsia-700 hover:bg-fuchsia-800 px-10 py-3 text-white font-bold text-xl cursor-pointer transition-colors rounded-md"
                    to={'team'}
                >Administrar Equipo</Link>
            </>
        )}
            <button
                type="button"
                className="bg-indigo-500 hover:bg-indigo-600 px-4 py-3 text-white font-bold text-xl cursor-pointer transition-colors rounded-md"
                onClick={ ()=> navigate('/')}
            >
                Volver a Proyectos
            </button>
        </nav>

        <TaskList
            tasks={data.tasks}
            canEdit={canEdit}
        />
        
        <AddTaskModal/>
        <EditTaskData/>
        <TaskModalDetails/>
    </>
    )
}
