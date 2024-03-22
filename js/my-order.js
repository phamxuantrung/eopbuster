if (!localStorage.getItem("eop-buster_login")) {
    window.location = location.href.replace("my-order", "order")
}

const myorder = document.querySelector(".my-order")
document.querySelector(".my-user p").innerText = localStorage.getItem("eop-buster_account")
document.querySelector(".loading").style.display = "flex"
fetch("https://65e85faa4bb72f0a9c4f1974.mockapi.io/orders")
    .then(res => res.json())
    .then(data => {
        document.querySelector(".loading").style.display = "none"
        let listItems = data.filter(e => {
            if (e.masv === localStorage.getItem("eop-buster_masv")) return e;
        })
        if(listItems.length === 0){
            document.querySelector(".empty").style.display = "flex"
            return;
        }
        listItems.sort(function (a, b) {
            return Number(b.id) - Number(a.id);
        });
        let htmlTemplateItemMyOrder = listItems.map(item => {
            return `
                <div class="item ${(item.status === "Từ chối nhận") ? "order-cancel" : ""}">
                    <div class="title">
                        <div style="display: flex;">
                            <p style="align-item: center; line-height: 30px;">${item.madon}</p>
                            <div class="tag-status ${(item['status-pay'] === "waiting") ? 'waiting' : ''} ${(item['status-pay'] === "payied") ? "payied" : ""}">${(item['status-pay'] === "waiting") ? "Chờ thanh toán" : ""}${(item['status-pay'] === "payied") ? "Đã thanh toán" : ""}</div>
                        </div>
                        <div style="display: flex;">
                            <div class="${(item.supporter !== "") ? 'supporter active' : 'supporter'}">${item.supporter} là người hỗ trợ bạn</div>
                            <div class="status">${(item.status !== "") ? (item.status) : "Chờ xác nhận"}</div>
                        </div>
                    </div>
                    <div class="info">
                        <img src="./images/unit.png" alt="">
                        <div class="info-product">
                            <p>${item.product}</p>
                            <div class="deadline">Thanh toán khi hoàn thành</div>
                        </div>
                        <button onclick="Cancel('${item.id}')" class="cancel-order ${(item.status === "") ? 'active' : ''}">Hủy</button>
                    </div>
                    <div class="total-pay ${(item.status === "Từ chối nhận")?"hidden":""}">
                        <div class="${(item.supporter !== "") ? 'supporter-mobile active' : 'supporter-mobile'}">${item.supporter} là người hỗ trợ bạn</div>
                        <div>Thành tiền: <span>${item.pay}</span></div>
                    </div>
                    <div class="footer ${(item['status-pay'] === "payied" || item.status === "Từ chối nhận") ? 'hidden' : ''}">
                        <p>Đơn hàng sẽ được hoàn thành trước ${item.deadline}</p>
                        <div style="display: flex;">
                            <a style="text-decoration: none;" href="${(item.supporter === "Trung")?"https://www.facebook.com/profile.php?id=100023143774485":""}${(item.supporter === "Tùng")?"https://www.facebook.com/profile.php?id=100047562911895":""}${(item.supporter === "Thành")?"https://www.facebook.com/profile.php?id=100030996483715":""}${(item.supporter === "Cường")?"":""}">
                                <div class="contact-button">Liên hệ người làm</div>
                            </a>
                            <div onclick="Paying('${item.madon}')" class="pay-button">Thanh toán</div>
                        </div>
                    </div>
                </div>`
        }).join("");
        myorder.innerHTML = htmlTemplateItemMyOrder;
    })


function Paying(madon) {
    document.querySelector(".my-order-control").style.display = "none"
    window.location = location.href.replace("my-order", "pay") + `${(!location.href.includes("?madon=")) ? `?madon=${madon}` : ""}`
}

function Cancel(id) {
    const endpointURL = `https://65e85faa4bb72f0a9c4f1974.mockapi.io/orders/${id}`;

    if(!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
    fetch(endpointURL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json', // Kiểu dữ liệu bạn gửi đi
            // Các header khác nếu cần
        },
    })
        .then(() => {
            location.reload();
        })
        .catch(() => {
            showErrorCancel();
        });

}

function showErrorCancel() {
    toast({
        title: "Lỗi!",
        message: "Không thể hủy đơn hàng. Vui lòng thử lại sau.",
        type: "error",
        duration: 5000,
    });
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

document.querySelector(".user-info").onclick = function(){
    window.location = location.href.replace("my-order", "my-user")
}

document.querySelector("nav .my-user").onclick = function(){
    this.querySelector(".setting").classList.toggle("active")
}
