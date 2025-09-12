const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// 전역 상태 (갤러리 이미지 관리용)
const state = {
  gallery: [],
  currentIndex: 0
};

/**
 * 페이지 로드 시 실행되는 메인 초기화 함수
 */
document.addEventListener("DOMContentLoaded", async () => {
  // URL에서 프로젝트 ID를 추출합니다.
  const projectId = location.pathname.split("/").pop();
  if (!projectId) {
    document.body.innerHTML = "<h1>잘못된 접근입니다.</h1>";
    return;
  }

  // 프로젝트 데이터를 가져와서 화면에 렌더링합니다.
  const project = await fetchProject(projectId);
  if (project) {
    renderDetail(project);
    renderGallery(project.details || []);
    setupModalEvents();
  } else {
    // 프로젝트 데이터 로드 실패 시 처리
    document.querySelector('main').innerHTML = `<p class="note error">프로젝트 정보를 불러올 수 없습니다.</p>`;
  }
});

/**
 * 특정 ID의 프로젝트 데이터를 API로 요청하는 함수
 * @param {string} id - 프로젝트 ID
 * @returns {Promise<object|null>} 프로젝트 데이터 또는 null
 */
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

/**
 * ▼▼▼ [수정] 받아온 프로젝트 데이터로 상세 페이지 UI를 채우는 함수 ▼▼▼
 * @param {object} p - 프로젝트 데이터 객체
 */
function renderDetail(p) {
  // document.title을 프로젝트 제목으로 변경하여 SEO에 유리하게 만듭니다.
  document.title = `My Portfolio - ${p.title}`;

  // 기본 정보 섹션 채우기
  $('#projectTitle').textContent = p.title;
  $('#projectDescription').textContent = p.description;
  $('#projectCreator').textContent = `by ${p.creator}`;
  $('#projectDate').textContent = new Date(p.createdAt).toLocaleDateString('ko-KR');
  $('#projectLink').href = p.link || '#';
  $('#projectTags').innerHTML = (p.tags || []).map(t => `<span class="tech">${t}</span>`).join("");

  // 케이스 스터디 섹션 채우기
  // DB에 저장된 텍스트의 줄바꿈(\n)을 HTML의 <br> 태그로 변환하여 출력합니다.
  $('#projectIntroduction').innerHTML = p.introduction.replace(/\n/g, '<br>');
  $('#projectProblem').innerHTML = p.problem.replace(/\n/g, '<br>');
  $('#projectRoles').innerHTML = p.roles.replace(/\n/g, '<br>');
  $('#projectResult').innerHTML = p.result.replace(/\n/g, '<br>');
}

/**
 * 상세 갤러리 이미지를 렌더링하는 함수 (기존 로직 유지)
 * @param {Array} details - 상세 갤러리 데이터 배열
 */
function renderGallery(details) {
  const grid = $("#galleryGrid");
  if (!grid) return;
  
  if (!details || details.length === 0) {
    grid.innerHTML = '<p class="note">등록된 상세 이미지가 없습니다.</p>';
    return;
  }
  
  state.gallery = details;
  grid.innerHTML = "";
  
  details.forEach((detail, index) => {
    const card = document.createElement("article");
    card.className = "gallery-card";
    card.innerHTML = `<img src="${detail.imageUrl}" alt="${detail.title}"><div class="card-caption">${detail.title}</div>`;
    card.addEventListener("click", () => openModal(index));
    grid.appendChild(card);
  });
}

/**
 * 모달 관련 이벤트를 설정하는 함수 (기존 로직 유지)
 */
function setupModalEvents() {
    const modal = $("#imageModal");
    if (!modal) return;
    $("#modalClose")?.addEventListener("click", () => modal.close());
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.close();
    });
}

function openModal(index) {
  state.currentIndex = index;
  const detail = state.gallery[index];
  const modal = $("#imageModal");
  if (!modal) return;
  $("#modalImage").src = detail.imageUrl || '';
  $("#modalImage").alt = detail.title || '상세 이미지';
  modal.showModal();
}