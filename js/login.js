let account = document.querySelector("#login input[name='login-account']")
let password = document.querySelector("#login input[name='login-password']")
let hasLogin = localStorage.getItem("eop-buster_login")

document.querySelector(".my-user p").innerText = localStorage.getItem("eop-buster_account")

if (hasLogin) {
    document.querySelector("#login").style.display = "none"
    document.querySelector("#order").style.display = "block"
}
else {
    document.querySelector("#login").style.display = "flex"
    document.querySelector("#order").style.display = "none"
}


function showErrorLoginToast() {
    toast({
        title: "Đăng nhập thất bại!",
        message: "Sai tài khoản hoặc mật khẩu. Vui lòng thử lại.",
        type: "error",
        duration: 5000,
    });
}

document.querySelector("#login button").onclick = function () {
    if (account.value.trim() == "admin" && password.value.trim() == "1234") {
        localStorage.setItem("eop-buster_admin_account", "true");
        window.location = location.href.replace("order", "manage")
    }
    else if (account.value.trim() !== "" && password.value.trim() !== "") {
        fetch('https://65e85faa4bb72f0a9c4f1974.mockapi.io/accounts')
            .then(response => {
                return response.json();
            })
            .then(data => {
                let index;
                let checkIDStudent = data.find((e, i) => {
                    index = i;
                    return e.masv == account.value.trim();
                });
                let checkPassword = data.find((e) => {
                    return e.password == password.value.trim();
                });
                if (checkIDStudent && checkPassword) {
                    localStorage.setItem("eop-buster_login", "true")
                    localStorage.setItem("eop-buster_account", data[index].name);
                    localStorage.setItem("eop-buster_masv", data[index].masv);
                    localStorage.setItem("eop-bustere_email", data[index].email);
                    document.querySelector("#login").style.display = "none"
                    document.querySelector("#order").style.display = "block"
                    document.querySelector(".my-user p").innerText = localStorage.getItem("eop-buster_account")
                } else {
                    showErrorLoginToast();
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
    if (account.value.trim() === "") {
        account.style.borderColor = '#dc354667'
        account.style.backgroundColor = '#dc35461f'
    }
    else {
        account.style.borderColor = "#d3d3d3"
        account.style.backgroundColor = "#fff"

    }
    if (password.value.trim() === "") {
        password.style.borderColor = '#dc354667'
        password.style.backgroundColor = '#dc35461f'
    }
    else {
        password.style.borderColor = "#d3d3d3"
        password.style.backgroundColor = "#fff"

    }
}

document.querySelector(".setting .my-order").onclick = function(){
    window.location = location.href.replace("order", "my-order")
}

document.querySelector(".setting .user-info").onclick = function(){
    window.location = location.href.replace("order", "my-user")
}

document.querySelectorAll(".log-out").forEach(e => {
    e.onclick = function () {
        localStorage.removeItem("eop-buster_login");
        localStorage.removeItem("eop-buster_account");
        localStorage.removeItem("eop-buster_masv");
        localStorage.removeItem("eop-buster_admin_account");
        location.reload();
    }
});