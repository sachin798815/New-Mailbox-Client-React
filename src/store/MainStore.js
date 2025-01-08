import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthStore";
import mailStoreReducer from "./MailStore";

const MainStore=configureStore({
    reducer:{
        auth:authReducer,
        mailStore:mailStoreReducer
    }
})

export default MainStore;