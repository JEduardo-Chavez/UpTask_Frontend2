import {isAxiosError} from "axios";
import api from "@/lib/axios";
import { CheckPasswordForm, ConfirmToken, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, UserLoginForm, UserRegistrationForm, userSchema } from "../types";

// UN COMENTARIO 2
export async function createAccount(formData : UserRegistrationForm) {
    try {
        const url = 'auth/create-account'
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function confirmAccount(formData : ConfirmToken) {
    try {
        const url = '/auth/confirm-account'
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function requestConfirmationCodeForm(formData : RequestConfirmationCodeForm) {
    try {
        const url = '/auth/request-code'
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function authenticateUser(formData : UserLoginForm) {
    try {
        const url = '/auth/login'
        const { data } = await api.post<string>(url, formData)
        localStorage.setItem('UpTask_Token', data)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function forgotPassword(formData : ForgotPasswordForm) {
    try {
        const url = '/auth/forgot-password'
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function validateToken(formData : ConfirmToken) {
    try {
        const url = '/auth/validate-account'
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function updatePasswordWithToken({formData, token} : {formData: NewPasswordForm, token: ConfirmToken['token']}) {
    try {
        const url = `/auth/update-password/${token}`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getUser() {
    try {
        const { data } = await api('/auth/user')
        const response = userSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }       
    }
}

export async function chechPassword(formData: CheckPasswordForm) {
    try {
        const url = '/auth/check-password'
        const {data} = await api.post<string>(url, formData)
        return data 
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }       
        
    }
}