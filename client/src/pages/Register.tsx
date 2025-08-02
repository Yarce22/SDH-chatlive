import { useNavigate } from 'react-router';
import { RegisterForm } from '../components/RegisterForm';
import { useEffect } from 'react';

export default function Register() {
    const navigate = useNavigate()

    useEffect(() => {
        if (document.cookie.length > 0) {
            navigate("/")
        }
    }, [navigate])

    return (
        <section>
            {/* <div>
                <img src="" alt="" />
            </div> */}

            <RegisterForm navigate={navigate} />

            <div>
                <h1>Welcome to SDH ChatLive.</h1>
            </div>
        </section>
    )
}