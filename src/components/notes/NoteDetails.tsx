import { deleteNote } from "@/api/NoteAPI"
import { useAuth } from "@/hooks/useAuth"
import { Note } from "@/types/index"
import { formateDate } from "@/Utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteDetailsProps = {
    note: Note
}

export default function NoteDetails({note}: NoteDetailsProps) {

    const {data, isLoading} = useAuth()
    const canDelete = useMemo(() => data?._id === note.createdBy._id, [data])
    
    const params = useParams()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const projectId = params.projectId!
    const taskId = queryParams.get('viewTask')!
    
    const queryClient = useQueryClient()
    const {mutate} = useMutation({
        mutationFn: deleteNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        }
    })

    if (isLoading) return 'Cargando...'
    
    return (
    <div className="py-3 flex justify-between items-center">
        <div>
            <p className="text-gray-500 italic text-xs">{formateDate(note.createdAt) }</p>
            <p>
                <span className="font-bold">{note.createdBy.name} - </span> {note.content}
            </p>
        </div>
        
        {canDelete && 
            <button 
                className="bg-rose-600 hover:bg-rose-500 hover:text-sm text-white text-xs font-bold py-2 px-5 rounded-md transition-colors"
                onClick={ () => mutate({projectId, taskId, noteId: note._id})}
            >Borrar</button>
        }
    </div>
    )
}
