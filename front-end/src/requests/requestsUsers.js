const basicUrl = "http://127.0.0.1:8000/"
export const PostUsersLogin = async (username, password) => {
    let token = false;
    const url1 = basicUrl + "login";
    const funcPostUsersLogin = async () => {
        const login1 = {
            username,
            password
        }
        console.log(login1)
        token = await fetch(url1, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(login1),

        }).then(response => response.json())
            .then(data => data)
            .catch(error => error)
        return token
    }

    token = await funcPostUsersLogin();
    return token
}
export const PostUsers = async (username, password, email) => {
    let token = false;
    const url = basicUrl + "signup";
    const funcPostUsers = async () => {
        const user1 = {
            username,
            password,
            email
        }
        token = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user1),

        }).then(data => data.json()).catch(error => error)
        return token
    }

    token = await funcPostUsers();
    return token
}