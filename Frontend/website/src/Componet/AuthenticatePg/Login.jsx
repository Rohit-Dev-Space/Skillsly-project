import { useContext, useState } from "react"
import Inputs from "../Inputs/Inputs";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axiosinstance from "../../Utilities/axiosIntance";
import { UserContext } from "../Context/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import Loader from "../../Utilities/Loader";

export default function Login({ page, setPage }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { updateUser } = useContext(UserContext);
    const [isLoader, setIsLoader] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Enter Valid Email")
            return
        }
        if (!password) {
            setError("Enter Valid Password")
            return
        }
        setError('')
        try {
            const response = await axiosinstance.post('http://localhost:5000/api/auth/login', { email, password })

            const { token } = response.data
            if (token) {
                localStorage.setItem('token', response.data.token)
                updateUser(response.data.user)
                setIsLoader(true);
                if (response.data.user.role === 'admin') {
                    setIsLoader(false)
                    navigate('/Admin')
                } else {
                    setIsLoader(false)
                    navigate('/dashboard')
                }
            } else {
                setError(response.data.message)
            }
        } catch (error) {
            setError(error.response.data.message || "Login Failed")
        }

    }

    return (

        <div className="flex flex-col items-center mt-2 gap-3 py-5">
            <div className="flex mx-auto items-start">
                <p className="font-medium text-3xl text-transparent bg-clip-text bg-[radial-gradient(circle,_#4DDCB7_0%,_#B8FB70_100%)]">Welcome Back!</p>
            </div>
            <div className="flex flex-col w-full items-center px-15">
                <form onSubmit={handleLogin} className="w-full my-4 flex items-start text-white flex-col gap-5">
                    <div className="w-full flex flex-col gap-1">
                        <label>Email :</label>
                        <Inputs type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="ex: Test@gmail.com " />
                    </div>
                    <div className="w-full flex flex-col gap-1">
                        <label>Password :</label>
                        <Inputs type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="ex: @12345 " />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="bg-[#5B9944] hover:bg-[#B8FB70] hover:text-black font-medium to-orange-500 rounded-xl px-10 cursor-pointer text-white text-lg p-2 w-full mt-5">Log In</button>
                    <div className="w-full h-auto flex flex-col justify-center mt-1">
                        <GoogleLogin
                            text="continue_with"
                            theme="filled_blue"

                            onSuccess={async (credentialResponse) => {
                                try {
                                    const res = await axiosinstance.post(
                                        "http://localhost:5000/api/auth/google-login",
                                        { credential: credentialResponse.credential }
                                    );

                                    localStorage.setItem("token", res.data.token);
                                    updateUser(res.data.user);
                                    const role = res.data.user.role;
                                    if (role === 'admin') {
                                        navigate('/admin');
                                    } else {
                                        navigate('/dashboard');
                                    }
                                } catch (err) {
                                    setError(err.response?.data?.message || "Google login failed");
                                }
                            }}
                            onError={() => setError("Google login failed")}

                        />
                    </div>

                    <p className="text-sm">Don't have an account? <span className="text-[#5B9944] underline cursor-pointer" onClick={() => setPage('signup')}>Sign Up</span></p>
                </form>
            </div>
            {isLoader && <Loader />}
        </div>

    )
} 