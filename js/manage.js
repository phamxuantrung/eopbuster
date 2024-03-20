const order = document.querySelector(".order")
let data_render, data_main = []

if (!localStorage.getItem("eop-buster_admin_account")) {
    window.location = location.href.replace("manage", "order")
}

function copy(tag) {
    let attributeValue = tag.getAttribute("data-custom");
    let textarea = document.createElement("textarea");
    textarea.value = attributeValue;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// ------- Filter Start -------

let filterItems = [
    {
        name: "Trạng thái",
        icon: '<i class="fa-solid fa-signal"></i>',
        childs: ["Chờ xác nhận", "Đang làm", "Chờ thanh toán", "Hoàn thành", "Đã thanh toán", "Từ chối nhận"],
    },
    {
        name: "Người hỗ trợ",
        icon: '<i class="fa-regular fa-user"></i>',
        childs: ["Trung", "Thành", "Tùng", "Cường"]
    }
]

function Filter(parent, text) {
    if (text === "Đã thanh toán") text = "payied";
    if (text === "Chờ thanh toán") text = "waiting";

    if (parent === "Người hỗ trợ") data_render = data_render.filter(data => {
        return data.supporter === text;
    })
    else if (parent === "Trạng thái") {
        if (text === "Chờ xác nhận") data_render = data_render.filter(data => {
            return data.status === "";
        })
        else data_render = data_render.filter(data => {
            return data.status === text || data['status-pay'] === text
        });
    }
}

document.querySelector(".add-filter").onclick = function () {
    this.querySelector(".filter").classList.toggle("active")
}

function renderItemFilter() {
    document.querySelector(".filter").innerHTML = filterItems.map(filterItem => {
        return `
                <div class="item">
                    <div style="display: flex; align-items: center;">
                        ${filterItem.icon}
                        <p style="margin-left: 12px;">${filterItem.name}</p>
                    </div>
                    <i class="fa-solid fa-angle-right"></i>
                </div>
                `
    }).join("");

    document.querySelectorAll(".filter .item").forEach((item, i) => {
        item.onclick = function (e) {
            e.stopPropagation();
            document.querySelector(".filter").innerHTML = `<div class="title-back"><i class="fa-solid fa-angle-left"></i><p>${filterItems[i].name}</p></div>` + filterItems[i].childs.map(child => {
                return `<div parent="${filterItems[i].name}" onclick="ClickItemFinal(this)" class="item-c2">${child}</div>`
            }).join("")
            document.querySelector(".title-back").onclick = function (e) {
                e.stopPropagation();
                renderItemFilter()
            }
        }
    })
}

renderItemFilter()


let filter_tags = JSON.parse(localStorage.getItem("eop-buster_filter_tags")) || [];
document.querySelector(".option section").insertAdjacentHTML('beforebegin', filter_tags.map(tag => {
    return `
    <div class="filter-active" tag="${tag.parent}">
        ${(tag.parent === "Trạng thái") ? '<i class="fa-solid fa-signal"></i>' : '<i class="fa-regular fa-user"></i>'}
        <p>${tag.text}</p>
        <i class="fa-solid fa-xmark"></i>
    </div>
    `
}).join(""))

function RemoveTag() {
    document.querySelectorAll(".option i.fa-xmark").forEach((e, i) => {
        e.onclick = function () {
            tag_remove = filter_tags.splice(i, 1);
            localStorage.setItem("eop-buster_filter_tags", JSON.stringify(filter_tags))
            document.querySelector(`.filter-active[tag="${tag_remove[0].parent}"]`).remove();
            data_render = data_main;
            Filter(filter_tags[0]?.parent, filter_tags[0]?.text);
            Filter(filter_tags[1]?.parent, filter_tags[1]?.text);
            Sort(localStorage.getItem("eop-buster_sort_by") || "time", localStorage.getItem("eop-buster_sort_ord") || "asc")
            render(data_render);
        }
    })
}

RemoveTag()

function ClickItemFinal(e) {
    renderItemFilter()
    let new_tag = {
        parent: e.getAttribute("parent"),
        text: e.innerText
    }
    let exist = filter_tags.find(e => {
        return (e.parent === new_tag.parent && e.text === new_tag.text)
    })
    if (exist) return;

    let tagExixt = filter_tags.find(e => {
        return (e.parent === new_tag.parent)
    })
    if (tagExixt) {
        document.querySelector(`.filter-active[tag="${tagExixt.parent}"]`).remove();
        filter_tags = filter_tags.filter(e => {
            return e.parent !== tagExixt.parent;
        })
    }

    document.querySelector(".option section").insertAdjacentHTML('beforebegin', `
        <div class="filter-active" tag="${e.getAttribute("parent")}">
            ${(e.getAttribute("parent") === "Trạng thái") ? '<i class="fa-solid fa-signal"></i>' : '<i class="fa-regular fa-user"></i>'}
            <p>${e.innerText}</p>
            <i class="fa-solid fa-xmark"></i>
        </div>
    `)
    RemoveTag()
    filter_tags.push(new_tag)
    localStorage.setItem("eop-buster_filter_tags", JSON.stringify(filter_tags))
    Filter(filter_tags[0]?.parent, filter_tags[0]?.text);
    Filter(filter_tags[1]?.parent, filter_tags[1]?.text);
    render(data_render);
}

// ------- Filter End -------


// ------- Sort Start -------

function Sort(by, ord) {
    if (by === "time") data_render.sort(function (a, b) {
        // Chuyển đổi các chuỗi thời gian thành các đối tượng Date để so sánh
        var dateA = new Date(a.time);
        var dateB = new Date(b.time);

        // Sử dụng phép so sánh thông thường, nhưng đảo ngược kết quả để sắp xếp giảm dần
        if (dateA < dateB) {
            if (ord === "asc") return -1;
            else return 1;
        }
        if (dateA > dateB) {
            if (ord === "asc") return 1;
            else return -1;
        }
        return 0;
    });
    else if (by === "name") data_render.sort(function (a, b) {
        let nameA = a.name.toUpperCase(); // Chuyển tên thành chữ hoa để sắp xếp không phân biệt hoa thường
        let nameB = b.name.toUpperCase(); // Chuyển tên thành chữ hoa để sắp xếp không phân biệt hoa thường
        if (nameA < nameB) {
            if (ord === "asc") return -1;
            else return 1;
        }
        if (nameA > nameB) {
            if (ord === "asc") return 1;
            else return -1;
        }
        return 0; // Trả về 0 nếu nameA bằng nameB
    });
    else if (by === "deadline") data_render.sort(function (a, b) {
        // Chuyển đổi các chuỗi ngày thành các đối tượng Date để so sánh
        var dateA = new Date(a.deadline.split('/').reverse().join('/')); // Chuyển đổi thành dạng yyyy/mm/dd
        var dateB = new Date(b.deadline.split('/').reverse().join('/')); // Chuyển đổi thành dạng yyyy/mm/dd

        // Sử dụng phép so sánh thông thường
        if (dateA < dateB) {
            if (ord === "asc") return -1;
            else return 1;
        }
        if (dateA > dateB) {
            if (ord === "asc") return 1;
            else return -1;
        }
        return 0;
    });
    else if (by === "price") data_render.sort(function (a, b) {
        // Chuyển đổi các chuỗi giá tiền thành dạng số để so sánh
        var priceA = parseInt(a.pay.replace('₫ ', '').replace('.', ''), 10); // Loại bỏ ký tự '₫ ' và dấu chấm và chuyển đổi thành số
        var priceB = parseInt(b.pay.replace('₫ ', '').replace('.', ''), 10); // Loại bỏ ký tự '₫ ' và dấu chấm và chuyển đổi thành số

        // Sử dụng phép so sánh thông thường
        if (priceA < priceB) {
            if (ord === "asc") return -1;
            else return 1;
        }
        if (priceA > priceB) {
            if (ord === "asc") return 1;
            else return -1;
        }
        return 0;
    });
}

document.querySelectorAll(".option .sort-item .by .item").forEach(item => {
    item.onclick = function (e) {
        e.stopPropagation();
        localStorage.setItem("eop-buster_sort_by", item.getAttribute("by"))
        document.querySelector(".by .item.active").classList.remove("active");
        item.classList.add("active")
        Sort(item.getAttribute("by"), localStorage.getItem("eop-buster_sort_ord") || "asc")
        render(data_render)
    }
})

document.querySelectorAll(".option .sort-item .ord .item").forEach(item => {
    item.onclick = function (e) {
        e.stopPropagation();
        localStorage.setItem("eop-buster_sort_ord", item.getAttribute("ord"))
        document.querySelector(".ord .item.active").classList.remove("active");
        item.classList.add("active")
        Sort(localStorage.getItem("eop-buster_sort_by") || "time", item.getAttribute("ord"))
        render(data_render)
    }
})

if (localStorage.getItem("eop-buster_sort_by")) {
    document.querySelector(".by .item.active").classList.remove("active");
    document.querySelectorAll(".option .sort-item .by .item").forEach(e => {
        if (e.getAttribute("by") === localStorage.getItem("eop-buster_sort_by")) e.classList.add("active")
    })
}

if (localStorage.getItem("eop-buster_sort_ord")) {
    document.querySelector(".ord .item.active").classList.remove("active");
    document.querySelectorAll(".option .sort-item .ord .item").forEach(e => {
        if (e.getAttribute("ord") === localStorage.getItem("eop-buster_sort_ord")) e.classList.add("active")
    })
}

document.querySelector(".sort").onclick = function () {
    document.querySelector(".sort .sort-item").classList.toggle("active")
}

// ------- Sort End -------

let sort = document.querySelector(".sort");
let filter = document.querySelector(".add-filter");
document.addEventListener('click', function (event) {
    // Kiểm tra xem sự kiện click có xảy ra bên ngoài pop-up không
    if (!sort.contains(event.target)) {
        // Đóng pop-up hoặc thực hiện hành động mong muốn khác
        document.querySelector(".sort .sort-item").classList.remove("active")
    }

    if (!filter.contains(event.target)) {
        // Đóng pop-up hoặc thực hiện hành động mong muốn khác
        document.querySelector(".add-filter .filter").classList.remove("active")
    }
});


function render(data) {
    let htmlTemplateItemOrder = data.map(item => {
        return `
            <div class="item ${(item.status === "Đang làm") ? 'doing' : ''} ${(item.status === "Hoàn thành") ? 'done' : ''} ${(item.status === "Từ chối nhận") ? 'cancel' : ''}">
                <div class="title">
                    <p>${item.name}</p>
                    <i onclick="copy(this)" data-custom="${item.masv}" class="fa-solid fa-user account"></i>
                    <i onclick="copy(this)" data-custom="${item.password}" class="fa-solid fa-lock password"></i>
                    <i onclick="copy(this)" data-custom="${item.link}" class="fa-solid fa-link link"></i>
                    <div class="tag-payied ${(item['confirm-pay'] === "ok") ? "active" : ""}">Đã thanh toán</div>
                </div>
                <div class="info">
                    <p>${item.product}</p>
                    <div>
                        <select ${(item.status === "Từ chối nhận") ? 'disabled' : ''} onchange="update(this, ${item.id}, 'status')">
                            <option value="" disabled selected>Status</option>
                            <option value="Đang làm" ${(item.status === 'Đang làm') ? 'selected' : ''}>Đang làm</option>
                            <option value="Hoàn thành" ${(item.status === 'Hoàn thành') ? 'selected' : ''}>Hoàn thành</option>
                        </select>
                        <select ${(item.status === "Từ chối nhận") ? 'disabled' : ''} onchange="update(this, ${item.id}, 'supporter')">
                            <option value="" disabled selected>Supporter</option>
                            <option value="Trung" ${(item.supporter === 'Trung') ? 'selected' : ''}>Trung</option>
                            <option value="Thành" ${(item.supporter === 'Thành') ? 'selected' : ''}>Thành</option>
                            <option value="Tùng" ${(item.supporter === 'Tùng') ? 'selected' : ''}>Tùng</option>
                            <option value="Cường" ${(item.supporter === 'Cường') ? 'selected' : ''}>Cường</option>
                        </select>
                    </div>
                    <p>${item.deadline}</p>
                    <p>${item.pay}</p>
                    <div class="option-other">
                        <i onclick="CancelOrder('${item.id}')" style="margin: 0 12px 0px 4px; cursor: pointer; ${(item.status !== "") ? "display: none" : ""}" class="fa-solid fa-ban"></i>
                        <i onclick="DeleteOrder('${item.id}')"  style="cursor: pointer" class="fa-solid fa-trash"></i>
                    </div>
                </div>
                <div class="note">
                    <p>Ghi chú: </p>
                    <input type="text" value="${item.note}">
                </div>
                <div class="comfirm-pay ${(item['noti-payied'] !== "hidden") ? "active" : ""}">
                    <p>Xác nhận đã thanh toán</p>
                    <div>
                        <button onclick="Notpay('${item.id}')">Chưa</button>
                        <button onclick="Payied('${item.id}')">Rồi</button>
                    </div>
                </div>
            </div>`
    }).join("");
    order.innerHTML = htmlTemplateItemOrder;
}

function LoadData() {
    fetch("https://65e85faa4bb72f0a9c4f1974.mockapi.io/orders")
        .then(res => res.json())
        .then(data => {
            data_render = data;
            data_main = data;
            Filter(filter_tags[0]?.parent, filter_tags[0]?.text);
            Filter(filter_tags[1]?.parent, filter_tags[1]?.text);
            Sort(localStorage.getItem("eop-buster_sort_by") || "time", localStorage.getItem("eop-buster_sort_ord") || "asc")
            render(data_render);
        })

}
LoadData();

function DeleteOrder(id) {
    if (confirm("Chắc chắn xóa đơn này hỏi danh sách!")) {
        const endpointURL = `https://65e85faa4bb72f0a9c4f1974.mockapi.io/orders/${id}`;
        fetch(endpointURL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', // Kiểu dữ liệu bạn gửi đi
                // Các header khác nếu cần
            },
        })
            .then(() => {
                LoadData()
            })
    }
}

