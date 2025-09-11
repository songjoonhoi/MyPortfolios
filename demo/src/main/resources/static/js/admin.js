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

// ===== 🔥 대표 이미지 업로드 이벤트 추가 (누락된 부분) =====
$("#coverFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 파일 유효성 검사
  if (!file.type.startsWith('image/')) {
    alert("이미지 파일만 업로드 가능합니다.");
    return;
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB 제한
    alert("파일 크기는 10MB 이하로 업로드해주세요.");
    return;
  }

  try {
    // 미리보기 표시
    const reader = new FileReader();
    reader.onload = ev => {
      $("#preview").src = ev.target.result;
      $("#preview").style.display = "block";
    };
    reader.readAsDataURL(file);

    // 서버에 업로드
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch("/api/uploads/images", { 
      method: "POST", 
      body: formData 
    });
    
    if (res.ok) {
      uploadedCoverUrl = await res.text();
      console.log("대표 이미지 업로드 성공:", uploadedCoverUrl);
    } else {
      throw new Error("업로드 실패");
    }
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
  }
});

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

  // 이미지 업로드 이벤트 (개선된 버전)
  container.querySelector(".detail-file").addEventListener("change", async (e)=>{
    const file = e.target.files[0];
    if (!file) return;

    // 파일 유효성 검사
    if (!file.type.startsWith('image/')) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB 제한
      alert("파일 크기는 10MB 이하로 업로드해주세요.");
      return;
    }

    try {
      // 미리보기 표시
      const reader = new FileReader();
      reader.onload = ev=>{
        container.querySelector(".detail-preview").src = ev.target.result;
        container.querySelector(".detail-preview").style.display = "block";
      };
      reader.readAsDataURL(file);

      // 서버에 업로드
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads/images", { method:"POST", body:formData });
      
      if (res.ok) {
        obj.imageUrl = await res.text();
        console.log("상세 이미지 업로드 성공:", obj.imageUrl);
      } else {
        throw new Error("업로드 실패");
      }
    } catch (error) {
      console.error("상세 이미지 업로드 오류:", error);
      alert("상세 이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    }
  });

  // 삭제 버튼
  container.querySelector(".btn-remove").addEventListener("click", ()=>{
    container.remove();
    detailForms = detailForms.filter(d => d !== obj);
  });
}

$("#addDetailBtn").addEventListener("click", ()=> addDetailForm());

// ===== 등록/수정 버튼 (유효성 검사 강화) =====
$("#submitBtn").addEventListener("click", async ()=>{
  // 필수 입력값 검사
  const title = $("#title").value.trim();
  const creator = $("#creator").value.trim();
  const description = $("#description").value.trim();
  
  if (!title) {
    alert("프로젝트 제목을 입력해주세요.");
    $("#title").focus();
    return;
  }
  
  if (!creator) {
    alert("작성자를 입력해주세요.");
    $("#creator").focus();
    return;
  }
  
  if (!description) {
    alert("프로젝트 설명을 입력해주세요.");
    $("#description").focus();
    return;
  }

  if (!uploadedCoverUrl) {
    alert("대표 이미지를 업로드해주세요!");
    return;
  }

  try {
    const data = {
      id: projectId || null,
      title: title,
      creator: creator,
      description: description,
      coverUrl: uploadedCoverUrl,
      link: $("#link").value.trim(),
      tags: $("#tags").value.split(",").map(t=>t.trim()).filter(t=>t.length > 0),
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
      const errorText = await res.text();
      throw new Error(`서버 오류: ${errorText}`);
    }
  } catch (error) {
    console.error("프로젝트 저장 오류:", error);
    alert("프로젝트 저장에 실패했습니다. 다시 시도해주세요.");
  }
});