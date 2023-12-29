import { useEffect, useState, useRef, FormEvent, MouseEvent } from 'react';
import Link from 'next/link';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Button from '@/components/Button';
import Label from '@/components/Label';
import { Transition } from '@headlessui/react';
import { ErrorsType } from'@/lib/types';
import { useAuth } from '@/hooks/auth';

interface UpdateProfileInformationProps {
    mustVerifyEmail?: boolean;
    verifyEmail?: string;
    className?: string;
}

export default function UpdateProfileInformationForm({ mustVerifyEmail=false, verifyEmail='', className = '' }: UpdateProfileInformationProps) {
    const { user, updateProfle, resendEmailVerification } = useAuth({middleware: 'auth'});
    const [name, setName] = useState(user ? user.name: '');
    const [email, setEmail] = useState(user ? user.email: '');
    const [errors, setErrors] = useState<ErrorsType>({});
    const [status, setStatus] = useState<string | null>(verifyEmail);
    const [processing, setProcessing] = useState(false);
    const verifyStatus = useRef(verifyEmail);

    useEffect(() => {
        if (status === 'updateprofile_done') {
           const statusTimeout = setTimeout(() => {
                setStatus(verifyStatus.current);
                setErrors({});
           }, 1000);
 
           return () => clearTimeout(statusTimeout);
        }
        if (status === 'verification-link-sent') {
            verifyStatus.current = status;
        }
    },[status]);

    useEffect(() => {
        setName(user ? user.name: '');
        setEmail(user ? user.email: '');
    },[user]);    
    
    const updateProfile = (event: FormEvent) => {
        event.preventDefault();

        updateProfle({
            name,
            email,
            setErrors, 
            setStatus, 
            setProcessing, 
            verifyStatus: verifyStatus.current,
        });
    };

    const sendVerifyEmail = (event: MouseEvent) => {
        event.preventDefault();

        resendEmailVerification({
            setStatus,
        });
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
                    Update your account&rsquo;s profile information and email address.
                </p>
            </header>

            <form onSubmit={updateProfile} className="mt-6 space-y-6">
                <div>
                    <Label className="text-dark dark:text-white" htmlFor="name">Name</Label>

                    <Input
                        id="name"
                        className="mt-1 block w-full bg-[#f8f8f8] dark:bg-[#2C303B] dark:text-white"
                        value={name}
                        onChange={(event: FormEvent) => setName((event.target as HTMLInputElement).value)}
                        required
                        autoFocus
                        autoComplete="name"
                    />

                    <InputError
                            messages={errors.name}
                            className="mt-2"
                        />
                </div>

                <div>
                    <Label className="text-dark dark:text-white" htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-[#f8f8f8] dark:bg-[#2C303B] dark:text-white"
                        value={email}
                        onChange={(event: FormEvent) => setEmail((event.target as HTMLInputElement).value)}
                        required
                        autoComplete="username"
                    />

                    <InputError
                            messages={errors.email}
                            className="mt-2"
                        />
               </div>
               
               {mustVerifyEmail && user?.email_verified_at === null && (

                    <div>
                        <p className="text-sm mt-2 text-gray-800 dark:text-gray-100">
                            Your email address is unverified.
                            <Link
                                href={'/'}
                                onClick={sendVerifyEmail}
                                as="button"
                                className="underline text-sm text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-200">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}
 
                <div className="flex items-center gap-4">
                    <Button disabled={processing}>Save</Button>

                    <Transition
                        show={status === 'updateprofile_done'}
                        enterFrom="opacity-0"
                        leaveTo="opacity-0"
                        className="transition ease-in-out"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-200">Saved.</p>
                    </Transition>
                </div>

            </form>
 
        </section>
    );

}    