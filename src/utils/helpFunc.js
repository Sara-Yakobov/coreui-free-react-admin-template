import parsePhoneNumber from 'libphonenumber-js';
import currencies from "currencies.json";
import {format} from "date-fns";
import {enUS, fr, he} from 'date-fns/locale';
import Geocode from "react-geocode";
import {Store} from "react-notifications-component";
import Resizer from "react-image-file-resizer";
import store from "../store";
import {dialogueActions} from "../store/dialogue";
import React from "react";

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
        duration: 2000,
        onScreen: true,
        showIcon: true,
        pauseOnHover: true
    }
}
const config = {
    // Base URL of your Drupal site.
    g_api_key: process.env.REACT_APP_MAPS_KEY,
};

export function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
}

export function capitalize(string) {
    try {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } catch (e) {
        return ""
    }
}

export function diffStrings(s, t) {
    // Determine the Damerau-Levenshtein distance between s and t
    if (!s || !t) {
        return 99;
    }
    var m = s.length;
    var n = t.length;
    var charDictionary = new Object();

    /* For all i and j, d[i][j] holds the Damerau-Levenshtein distance
     * between the first i characters of s and the first j characters of t.
     * Note that the array has (m+1)x(n+1) values.
     */
    var d = new Array();
    for (var i = 0; i <= m; i++) {
        d[i] = new Array();
        d[i][0] = i;
    }
    for (var j = 0; j <= n; j++) {
        d[0][j] = j;
    }

    // Populate a dictionary with the alphabet of the two strings
    for (var i = 0; i < m; i++) {
        charDictionary[s.charAt(i)] = 0;
    }
    for (var j = 0; j < n; j++) {
        charDictionary[t.charAt(j)] = 0;
    }

    // Determine substring distances
    for (var i = 1; i <= m; i++) {
        var db = 0;
        for (var j = 1; j <= n; j++) {
            var i1 = charDictionary[t.charAt(j - 1)];
            var j1 = db;
            var cost = 0;

            if (s.charAt(i - 1) == t.charAt(j - 1)) { // Subtract one to start at strings' index zero instead of index one
                db = j;
            } else {
                cost = 1;
            }
            d[i][j] = Math.min(d[i][j - 1] + 1,                 // insertion
                Math.min(d[i - 1][j] + 1,        // deletion
                    d[i - 1][j - 1] + cost)); // substitution
            if (i1 > 0 && j1 > 0) {
                d[i][j] = Math.min(d[i][j], d[i1 - 1][j1 - 1] + (i - i1 - 1) + (j - j1 - 1) + 1); //transposition
            }
        }
        charDictionary[s.charAt(i - 1)] = i;
    }

    // Return the strings' distance
    return d[m][n];
}

export function getCountryFromPhone(phone, ext_id = undefined) {
    if (undefined !== ext_id && phone[0] === "0") {
        console.log(ext_id);
        const regionInFrench = new Intl.DisplayNames(['fr'], {type: 'region'});
        let country = 'Undefined';
        if ("+" != ext_id[0]) {
            ext_id = "+" + ext_id
        }
        let phone_parse = parsePhoneNumber(ext_id);
        let country_img_prefix = 'FR';
        if (phone_parse && undefined !== phone_parse.country) {
            country = regionInFrench.of(phone_parse.country);
            country_img_prefix = phone_parse.country;
        }
        return ({country: country, prefix: country_img_prefix});
    }
    const regionInFrench = new Intl.DisplayNames(['fr'], {type: 'region'});
    let country = 'Undefined';
    if ("+" != phone[0]) {
        phone = "+" + phone
    }
    let phone_parse = parsePhoneNumber(phone);
    let country_img_prefix = 'FR';
    if (phone_parse && undefined !== phone_parse.country) {
        country = regionInFrench.of(phone_parse.country);
        country_img_prefix = phone_parse.country;
    }
    return ({country: country, prefix: country_img_prefix});

}

const secToFormatted = (sec) => {
    var sec_num = parseInt(sec, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}

const audioToBase64 = async (audioFile) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onerror = reject;
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(audioFile);
    }).then(
        (response) => {
            return response;
        }
    )
}

export function hasNumber(myString) {
    return /\d/.test(myString);
}

