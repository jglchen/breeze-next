import { useState, FormEvent } from 'react';
import DangerButton from '@/components/DangerButton';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import Modal from '@/components/Modal';
import SecondaryButton from '@/components/SecondaryButton';
import { ErrorsType } from'@/lib/types';
import { useAuth } from '@/hooks/auth';

export default function DeleteUserForm({ className = '' }) {
    const { deleteUser } = useAuth({ middleware: 'auth' });
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<ErrorsType>({});

    const deleteAccount = (event: FormEvent) => {
        event.preventDefault()
        
        setErrors({});

        deleteUser({
            password,
            setErrors,
        });
    
    }

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        setPassword('');
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">Delete Account</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
                    Once your account is deleted, all of its resources and data will be permanently deleted. Before
                    deleting your account, please download any data or information that you wish to retain.
                </p>
            </header>

            <DangerButton onClick={() => setConfirmingUserDeletion(true)}>Delete Account</DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteAccount} className="p-6 dark:bg-black">

                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                        Are you sure you want to delete your account?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
                        Once your account is deleted, all of its resources and data will be permanently deleted. Please
                        enter your password to confirm you would like to permanently delete your account.
                    </p>

                    <div className="mt-6">
                        <Label htmlFor="password" className="sr-only dark:text-white">Password</Label>

                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(event: FormEvent) => setPassword((event.target as HTMLInputElement).value)}
                            className="mt-1 block w-3/4 bg-[#f8f8f8] dark:bg-[#2C303B] dark:text-white"
                            placeholder="Password"
                            required
                            autoFocus
                       />

                        <InputError
                            messages={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

                        <DangerButton className="ml-3">
                            Delete Account
                        </DangerButton>
                    </div>

                </form>
            </Modal>

        </section>
    );

}   