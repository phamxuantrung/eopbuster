let priceUnit = 7;
let priceTest = 15;
let priceWriting = 3;
let priceFast = 3;

// Render items
let units = [1, 2, 3, 4, 5, 6, 7, 8]
let htmlTemplateUnit = units.map(unit => {
    return `
    <div class="item">
                    <div class="item-wrapper">
                        <div class="item-infor">
                            <div class="input-checkbox" price="${priceUnit}">
                                <input type="checkbox">
                                <div class="stardust-checkbox"></div>
                            </div>
                            <img src="./images/unit.png" alt="">
                            <div class="title">Unit ${unit} (Không bao gồm Writing và Speaking)</div>
                        </div>
                        <select class="speed" disabled>
                            <option value="" disabled selected>Tốc độ làm bài</option>
                            <option value="normal">Bình thường</option>
                            <option value="fast">Nhanh</option>
                        </select>
                        <div class="item-price">
                            <div class="price-1">₫ ${priceUnit + 3}.000</div>
                            <div class="price-2">₫ ${priceUnit}.000</div>
                        </div>
                    </div>
                    <div class="addwriting">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>                          
                        <div class="title">Kèm thêm bài Writing (₫ ${priceWriting}.000)</div>
                        <input disabled class="input-checkbox-addwriting" type="checkbox">
                    </div>
    </div>
    `
}).join("");
document.querySelector(".box .unit .product").innerHTML = htmlTemplateUnit;

let tests = [1, 2, 3, 4, 5, 6, 7, 8]
let htmlTemplateTest = tests.map(test => {
    return `
    <div class="item">
    <div class="item-wrapper">
    <div class="item-infor">
        <div class="input-checkbox" price="${priceTest}">
            <input type="checkbox">
            <div class="stardust-checkbox"></div>
        </div>
        <img src="./images/unit.png" alt="">
        <div class="title">Unit Test ${test}</div>
    </div>
    <select class="speed" disabled>
        <option value="" disabled selected>Tốc độ làm bài</option>
        <option value="normal">Bình thường</option>
        <option value="fast">Nhanh</option>
    </select>
    <div class="item-price">
        <div class="price-1">₫ ${priceTest + 5}.000</div>
        <div class="price-2">₫ ${priceTest}.000</div>
    </div>
</div>
                </div>
    `
}).join("");
document.querySelector(".test .product").innerHTML = htmlTemplateTest;

// Handling toggle show
let showToggles = document.querySelectorAll(".box .show-toggle")
let products = document.querySelectorAll(".box .product")

showToggles.forEach((e, i) => {
    e.onclick = function () {
        this.classList.toggle("active")
        products[i].classList.toggle("active")
    }
})

// Handling
let total = 0;
let fast = new Array(16).fill(0);
let addwriting = new Array(16).fill(0);
let amount = 0;

let speedSelects = document.querySelectorAll(".box select.speed")
let addwritings = document.querySelectorAll(".box .addwriting input")
let totalPay = document.querySelector(".box .pay .total-pay")
let title = document.querySelector(".box .pay .title")

function selectAll(element, start, end) {
    if (element.classList.contains("input-checkbox--checked")) {
        element.classList.remove("input-checkbox--checked")
        document.querySelectorAll(`.box .input-checkbox:not(.check-all)`).forEach((e, i) => {
            if (!e.classList.contains("input-checkbox--checked")) return;
            if (i < start || i > end) return;
            e.classList.remove("input-checkbox--checked")
            speedSelects[i].value = ""
            speedSelects[i].disabled = true;
            if (i < 8) {
                document.querySelector(".box .unit .input-checkbox.check-all").classList.remove("input-checkbox--checked")
                addwritings[i].disabled = true;
                addwritings[i].checked = false;
            }
            total -= Number(e.getAttribute("price")) + fast[i] + addwriting[i];
            fast[i] = 0;
            addwriting[i] = 0
            amount--;
        })
    }
    else {
        element.classList.add("input-checkbox--checked")
        document.querySelectorAll(`.box .input-checkbox:not(.check-all)`).forEach((e, i) => {
            if (e.classList.contains("input-checkbox--checked")) return;
            if (i < start || i > end) return;
            e.classList.add("input-checkbox--checked")
            speedSelects[i].value = "normal"
            speedSelects[i].disabled = false;
            if (i < 8) {
                addwritings[i].disabled = false;
                addwritings[i].checked = false;
            }
            total += Number(e.getAttribute("price"))
            amount++;
        })
    }
    totalPay.innerText = `₫ ${total}.000`;
    title.innerText = `Tổng thanh toán (${amount} Lựa Chọn): `;
}

