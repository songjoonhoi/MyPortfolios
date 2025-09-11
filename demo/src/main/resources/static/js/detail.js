const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const state = {
  page: 0,
  pageSize: 3,
  isLastPage: false,
  isLoading: false,
  gallery: [],
  currentIndex: 0
};

// --- API 호출 ---
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

async function fetchOtherProjects() {
  if (state.isLastPage || state.isLoading) return null;
  state.isLoading = true;
  try {
    const res = await fetch(`/api/portfolios?page=${state.page}&size=${state.pageSize}`);
    if (!res.ok) throw new Error('다른 프로젝트 목록을 불러오는데 실패했습니다.');
    const pageData = await res.json();
    state.isLastPage = pageData.last;
    return pageData.content; // 실제 프로젝트 데이터 배열 반환
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    state.isLoading = false;
  }
}

// --- 화면 렌더링 ---
function renderDetail(p) {
  if (!p) {
    document.querySelector('.detailband').innerHTML = '<p class="note">프로젝트를 찾을 수 없습니다.</p>';
    return;
  }
  $("#detailTitle").textContent = p.title;
  $("#detailProjectTitle").textContent = p.title;
  $("#detailDesc").textContent = p.description;
  $("#detailCover").src = p.coverUrl || '';
  $("#detailCreator").textContent = `by ${p.creator}`;
  $("#detailDate").textContent = new Date(p.createdAt).toLocaleDateString('ko-KR');
  $("#detailLikes").textContent = `❤ ${p.likes}`;
  $("#detailTags").innerHTML = (p.tags || []).map(t => `<span class="tech" data-tech="${t}">${t}</span>`).join("");
  $("#detailLink").href = p.link;
  renderGallery(p.details || []);
}

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

async function renderOtherProjectsGrid() {
  const grid = $("#grid");
  if (state.page === 0) grid.innerHTML = "";
  const projects = await fetchOtherProjects();
  if (projects && projects.length > 0) {
    projects.forEach(p => {
      const currentProjectId = location.pathname.split("/").pop();
      if (p.id.toString() !== currentProjectId) {
        grid.appendChild(createCard(p));
      }
    });
  }
  $("#btnLoadMore").classList.toggle("hidden", state.isLastPage);
}

function renderGallery(details) { /* 내용은 이전과 동일하므로 생략 */ }
function openModal(index) { /* 내용은 이전과 동일하므로 생략 */ }
function closeModal() { /* 내용은 이전과 동일하므로 생략 */ }
function showPrev() { /* 내용은 이전과 동일하므로 생략 */ }
function showNext() { /* 내용은 이전과 동일하므로 생략 */ }
function attachLikeHandler(projectId) { /* 내용은 이전과 동일하므로 생략 */ }
function attachTagHandlers() { /* 내용은 이전과 동일하므로 생략 */ }

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
});