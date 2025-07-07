let dang_choi = false;
let so_giay = 0;
let dong_ho = null;
let di_chuyen = 0;
let stt = 1;

function cap_nhat_ThoiGian() {
    let phut = Math.floor(so_giay / 60).toString().padStart(2, '0');
    let giay = (so_giay % 60).toString().padStart(2, '0');
    document.getElementById('time').textContent = `${phut}:${giay}`;
}

function bat_dau_Dem() {
    clearInterval(dong_ho);
    so_giay = 0;
    cap_nhat_ThoiGian();
    dong_ho = setInterval(() => {
        so_giay++;
        cap_nhat_ThoiGian();
    }, 1000);
}

function dung_dong_ho() {
    clearInterval(dong_ho);
}

document.querySelector('.start-button').addEventListener('click', function () {
    const winText = document.getElementById('win-message');
    winText.classList.add('hidden');

    if (!dang_choi) {
        this.textContent = "Kết Thúc";
        this.classList.remove("bg-green-500");
        this.classList.add("bg-red");
        dang_choi = true;
        di_chuyen = 0;
        bat_dau_Dem();
        tronO(100);
    } else {
        this.textContent = "Bắt Đầu";
        this.classList.remove("bg-red");
        this.classList.add("bg-green-500");
        dang_choi = false;
        dung_dong_ho();
    }
});

function tronO(solan) {
    const phim = ['w', 'a', 's', 'd'];
    for (let i = 0; i < solan; i++) {
        let phimNgauNhien = phim[Math.floor(Math.random() * 4)];
        di_chuyen_Oden(phimNgauNhien);
    }
}

document.addEventListener('keydown', function (e) {
    if (!dang_choi) return;
    const phim = e.key.toLowerCase();
    const huong = {
        'w': 'len',
        'arrowup': 'len',
        's': 'xuong',
        'arrowdown': 'xuong',
        'a': 'trai',
        'arrowleft': 'trai',
        'd': 'phai',
        'arrowright': 'phai'
    }[phim];
    if (huong) {
        di_chuyen_Oden(huong);
        kiem_tra_Thang();
    }
});

function di_chuyen_Oden(huong) {
    const board = document.getElementById('board');
    const cells = Array.from(board.children);
    const emptyIndex = cells.findIndex(cell => cell.classList.contains('cell-empty'));
    const row = Math.floor(emptyIndex / 4);
    const col = emptyIndex % 4;

    let targetIndex = -1;

    if (huong === 'len' && row > 0) targetIndex = emptyIndex - 4;
    if (huong === 'xuong' && row < 2) targetIndex = emptyIndex + 4;
    if (huong === 'trai' && col > 0) targetIndex = emptyIndex - 1;
    if (huong === 'phai' && col < 3) targetIndex = emptyIndex + 1;

    if (targetIndex >= 0 && targetIndex < 12) {
        const empty = cells[emptyIndex];
        const target = cells[targetIndex];

        const cloneEmpty = empty.cloneNode(true);
        const cloneTarget = target.cloneNode(true);

        board.replaceChild(cloneTarget, empty);
        board.replaceChild(cloneEmpty, target);

        di_chuyen++;
    }
}

function kiem_tra_Thang() {
    const cells = document.querySelectorAll('#board .cell');
    let dung_thu_tu = true;
    for (let i = 0; i < 11; i++) {
        if (!cells[i].classList.contains(`cell-${i + 1}`)) {
            dung_thu_tu = false;
            break;
        }
    }
    if (dung_thu_tu) {
        dung_dong_ho();
        document.getElementById('win-message').classList.remove('hidden');
        document.querySelector('.start-button').textContent = "Chơi lại";
        document.querySelector('.start-button').classList.remove("bg-red");
        document.querySelector('.start-button').classList.add("bg-green-500");
        dang_choi = false;
        luu_lich_su();
    }
}

function luu_lich_su() {
    const tbody = document.getElementById('history');
    const hang = document.createElement('tr');
    hang.innerHTML = `
        <td>${stt++}</td>
        <td>${di_chuyen}</td>
        <td>${document.getElementById('time').textContent}</td>
    `;
    tbody.appendChild(hang);
    di_chuyen = 0;
}