document.querySelector(".box .unit .input-checkbox.check-all").onclick = function () {
    selectAll(this, 0, 7)
}

document.querySelector(".box .test .input-checkbox.check-all").onclick = function () {
    selectAll(this, 8, 15)
}



document.querySelectorAll(".box .input-checkbox:not(.check-all)").forEach((e, i) => {
    e.onclick = function () {
        if (this.classList.contains("input-checkbox--checked")) {
            this.classList.remove("input-checkbox--checked")
            if (speedSelects[i].value == "fast") {
                document.querySelectorAll(".box .price-1")[i].innerText = `₫ ${Number(document.querySelectorAll(".box .price-1")[i].innerText.slice(2)) - 3}.000`
                document.querySelectorAll(".box .price-2")[i].innerText = `₫ ${Number(document.querySelectorAll(".box .price-2")[i].innerText.slice(2)) - 3}.000`
            }
            speedSelects[i].value = ""
            speedSelects[i].disabled = true;
            if (i < 8) {
                document.querySelector(".box .unit .input-checkbox.check-all").classList.remove("input-checkbox--checked")
                addwritings[i].disabled = true;
                addwritings[i].checked = false;
            }
            else {
                document.querySelector(".box .test .input-checkbox.check-all").classList.remove("input-checkbox--checked")
            }
            total -= Number(this.getAttribute("price")) + fast[i] + addwriting[i];
            fast[i] = 0;
            addwriting[i] = 0
            amount--;
        }
        else {
            this.classList.add("input-checkbox--checked")
            speedSelects[i].value = "normal"
            speedSelects[i].disabled = false;
            if (i < 8) {
                addwritings[i].disabled = false;
                addwritings[i].checked = false;
            }
            else {
                document.querySelector(".box .test .input-checkbox.check-all").classList.remove("input-checkbox--checked")
            }
            total += Number(this.getAttribute("price"))
            amount++;
        }
        totalPay.innerText = `₫ ${total}.000`;
        title.innerText = `Tổng thanh toán (${amount} Lựa Chọn): `;
    }
})

document.querySelectorAll(".box .speed").forEach((e, i) => {
    e.onchange = function () {
        let p1 = document.querySelectorAll(".box .price-1")[i]
        let p2 = document.querySelectorAll(".box .price-2")[i]
        if (e.value === "fast") {
            fast[i] += 3;
            total += 3;
            p1.innerText = `₫ ${Number(p1.innerText.slice(2)) + priceFast}.000`
            p2.innerText = `₫ ${Number(p2.innerText.slice(2)) + priceFast}.000`
        }
        else {
            fast[i] -= priceFast;
            total -= priceFast;
            p1.innerText = `₫ ${Number(p1.innerText.slice(2)) - priceFast}.000`
            p2.innerText = `₫ ${Number(p2.innerText.slice(2)) - priceFast}.000`
        }
        totalPay.innerText = `₫ ${total}.000`;
    }
})

document.querySelectorAll(".box .addwriting input").forEach((e, i) => {
    e.onchange = function () {
        if (e.checked) {
            addwriting[i] += priceWriting;
            total += priceWriting;
        }
        else {
            addwriting[i] -= priceWriting;
            total -= priceWriting;
        }
        totalPay.innerText = `₫ ${total}.000`;
    }
})

