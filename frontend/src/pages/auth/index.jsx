import { auth, provider } from "../../config/firebase-config"
import { signInWithPopup } from "firebase/auth"
import {useNavigate} from "react-router-dom"
import { useEffect } from "react";
import './authh.css'

export const Auth = () => {

    const navigate = useNavigate();

      // ✅ Check if user is already authenticated
  useEffect(() => {
    const authInfo = JSON.parse(localStorage.getItem("auth"));
    if (authInfo?.isAuth) {
      navigate("/base");
    }
  }, [navigate]);


    const SignInWithGoogle = async () => {

        const results = await signInWithPopup(auth, provider);
        console.log(results);

        const authInfo = {
            userID : results.user.uid,
            name : results.user.displayName,
            profilePhoto : results.user.photoURL,
            isAuth : true
        }
        localStorage.setItem("auth", JSON.stringify(authInfo))
        navigate("/base")
    }

    return (
        <div className="login-page">
            <div className="login-box">
            <div className="q"><h1>Please Sign in to <br/>Proceed</h1></div>
            <div className="r">
            <button className="Sign-in-with-google" onClick={SignInWithGoogle}>{" "}Sign in with Google</button>
            <button className="Sign-in-with-email" onClick={console.log("clicked email sign in")}>{" "}Sign in with Email</button>
            </div>
            </div>
        </div>
    );
};