import api from "@/lib/axios";
import { Project, ProjectFormData, dashboardProjectSchema, editProjectSchema, projectSchema } from "@/types/index";
import { isAxiosError } from "axios";

// GUARDAR REGISTRO
export async function createProject(formData : ProjectFormData) {
    try {
        const { data } = await api.post('/projects', formData)
        return data
    } catch (error) {
        console.log(error);
        
    }
}

//OBTENER TODOS LOS REGISTROS
export async function getProjects() {
    try {
        const { data } = await api('/projects')
        const response = dashboardProjectSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

//OBTENER POR ID
export async function getProjectById(id : Project['_id']) {
    try {
        const { data } = await api(`/projects/${id}`)
        const response = editProjectSchema.safeParse(data)
        if (response.data) {
            return response.data
        }        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getFullProject(id : Project['_id']) {
    try {
        const { data } = await api(`/projects/${id}`)
        const response = projectSchema.safeParse(data)
        if (response.data) {
            return response.data
        }        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

//ACTUALIZAR UN PROYECTO
type ProjectAPIType = {
    formData: ProjectFormData,
    projectId: Project['_id']
}

export async function UpdateProject({formData, projectId} : ProjectAPIType ) {
    try {
        const { data } = await api.put<string>(`/projects/${projectId}`, formData)
        return data
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

//ELIMINAR PROYECTO
export async function deleteProject(id : Project['_id']) {
    try {
        const url = `/projects/${id}`
        const { data } = await api.delete<string>(url)
        return data
        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}