import { useState, createContext, useReducer } from "react";

export const UserContext = createContext();
export const DispatchContext = createContext();

let email = "";
let token = "";

if (typeof window !== "undefined") {
    // Perform localStorage action
    email = localStorage.getItem("currentUser")
        ? JSON.parse(localStorage.getItem("currentUser")).email
        : "";

    token = localStorage.getItem("currentUser")
        ? JSON.parse(localStorage.getItem("currentUser")).token
        : "";
}
const initialState = {
    email: "" || email,
    token: "" || token,
    loading: false,
    errorMessage: null,
    successMessage: null,
};

export const AuthReducer = (initialState, action) => {
    switch (action.type) {
        case "REQUEST_LOGIN":
            return {
                ...initialState,
                loading: true,
            };
        case "LOGIN_SUCCESS":
            return {
                ...initialState,
                email: action.payload.email,
                token: action.payload.token,
                errorMessage: null,
                successMessage: action.successMessage,
                loading: false,
            };
        case "LOGOUT":
            return {
                ...initialState,
                user: "",
                token: "",
            };
        case "LOGIN_ERROR":
            return {
                email: "" || email,
                token: "" || token,
                loading: false,
                errorMessage: null,
                successMessage: null,
            };
    }
};

export const login = async (dispatch, loginPayload) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    };

    try {
        dispatch({ type: "REQUEST_LOGIN" });

        let response = await fetch(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login?` +
                new URLSearchParams({
                    email: loginPayload.email,
                    password: loginPayload.password,
                }),
            requestOptions
        );
        let data = await response.json();

        if (data.token) {
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: data,
                successMessage: "Login Successful",
            });
            localStorage.setItem("currentUser", JSON.stringify(data));
            return data;
        }

        dispatch({ type: "LOGIN_ERROR", error: data.message });
        return;
    } catch (err) {
        dispatch({ type: "LOGIN_ERROR", error: err });
    }
};

export const signup = async (dispatch, signpPayload) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    };

    try {
        dispatch({ type: "REQUEST_LOGIN" });

        let response = await fetch(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/create?` +
                new URLSearchParams({
                    email: signpPayload.email,
                    password: signpPayload.password,
                }),
            requestOptions
        );
        let data = await response.json();

        if (data.token) {
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: data,
                successMessage: "Sign Up Successful",
            });
            localStorage.setItem("currentUser", JSON.stringify(data));
            return data;
        }

        dispatch({ type: "LOGIN_ERROR", error: "Username Taken" });
        return;
    } catch (err) {
        dispatch({ type: "LOGIN_ERROR", error: err });
    }
};

export const logout = (dispatch) => {
    dispatch({ type: "LOGOUT" });
    // remove from local storage
};

export const UserProvider = ({ children }) => {
    const [user, dispatch] = useReducer(AuthReducer, initialState);

    return (
        <UserContext.Provider value={user}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </UserContext.Provider>
    );
};
