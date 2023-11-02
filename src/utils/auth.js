import axios from "axios";
import jwt from 'jwt-decode';
import React from "react";
import { Store } from "react-notifications-component";
import { capitalize } from "@material-ui/core";
import store from "../store";
import { authActions } from "../store/auth";

const notifClass = {
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    slidingExit: {
        duration: 800,
        timingFunction: 'ease-out',
        delay: 0
    },
    dismiss: {
        duration: 10000,
        onScreen: true,
        showIcon: true,
        pauseOnHover: true
    }
}
/**
 * Exchange a username & password for an OAuth token.
 *
 * @param {string} username
 * @param {string} password
 */
export async function login(username, password) {
    try {
        const response = await axios({
            method: "post",
            url: `${process.env.REACT_APP_CRM_BASE}userBackOffice/login`,
            data: { 'email': username, 'password': password },
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            }
        })
        const data = await response?.data;
        if (data.error) {
            console.log('Error retrieving token', data);
            return Promise.reject(new Error(`Error retrieving OAuth token: ${data.error}`));
        }
        let userDatas = response?.data?.userData
        saveToken(response?.data?.token)
        return {
            first_name: userDatas?.firstname,
            last_name: userDatas?.lastname,
            user_email: userDatas?.email,
            uuid: userDatas?.uuid
        }
    } catch (err) {
        console.log('API got an error', err);
        throw new Error(`API error: ${err?.message ?? ""}`)
    }
};
/**
 * Update CRM Data
 */
export async function updateCRMData(url, post_data = {}, extraOpts = { contentType: "application/json", customSuccess: false, customError: false }) {
    const oauth_token = await token();
    var bearer = '';
    var form_data = new FormData();
    if (oauth_token) {
        post_data.bearer = `Bearer ${oauth_token.access_token}`;
        bearer = `Bearer ${oauth_token.access_token}`;
    }
    for (var key in post_data) {
        form_data.append(key, post_data[key]);
    }
    if (extraOpts?.contentType === 'multipart/form-data') {
        post_data = form_data
    }
    try {
        let res = await axios({
            method: "put",
            url: `${process.env.REACT_APP_CRM_BASE}${url}`,
            data: post_data,
            headers: {
                'Accept': '*/*',
                'Content-Type': extraOpts?.contentType,
                'Authorization': bearer
            }
        })
        if (res.status === 200) {
            successHandler(res, extraOpts?.customSuccess)
            console.log(res.status)
            return res.data
        }
    }
    catch (err) {
        errorHandler(err?.response?.data ?? err?.response?.message ?? extraOpts?.customSuccess, { type: "UPDATE" })
        throw new Error(err);
    }
}

/**
 * Set CRM Data (new object)
 */
export async function setCRMData(url, post_data = {}, content = 'application/json', options) {
    const oauth_token = await token();
    var bearer = '';
    var form_data = new FormData();
    if (oauth_token) {
        post_data.bearer = `Bearer ${oauth_token.access_token}`;
        bearer = `Bearer ${oauth_token.access_token}`;
    }
    for (var key in post_data) {
        form_data.append(key, post_data[key]);
    }
    if (content === 'multipart/form-data') {
        post_data = form_data
    }

    try {
        let res = await axios({
            method: "post",
            url: `${process.env.REACT_APP_CRM_BASE}${url}`,
            data: post_data,
            headers: {
                'Accept': '*/*',
                'Content-Type': content,
                'Authorization': bearer
            }
        })
        if (res.status === 200) {
            successHandler(res)
            console.log(res.status)
            return res.data
        }
    }
    catch (err) {
        throw err?.response;
        console.log('API got an error', err?.response);
        if (options?.handleError) {
            errorHandler(err, { type: "CREATE" })
        }
    }
}

/**
 * Delete CRM Data (new object)
 */