let productCheckeds = [];
let addwritingCheckeds = [];
let speedFasts = [];
let speedSelectCurrents = [];
document.querySelector(".box .button").onclick = function () {
    document.querySelectorAll(".box .input-checkbox:not(.check-all)").forEach((e, i) => {
        if (!e.classList.contains("input-checkbox--checked")) return;
        productCheckeds.push(i);
        if (i < 8 && addwritings[i].checked) addwritingCheckeds.push(i)
        if (speedSelects[i].value == "fast") {
            speedSelectCurrents.push("Nhanh")
            speedFasts.push(i)
        }
        else speedSelectCurrents.push("Thường")
    })

    if (productCheckeds.length === 0) return;

    document.querySelector(".box").style.display = "none"
    document.querySelector(".final").style.display = "block"

    let htmlTemplateFinal = productCheckeds.map((e, i) => {
        return `
        <div class="item">
            <div class="grid">
                <div style="display: flex; align-items: center;">
                    <img src="./images/unit.png" alt="">
                    ${(e < 8) ? `<div class="title">Unit ${e + 1} (Không bao gồm Writing và Speaking)</div>` : `<div class="title">Unit Test ${e - 7}</div>`}
                </div>
                <div class="speed">${speedSelectCurrents[i]}</div>
                <div class="price">₫ ${(e < 8) ? ((speedFasts.includes(e)) ? `${priceUnit + 3}.000` : `${priceUnit}.000`) : ((speedFasts.includes(e)) ? `${priceUnit + priceFast + 3}.000` : `${priceUnit + priceFast}.000`)}</div>
            </div>
            ${(e < 8) ? `<div class="addwriting"><div style="display: flex; align-items: center;"><input type="checkbox" ${(addwritingCheckeds.includes(e)) ? 'checked' : ''}><div class="sNymxn"><span>Kèm thêm bài Writing</span><div class="_0IoUJ3">Gợi ý cho bạn</div></div></div><div class="JKf6hB"><span>₫ 3.000</span></div></div>` : ``}</div>
        `
    }).join("")

    document.querySelector(".final .product-final").innerHTML = htmlTemplateFinal
    document.querySelector(".final .final-pay .title").innerText = `Tổng số tiền (${amount} sản phẩm):`
    document.querySelector(".final .final-pay .final-total-pay").innerText = `₫ ${total}.000`
    document.querySelector(".final .main .user-infor").innerText = `${localStorage.getItem("eop-buster_account")} (MSV) ${localStorage.getItem("eop-buster_masv")}`

    document.querySelectorAll(".final .addwriting input").forEach((e, i) => {
        e.onchange = function () {
            if (e.checked) {
                addwritingCheckeds.push(productCheckeds[i])
                total += priceWriting;
            }
            else {
                addwritingCheckeds = addwritingCheckeds.filter(e => e !== productCheckeds[i])
                total -= priceWriting;
            }
            document.querySelector(".final form .agree-order input").checked = false;
            document.querySelector(".final .final-pay .final-total-pay").innerText = `₫ ${total}.000`
        }
    })

    document.querySelector(".final .deadline input").onchange = function () {
        document.querySelector("#pay-form input[name='deadline']").value = convertDate(document.querySelector(".final input[name='deadline']").value)
    }

    document.querySelector(".final input[name='note-text']").oninput = function () {
        document.querySelector("#pay-form input[name='note']").value = this.value
    }

    // Handling Processing Form
    document.querySelector(".final form .agree-order input").onchange = function () {
        if (!this.checked) return;
        let pProduct = ''
        let units = productCheckeds.filter(e => (e < 8))
        let tests = productCheckeds.filter(e => (e >= 8 && e < 16))
        addwritingCheckeds = addwritingCheckeds.sort()
        if (units.length > 0) pProduct += `Unit: ${units.map(e => `${e + 1}${(speedFasts.includes(e)) ? "[Fast]" : ""}`).join(", ")}`
        if (addwritingCheckeds.length > 0) pProduct += `</br>Writing: ${addwritingCheckeds.map(e => e + 1).join(", ")}`
        if (tests.length > 0) pProduct += `</br>Test: ${tests.map(e => `${e - 7}${(speedFasts.includes(e)) ? "[Fast]" : ""}`).join(", ")}`
        document.querySelector("#pay-form textarea[name='product']").value = pProduct;
        document.querySelector("#pay-form input[name='pay']").value = `₫ ${total}.000`;
    }

    let form = document.querySelector("#pay-form");
    form.onsubmit = (e) => {
        e.preventDefault();
        if (document.querySelector(".final .last input[name='deadline']").value === "") {
            document.querySelector(".final .last input[name='deadline']").style.borderColor = "rgba(220, 53, 70, 0.404)"
            document.querySelector(".final .last input[name='deadline']").style.backgroundColor = "rgba(220, 53, 70, 0.12)"
            return;
        }

        let now = new Date()
        let selectedDate = new Date(document.querySelector(".final .deadline input").value);
        if (compareDates(selectedDate.toLocaleDateString(), now.toLocaleDateString()) === -1) {
            showErrorDeadline(`Bạn không thể chọn deadline là ngày đã qua!`)
            document.querySelector(".final .last input[name='deadline']").style.borderColor = "rgba(220, 53, 70, 0.404)"
            document.querySelector(".final .last input[name='deadline']").style.backgroundColor = "rgba(220, 53, 70, 0.12)"
            return
        }
        if (selectedDate.toLocaleDateString() === now.toLocaleDateString() && speedFasts.length !== productCheckeds.length) {
            showErrorDeadline(`Bạn không thể chọn deadline là ngày hôm nay được. Vui lòng chọn hình thức làm bài "Nhanh"`)
            document.querySelector(".final .last input[name='deadline']").style.borderColor = "rgba(220, 53, 70, 0.404)"
            document.querySelector(".final .last input[name='deadline']").style.backgroundColor = "rgba(220, 53, 70, 0.12)"
            return;
        }

        document.querySelector(".loading").style.display = "flex";
        fetch("https://65e85faa4bb72f0a9c4f1974.mockapi.io/accounts")
            .then(response => response.json())
            .then((data) => {
                const currentAccount = data.find((e) => {
                    return e.masv === localStorage.getItem("eop-buster_masv");
                })
                const newOrder = {
                    madon: generateRandomID(10),
                    time: new Date(),
                    masv: currentAccount.masv,
                    name: currentAccount.name,
                    password: currentAccount.password,
                    link: currentAccount.link,
                    deadline: document.querySelector("#pay-form input[name='deadline']").value,
                    note: document.querySelector("#pay-form input[name='note']").value,
                    pay: document.querySelector("#pay-form input[name='pay']").value,
                    product: document.querySelector("#pay-form textarea[name='product']").value,
                    supporter: "",
                    status: "",
                    "status-pay": "",
                    "noti-payied": "hidden",
                    "confirm-pay": ""
                }
                fetch(
                    "https://65e85faa4bb72f0a9c4f1974.mockapi.io/orders",
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newOrder)
                    }
                )
                    .then(() => {
                        Email.send({
                            Host: "smtp.elasticemail.com",
                            Username: "eopbuster@gmail.com",
                            Password: "98CA9F02EB45AD9E8C3AEA22D5C408502139",
                            To: ['phamxuantrung123d@gmail.com', 'lekimthanh28072003@gmail.com'],
                            From: "eopbuster@gmail.com",
                            Subject: "Đơn hàng mới từ eopbuster",
                            Body: `Có một đơn hàng mới của ${localStorage.getItem("eop-buster_account")}`,
                        })
                        .then(() => {
                            clearData()
                            window.location = location.href.replace("order", "welldone")
                        })
                    })
                    .catch(() => {
                        clearData()
                        showErrorToast();
                    });
            })
            .catch()
    };

}

