import { useState, useContext } from "react";
import { login, UserContext, DispatchContext, signup } from "../hooks/auth";
import { useRouter } from "next/router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsLogin] = useState(false);

    const { loading, errorMessage, successMessage } = useContext(UserContext);

    const dispatch = useContext(DispatchContext);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        let payload = { email, password };
        try {
            let res = await login(dispatch, payload);

            if (!res) return;
            router.push("/dashboard");
        } catch (err) {
            console.log(err);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        let payload = { email, password };
        try {
            let res = await signup(dispatch, payload);
            if (!res) return;
            router.push("/dashboard");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="h-full flex flex-col justify-center">
            <form
                className="p-10 bg-white rounded-xl drop-shadow-lg space-y-5"
                action=""
            >
                <h1 className="text-center text-3xl">Login</h1>
                {errorMessage ? (
                    <p className="text-red-500 text-center">{errorMessage}</p>
                ) : null}
                {successMessage ? (
                    <p className="text-green-500 text-center">
                        {successMessage}
                    </p>
                ) : null}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-light" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="w-96 px-3 py-2 rounded-md border"
                        type="email"
                        placeholder="Email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-light" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="w-96 px-3 py-2 rounded-md border"
                        type="password"
                        placeholder="Password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                </div>
                {isSignup ? (
                    <button
                        className="w-full px-10 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 hover:drop-shadow-md duration-100 ease-in"
                        type="button"
                        onClick={handleSignup}
                        disabled={loading}
                    >
                        Sign Up
                    </button>
                ) : (
                    <button
                        className="w-full px-10 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 hover:drop-shadow-md duration-100 ease-in"
                        type="button"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        Sign In
                    </button>
                )}
                <p
                    className="text-center"
                    onClick={() => setIsLogin(!isSignup)}
                >
                    <a className="text-blue-600 text-sm font-light hover:underline">
                        Click here to {isSignup ? "sign in" : "sign up"}
                    </a>
                </p>
            </form>
        </div>
    );
}
