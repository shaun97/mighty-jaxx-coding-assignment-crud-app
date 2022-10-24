import Image from "next/image";
import ProductEditCard from "./ProductEditCard";
import { useState, useContext } from "react";
import { UserContext } from "../hooks/auth";

export default function ProductCard({
    _id,
    title,
    sku,
    img_url,
    idx,
    products,
    setProducts,
}) {
    const [isEdit, setIsEdit] = useState(false);
    const { token } = useContext(UserContext);
    const handleDelete = async () => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        await fetch(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products?` +
                new URLSearchParams({
                    _id: _id,
                }),
            requestOptions
        );
        products.splice(idx, 1);
        setProducts([...products]);
    };
    return (
        <>
            {isEdit ? (
                <ProductEditCard
                    title={title}
                    sku={sku}
                    img_url={img_url}
                    _id={_id}
                    action="EDIT"
                    setIsEdit={setIsEdit}
                ></ProductEditCard>
            ) : (
                <div className="w-full bg-white rounded-xl flex flex-row gap-2 drop-shadow-2xl bg-slate-200 p-2 m-2">
                    <Image
                        className="rounded-md"
                        src={img_url}
                        alt="Picture of the author"
                        width={125}
                        height={125}
                    />
                    <div className="flex flex-col p-2">
                        <h1 className="text-xl">{title}</h1>
                        <p className="text-sm">{sku}</p>
                        <div className="flex flex-row gap-2 mt-6">
                            <button
                                className="w-auto bg-blue-600 text-sm text-white px-5 py-1 rounded-md hover:bg-blue-500 hover:drop-shadow-md duration-100 ease-in"
                                onClick={() => setIsEdit(true)}
                            >
                                Edit
                            </button>
                            <button
                                className="w-auto bg-blue-600 text-sm text-white px-5 py-1 rounded-md hover:bg-blue-500 hover:drop-shadow-md duration-100 ease-in"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
