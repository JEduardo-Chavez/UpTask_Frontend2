import { NoteFormData } from '@/types/index'
import { useForm } from 'react-hook-form'
import ErrorMessage from '../ErrorMessage'
import { useMutation, useQueryClient} from '@tanstack/react-query'
import { createNote } from '@/api/NoteAPI'
import { toast } from 'react-toastify'
import { useLocation, useParams } from 'react-router-dom'

export default function AddNotesForm() {
    const initialValues : NoteFormData = {
        content: ''
    }
    const params = useParams()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    
    const projectId = params.projectId!
    const taskId = queryParams.get('viewTask')!

    const queryClient = useQueryClient()
    const {register, handleSubmit, reset, formState: {errors} } = useForm({defaultValues : initialValues})
    const {mutate} = useMutation({
        mutationFn: createNote,
        onError: (error)=> {
            toast.error(error.message)
        },
        onSuccess: (data)=>{
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        }
    })
    
    const handleNote = (formData: NoteFormData)=> {
        const data = {
            formData,
            projectId,
            taskId
        }
        mutate(data)
        reset()
    }

    return (
        <>
            <form 
                onSubmit={ handleSubmit(handleNote)}
                className="space-y-3"
                noValidate
            >
                <div className="flex flex-col gap-2">
                    <label htmlFor="content" className="font-bold" >Crear Nota</label>
                    <input 
                        type="text" 
                        id="content" 
                        className="border border-gray-300 w-full p-3 rounded-md" 
                        placeholder="Contenido de la nota"
                        {...register( 'content', {
                            required: 'Es obligatorio poner una descripcion en la nota'
                        })}
                    />
                    {errors.content && <ErrorMessage>{errors.content.message}</ErrorMessage>}
                </div>
                <input type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-700 cursor-pointer p-2 w-full rounded-md text-white font-bold" value="Crear nota"/>
            </form>           
        </>
    )
}
