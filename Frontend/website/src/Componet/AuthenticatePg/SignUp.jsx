import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Inputs from "../Inputs/Inputs";
import { AnimatePresence, motion } from "framer-motion";
import axiosinstance from "../../Utilities/axiosIntance";
import ProfilePicSelector from "../ProfilePicSelector";
import { UserContext } from "../Context/UserContext";
import { uploadProfilePic } from "../Inputs/UploadToSupabase";

export default function SignUp({ page, setPage }) {
    const [name, setName] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [profilePic, setProfilePic] = useState(null)
    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!name) {
            setError('Enter your name')
            return
        }
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
            const profileImgUrl = await uploadProfilePic(profilePic, email);
            console.log("Profile Image URL:", profileImgUrl);

            const response = await axiosinstance.post('/api/auth/register-initial', { name, email, password, profileImageUrl: profileImgUrl, userName });
            const { token } = response.data
            if (token) {
                localStorage.setItem('token', response.data.token)
                console.log(response.data);
                updateUser(response.data);
                navigate('/Sign-up-info')
            } else {
                setError(response.data.message)
            }
        } catch (err) {
            setError(err.response.data.message || "Sign Up Failed")
        }
    }
    return (

        <div className="flex flex-col items-center gap-3 py-5">
            <div className="flex flex-col w-full items-center px-15">
                <form onSubmit={handleSignUp} className="w-full flex flex-col items-center text-white gap-7 ">
                    <ProfilePicSelector image={profilePic} setImage={setProfilePic} />
                    <div className="w-full h-auto flex gap-10">
                        <div className="w-fit flex flex-col gap-5">
                            <div className="w-full flex flex-col gap-1">
                                <label>Name :</label>
                                <Inputs type="text" value={name} onChange={(e) => { setName(e.target.value) }} placeholder="Enter your Name" />
                            </div>
                            <div className="w-full flex flex-col gap-1">
                                <label>Enter User Name :</label>
                                <Inputs type="text" value={userName} onChange={(e) => { setUserName(e.target.value) }} placeholder="Enter User Name" />
                            </div>
                        </div>
                        <div className="w-fit flex flex-col gap-5">
                            <div className="w-full flex flex-col gap-1">
                                <label>Enter your Email :</label>
                                <Inputs type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="ex: Test@gmail.com " />
                            </div>
                            <div className="w-full flex flex-col gap-1">
                                <label>Enter Your Password :</label>
                                <Inputs type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="ex: @12345 " />
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" className="bg-[#5B9944] hover:bg-[#B8FB70] text-white hover:text-black font-medium to-orange-500 rounded-xl px-10 cursor-pointer text-lg p-2 w-full mt-5" >Sign In</button>
                        <p className="text-sm">Already have an account? <span className="text-[#5B9944] underline cursor-pointer" onClick={() => setPage('login')}>Log in</span></p>
                    </div>

                </form>
            </div>

        </div>

    )
} 