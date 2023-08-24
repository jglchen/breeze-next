import Head from 'next/head'

interface PropsType {
    children: React.ReactNode;
}

const GuestLayout = ({ children }: PropsType) => {
    return (
        <div>
            <Head>
                <title>Laravel Breeze API Backend with Next.js Frontend</title>
            </Head>

            <div className="font-sans text-gray-900 antialiased">
                {children}
            </div>
        </div>
    )
}

export default GuestLayout