/*export async function clickToCall(dest, domain = "pbx1", username = "admin", password = "B#QI*(Q38cch928qh2q309dfw") {
    let url = "https://" + domain + ".cool-telecom.com/app/click_to_call/click_to_call.php?src_cid_name=WebDialer&src_cid_number=" + dest + "&dest_cid_name=&dest_cid_number=&src=110&dest=+33140765555&auto_answer=false&rec=false&ringback=fr-ring&username=" + username + "&password=" + password
    const response = await fetch(url).then()
    try{
        console.log(response)
    }catch (e) {
        console.log(e)
    }
}*/
export function dateIsGreater(d1, d2) {
    const date1 = new Date(d1);
    const date2 = new Date(d2);

    if (date1 > date2) {
        return false;
    } else {
        return true;
    }
}

export function padTo2Digits(num) {
    return String(num).padStart(2, '0');
}


export function getFullDate(date, hour = false, seconds = false, letterForm = false) {
    let currDate = "";
    currDate = new Date(date);
    if (!(currDate instanceof Date && !isNaN(currDate.valueOf()))) {
        return ""
    }
    let hourRegex = " HH:mm";
    if (seconds) {
        hourRegex = " HH:mm:ss";
    }
    let dateRegex = "dd-MM-yyyy";
    let res = format(currDate, "dd-MM-yyyy HH:mm:ss");
    if (letterForm) {
        dateRegex = "dd LLLL yyyy"
    }
    if (hour) {
        dateRegex += hourRegex
    }
    res = format(currDate, dateRegex, {locale: enUS});
    console.log(res)
    return res
}

export function indexToSymbol(index) {
    if (index !== "") {
        let currencyList = currencies.currencies;
        return Object.values(currencyList)[index].symbolNative
    } else {
        return ""
    }
}

export function indexToCode(index) {
    if (index !== "") {
        let currencyList = currencies.currencies;
        if (Object.values(currencyList)[index] !== undefined) {
            return Object.values(currencyList)[index].code
        }
    } else {
        return ""
    }
}

export async function converter(codeFrom, codeTo, amount = undefined) {
    let requestURL = 'https://api.exchangerate.host/latest?base=' + codeFrom;
    if (amount) {
        let response = await fetch(requestURL + "&amount=" + amount);
        response = await response.json();
        return response.rates[codeTo]
    } else {
        let response = await fetch(requestURL);
        response = await response.json();
        return response.rates[codeTo]
    }
}

export function arrayToObject(array = [], refKey, orderBy = undefined) {
    let result = {};
    Object.values(array).forEach(x => {
        if (refKey in x) {
            let element = {...x}
            let key = element[refKey]
            delete element[refKey]
            result[key] = element
        }
    })
    return result
}

export function customerCompactor(customer) {
    let result = {...customer}
    let fields = {}
    Object.values(customer.customFields).forEach(field => {
        let value = field.customerCustomFieldValue.customFieldValue
        if ("customFieldOptions" in field && field.customFieldOptions.length > 0) {
            let options = arrayToObject(field.customFieldOptions, "id");
            fields[field.system_name] = options[parseInt(value)]?.option
        } else {
            fields[field.system_name] = value
        }
    })
    result.customerType = result.customerType.id
    delete result.customFields
    delete result.user
    result = {...result, ...fields}
    return result
}

export function getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000 - 20;
    return (yiq >= 128) ? 'black' : 'white';
}

const coordinateFromAddress = async (address, res) => {
    Geocode.setApiKey(config.g_api_key);
    Geocode.setLanguage("en");
    Geocode.enableDebug();
    await Geocode.fromAddress(address).then(
        (response) => {
            const {lat, lng} = response.results[0].geometry.location;
            console.log(lat, lng);
            res({lat: lat, lng: lng})
        },
        (error) => {
            console.error(error);
        }
    );
}

const convertTime12to24 = time12h => {
    const [time, modifier] = time12h.split(" ");

    let [hours, minutes] = time.split(":");

    if (hours === "12") {
        hours = "00";
    }

    if (modifier === "PM") {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
};

export function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
}

const resizeFile = (file, maxHeight = 150, maxWidth = 150) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            maxWidth,
            maxHeight,
            "png",
            100,
            0,
            (uri) => {
                resolve(uri);
            },
            "file"
        );
    });

export function setAlert({title, text, type = "info", html = false}) {
    Store.addNotification({
        title: capitalize(title),
        message: html ? <span dangerouslySetInnerHTML={{__html: text}}/> : text,
        type: type,
        ...notifClass
    });
}

export function openDialogue({message = ''}) {
    return new Promise((resolve) => {
        store.dispatch(
            dialogueActions.showDialogue({
                message: message,
                callback: (confirmed) => {
                    if (confirmed !== undefined) {
                        if (confirmed) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
                },
            })
        );
    });
}

export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}