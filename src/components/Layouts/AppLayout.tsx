import Navigation from '@/components/Layouts/Navigation';
import { useAuth } from '@/hooks/auth';

interface PropsType {
    header: React.ReactNode;
    children: React.ReactNode;
}

const AppLayout = ({ header, children }: PropsType) => {
    const { user } = useAuth({ middleware: 'auth'})

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-700">
            <Navigation user={user} />

            {/* Page Heading */}
            <header className="bg-white dark:bg-black shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {header}
                </div>
            </header>

            {/* Page Content */}
            <main>{children}</main>
        </div>
    )
}

export default AppLayout