// Over function
function convertDate(inputDate) {
    let dateParts = inputDate.split("-"); // Split the date into day, month, and year
    if (dateParts.length !== 3) {
        return "Invalid date";
    }

    // Rearrange the array elements
    let day = dateParts[2];
    let month = dateParts[1];
    let year = dateParts[0];

    // Create a new string in "dd/mm/yyyy" format
    let newDateString = day + "/" + month + "/" + year;
    return newDateString;
}

function generateRandomID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function clearData() {
    total = 0;
    fast = new Array(16).fill(0);
    addwriting = new Array(16).fill(0);
    amount = 0;
    productCheckeds = [];
    addwritingCheckeds = [];
    speedFasts = [];
    speedSelectCurrents = [];
    totalPay.innerText = `₫ ${total}.000`;
    title.innerText = `Tổng thanh toán (${amount} Lựa Chọn): `;
    document.querySelectorAll(".box .input-checkbox").forEach(e => { e.classList.remove("input-checkbox--checked") })
    document.querySelectorAll("input").forEach(e => { e.value = '' })
    document.querySelectorAll(".input-checkbox-addwriting").forEach(e => { e.checked = false; e.disabled = true })
    document.querySelector(".agree-order input").checked = false;
    document.querySelectorAll("textarea").forEach(e => { e.value = false })
    document.querySelectorAll("select.speed").forEach(e => { e.value = ''; e.disabled = true })
    document.querySelector(".box").style.display = "block"
    document.querySelector(".final").style.display = "none"
    document.querySelector(".loading").style.display = "none"
    document.querySelector(".final .last input[name='deadline']").style.borderColor = "#e4e4e4"
    document.querySelector(".final .last input[name='deadline']").style.backgroundColor = "white"
}

