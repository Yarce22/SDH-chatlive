import { useNavigate } from 'react-router';
import { RegisterForm } from '../components/RegisterForm';
import { useEffect } from 'react';
import UserIcon from '../assets/user-icon.png'

export default function Register() {
    const navigate = useNavigate()

    useEffect(() => {
        if (document.cookie.length > 0) {
            navigate("/")
        }
    }, [navigate])

    return (
        <section className='flex flex-col gap-20 items-center justify-center h-screen bg-bgPrimary'>
            <div className='w-32 h-32 px-2 pt-2 pr-3.5 pb-4 rounded-full overflow-hidden border-6 border-white'>
                <img src={UserIcon} alt="user-icon" className='w-full h-full object-contain' />
            </div>

            <div className='text-colorText text-4xl font-bold'>
                <h1>
                    WELCOME TO <br /> <span className='relative z-10 text-shadow-2xs before:absolute before:content-["SDH"] before:-z-10 before:top-2.5 before:left-2 before:w-10 before:h-10 before:text-colorTextSecondary'>SDH</span> - ChatLive.
                </h1>
            </div>

            <RegisterForm navigate={navigate} />

            <div className='hidden text-colorText text-4xl font-bold'>
                <h1>
                    WELCOME TO <br /> <span className='relative z-10 text-shadow-2xs before:absolute before:content-["SDH"] before:-z-10 before:top-2.5 before:left-2 before:w-10 before:h-10 before:text-colorTextSecondary'>SDH</span> - ChatLive.
                </h1>
            </div>
        </section>
    )
}