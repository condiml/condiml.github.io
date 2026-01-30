# 💡 Gợi ý tính năng mới – Watermeloz

Gợi ý theo mức độ dễ làm và giá trị mang lại. Bạn có thể chọn vài cái để làm dần.

---

## 🟢 Dễ làm – Nên làm trước

### 1. **Nút Dark/Light theme**
- Thêm icon mặt trăng/ mặt trời góc trên (hoặc cạnh profile).
- Lưu preference vào `localStorage`, lần sau vào tự áp theme.
- CSS dùng biến `--color-bg`, `--color-text`… đổi theo class `dark` / `light` trên `<body>`.
- **Effort:** Thấp | **Impact:** Cao (nhiều người thích chọn theme).

---

### 2. **“Đang nghe” từ Discord (Lanyard)**
- Bạn đã dùng Lanyard cho Discord status.
- API trả thêm `activities` → có thể lấy **Spotify** hoặc **Custom status**.
- Hiển thị dưới Discord status: *“Đang nghe: [tên bài – artist]”* hoặc custom status, có icon nhỏ.
- **Effort:** Trung bình | **Impact:** Cao (làm profile “sống” hơn).

---

### 3. **Copy link / Copy contact**
- Một nút nhỏ “Copy link trang” hoặc “Copy Telegram/email” → copy vào clipboard, toast *“Đã copy!”*.
- Dùng `navigator.clipboard.writeText()` + vài dòng CSS cho toast.
- **Effort:** Thấp | **Impact:** Trung bình (tiện khi share).

---

### 4. **Phím tắt cho Music Player**
- `Space` = play/pause.
- `M` = mute/unmute.
- `←` / `→` = tua 10s (nếu muốn).
- Lắng nghe `keydown`, `preventDefault` cho các phím này để tránh scroll.
- **Effort:** Thấp | **Impact:** Trung bình (power user thích).

---

### 5. **Nút “Back to top”**
- Khi scroll xuống (ví dụ > 300px) mới hiện nút góc dưới phải.
- Click thì `window.scrollTo({ top: 0, behavior: 'smooth' })`.
- **Effort:** Thấp | **Impact:** Trung bình (hữu ích khi bạn thêm nhiều link/section).

---

## 🟡 Trung bình – Làm khi rảnh

### 6. **QR code cho trang**
- Dùng lib (vd: `qrcode.js`) tạo QR từ `window.location.href`.
- Nút “Share” hoặc “QR” → mở modal/ popover hiển thị QR để người khác quét.
- **Effort:** Trung bình | **Impact:** Trung bình (gặp mặt dùng rất tiện).

---

### 7. **GitHub pinned repos / contribution graph**
- Embed 4–6 repo GitHub (API hoặc iframe/widget).
- Hoặc chỉ ảnh contribution graph (img từ `https://ghchart.rshah.org/...` hoặc tương tự).
- **Effort:** Trung bình | **Impact:** Cao nếu bạn muốn showcase code.

---

### 8. **“Random quote” hoặc “Status hôm nay”**
- Mảng vài câu quote hoặc status, mỗi lần load (hoặc mỗi ngày) random 1 câu hiển thị dưới bio.
- Có thể dùng `Date` để “1 câu/ngày” thay vì random mỗi lần.
- **Effort:** Thấp–Trung bình | **Impact:** Trung bình (thể hiện cá tính).

---

### 9. **PWA: “Thêm lên màn hình chính”**
- `site.webmanifest` đã có, có thể bổ sung `start_url`, icons đủ kích thước.
- Thêm prompt “Add to Home Screen” (dùng `beforeinstallprompt`) một lần khi visit.
- **Effort:** Trung bình | **Impact:** Trung bình (mobile dùng như app).

---

### 10. **Skeleton loading cho Discord status**
- Trước khi API Discord trả về, không hiện “Loading” chữ mà hiện skeleton (thanh xám nhấp nháy) cùng vị trí.
- **Effort:** Thấp | **Impact:** Nhỏ nhưng UI trông pro hơn.

---

## 🔵 Nâng cao – Làm khi muốn “nâng level”

### 11. **Đa ngôn ngữ (Vi / En)**
- Nút chuyển ngôn ngữ, nội dung (bio, nhãn nút, section) đổi theo.
- Cách đơn giản: object `{ vi: { bio: "..." }, en: { bio: "..." } }` + 1 biến `lang`, render text từ object.
- **Effort:** Cao hơn (phải dịch và maintain 2 bản) | **Impact:** Cao nếu có audience quốc tế.

---

### 12. **Blog / Notes section**
- Link tới GitHub Pages blog, hoặc Notion, Substack, v.v.
- Hoặc 1 section “Latest post” lấy 1 bài mới nhất qua RSS/API.
- **Effort:** Trung bình–Cao | **Impact:** Cao nếu bạn viết thường xuyên.

---

### 13. **Visitor counter**
- Dùng service như CountAPI, hoặc serverless (Vercel/Netlify function) ghi +1 mỗi lần visit, hiển thị số.
- Hoặc đơn giản: “Đã có X lượt truy cập” (số có thể cố định/random cho vui).
- **Effort:** Trung bình (nếu dùng API) | **Impact:** Trung bình (tâm lý “có người xem”).

---

### 14. **Easter eggs**
- Ví dụ: bấm 5 lần vào avatar → confetti hoặc đổi tạm theme.
- Hoặc gõ “watermeloz” trên trang → trigger 1 animation nhỏ.
- **Effort:** Thấp–Trung bình | **Impact:** Vui, tạo ấn tượng.

---

### 15. **Weather widget (optional)**
- Hiển thị thời tiết (Hà Nội/HCM hoặc theo geolocation) qua API miễn phí (Open-Meteo, etc.).
- Chỉ nên làm nếu bạn thấy hợp với phong cách trang.
- **Effort:** Trung bình | **Impact:** Thấp–Trung bình.

---

## 📋 Gợi ý thứ tự làm (theo ưu tiên)

| # | Tính năng              | Lý do ưu tiên                    |
|---|------------------------|-----------------------------------|
| 1 | Dark/Light theme       | Nhiều người mong đợi, dễ làm      |
| 2 | “Đang nghe” từ Discord | Tận dụng Lanyard, profile sống hơn |
| 3 | Copy link / contact   | Tiện share, code ít               |
| 4 | Phím tắt music        | Trải nghiệm dùng tốt hơn         |
| 5 | Back to top           | Chuẩn bị cho trang dài sau này   |

---

## 🛠 Gợi ý kỹ thuật nhanh

- **Theme:** Thêm `.dark` / `.light` (hoặc `[data-theme="dark"]`) lên `<html>` hoặc `<body>`, đổi CSS variables.
- **Lanyard “đang nghe”:** Trong `discord-status.js`, sau khi có `data.data`, kiểm tra `data.data.activities` (Spotify hoặc custom) và render thêm 1 dòng HTML.
- **Copy:** `navigator.clipboard.writeText(url).then(() => showToast('Đã copy!'))`.
- **Keyboard:** `document.addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); togglePlay(); } })`.

Nếu bạn chọn 1–2 tính năng cụ thể (ví dụ: theme + “đang nghe” Discord), có thể nói rõ và tôi sẽ gợi ý từng bước code chi tiết cho đúng codebase hiện tại của bạn.
