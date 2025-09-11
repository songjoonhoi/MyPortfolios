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
    return pageData.content;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    state.isLoading = false;
  }
}

function renderDetail(p) {
  if (!p) {
    const detailband = document.querySelector('.detailband');
    if (detailband) {
      detailband.innerHTML = '<p class="note">프로젝트를 찾을 수 없습니다.</p>';
    }
    return;
  }
  
  const elements = {
    detailTitle: $("#detailTitle"),
    detailProjectTitle: $("#detailProjectTitle"),
    detailDesc: $("#detailDesc"),
    detailCover: $("#detailCover"),
    detailCreator: $("#detailCreator"),
    detailDate: $("#detailDate"),
    detailLikes: $("#detailLikes"),
    detailTags: $("#detailTags"),
    detailLink: $("#detailLink")
  };
  
  if (elements.detailTitle) elements.detailTitle.textContent = p.title;
  if (elements.detailProjectTitle) elements.detailProjectTitle.textContent = p.title;
  if (elements.detailDesc) elements.detailDesc.textContent = p.description;
  if (elements.detailCover) elements.detailCover.src = p.coverUrl || '';
  if (elements.detailCreator) elements.detailCreator.textContent = `by ${p.creator}`;
  if (elements.detailDate) elements.detailDate.textContent = new Date(p.createdAt).toLocaleDateString('ko-KR');
  if (elements.detailLikes) elements.detailLikes.textContent = `❤ ${p.likes}`;
  if (elements.detailTags) elements.detailTags.innerHTML = (p.tags || []).map(t => `<span class="tech" data-tech="${t}">${t}</span>`).join("");
  if (elements.detailLink) elements.detailLink.href = p.link || '#';
  
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
  if (!grid) return;
  
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
  
  const btnLoadMore = $("#btnLoadMore");
  if (btnLoadMore) {
    btnLoadMore.classList.toggle("hidden", state.isLastPage);
  }
}

function renderGallery(details) {
  const grid = $("#galleryGrid");
  if (!grid) return;
  
  if (!details || details.length === 0) {
    grid.innerHTML = '<p class="note" style="grid-column: 1/-1; text-align: center; padding: 2rem;">등록된 상세 이미지가 없습니다.</p>';
    return;
  }
  
  state.gallery = details;
  grid.innerHTML = "";
  
  details.forEach((detail, index) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.cursor = "pointer";
    
    const placeholder = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#365cff"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#fff" text-anchor="middle" dy=".3em">No Image</text>
      </svg>
    `)}`;
    
    card.innerHTML = `
      <figure class="card-media">
        <img src="${detail.imageUrl || placeholder}" 
             alt="${detail.title || '상세 이미지'}"
             onerror="this.src='${placeholder}'; this.onerror=null;" />
      </figure>
      <div class="card-body">
        <h3 class="card-title">${detail.title || '제목 없음'}</h3>
        <p class="card-desc">${detail.description || '설명 없음'}</p>
      </div>
    `;
    
    card.addEventListener("click", () => openModal(index));
    grid.appendChild(card);
  });
}

function openModal(index) {
  if (!state.gallery || state.gallery.length === 0) return;
  
  state.currentIndex = index;
  const detail = state.gallery[index];
  const modal = $("#imageModal");
  const modalImage = $("#modalImage");
  
  if (!modal || !modalImage) return;
  
  modalImage.src = detail.imageUrl || '';
  modalImage.alt = detail.title || '상세 이미지';
  modal.showModal();
  
  const prevBtn = $("#modalPrev");
  const nextBtn = $("#modalNext");
  if (prevBtn) prevBtn.style.display = state.gallery.length > 1 ? "block" : "none";
  if (nextBtn) nextBtn.style.display = state.gallery.length > 1 ? "block" : "none";
}

function closeModal() {
  const modal = $("#imageModal");
  if (modal) modal.close();
}

function showPrev() {
  if (state.gallery && state.gallery.length > 1) {
    state.currentIndex = (state.currentIndex - 1 + state.gallery.length) % state.gallery.length;
    openModal(state.currentIndex);
  }
}

function showNext() {
  if (state.gallery && state.gallery.length > 1) {
    state.currentIndex = (state.currentIndex + 1) % state.gallery.length;
    openModal(state.currentIndex);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const projectId = location.pathname.split("/").pop();
  const project = await fetchProject(projectId);
  renderDetail(project);
  renderOtherProjectsGrid();
  
  const btnLoadMore = $("#btnLoadMore");
  if (btnLoadMore) {
    btnLoadMore.addEventListener("click", () => { 
      state.page++; 
      renderOtherProjectsGrid(); 
    });
  }
  
  // 모달 이벤트
  const modalClose = $("#modalClose");
  const modalPrev = $("#modalPrev");
  const modalNext = $("#modalNext");
  const imageModal = $("#imageModal");
  
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalPrev) modalPrev.addEventListener("click", showPrev);
  if (modalNext) modalNext.addEventListener("click", showNext);
  
  if (imageModal) {
    imageModal.addEventListener("click", (e) => {
      if (e.target === imageModal) closeModal();
    });
  }
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });
});