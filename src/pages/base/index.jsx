import  Header from "../../Header"
import  Footer from "../../Footer"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
import './Base.css'
import Calendar from "../../components/calendar";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import Bal from "../../components/balance" 
import Mon from "../../components/months" 
import Chart from "../../components/chart"



export const Base = () => {

    let Navigate = useNavigate();
    const isAuth = JSON.parse(localStorage.getItem("auth"))?.isAuth;
    const overallTotal = localStorage.getItem("overallTotal");
    console.log(overallTotal); // This will be a string or null if not set

    //AUTHENTICATING 
    useEffect(() => {
    if (!isAuth) {
      Navigate("/", { replace: true });
    }
  }, [isAuth, Navigate]);

  if (!isAuth) return null; // Optional loading placeholder




    return (
        <div className="wholePage">
            <Header />
            <div className="between">
                <div className="bals">
                    <div className="balsRow">
                    <Bal/>
                    <Mon/>
                    </div>
                    <div className="balsRow2">
                    <Chart />
                    </div>
                </div>
                
               
                

            <Calendar />


            </div>
           
            <Footer />
        </div>
    )
}