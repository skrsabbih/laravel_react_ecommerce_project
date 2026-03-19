import { useContext } from "react"
import { CustomerAuthContext } from "../context/CustomerAuth"
import { Navigate } from "react-router-dom";

export const CustomerRequireAuth = ({ children }) => {
    const { user } = useContext(CustomerAuthContext);
    return user ? children : <Navigate to="/account/login" />
}