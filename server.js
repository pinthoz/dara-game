const SERVER = "http://twserver.alunos.dcc.fc.up.pt:8008/";

async function registerClient(username, password) {
    let url = SERVER + "register";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ nick: username, password: password }),
        });

        if (response.ok) {
            const json = await response.json();
            return !("error" in json);
        }
    } catch (error) {
        return false;
    }
}

async function clickRegister() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let canRegister = await registerClient(username, password);

    if (canRegister) {
        console.log("Registration successful");
        return true;
    } else {
        console.log("Registration failed");
        return false;
    }
}

async function join(group, nick, password, size) {
    try {
        // Check for missing or invalid arguments
        if (!group || !nick || !password || !size) {
            throw new Error("Missing or invalid arguments.");
        }

        console.log("Here!!");
        // Send a request to join the game
        const response = await fetch(`${SERVER}join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                group: group,
                nick: nick,
                password: password,
                size: size,
            }),
        });
        console.log(response);

        if (response.ok) {
            const json = await response.json();
            // Handle the result as needed
            console.log("Join request successful:", json);
        } else {
            throw new Error("Failed to join the game.");
        }
    } catch (error) {
        console.error("Error in join function:", error.message);
    }
}



document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-button").addEventListener("click", clickRegister);
});
