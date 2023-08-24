import useSWR from 'swr';
import axios from '@/lib/axios';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { UseAuthProps, RegisterAuth, LoginAuth, ForgotPasswordAuth, ResetPasswordAuth, UpdatePasswordAuth, UpdateProfileAuth, EmailverifyAuth, DeleteUserAuth } from '@/lib/types';

export const useAuth = ({ middleware, redirectIfAuthenticated = '/' }: UseAuthProps = {}) => {
    const router = useRouter()

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }: RegisterAuth) => {
        await csrf()

        setErrors({})

        axios
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }: LoginAuth) => {
        await csrf()

        setErrors({})
        setStatus(null)

        axios
            .post('/login', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }: ForgotPasswordAuth) => {
        await csrf()

        setErrors({})
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }: ResetPasswordAuth) => {
        await csrf()

        setErrors({})
        setStatus(null)

        axios
            .post('/reset-password', { token: router.query.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const updatePassword = async ({setErrors, setStatus, setProcessing, ...props}: UpdatePasswordAuth) => {

        setErrors({});
        setStatus(null);
        setProcessing(true);

        await axios
            .put('/update-password', props )
            .then(() => setStatus('updatepassword_done'))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
        });

        setProcessing(false);    
    }

    const updateProfle = async ({setErrors, setStatus, setProcessing, verifyStatus, ...props}: UpdateProfileAuth) => {
    
        setErrors({});
        setStatus(verifyStatus);
        setProcessing(true);

        await axios
            .patch('/update-profile', props )
            .then(() => {
                mutate();
                setStatus('updateprofile_done');
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
        });

        setProcessing(false);    
    }

    const resendEmailVerification = ({ setStatus }: EmailverifyAuth) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const deleteUser = async ({ setErrors, ...props }: DeleteUserAuth) => {
        setErrors({});
    
        await axios
            .post('/userdelete', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            });


        window.location.pathname = '/';
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        updatePassword,
        updateProfle,
        resendEmailVerification,
        deleteUser,
        logout,
    }
}
