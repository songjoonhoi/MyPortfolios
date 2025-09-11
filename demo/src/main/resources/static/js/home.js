const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const state = {
  data: [],
  query: "",
  sort: "latest",
  page: 1,
  pageSize: 9,
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
  
  // 안전한 이미지 URL 처리
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

// 데이터 필터링/정렬
function getFilteredSortedData(){
  let data = [...state.data];
  const q = state.query.toLowerCase();
  if (q){
    data = data.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.creator.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }
  if (state.sort === "latest"){
    data.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
  } else if (state.sort === "popular"){
    data.sort((a,b)=> b.likes - a.likes);
  } else if (state.sort === "title"){
    data.sort((a,b)=> a.title.localeCompare(b.title,"ko"));
  }
  return data;
}

// 그리드 렌더링
function renderGrid(){
  const grid = $("#grid");
  grid.innerHTML = "";
  const all = getFilteredSortedData();
  const slice = all.slice(0, state.page * state.pageSize);

  if (slice.length === 0){
    grid.innerHTML = `<p class="note">조건에 맞는 프로젝트가 없습니다.</p>`;
    return;
  }
  slice.forEach(p => grid.appendChild(createCard(p)));
  $("#btnLoadMore").classList.toggle("hidden", slice.length >= all.length);
}

// 툴바 이벤트
function attachToolbarHandlers(){
  $("#searchInput").addEventListener("input", e=>{
    state.query = e.target.value.trim();
    state.page = 1;
    renderGrid();
  });
  $("#sortSelect").addEventListener("change", e=>{
    state.sort = e.target.value;
    state.page = 1;
    renderGrid();
  });
  $("#btnClear").addEventListener("click", ()=>{
    state.query = ""; state.sort="latest"; state.page=1;
    $("#searchInput").value="";
    $("#sortSelect").value="latest";
    renderGrid();
  });
  $("#btnLoadMore").addEventListener("click", ()=>{
    state.page++;
    renderGrid();
  });
}

// 데이터 fetch (에러 처리 개선)
async function loadData(){
  try {
    const res = await fetch("/api/portfolios");
    if (!res.ok) {
      throw new Error(`서버 오류: ${res.status}`);
    }
    state.data = await res.json();
    renderGrid();
  } catch (error) {
    console.error("데이터 로드 오류:", error);
    const grid = $("#grid");
    grid.innerHTML = `
      <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 2rem; background: #fff5f5; border-radius: 8px; color: #c53030;">
        <h3>데이터를 불러올 수 없습니다</h3>
        <p>${error.message}</p>
        <button onclick="loadData()" style="background: #e53e3e; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">다시 시도</button>
      </div>
    `;
  }
}

// 초기화
function init(){
  attachToolbarHandlers();
  loadData();
}
document.addEventListener("DOMContentLoaded", init);