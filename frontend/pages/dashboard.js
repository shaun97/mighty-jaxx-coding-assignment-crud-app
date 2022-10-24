import ProductListings from "../components/ProductListings";
import Layout from "../components/Layout";
import { UserContext, logout, DispatchContext } from "../hooks/auth";
import { useEffect, useContext } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
    const router = useRouter();
    const { token } = useContext(UserContext);

    const dispatch = useContext(DispatchContext);

    useEffect(() => {
        token ? null : router.push("/");
    });

    const handleLogout = async (e) => {
        await logout(dispatch);
    };
    return (
        <Layout>
            <div className="bg-neutral-900 h-20 w-full flex items-center">
                <div className="basis-11/12 p-5">
                    <h1 className="text-4xl text-white">Dashboard</h1>
                </div>
                <button
                    className="basis-1/12 h-12 m-4 bg-red-600 text-white rounded-md hover:bg-red-500 hover:drop-shadow-md duration-100 ease-in"
                    type="button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
            <ProductListings></ProductListings>
        </Layout>
    );
}
