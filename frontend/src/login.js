import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

export const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const token = sessionStorage.getItem("token");

    const handleClick = () => {
        const opts = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
            body: JSON.stringify({
                email: email,
                password: password
            })
        };
    }

    fetch('HTTPS!!', opts)
        .then(resp => {
            if(resp.status == 200) return resp.json();
            else alert("There has been some error");
        })
        .then(data => {
            console.log("this came from the backend", data)
            sessionStorage.setItem("token", data.access_token)
        })
        .catch(error => {
            console.error("ERROR", error);
        })

    return {
/*        <div className="text-center mt-5">
            <h1>Login</h1>
            {token && token !="" && token != undefined ? {
                "You are loggedd with this token" + token
            } : {
                <div>
                    {(sessionStorage.getItem("token"))}
                    <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button onClick>Login</button>
                </div>
        </div>
    };
}; */