function CancelOrder(id) {
    if (confirm("Từ chối đơn hàng này!")) {
        const apiUrl = "https://65e85faa4bb72f0a9c4f1974.mockapi.io/orders"

        // Gửi yêu cầu GET để lấy dữ liệu từ API
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Tìm kiếm trường cần sửa đổi trong dữ liệu
                const itemToUpdate = data.find(item => item.id === id);

                // Nếu tìm thấy trường cần sửa đổi
                if (itemToUpdate) {
                    // Sửa đổi trường cần thiết
                    itemToUpdate["status"] = "Từ chối nhận";

                    // Gửi yêu cầu PUT/PATCH để cập nhật dữ liệu lên server
                    return fetch(apiUrl + `/${itemToUpdate.id}`, {
                        method: 'PUT', // hoặc 'PATCH' nếu chỉ muốn cập nhật trường cụ thể
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(itemToUpdate)
                    })
                }
            })
            .then(() => LoadData())
    }
}

function Payied(id) {
    if (confirm("Xác nhận khách hàng ĐÃ thanh toàn đơn này")) {
        const apiUrl = "https://65e85faa4bb72f0a9c4f1974.mockapi.io/orders"

        // Gửi yêu cầu GET để lấy dữ liệu từ API
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Tìm kiếm trường cần sửa đổi trong dữ liệu
                const itemToUpdate = data.find(item => item.id === id);

                // Nếu tìm thấy trường cần sửa đổi
                if (itemToUpdate) {
                    // Sửa đổi trường cần thiết
                    itemToUpdate["noti-payied"] = "hidden";
                    itemToUpdate["confirm-pay"] = "ok";
                    itemToUpdate["status-pay"] = "payied";

                    // Gửi yêu cầu PUT/PATCH để cập nhật dữ liệu lên server
                    return fetch(apiUrl + `/${itemToUpdate.id}`, {
                        method: 'PUT', // hoặc 'PATCH' nếu chỉ muốn cập nhật trường cụ thể
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(itemToUpdate)
                    })
                }
            })
            .then(() => LoadData())
    }
}

