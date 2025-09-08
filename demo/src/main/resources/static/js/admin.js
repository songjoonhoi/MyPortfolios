const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const form = $("#projectForm");
const coverInput = $("#coverFile");
const preview = $("#preview");
const detailsContainer = $("#detailsContainer");
const addDetailBtn = $("#addDetailBtn");

let uploadedCoverUrl = "";
let detailEntries = []; // 상세 항목 저장

// ===== 대표 이미지 업로드 =====
coverInput.addEventListener("change", async () => {
  const file = coverInput.files[0];
  if (!file) return;

  // 미리보기
  const reader = new FileReader();
  reader.onload = e => {
    preview.src = e.target.result;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);

  // 서버 업로드
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/uploads/images", { method: "POST", body: formData });

  if (res.ok) {
    uploadedCoverUrl = await res.text();
    alert("대표 이미지 업로드 성공!");
  } else {
    alert("대표 이미지 업로드 실패");
  }
});

// ===== 상세 항목 추가 =====
addDetailBtn.addEventListener("click", () => {
  const index = detailEntries.length;

  const div = document.createElement("div");
  div.className = "detail-item";
  div.innerHTML = `
    <label>상세 제목</label>
    <input type="text" class="detail-title" required />

    <label>상세 설명</label>
    <textarea class="detail-desc" required></textarea>

    <label>상세 이미지</label>
    <input type="file" class="detail-file" accept="image/*" />
    <img class="detail-preview" style="display:none;" />
  `;

  detailsContainer.appendChild(div);

  const fileInput = div.querySelector(".detail-file");
  const imgPreview = div.querySelector(".detail-preview");

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    // 미리보기
    const reader = new FileReader();
    reader.onload = e => {
      imgPreview.src = e.target.result;
      imgPreview.style.display = "block";
    };
    reader.readAsDataURL(file);

    // 서버 업로드
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/uploads/images", { method: "POST", body: formData });

    if (res.ok) {
      const url = await res.text();
      detailEntries[index] = { ...detailEntries[index], imageUrl: url };
    } else {
      alert("상세 이미지 업로드 실패");
    }
  });

  // 새 항목 초기화
  detailEntries.push({ title: "", description: "", imageUrl: "" });

  // 값 변경 반영
  div.querySelector(".detail-title").addEventListener("input", e => {
    detailEntries[index].title = e.target.value;
  });
  div.querySelector(".detail-desc").addEventListener("input", e => {
    detailEntries[index].description = e.target.value;
  });
});

// ===== 최종 등록 =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!uploadedCoverUrl) {
    alert("대표 이미지를 업로드하세요!");
    return;
  }

  const data = {
    title: $("#title").value,
    creator: $("#creator").value,
    description: $("#description").value,
    coverUrl: uploadedCoverUrl,
    link: $("#link").value,
    tags: $("#tags").value.split(",").map(t => t.trim()),
    details: detailEntries // 상세 항목들
  };

  const res = await fetch("/api/portfolios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("프로젝트가 등록되었습니다!");
    location.href = "/";
  } else {
    alert("등록 실패");
  }
});