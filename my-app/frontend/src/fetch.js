export function fetchData(SERVER_URL, endpoint, method, paramEndPoint, body) {
    const url = `${SERVER_URL}/${endpoint}/${paramEndPoint}`
    const options = {
        credentials: 'include',
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }
    return fetch(url, options)
}

export function fetchData2(SERVER_URL, endpoint, method, paramEndPoint) {
    const url = `${SERVER_URL}/${endpoint}/${paramEndPoint}`
    const options = {
        credentials: 'include',
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    }
    return fetch(url, options)
}