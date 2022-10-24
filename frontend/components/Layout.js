export default function Layout({ children }) {
    return (
        <div className=" w-screen h-screen flex flex-col items-center bg-gradient-to-b from-blue-900 to-indigo-700">
            {children}
        </div>
    );
}
