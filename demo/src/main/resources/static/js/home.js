const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const state = {
  // data: [], // 전체 데이터를 저장할 필요가 없어짐
  query: "",
  sort: "latest",
  page: 0, // ✅ 페이지 번호는 0부터 시작
  pageSize: 9,
  isLastPage: false, // ✅ 마지막 페이지인지 확인하는 변수 추가
  isLoading: false,  // ✅ 중복 요청 방지를 위한 변수 추가
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

// 카드 생성 (개선된 이미지 처리)
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
      <a href="${project.link}" class="btn ghost" target="_blank">원본</a>
    </div>
  `;
  return el;
}

// 그리드 렌더링 함수 (데이터 추가 방식)
function renderGrid(projects) {
  const grid = $("#grid");
  
  if (state.page === 0) {
      grid.innerHTML = ""; // 첫 페이지일 때만 그리드를 비움
  }

  if (projects.length === 0 && state.page === 0) {
    grid.innerHTML = `<p class="note" style="grid-column: 1 / -1;">등록된 프로젝트가 없습니다.</p>`;
    return;
  }
  
  projects.forEach(p => grid.appendChild(createCard(p)));
}

// 데이터 fetch 함수 (페이징 방식)
async function loadData() {
  if (state.isLastPage || state.isLoading) return; 

  state.isLoading = true;
  
  try {
    const res = await fetch(`/api/portfolios?page=${state.page}&size=${state.pageSize}`);
    if (!res.ok) {
      throw new Error(`서버 오류: ${res.status}`);
    }
    
    const pageData = await res.json();
    renderGrid(pageData.content);

    state.isLastPage = pageData.last;
    $("#btnLoadMore").classList.toggle("hidden", state.isLastPage);

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

// 초기화
function init() {
  // attachToolbarHandlers(); // 검색/정렬 기능은 나중에 페이징과 연동해야 함
  
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
  
  loadData(); // 첫 페이지 데이터 로드
}

document.addEventListener("DOMContentLoaded", init);