function Notpay(id) {
    if (confirm("Xác nhận khách hàng CHƯA thanh toàn đơn này")) {
        const apiUrl = "https://65e85faa4bb72f0a9c4f1974.mockapi.io/orders"

        // Gửi yêu cầu GET để lấy dữ liệu từ API
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Tìm kiếm trường cần sửa đổi trong dữ liệu
                const itemToUpdate = data.find(item => item.id === id);

                // Nếu tìm thấy trường cần sửa đổi
                if (itemToUpdate) {
                    // Sửa đổi trường cần thiết
                    itemToUpdate["noti-payied"] = "hidden";
                    itemToUpdate["confirm-pay"] = "";
                    if (itemToUpdate.status === "Đang làm") itemToUpdate["status-pay"] = "";
                    else if (itemToUpdate.status === "Hoàn thành") itemToUpdate["status-pay"] = "waiting";

                    // Gửi yêu cầu PUT/PATCH để cập nhật dữ liệu lên server
                    return fetch(apiUrl + `/${itemToUpdate.id}`, {
                        method: 'PUT', // hoặc 'PATCH' nếu chỉ muốn cập nhật trường cụ thể
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(itemToUpdate)
                    })
                }
            })
            .then(() => LoadData())
    }
}

function update(e, id, fieldToUpdate) {
    // Định nghĩa đường dẫn của API
    const apiUrl = "https://65e85faa4bb72f0a9c4f1974.mockapi.io/orders"
    const newValue = e.value;

    // Gửi yêu cầu GET để lấy dữ liệu từ API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Tìm kiếm trường cần sửa đổi trong dữ liệu
            const itemToUpdate = data.find(item => Number(item.id) === id);

            // Nếu tìm thấy trường cần sửa đổi
            if (itemToUpdate) {
                // Sửa đổi trường cần thiết
                itemToUpdate[fieldToUpdate] = newValue;
                if (itemToUpdate['status-pay'] !== "payied") {
                    if (fieldToUpdate === "status" && newValue === "Hoàn thành") {
                        itemToUpdate['status-pay'] = "waiting";
                        fetch("https://65e85faa4bb72f0a9c4f1974.mockapi.io/accounts")
                            .then(response => {
                                return response.json();
                            })
                            .then((data) => {
                                let account = data.find((e) => {
                                    return e.masv === itemToUpdate.masv;
                                });
                                Email.send({
                                    Host: "smtp.elasticemail.com",
                                    Username: "eopbuster@gmail.com",
                                    Password: "98CA9F02EB45AD9E8C3AEA22D5C408502139",
                                    To: `${account.email}`,
                                    From: "eopbuster@gmail.com",
                                    Subject: "Eop của bạn đã làm xong.",
                                    Body: `Mã đơn ${itemToUpdate.madon} đã được hoàn thành. Hãy kiểm tra lại và liên hệ chúng tôi nếu có sai sót.`,
                                })
                            })
                    }
                    else if (fieldToUpdate === "status" && newValue === "Đang làm") itemToUpdate['status-pay'] = ""
                }

                // Gửi yêu cầu PUT/PATCH để cập nhật dữ liệu lên server
                return fetch(apiUrl + `/${itemToUpdate.id}`, {
                    method: 'PUT', // hoặc 'PATCH' nếu chỉ muốn cập nhật trường cụ thể
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(itemToUpdate)
                });
            }
        }).then(() => LoadData())
}

document.querySelector(".out").onclick = function(){
    localStorage.removeItem("eop-buster_login");
    localStorage.removeItem("eop-buster_account");
    localStorage.removeItem("eop-buster_masv");
    localStorage.removeItem("eop-buster_admin_account");
    location.reload();
}
