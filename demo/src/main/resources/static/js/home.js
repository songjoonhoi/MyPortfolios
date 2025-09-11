const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const state = {
  query: "",
  sort: "latest",
  page: 0,
  pageSize: 9,
  isLastPage: false,
  isLoading: false,
};

// 날짜 포맷
const formatDate = iso => new Date(iso).toLocaleDateString('ko-KR');

// 기본 placeholder 이미지 생성
function createPlaceholderImage(text = 'No Image', color = '#365cff') {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#fff" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `)}`;
}

// 태그 뱃지 렌더링
function renderTagBadges(tags){
  if (!tags || tags.length === 0) return '';
  
  const show = tags.slice(0, 3);
  const hidden = tags.length - show.length;
  const html = show.map(t => `<span class="tag-badge">${t}</span>`).join("");
  return html + (hidden > 0 ? `<span class="tag-badge more">+${hidden}</span>` : "");
}

// 카드 생성
function createCard(project){
  const el = document.createElement("article");
  el.className = "card";
  
  const imageUrl = project.coverUrl || createPlaceholderImage('No Image');
  const fallbackImage = createPlaceholderImage('Image Error', '#f56565');
  
  el.innerHTML = `
    <figure class="card-media">
      <img src="${imageUrl}" 
           alt="${project.title}"
           onerror="this.src='${fallbackImage}'; this.onerror=null;" />
    </figure>
    <div class="card-body">
      <h3 class="card-title">${project.title}</h3>
      <div class="card-meta">
        <span>${project.creator}</span> •
        <span>${formatDate(project.createdAt)}</span> •
        ❤ ${project.likes}
      </div>
      <div class="card-tags">${renderTagBadges(project.tags)}</div>
      <p class="card-desc">${project.description}</p>
    </div>
    <div class="card-actions">
      <a href="/projects/${project.id}" class="btn primary">자세히</a>
      <a href="${project.link || '#'}" class="btn ghost" ${project.link ? 'target="_blank"' : 'onclick="return false;"'}>원본</a>
    </div>
  `;
  return el;
}

// 그리드 렌더링
function renderGrid(projects) {
  const grid = $("#grid");
  
  if (state.page === 0) {
    grid.innerHTML = "";
  }

  if (projects.length === 0 && state.page === 0) {
    grid.innerHTML = `<p class="note" style="grid-column: 1 / -1;">등록된 프로젝트가 없습니다.</p>`;
    return;
  }
  
  projects.forEach(p => grid.appendChild(createCard(p)));
}

// 데이터 로드
async function loadData() {
  if (state.isLastPage || state.isLoading) return; 

  state.isLoading = true;
  
  try {
    const params = new URLSearchParams({
      page: state.page,
      size: state.pageSize,
      sort: state.sort,
      search: state.query
    });
    
    const res = await fetch(`/api/portfolios?${params}`);
    if (!res.ok) {
      throw new Error(`서버 오류: ${res.status}`);
    }
    
    const pageData = await res.json();
    renderGrid(pageData.content);

    state.isLastPage = pageData.last;
    const btnLoadMore = $("#btnLoadMore");
    if (btnLoadMore) {
      btnLoadMore.classList.toggle("hidden", state.isLastPage);
    }

  } catch (error) {
    console.error("데이터 로드 오류:", error);
    const grid = $("#grid");
    grid.innerHTML = `
      <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 2rem; background: #fff5f5; border-radius: 8px; color: #c53030;">
        <h3>데이터를 불러올 수 없습니다</h3>
        <p>${error.message}</p>
        <button onclick="location.reload()" style="background: #e53e3e; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">다시 시도</button>
      </div>
    `;
  } finally {
    state.isLoading = false;
  }
}

// 검색/정렬 기능
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function handleSearch(e) {
  state.query = e.target.value.trim();
  state.page = 0;
  state.isLastPage = false;
  loadData();
}

function handleSort(e) {
  state.sort = e.target.value;
  state.page = 0;
  state.isLastPage = false;
  loadData();
}

function handleClear() {
  state.query = "";
  state.sort = "latest";
  state.page = 0;
  state.isLastPage = false;
  
  const searchInput = $("#searchInput");
  const sortSelect = $("#sortSelect");
  
  if (searchInput) searchInput.value = "";
  if (sortSelect) sortSelect.value = "latest";
  
  loadData();
}

function attachToolbarHandlers() {
  const searchInput = $("#searchInput");
  const sortSelect = $("#sortSelect");
  const btnClear = $("#btnClear");

  if (searchInput) {
    searchInput.addEventListener("input", debounce(handleSearch, 300));
  }
  
  if (sortSelect) {
    sortSelect.addEventListener("change", handleSort);
  }
  
  if (btnClear) {
    btnClear.addEventListener("click", handleClear);
  }
}

// 초기화
function init() {
  attachToolbarHandlers();
  
  const btnLoadMore = $("#btnLoadMore");
  if (btnLoadMore) {
    btnLoadMore.addEventListener("click", () => {
      state.page++;
      loadData();
    });
  }

  const btnToTop = $("#btnToTop");
  if(btnToTop) {
    btnToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("scroll", () => btnToTop.classList.toggle("hidden", window.scrollY < 600));
  }
  
  loadData();
}

document.addEventListener("DOMContentLoaded", init);