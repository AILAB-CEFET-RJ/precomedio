const basicUrl = "http://127.0.0.1:8000/"
export const PostUsersLogin = async (username, password) => {
    try {
        const response = await fetch(basicUrl + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: username,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
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