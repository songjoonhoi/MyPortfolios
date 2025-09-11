const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// 페이지 상태를 관리하는 객체
const state = {
  page: 0,
  pageSize: 3, // 상세 페이지에서는 관련 프로젝트를 3개만 보여줌
  isLastPage: false,
  isLoading: false,
  gallery: [],
  currentIndex: 0
};

// --- API 호출 함수 ---

// 특정 ID의 프로젝트 상세 정보 가져오기
async function fetchProject(id) {
  try {
    const res = await fetch(`/api/portfolios/${id}`);
    if (!res.ok) throw new Error('프로젝트 정보를 불러오는데 실패했습니다.');
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 다른 프로젝트 목록을 페이지 단위로 가져오기
async function fetchOtherProjects() {
  if (state.isLastPage || state.isLoading) return null;
  state.isLoading = true;
  try {
    const res = await fetch(`/api/portfolios?page=${state.page}&size=${state.pageSize}`);
    if (!res.ok) throw new Error('다른 프로젝트 목록을 불러오는데 실패했습니다.');
    const pageData = await res.json();
    state.isLastPage = pageData.last;
    return pageData.content; // ✅ 실제 프로젝트 데이터 배열 반환
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    state.isLoading = false;
  }
}

// --- 화면 렌더링 함수 ---

// 메인 프로젝트 상세 정보 표시
function renderDetail(p) {
  if (!p) {
    document.querySelector('.detailband').innerHTML = '<p class="note">프로젝트를 찾을 수 없습니다.</p>';
    return;
  }
  $("#detailTitle").textContent = p.title;
  $("#detailProjectTitle").textContent = p.title;
  $("#detailDesc").textContent = p.description;
  $("#detailCover").src = p.coverUrl || '';
  $("#detailCover").alt = p.title;
  $("#detailCreator").textContent = `by ${p.creator}`;
  $("#detailDate").textContent = new Date(p.createdAt).toLocaleDateString('ko-KR');
  $("#detailLikes").textContent = `❤ ${p.likes}`;
  $("#detailTags").innerHTML = (p.tags || []).map(t => `<span class="tech" data-tech="${t}">${t}</span>`).join("");
  $("#detailLink").href = p.link;
  renderGallery(p.details || []);
}

// 다른 프로젝트 카드 1개 생성
function createCard(project) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <figure class="card-media"><img src="${project.coverUrl || ''}" alt="${project.title}"></figure>
    <div class="card-body">
      <h3 class="card-title">${project.title}</h3>
      <div class="card-meta">
        <span>${project.creator}</span> •
        <span>${new Date(project.createdAt).toLocaleDateString('ko-KR')}</span> •
        ❤ ${project.likes}
      </div>
    </div>
    <div class="card-actions">
      <a href="/projects/${project.id}" class="btn primary">자세히</a>
    </div>
  `;
  return el;
}

// ✅ '다른 프로젝트' 그리드 렌더링 함수 (오류 수정)
async function renderOtherProjectsGrid() {
  const grid = $("#grid");
  if (state.page === 0) grid.innerHTML = "";

  const projects = await fetchOtherProjects(); // ✅ 이제 'projects'는 순수한 배열
  
  if (projects && projects.length > 0) {
    // ✅ .slice() 없이 바로 forEach를 사용
    projects.forEach(p => {
      const currentProjectId = location.pathname.split("/").pop();
      if (p.id.toString() !== currentProjectId) {
        grid.appendChild(createCard(p));
      }
    });
  }

  $("#btnLoadMore").classList.toggle("hidden", state.isLastPage);
}

// 상세 갤러리 렌더링
function renderGallery(details) {
  const grid = $("#galleryGrid");
  grid.innerHTML = "";
  if (!details || details.length === 0) {
    grid.innerHTML = `<p class="note" style="grid-column: 1 / -1;">등록된 상세 이미지가 없습니다.</p>`;
    return;
  }
  state.gallery = details;
  details.forEach((d, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <figure class="card-media">
        <img src="${d.imageUrl || ''}" alt="${d.title}"/>
      </figure>
      <div class="card-body">
        <h4 class="card-title">${d.title}</h4>
        <p class="card-desc">${d.description}</p>
      </div>
    `;
    card.addEventListener("click", () => openModal(i));
    grid.appendChild(card);
  });
}

// --- 모달 관련 함수 ---
function openModal(index) {
  const modal = $("#imageModal");
  if (!modal) return;
  const modalImg = $("#modalImage");
  state.currentIndex = index;
  modalImg.src = state.gallery[state.currentIndex].imageUrl;
  modal.showModal();
}
function closeModal() { 
  const modal = $("#imageModal");
  if (modal) modal.close(); 
}
function showPrev() {
  if (state.gallery.length === 0) return;
  state.currentIndex = (state.currentIndex - 1 + state.gallery.length) % state.gallery.length;
  $("#modalImage").src = state.gallery[state.currentIndex].imageUrl;
}
function showNext() {
  if (state.gallery.length === 0) return;
  state.currentIndex = (state.currentIndex + 1) % state.gallery.length;
  $("#modalImage").src = state.gallery[state.currentIndex].imageUrl;
}


// --- 이벤트 핸들러 부착 함수 ---
function attachLikeHandler(projectId) {
  const likeBtn = $("#detailLikes");
  if (!likeBtn) return;
  
  likeBtn.addEventListener("click", async () => {
    if (likeBtn.classList.contains('liked')) return;
    try {
      const res = await fetch(`/api/portfolios/${projectId}/like`, { method: "POST" });
      if (!res.ok) throw new Error('좋아요 처리에 실패했습니다.');
      const updatedProject = await res.json();
      likeBtn.textContent = `❤ ${updatedProject.likes}`;
      likeBtn.classList.add('liked'); // 중복 클릭 방지
    } catch (error) {
      console.error("좋아요 오류:", error);
      alert(error.message);
    }
  });
}

function attachTagHandlers() {
  $("#detailTags").addEventListener("click", (e) => {
    if (e.target.classList.contains("tech")) {
      const tech = e.target.dataset.tech;
      location.href = `/?q=${encodeURIComponent(tech)}`;
    }
  });
}

// --- 초기화 ---
document.addEventListener("DOMContentLoaded", async () => {
  const projectId = location.pathname.split("/").pop();
  
  const project = await fetchProject(projectId);
  renderDetail(project);
  
  renderOtherProjectsGrid();
  
  attachLikeHandler(projectId);
  attachTagHandlers();

  $("#btnLoadMore").addEventListener("click", () => { 
    state.page++; 
    renderOtherProjectsGrid(); 
  });
  
  const btnToTop = $("#btnToTop");
  if (btnToTop) {
    btnToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("scroll", () => btnToTop.classList.toggle("hidden", window.scrollY < 600));
  }

  // 모달 이벤트
  $("#modalClose")?.addEventListener("click", closeModal);
  $("#modalPrev")?.addEventListener("click", showPrev);
  $("#modalNext")?.addEventListener("click", showNext);

  document.addEventListener("keydown", (e) => {
    const modal = $("#imageModal");
    if (!modal?.open) return;
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "Escape") closeModal();
  });
});