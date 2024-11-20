import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TaskFormData } from '@/types/index';
import TaskForm from './TaskForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';


export default function AddTaskModal() {

    /**Leer si modal activo */
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const modalTask = queryParams.get('newTask')
    const show = modalTask ? true : false

    const initialValues : TaskFormData = {
        name: '',
        description: ''
    }
    const {register, reset, handleSubmit, formState: {errors} } = useForm({defaultValues: initialValues})
    
    /**Obtener projectId de url */
    const params = useParams()
    const projectId = params.projectId!
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: createTask,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            toast.success(data)
            reset()
            navigate(location.pathname, {replace: true})
        }
    })

    const handeCreateTask = (formData : TaskFormData) => {
        const data = {
            projectId,
            formData
        }
        mutate(data)
    }

    const closeModal = () => {
        reset()
        navigate(location.pathname, {replace: true})
    }    
    
    return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <Dialog.Title
                                        as="h3"
                                        className="font-bold text-4xl  my-5"
                                    >
                                        Nueva Tarea
                                    </Dialog.Title>

                                    <p className="text-2xl font-light">Llena el formulario y crea  {''}
                                        <span className="text-fuchsia-600 font-bold">una tarea</span>
                                    </p>
                                    <form className='mt-10 space-y-5' noValidate onSubmit={handleSubmit(handeCreateTask)}>

                                        <TaskForm
                                            register={register}
                                            errors={errors}
                                        />

                                        <input 
                                            type="submit"
                                            value='Guardar cambios'
                                            className="bg-fuchsia-600 hover:bg-fuchsia-700 p-3 w-full cursor-pointer transition-colors text-white font-bold uppercase mt-6" 
                                        />
                                    </form>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}