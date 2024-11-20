import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTranslate } from "@/locales/es"
import DropTask from "./DropTask"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateStatus } from "@/api/TaskAPI"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"

type TaskListProps = {
  tasks : TaskProject[],
  canEdit: boolean
}

type GroupedTask = {
  [key: string] : TaskProject[]
}

const initialStatusGroup : GroupedTask = {
  pending : [],
  onHold : [],
  inProcess : [],
  onReview : [],
  completed:[]
}

const statusColors : {[key:string] : string} = {
  pending : "border-t-rose-500",
  onHold : "border-t-amber-500",
  inProcess : "border-t-blue-500",
  onReview : "border-t-violet-500",
  completed:"border-t-emerald-500"
}

export default function TasksList( {tasks, canEdit} : TaskListProps) {
  
  const groupedTasks = tasks.reduce((acc, task) => {
      let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
      currentGroup = [...currentGroup, task]
      return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroup);
  // console.log(groupedTasks);

  const navigate = useNavigate()
  const params = useParams()
  const projectId = params.projectId!

  const queryClient = useQueryClient()
  const {mutate} = useMutation({
      mutationFn: updateStatus,
      onError: (error) => {
          toast.error(error.message)
      },
      onSuccess: (data)  => {
          toast.success(data)
          queryClient.invalidateQueries({queryKey: ['project', projectId]})
          navigate(location.pathname, {replace: true})
      }
  })
  
  const handleDragEnd = (e: DragEndEvent) =>{
    const { active, over} = e
    if (over && over.id) {
      const taskId = active.id.toString()
      const status = over.id as TaskStatus
      mutate({projectId, taskId, status})

      queryClient.setQueryData(['project', projectId], (prevData: Project) => {
        const updatedStatus = prevData.tasks.map( (task) => {
          if (task._id === taskId) {
            return {
              ...task,
              status
            }
          }
          return task
        })
        return {
          ...prevData,
          tasks: updatedStatus
        }
      })
    }
  }

  return (
    <>
      <h2 className="text-5xl font-black my-10">Tareas</h2>

      <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
          <DndContext onDragEnd={handleDragEnd}>
            {Object.entries(groupedTasks).map(([status, tasks]) => (
                <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>
                    
                    <h3 className={`capitalize text-center text-xl font-light bg-white border border-slate-300 p-3 border-t-8 ${statusColors[status]}`}>
                      {statusTranslate[status]}
                    </h3>

                    {/* COMPONENTE DE DRAG N DROP */}
                    <DropTask status={status}/>

                    <ul className='mt-5 space-y-5'>
                        {tasks.length === 0 ? (
                            <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                        ) : (
                            tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                        )}
                    </ul>
                </div>
            ))}
          </DndContext>
      </div>

    </>
  )
}
