import Image from "next/image";
import { useState, useContext } from "react";
import { UserContext } from "../hooks/auth";
import { clientApp } from "../firebase/clientApp";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ImageUploading from "react-images-uploading";
import empty from "../public/empty.jpeg";

export default function ProductEditCard({
    title,
    sku,
    img_url,
    action,
    setIsEdit,
    _id,
}) {
    const [images, setImages] = useState([]);
    const [newTitle, setTitle] = useState(title);
    const [newSku, setSku] = useState(sku);
    const [newImg_url, setImg_url] = useState(img_url);
    const [resMessage, setResMessage] = useState("");
    const { token } = useContext(UserContext);

    const storage = getStorage(clientApp);
    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
        setResMessage("");
        setImg_url(imageList[0].data_url);
    };
    const handleSave = async () => {
        // data for submit
        const imageRef = ref(storage, `${newSku}-cover.jpg`);
        let uploadedImageURL = newImg_url;
        if (images.length > 0) {
            let img = images[0];
            // store image
            await uploadBytes(imageRef, img.file).then(async (snapshot) => {
                await getDownloadURL(snapshot.ref).then((downloadURL) => {
                    console.log("File available at", downloadURL);
                    uploadedImageURL = downloadURL;
                });
            });
        }

        if (action == "ADD") {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    sku: newSku,
                    title: newTitle,
                    img_url: uploadedImageURL,
                }),
            };
            let res = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products`,
                requestOptions
            );
            if (res) {
                setResMessage("Product successfully added");
            }
            setIsEdit(false);
        } else {
            const requestOptions = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    sku: newSku,
                    title: newTitle,
                    img_url: uploadedImageURL,
                }),
            };

            let res = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products?` +
                    new URLSearchParams({
                        _id: _id,
                    }),
                requestOptions
            );
            if (res) {
                setResMessage("Product successfully updated");
            }
        }
    };
    return (
        <div className="w-full bg-white rounded-xl flex flex-row gap-2 drop-shadow-2xl bg-slate-200 p-2 m-2">
            <ImageUploading
                value={images}
                onChange={onChange}
                dataURLKey="data_url"
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                }) => (
                    // write your building UI

                    <div className="upload__image-wrapper">
                        <button
                            className="flex flex-col items-center"
                            style={isDragging ? { color: "red" } : undefined}
                            onClick={onImageUpload}
                            {...dragProps}
                        >
                            <Image
                                className="rounded-md hover:opacity-40 ease-in duration-100"
                                src={
                                    newImg_url == undefined ? empty : newImg_url
                                }
                                alt=""
                                width={200}
                                height={200}
                            />
                        </button>
                    </div>
                )}
            </ImageUploading>
            <div className="flex flex-col p-2 gap-2">
                <h1 className="text-xl">
                    {action == "EDIT" ? "Edit" : "Create New"} Product
                </h1>
                <label className="text-m">Title</label>
                <input
                    className="w-96 px-3 py-2 rounded-md border"
                    placeholder={newTitle}
                    value={newTitle}
                    onChange={(e) => {
                        setResMessage("");
                        setTitle(e.target.value);
                    }}
                ></input>
                <label className="text-m">SKU</label>
                <input
                    className="w-96 px-3 py-2 rounded-md border"
                    placeholder={newSku}
                    value={newSku}
                    onChange={(e) => {
                        setResMessage("");
                        setSku(e.target.value);
                    }}
                ></input>
                {resMessage == "" ? null : (
                    <p className="text-green-500">{resMessage}</p>
                )}
                <div className="flex flex-row gap-2 mt-6">
                    <button
                        className="w-auto bg-blue-600 text-sm text-white px-5 py-1 rounded-md hover:bg-blue-500 hover:drop-shadow-md duration-100 ease-in"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button
                        className="w-auto bg-slate-600 text-sm text-white px-5 py-1 rounded-md hover:bg-slate-500 hover:drop-shadow-md duration-100 ease-in"
                        onClick={() => {
                            setIsEdit(false);
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
