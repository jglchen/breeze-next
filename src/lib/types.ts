export interface UseAuthProps {
    middleware?: string;
    redirectIfAuthenticated?: string;
}

export interface ErrorsType {
    name?: string[];
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
    current_password?: string[];
}

export interface UserType {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface User {
    user: UserType;
}

export interface RegisterProps {
    name: string;
    email: string
    password: string;
    password_confirmation: string;
}

export interface LoginProps {
    email: string;
    password: string;
    remember: boolean;
}

export interface ForgotPasswordProps {
    email: string;
}

export interface ResetPasswordProps {
    email: string;
    password: string;
    password_confirmation: string;
}

export interface UpdatePasswordProps {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export interface UpdateProfileProps {
    name: string;
    email: string;
}

export interface DeleteUserProps {
    password: string;
}

export interface SetErrorsType {
    setErrors: (x: ErrorsType) => void;
}

export interface SetStatusType {
    setStatus: (x: string | null) => void;
}

export interface SetProcessingType {
    setProcessing: (x: boolean) => void;
}

export interface verifyStatusType {
    verifyStatus: string;
}

export type RegisterAuth = RegisterProps & SetErrorsType;

export type LoginAuth = LoginProps & SetErrorsType & SetStatusType;

export type ForgotPasswordAuth = ForgotPasswordProps & SetErrorsType & SetStatusType;

export type ResetPasswordAuth = ResetPasswordProps & SetErrorsType & SetStatusType;

export type UpdatePasswordAuth = UpdatePasswordProps & SetErrorsType & SetStatusType & SetProcessingType ;

export type UpdateProfileAuth = UpdateProfileProps & SetErrorsType & SetStatusType & SetProcessingType &  verifyStatusType;

export type DeleteUserAuth = DeleteUserProps & SetErrorsType;

export type EmailverifyAuth = SetStatusType;