function compareDates(date1, date2) {
    // Assuming date1 and date2 are strings in the format dd/mm/yyyy
    const [day1, month1, year1] = date1.split('/');
    const [day2, month2, year2] = date2.split('/');

    // Convert the parts to integers for comparison
    const intYear1 = parseInt(year1, 10);
    const intMonth1 = parseInt(month1, 10);
    const intDay1 = parseInt(day1, 10);

    const intYear2 = parseInt(year2, 10);
    const intMonth2 = parseInt(month2, 10);
    const intDay2 = parseInt(day2, 10);

    // Compare years
    if (intYear1 > intYear2) return 1;
    if (intYear1 < intYear2) return -1;

    // Compare months
    if (intMonth1 > intMonth2) return 1;
    if (intMonth1 < intMonth2) return -1;

    // Compare days
    if (intDay1 > intDay2) return 1;
    if (intDay1 < intDay2) return -1;

    // Dates are equal
    return 0;
}

function showSuccessToast() {
    toast({
        title: "Đăng ký thành công!",
        message: "Hãy chờ chúng tôi sẽ liên hệ với bạn để xác nhận.",
        type: "success",
        duration: 8000,
    });
}

function showErrorToast() {
    toast({
        title: "Đăng ký thất bại!",
        message: "Có lỗi xảy ra, vui lòng thử lại sau.",
        type: "error",
        duration: 5000,
    });
}

function showErrorDeadline(p) {
    toast({
        title: "Lỗi!",
        message: p,
        type: "error",
        duration: 5000,
    });
}

function showWarningToast() {
    toast({
        title: "Chú ý!",
        message: `Nếu bạn muốn chúng tôi làm xong ngay trong ngày, hãy chọn hình thức làm bài là "Nhanh".`,
        type: "warning",
        duration: 15000,
    });
}

if (localStorage.getItem("eop-buster_login")) showWarningToast();

document.querySelector("nav .my-user").onclick = function () {
    this.querySelector(".setting").classList.toggle("active")
}

