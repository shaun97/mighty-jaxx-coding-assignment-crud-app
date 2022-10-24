import "../styles/globals.css";
import { UserProvider } from "../hooks/auth";

function MyApp({ Component, pageProps }) {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
}

export default MyApp;
