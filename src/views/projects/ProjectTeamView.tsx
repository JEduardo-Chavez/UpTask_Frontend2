import { Fragment } from 'react'
import { Transition, Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import AddMemberModal from "@/components/team/AddMemberModal";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUserFromProject, getProjectTeam } from "@/api/TeamAPI";
import { toast } from 'react-toastify';

export default function ProjectTeamView() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ProjectTeam", projectId],
    queryFn: () => getProjectTeam(projectId),
    retry: false,
  });

  const {mutate} = useMutation({
    mutationFn: deleteUserFromProject,
    onError: (error) => {
        toast.error(error.message)
    },
    onSuccess: (data)=>{
        toast.success(data)
        queryClient.invalidateQueries({queryKey: ['ProjectTeam', projectId]})
    }
  })

  if (isLoading) return "...Cargando";
  if (isError) return <Navigate to={"/404"} />;

  if (data)
    return (
      <>
        <h1 className="text-5xl font-bold text-center">Administrar Equipos</h1>
        <p className="text-center mt-2 text-2xl font-light">
          Administra los miembros del equipo de trabajo para este proyecto
        </p>

        <nav className="flex my-5 gap-3">
          <button
            type="button"
            className="bg-purple-500 hover:bg-purple-600 px-10 py-3 text-white font-bold text-xl cursor-pointer transition-colors rounded-md"
            onClick={() => navigate("?addMember=true")}
          >
            Agregar miembro
          </button>
          <button
            type="button"
            className="bg-indigo-500 hover:bg-indigo-600 px-10 py-3 text-white font-bold text-xl cursor-pointer transition-colors rounded-md"
            onClick={() => navigate(`/projects/${projectId}`)}
          >
            Volver a Proyecto
          </button>
        </nav>

        {/* CONTENIDO DE MIEMBROS */}
        <h2 className="text-5xl font-bold my-10">Miembros actuales</h2>
        {data.length ? (
          <ul
            role="list"
            className="divide-y-8 divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg rounded-xl"
          >
            {data?.map((member) => (
              <li key={member._id} className="flex justify-between gap-x-6 px-10 py-8">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <p className="text-4xl font-black text-gray-600">{member.name}</p>
                    <p className="text-md font-thin text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-6">
                  <Menu as="div" className="relative flex-none">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                      <span className="sr-only">opciones</span>
                      <EllipsisVerticalIcon
                        className="h-9 w-9"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <Menu.Item>
                          <button
                          onClick={ () => mutate({projectId, userId: member._id})}
                            type="button"
                            className="block px-3 py-1 text-sm leading-6 text-red-500"
                          >
                            Eliminar del Proyecto
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-20">No hay miembros en este equipo</p>
        )}

        <AddMemberModal />
      </>
    );
}
