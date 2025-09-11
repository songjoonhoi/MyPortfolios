const $ = (sel, ctx=document)=>ctx.querySelector(sel);
const $$ = (sel, ctx=document)=>Array.from(ctx.querySelectorAll(sel));

let uploadedCoverUrl = "";
let detailForms = [];

// ===== URL에서 id 확인 =====
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id");

// ===== 수정 모드면 데이터 불러오기 =====
if (projectId) {
  $("#formTitle").textContent = "프로젝트 수정";
  $("#submitBtn").textContent = "수정 완료";

  fetch(`/api/portfolios/${projectId}`)
    .then(res => res.json())
    .then(p => {
      $("#projectId").value = p.id;
      $("#title").value = p.title;
      $("#creator").value = p.creator;
      $("#description").value = p.description;
      $("#link").value = p.link;
      $("#tags").value = p.tags.join(", ");
      uploadedCoverUrl = p.coverUrl;
      if (p.coverUrl) {
        $("#preview").src = p.coverUrl;
        $("#preview").style.display = "block";
      }

      // 상세 갤러리 불러오기
      if (p.details) {
        p.details.forEach(d => addDetailForm(d));
      }
    });
}

// ===== 상세 갤러리 추가 폼 =====
function addDetailForm(detail={title:"",description:"",imageUrl:""}) {
  const container = document.createElement("div");
  container.className = "detail-card";
  container.innerHTML = `
    <label>상세 제목</label>
    <input type="text" class="detail-title" value="${detail.title}" />

    <label>상세 설명</label>
    <textarea class="detail-desc">${detail.description}</textarea>

    <label>상세 이미지</label>
    <input type="file" class="detail-file" accept="image/*" />
    <img class="detail-preview" style="display:${detail.imageUrl ? "block":"none"};" src="${detail.imageUrl||""}" />

    <button type="button" class="btn-remove">삭제</button>
  `;
  $("#detailsContainer").appendChild(container);

  const obj = { ...detail };
  detailForms.push(obj);

  // 제목/설명 이벤트
  container.querySelector(".detail-title").addEventListener("input", e=>obj.title=e.target.value);
  container.querySelector(".detail-desc").addEventListener("input", e=>obj.description=e.target.value);

  // 이미지 업로드 이벤트
  container.querySelector(".detail-file").addEventListener("change", async (e)=>{
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev=>{
      container.querySelector(".detail-preview").src = ev.target.result;
      container.querySelector(".detail-preview").style.display = "block";
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/uploads/images", { method:"POST", body:formData });
    if (res.ok) obj.imageUrl = await res.text();
  });

  // 삭제 버튼
  container.querySelector(".btn-remove").addEventListener("click", ()=>{
    container.remove();
    detailForms = detailForms.filter(d => d !== obj);
  });
}

$("#addDetailBtn").addEventListener("click", ()=> addDetailForm());

// ===== 등록/수정 버튼 =====
$("#submitBtn").addEventListener("click", async ()=>{
  if (!uploadedCoverUrl) {
    alert("대표 이미지를 업로드하세요!");
    return;
  }

  const data = {
    id: projectId || null,
    title: $("#title").value,
    creator: $("#creator").value,
    description: $("#description").value,
    coverUrl: uploadedCoverUrl,
    link: $("#link").value,
    tags: $("#tags").value.split(",").map(t=>t.trim()),
    details: detailForms
  };

  const method = projectId ? "PUT" : "POST";
  const url = projectId ? `/api/portfolios/${projectId}` : "/api/portfolios";

  const res = await fetch(url, {
    method,
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert(projectId ? "프로젝트가 수정되었습니다!" : "프로젝트가 등록되었습니다!");
    location.href = "/admin-list";
  } else {
    alert("실패했습니다.");
  }
});
