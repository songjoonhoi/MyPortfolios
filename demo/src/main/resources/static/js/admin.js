const $ = (sel, ctx=document)=>ctx.querySelector(sel);
const $$ = (sel, ctx=document)=>Array.from(ctx.querySelectorAll(sel));

let uploadedCoverUrl = "";
let detailForms = [];

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id");

if (projectId) {
  const formTitle = $("#formTitle");
  const submitBtn = $("#submitBtn");
  
  if (formTitle) formTitle.textContent = "프로젝트 수정";
  if (submitBtn) submitBtn.textContent = "수정 완료";

  fetch(`/api/portfolios/${projectId}`)
    .then(res => {
      if (!res.ok) throw new Error('프로젝트 데이터를 불러올 수 없습니다.');
      return res.json();
    })
    .then(p => {
      const projectIdEl = $("#projectId");
      const titleEl = $("#title");
      const creatorEl = $("#creator");
      const descriptionEl = $("#description");
      const linkEl = $("#link");
      const tagsEl = $("#tags");
      const previewEl = $("#preview");
      
      if (projectIdEl) projectIdEl.value = p.id;
      if (titleEl) titleEl.value = p.title;
      if (creatorEl) creatorEl.value = p.creator;
      if (descriptionEl) descriptionEl.value = p.description;
      if (linkEl) linkEl.value = p.link || '';
      if (tagsEl) tagsEl.value = (p.tags || []).join(", ");
      
      uploadedCoverUrl = p.coverUrl || '';
      if (p.coverUrl && previewEl) {
        previewEl.src = p.coverUrl;
        previewEl.style.display = "block";
      }

      if (p.details) {
        p.details.forEach(d => addDetailForm(d));
      }
    })
    .catch(error => {
      console.error('프로젝트 로드 오류:', error);
      alert('프로젝트 정보를 불러오는데 실패했습니다.');
    });
}

const coverFileEl = $("#coverFile");
if (coverFileEl) {
  coverFileEl.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("파일 크기는 10MB 이하로 업로드해주세요.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = ev => {
        const previewEl = $("#preview");
        if (previewEl) {
          previewEl.src = ev.target.result;
          previewEl.style.display = "block";
        }
      };
      reader.readAsDataURL(file);

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
        const errorText = await res.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      alert(`이미지 업로드에 실패했습니다: ${error.message}`);
    }
  });
}

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
  
  const detailsContainer = $("#detailsContainer");
  if (detailsContainer) {
    detailsContainer.appendChild(container);
  }

  const obj = { ...detail };
  detailForms.push(obj);

  container.querySelector(".detail-title").addEventListener("input", e=>obj.title=e.target.value);
  container.querySelector(".detail-desc").addEventListener("input", e=>obj.description=e.target.value);

  container.querySelector(".detail-file").addEventListener("change", async (e)=>{
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("파일 크기는 10MB 이하로 업로드해주세요.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = ev=>{
        container.querySelector(".detail-preview").src = ev.target.result;
        container.querySelector(".detail-preview").style.display = "block";
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads/images", { method:"POST", body:formData });
      
      if (res.ok) {
        obj.imageUrl = await res.text();
        console.log("상세 이미지 업로드 성공:", obj.imageUrl);
      } else {
        const errorText = await res.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("상세 이미지 업로드 오류:", error);
      alert(`상세 이미지 업로드에 실패했습니다: ${error.message}`);
    }
  });

  container.querySelector(".btn-remove").addEventListener("click", ()=>{
    container.remove();
    detailForms = detailForms.filter(d => d !== obj);
  });
}

const addDetailBtn = $("#addDetailBtn");
if (addDetailBtn) {
  addDetailBtn.addEventListener("click", ()=> addDetailForm());
}

const submitBtn = $("#submitBtn");
if (submitBtn) {
  submitBtn.addEventListener("click", async ()=>{
    const titleEl = $("#title");
    const creatorEl = $("#creator");
    const descriptionEl = $("#description");
    const linkEl = $("#link");
    const tagsEl = $("#tags");
    
    const title = titleEl ? titleEl.value.trim() : '';
    const creator = creatorEl ? creatorEl.value.trim() : '';
    const description = descriptionEl ? descriptionEl.value.trim() : '';
    
    if (!title) {
      alert("프로젝트 제목을 입력해주세요.");
      if (titleEl) titleEl.focus();
      return;
    }
    
    if (!creator) {
      alert("작성자를 입력해주세요.");
      if (creatorEl) creatorEl.focus();
      return;
    }
    
    if (!description) {
      alert("프로젝트 설명을 입력해주세요.");
      if (descriptionEl) descriptionEl.focus();
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
        link: linkEl ? linkEl.value.trim() : '',
        tags: tagsEl ? tagsEl.value.split(",").map(t=>t.trim()).filter(t=>t.length > 0) : [],
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
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("프로젝트 저장 오류:", error);
      alert(`프로젝트 저장에 실패했습니다: ${error.message}`);
    }
  });
}