export async function deleteCRMData(url, id) {
    const oauth_token = await token();
    var bearer = '';
    if (oauth_token) {
        bearer = `Bearer ${oauth_token.access_token}`;
    }

    try {
        let res = await axios({
            method: "delete",
            url: `${process.env.REACT_APP_CRM_BASE}${url}/${id}`,
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': bearer
            }
        })
        if (res.status === 200) {
            Store.addNotification({
                title: "Success!",
                message: `Delete operation was successful. ${res.data}`,
                type: "success",
                ...notifClass
            });
            console.log(res.status)
            return res.data
        }
    }
    catch (err) {
        errorHandler(err, { type: "DELETE" })
        throw new Error(err);
    }
}

/**
 * Get CRM Data
 */
export async function getCRMData(url, type = undefined, extraOptions = {}) {
    const oauth_token = await token();
    var bearer = '';
    // forms post_data or just json
    if (oauth_token) {
        bearer = `Bearer ${oauth_token.access_token}`;
    }
    let configAxios = {
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': bearer
        }
    };

    try {
        if (type !== undefined) {
            configAxios.headers["Content-Type"] = type
        }
        configAxios = { ...configAxios, ...extraOptions }
        const response = await axios.get(`${process.env.REACT_APP_CRM_BASE}${url}`, configAxios);
        const responce_data = await response.data;
        return responce_data;
    } catch (err) {
        errorHandler(err)
    }
}

/**
 * Delete the stored OAuth token, effectively ending the user's session.
 */
export function logout() {
    let state = store.getState()
    localStorage.removeItem("token");
    store.dispatch(authActions.logout())
    return Promise.resolve(true);
};

function saveToken(data) {
    const tokenRaw = jwt(data) // Make a copy of data object.
    let token = {
        access_token: data,
        date: Math.floor(Date.now() / 1000),
        expires_at: Math.floor(Date.now() / 1000) + tokenRaw.exp,
        expires_in: tokenRaw.exp,
    }
    sessionStorage.setItem("token", JSON.stringify(token));
    return token;
}

function errorHandler(err, params = {}) {
    let { message = false, type = false } = params;
    let state = store.getState()
    let logged = state?.auth?.isLoggedIn
    let token = sessionStorage.getItem("token")
    if (err?.response?.status === 401 && token !== null) {
        store.dispatch(authActions.logout())
        Store.addNotification({
            title: "Attention!",
            message: "Invalid token. Your connexion was reset.",
            type: "warning",
            ...notifClass
        });
    }
    else {
        Store.addNotification({
            title: "Attention!",
            message: err ?? message,
            type: "warning",
            ...notifClass
        });
    }
    //return err;
}


function successHandler(res, customSuccess = false) {
    if (res?.status === 200) {
        let url = res?.config?.url
        let funcName = url.slice(-1) === "/" ? url.slice(0, -1).split("/").pop() : url.split("/").pop()
        funcName = capitalize(funcName.replace(/([A-Z])/g, ' $1').trim())
        let dataType = funcName.split(" ").pop()
        Store.addNotification({
            title: "Success!",
            message: customSuccess ? customSuccess : res?.data?.message ?? `${dataType} added successfully!`,
            type: "success",
            ...notifClass
        });
    }
    else {
        Store.addNotification({
            title: "Error!",
            message: `API got an error ${res?.message}`,
            type: "danger",
            ...notifClass
        })
    }
    console.log(res)
}

/**
 * Get the current OAuth token if there is one.
 *
 * Get the OAuth token forms localStorage, and refresh it if necessary using
 * the included refresh_token.
 *
 * @returns {Promise}
 *   Returns a Promise that resolves to the current token, or false.
 */
async function token() {
    const token = sessionStorage.getItem("token") !== null
        ? JSON.parse(sessionStorage.getItem("token"))
        : false;

    if (!token) {
        return Promise.reject(false);
    }

    const { expires_at, refresh_token } = token;
    if (expires_at < Date.now() / 1000) {
        return Promise.reject(false);
    }
    return Promise.resolve(token);
};

/**
 * Check if the current user is logged in or not.
 *
 * @returns {Promise}
 */
export async function isLoggedIn() {
    const oauth_token = await token();
    if (oauth_token) {
        return Promise.resolve(true);
    }
    return Promise.reject(false);
}