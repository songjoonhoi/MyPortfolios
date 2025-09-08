const $ = (sel, ctx=document)=>ctx.querySelector(sel);
const $$ = (sel, ctx=document)=>Array.from(ctx.querySelectorAll(sel));

const state = { page:1, pageSize:5, gallery:[], currentIndex:0 };

// ===== API =====
async function fetchProject(id){
  const res = await fetch(`/api/portfolios/${id}`);
  return await res.json();
}
async function fetchProjects(){
  const res = await fetch("/api/portfolios");
  return await res.json();
}

// ===== 상세 표시 =====
function renderDetail(p){
  $("#detailTitle").textContent = p.title;
  $("#detailProjectTitle").textContent = p.title;
  $("#detailDesc").textContent = p.description;
  $("#detailCover").src = p.coverUrl;
  $("#detailCreator").textContent = `by ${p.creator}`;
  $("#detailDate").textContent = p.createdAt;
  $("#detailLikes").textContent = `❤ ${p.likes}`;
  $("#detailTags").innerHTML = p.tags.map(t=>`<span class="tech" data-tech="${t}">${t}</span>`).join("");
  $("#detailLink").href = p.link;

  // ✅ 갤러리 표시
  renderGallery(p.details || []);
}

// ===== 태그 클릭 → 홈 검색 =====
function attachTagHandlers(){
  $$(".tech").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const tech=btn.dataset.tech;
      location.href=`/?q=${encodeURIComponent(tech)}`;
    });
  });
}

// ===== 관련 프로젝트 카드 =====
function createCard(project){
  const el=document.createElement("article");
  el.className="card";
  el.innerHTML=`
    <figure class="card-media"><img src="${project.coverUrl}" alt="${project.title}"></figure>
    <div class="card-body">
      <h3 class="card-title">${project.title}</h3>
      <div class="card-meta">
        <span>${project.creator}</span> •
        <span>${project.createdAt}</span> •
        ❤ ${project.likes}
      </div>
    </div>
    <div class="card-actions">
      <a href="/projects/${project.id}" class="btn view">자세히</a>
    </div>
  `;
  return el;
}
async function renderGrid(){
  const grid=$("#grid");
  const data=await fetchProjects();
  const slice=data.slice(0,state.page*state.pageSize);
  grid.innerHTML="";
  slice.forEach(p=>grid.appendChild(createCard(p)));
  $("#btnLoadMore").classList.toggle("hidden", slice.length>=data.length);
}

// ===== 갤러리 렌더링 =====
function renderGallery(details) {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = "";

  if (!details || details.length === 0) {
    grid.innerHTML = `<p class="note">등록된 상세 이미지가 없습니다.</p>`;
    return;
  }

  state.gallery = details.map(d => d.imageUrl);

  details.forEach((d, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <figure class="card-media">
        <img src="${d.imageUrl}" alt="${d.title}"/>
      </figure>
      <div class="card-body">
        <h4 class="card-title">${d.title}</h4>
        <p class="card-desc">${d.description}</p>
      </div>
    `;
    card.addEventListener("click", ()=>openModal(i));
    grid.appendChild(card);
  });
}

// ===== 모달 기능 =====
function openModal(index) {
  const modal = $("#imageModal");
  const modalImg = $("#modalImage");
  state.currentIndex = index;
  modalImg.src = state.gallery[state.currentIndex];
  modal.showModal();
}
function closeModal() { $("#imageModal").close(); }
function showPrev() {
  if (state.gallery.length === 0) return;
  state.currentIndex = (state.currentIndex - 1 + state.gallery.length) % state.gallery.length;
  $("#modalImage").src = state.gallery[state.currentIndex];
}
function showNext() {
  if (state.gallery.length === 0) return;
  state.currentIndex = (state.currentIndex + 1) % state.gallery.length;
  $("#modalImage").src = state.gallery[state.currentIndex];
}

// ===== 초기화 =====
document.addEventListener("DOMContentLoaded",async()=>{
  const id = location.pathname.split("/").pop();
  const project=await fetchProject(id);
  renderDetail(project);
  attachTagHandlers();
  renderGrid();

  $("#btnLoadMore").addEventListener("click",()=>{state.page++;renderGrid();});
  $("#btnToTop").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
  window.addEventListener("scroll",()=>$("#btnToTop").classList.toggle("hidden",window.scrollY<600));

  // 📌 모달 이벤트
  $("#modalClose").addEventListener("click", closeModal);
  $("#modalPrev").addEventListener("click", showPrev);
  $("#modalNext").addEventListener("click", showNext);

  // 키보드 ← → ESC 지원
  document.addEventListener("keydown",(e)=>{
    if (!$("#imageModal").open) return;
    if (e.key==="ArrowLeft") showPrev();
    if (e.key==="ArrowRight") showNext();
    if (e.key==="Escape") closeModal();
  });
});
