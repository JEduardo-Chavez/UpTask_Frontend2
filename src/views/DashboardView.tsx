import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'

import { Link, useLocation, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProjects } from "@/api/ProjectAPI"
import { useAuth } from '@/hooks/useAuth'
import DeleteProjectModal from '@/components/projects/DeleteProjectModal'

export default function DashboardView() {

  const { data: user, isLoading: authLoading } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects 
  })

  const location = useLocation()
  const navigate = useNavigate()


  // console.log(data);
  // console.log(user?._id);
  

  if (isLoading && authLoading) return 'Cargando..'

  if(data && user?._id) return (
    <>
      <h1 className="text-5xl font-bold">Mis Proyectos</h1>
      <p className="mt-2 text-2xl font-light text-gray-500">Maneja y administra tus proyectos</p>
      <nav className="my-6">
        <Link className="bg-purple-500 hover:bg-purple-600 transition-colors cursor-pointer px-8 py-3 text-lg font-bold text-white rounded-md" to={'/projects/create'}>
          Nuevo Proyecto
        </Link>
      </nav>


      {data.length ? (
        <ul role="list" className="divide-y divide-gray-200 border border-gray-200 mt-10 bg-white shadow-lg rounded-lg">
          {data.map((project) => (
            <li key={project._id} className="flex justify-between gap-x-6 px-5 py-10">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto space-y-2">
                  <div className='mb-2'>
                    {project.manager === user._id ? 
                      <p className='bg-indigo-100 text-indigo-600 border-2 border-indigo-600 font-bold text-xs inline-block rounded-lg uppercase py-1 px-3'>Manager</p>
                      : 
                      <p className='bg-emerald-100 text-emerald-600 border-2 border-emerald-600 font-bold text-xs inline-block rounded-lg uppercase py-1 px-3'>Equipo</p>
                    }
                  </div>
                  <Link to={`/projects/${project._id}`}
                    className="text-gray-700 cursor-pointer hover:underline text-3xl font-bold"
                  >{project.projectName}</Link>
                  <p className="text-sm text-gray-500">
                    Cliente: {project.clientName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                  <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">opciones</span>
                    <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                  </MenuButton>
                  <Transition as={Fragment} enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <MenuItems
                      className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                    >
                      <MenuItem>
                        <Link to={`/projects/${project._id}`}
                          className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                          Ver Proyecto
                        </Link>
                      </MenuItem>
                      {project.manager === user._id && (
                        <>
                          <MenuItem>
                            <Link to={`/projects/${project._id}/edit`}
                              className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                              Editar Proyecto
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <button
                              type='button'
                              className='block px-3 py-1 text-sm leading-6 text-red-500'
                              onClick={() => navigate(location.pathname + `?deleteProject=${project._id}`)}
                            >
                              Eliminar Proyecto
                            </button>
                          </MenuItem>
                        </>
                      )}
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center py-20 font-thin">No hay proyectos registrados 
          <Link to='/projects/create' className="text-fuchsia-700 font-bold"> Crear un proyecto
          </Link>
        </p>
      )}
      

      < DeleteProjectModal />
    </>
  )
}
