import ProductCard from "./ProductCard";
import ProductEditCard from "./ProductEditCard";
import { UserContext } from "../hooks/auth";

import { useState, useEffect, useContext } from "react";
export default function ProductListings() {
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [isAddItem, setIsEdit] = useState(false);
    const { token } = useContext(UserContext);

    const getRequestOptions = (action) => {
        return {
            method: action,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
    };

    const fetchProducts = async () => {
        const requestOptions = getRequestOptions("GET");

        let res = await fetch(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products?` +
                new URLSearchParams({
                    search: searchQuery,
                }),
            requestOptions
        );
        res = await res.json();
        return res.products;
    };

    useEffect(() => {
        async function fetchInitialProducts() {
            let retrievedProducts = await fetchProducts();
            setProducts(retrievedProducts);
            console.log(retrievedProducts);
        }
        fetchInitialProducts();
    }, [isAddItem, searchQuery]);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-1/2 min-w-fit flex flex-col items-center p-5 gap-2">
                <input
                    className="w-full px-3 py-2 mb-2 rounded-md border"
                    placeholder="Search"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                ></input>
                <button
                    className="w-full text-xl bg-blue-600 text-sm text-white px-5 py-1 rounded-md hover:bg-blue-500 hover:drop-shadow-md duration-100 ease-in"
                    onClick={() => setIsEdit(true)}
                >
                    Add Item
                </button>
                {isAddItem ? (
                    <ProductEditCard
                        action="ADD"
                        setIsEdit={setIsEdit}
                    ></ProductEditCard>
                ) : null}

                {products.map((el, idx) => (
                    <ProductCard
                        key={idx}
                        {...el}
                        idx={idx}
                        setProducts={setProducts}
                        products={products}
                    ></ProductCard>
                ))}
            </div>
        </div>
    );
}
