import { useEffect, useState, FormEvent } from 'react';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import Button from '@/components/Button';
import { ErrorsType } from'@/lib/types';
import { useAuth } from '@/hooks/auth';
import { Transition } from '@headlessui/react';

export default function UpdatePasswordForm({ className = '' }) {
    const { updatePassword } = useAuth({ middleware: 'auth' });
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<ErrorsType>({});
    const [status, setStatus] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
       if (status === 'updatepassword_done') {
          const statusTimeout = setTimeout(() => {
            setBackToDefault();
          }, 1000);

          return () => clearTimeout(statusTimeout);
       }
    },[status]);

    const updatePasswd = (event: FormEvent) => {
        event.preventDefault();
 
        updatePassword({
            current_password: currentPassword,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
            setStatus,
            setProcessing,
        });
    }

    const setBackToDefault = () => {
        setStatus(null);
        setErrors({});
        setCurrentPassword('');
        setPassword('');
        setPasswordConfirmation('');
    }


    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">Update Password</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <form onSubmit={updatePasswd} className="mt-6 space-y-6">

                <div>
                    <Label className="text-dark dark:text-white" htmlFor="current_password">Current Password</Label>

                    <Input
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(event: FormEvent) => setCurrentPassword((event.target as HTMLInputElement).value)}
                        type="password"
                        className="mt-1 block w-full bg-[#f8f8f8] dark:bg-[#2C303B] dark:text-white"
                        autoComplete="current-password"
                        required
                    />

                    <InputError
                            messages={errors.current_password}
                            className="mt-2"
                        />
                </div>

                <div>
                    <Label className="text-dark dark:text-white" htmlFor="password">New Password</Label>

                    <Input
                        id="password"
                        value={password}
                        onChange={(event: FormEvent) => setPassword((event.target as HTMLInputElement).value)}
                        type="password"
                        className="mt-1 block w-full bg-[#f8f8f8] dark:bg-[#2C303B] dark:text-white"
                        autoComplete="new-password"
                        required
                    />

                    <InputError
                            messages={errors.password}
                            className="mt-2"
                        />
                </div>

                <div>
                    <Label className="text-dark dark:text-white" htmlFor="passwordConfirmation">Confirm Password</Label>

                    <Input
                        id="passwordConfirmation"
                        value={passwordConfirmation}
                        onChange={(event: FormEvent) => setPasswordConfirmation((event.target as HTMLInputElement).value)}
                        type="password"
                        className="mt-1 block w-full bg-[#f8f8f8] dark:bg-[#2C303B] dark:text-white"
                        autoComplete="new-password"
                        required
                    />

                    <InputError
                            messages={errors.password_confirmation}
                            className="mt-2"
                        />
                </div>

                <div className="flex items-center gap-4">
                    <Button disabled={processing}>Save</Button>
                    
                    <Transition
                        show={status === 'updatepassword_done'}
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