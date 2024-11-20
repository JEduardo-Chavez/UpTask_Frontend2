import { addUserToProject } from "@/api/TeamAPI"
import { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type SearchResultProps = {
    user: TeamMember,
    reset: () => void
}

export default function SearchResult({user, reset} : SearchResultProps) {

    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!

    const queryClient = useQueryClient()
    
    const {mutate} = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            queryClient.invalidateQueries({queryKey: ['ProjectTeam', projectId]})
            navigate(location.pathname, {replace: true})
        }
    })

    const handleAddUserToProject = () => {
        const data = {
            projectId,
            id: user._id
        }
        mutate(data)
    }

  return (
    <>
        <p className="text-center font-bold mt-10">Resutlados</p>
        <div className="flex justify-between items-center border-b-2 px-2">
            <p className="font-semibold text-xl">{user.name}</p>
            <button
            onClick={handleAddUserToProject}
                className="text-purple-600 font-bold cursor-pointer py-2 px-10 hover:bg-purple-200 rounded-2xl"
            >Agregar a Proyecto
            </button>
        </div>
    </>
  )
}
