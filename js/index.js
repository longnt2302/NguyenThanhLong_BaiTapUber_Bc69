let switchCurrency = (value) => parseInt(value).toLocaleString("it-IT", { style: "currency", currency: "VND" });

// Regrex Number Integer
let regNum = /^\d*$/;
// Warning messeage
let warInterger = 'Chỉ được nhập số';
let typeNum = document.querySelectorAll('input[type=text]');
typeNum.forEach( (type) => {
    let _this = type;
    _this.oldValue = _this.value;
    _this.onkeyup = (event) => {
        if( regNum.test(_this.value) === true ) {
            _this.classList.remove("input-error");
            _this.setCustomValidity("");
            _this.oldValue = _this.value;
            _this.oldSelectionStart = _this.selectionStart;
            _this.oldSelectionEnd = _this.selectionEnd;
        } else if( _this.hasOwnProperty("oldValue") ) {
            _this.classList.add("input-error");
            _this.setCustomValidity(warInterger);
            _this.reportValidity();
            _this.value = _this.oldValue;
            _this.setSelectionRange(_this.oldSelectionStart, _this.oldSelectionEnd);
        } else {
            _this.value = "";
        }
    };
} );

const UBER_CAR = "uberCar",
  UBER_SUV = "uberSUV",
  UBER_BLACK = "uberBlack";

const datasPrice = {
  UBER_CAR: {
    first: 8000,
    middle: 7500,
    end: 7000,
    wait: 2000,
  },
  UBER_SUV: {
    first: 9000,
    middle: 8500,
    end: 8000,
    wait: 3000,
  },
  UBER_BLACK: {
    first: 10000,
    middle: 9500,
    end: 9000,
    wait: 3500,
  },
};

let handlePayment = (transportation, distance, time = 0) => {
  let data = {};
  data.transportation = transportation.replace("_", " ");
  let total = 0;
  data.distance = {};
  data.price = {};
  data.wait = {};
  let perThreeMinutes = 1;
  data.wait.time = time;
  data.wait.unitprice = datasPrice[transportation]["wait"];
  data.wait.price = 0;
  if (time > 3) {
    perThreeMinutes = Math.floor(time / 3);
    data.wait.price = data.wait.unitprice * perThreeMinutes;
  }

  data.price.first = datasPrice[transportation]["first"];
  if (distance <= 1) {
    if (distance < 1) {
      data.distance.first = 1 - distance;
    } else {
      data.distance.first = 1;
    }
    data.distance.middle = 0;
    data.distance.end = 0;
    data.price = {
      first: datasPrice[transportation]["first"],
      middle: 0,
      end: 0,
    };
  } else if (distance > 1 && distance <= 19) {
    data.distance.first = 1;
    data.distance.middle = distance - 1;
    data.distance.end = 0;
    data.price.middle = datasPrice[transportation]["middle"] * data.distance.middle;
    data.price.end = 0;
  } else {
    data.distance.first = 1;
    data.distance.middle = 18;
    data.distance.end = distance - 19;
    data.price.middle = datasPrice[transportation]["middle"] * 18;
    data.price.end = datasPrice[transportation]["end"] * data.distance.end;
  }
  total += data.price.first + data.price.middle + data.price.end + data.wait.price;
  data.total = total;
  return data;
};

document.querySelector(".contact100-form-btn").onclick = function () {
  let checkedErr = 0;
  if (!document.querySelector("input[type='radio']:checked")) {
    alert('VUI LÒNG CHỌN LOẠI XE DI CHUYỂN');
    checkedErr++;
  } else if( document.getElementById("txt-km").value == '' ) {
    alert('VUI LÒNG NHẬP SỐ KM');
    checkedErr++;
  } else if ( +document.getElementById("txt-km").value == 0 ) {
    alert('VUI LÒNG NHẬP SỐ KM > 0');
    checkedErr++;
  }
  if( checkedErr == 0 ) {
    let loaiXe = document.querySelector("input[name=selector]:checked").value;
    let distance = document.getElementById("txt-km").value * 1;
    let time = document.getElementById("txt-thoiGianCho").value * 1;
    let transportation;
    switch (loaiXe) {
      case UBER_CAR:
        transportation = "UBER_CAR";
        break;
      case UBER_SUV:
        transportation = "UBER_SUV";
        break;
      case UBER_BLACK:
        transportation = "UBER_BLACK";
        break;
    }
    let data = handlePayment(transportation, distance, time);
    let tbl = "";
    tbl += `<tr>
      <th scope="row">KM ĐẦU TIÊN</th>
      <td>${data.distance.first}km</td>
      <td>${switchCurrency(datasPrice[transportation]["first"])}</td>
      <td>${switchCurrency(data.price.first)}</td>
    </tr>`;
    if (distance > 1 && distance <= 19) {
      tbl += `<tr>
      <th scope="row">Từ 1km đến ${data.distance.middle}km</th>
      <td>${data.distance.middle}km</td>
      <td>${switchCurrency(datasPrice[transportation]["middle"])}</td>
      <td>${switchCurrency(data.price.middle)}</td>
    </tr>`;
    } else if (distance > 19) {
      tbl += `<tr>
      <th scope="row">Từ 1km đến 18km</th>
      <td>${data.distance.middle}km</td>
      <td>${switchCurrency(datasPrice[transportation]["middle"])}</td>
      <td>${switchCurrency(data.price.middle)}</td>
    </tr>
      <tr>
      <th scope="row">Từ 19km đến ${distance}km</th>
      <td>${data.distance.end}km</td>
      <td>${switchCurrency(datasPrice[transportation]["end"])}</td>
      <td>${switchCurrency(data.price.end)}</td>
    </tr>`;
    }
    if (time > 3) {
      tbl += `
      <tr>
            <th scope="row">Thời gian chờ trên 3 phút ( mỗi 3 phút )</th>
            <td>${time}phút - Free: 3phút đầu - Tính phí chờ: ${time - 3}phút</td>
            <td>${switchCurrency(data.wait.unitprice)}</td>
            <td>${switchCurrency(data.wait.price)}</td>
          </tr>
      `;
    } else {
      tbl += `
      <tr>
            <th scope="row">Thời gian chờ nhỏ hơn hoặc bằng 3 phút ( Free )</th>
            <td>${time} phút</td>
            <td>${switchCurrency(data.wait.unitprice)}</td>
            <td>${switchCurrency(data.wait.price)}</td>
          </tr>
      `;
    }
    let tblHoaDon = `<table class="table table-bordered">
        <thead">
          <tr>
            <th scope="col" colspan="4" class="bg-secondary text-light text-center">CHI TIẾT HOÁ ĐƠN</th>
          </tr>
          <tr>
            <th scope="col">LOẠI XE</th>
            <th colspan="3" class="text-center">${data.transportation}</th>
          </tr>
          <tr>
            <th scope="col">CHI TIẾT</th>
            <th scope="col">SỬ DỤNG</th>
            <th scope="col">ĐƠN GIÁ (1000đ)</th>
            <th scope="col">THÀNH TIỀN (1000đ)</th>
          </tr>
        </thead>
        <tbody>
          ${tbl}
          <tr>
            <td colspan="4" class="text-right">TỔNG TIỀN: <span class="text-danger">${switchCurrency(data.total)}</span></td>
          </tr>
        </tbody>
      </table>`;
    document.querySelector(".modal-body").innerHTML = tblHoaDon;
    $("#exampleModal").modal("show");
  }
};
