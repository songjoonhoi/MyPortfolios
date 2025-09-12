const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// 전역 상태 객체
const state = {
  loading: false,
  projects: [],
  error: null
};

/**
 * 모든 프로젝트 데이터를 서버에서 가져옵니다.
 * 페이지네이션 없이 모든 데이터를 가져오기 위해 size를 큰 값으로 설정합니다.
 */
async function fetchAllProjects() {
  state.loading = true;
  showLoading(); // 로딩 UI 표시

  try {
    const res = await fetch("/api/portfolios?page=0&size=200&sort=latest");
    if (!res.ok) {
      throw new Error(`서버 오류: ${res.status} ${res.statusText}`);
    }
    const pageData = await res.json();
    state.projects = pageData.content; // 받아온 데이터를 state에 저장
    return state.projects;
  } catch (error) {
    state.error = error.message;
    console.error("프로젝트 조회 오류:", error);
    showError(error.message); // 에러 UI 표시
    return []; // 오류 발생 시 빈 배열 반환
  } finally {
    state.loading = false;
  }
}

/**
 * 로딩 중임을 나타내는 UI를 표시합니다.
 * '새 프로젝트' 카드는 그대로 두고, 그 뒤에 로딩 메시지를 표시합니다.
 */
function showLoading() {
  const list = $("#adminList");
  if (!list) return;
  // 기존 카드들을 제거하고 로딩 메시지만 추가
  $$('.admin-project-card').forEach(card => card.remove());
  if (!$('.loading-container')) {
    list.insertAdjacentHTML('beforeend', `<div class="loading-container" style="grid-column: 1/-1;"><p class="loading">프로젝트를 불러오는 중입니다...</p></div>`);
  }
}

/**
 * 에러 메시지를 표시합니다.
 */
function showError(message) {
    const list = $("#adminList");
    if (!list) return;
    list.innerHTML = `<div class="error-message" style="grid-column: 1/-1;">오류가 발생했습니다: ${message}</div>`;
}

/**
 * 프로젝트가 없을 때의 UI를 표시합니다.
 * '새 프로젝트' 카드는 이미 HTML에 있으므로, 추가 메시지는 표시하지 않거나 필요 시 다른 방식으로 처리합니다.
 */
function showEmpty() {
    // '새 프로젝트 만들기' 카드 외에 다른 카드가 없으면 비어있는 상태로 간주합니다.
    // 특별한 메시지를 추가하지 않아도 UI상으로 비어있음이 명확합니다.
    console.log("등록된 프로젝트가 없습니다.");
}

/*
 * ▼▼▼ [수정] 새로운 대시보드 디자인에 맞는 프로젝트 카드 생성 함수 ▼▼▼
 * @param {object} project - 프로젝트 데이터 객체
 * @returns {HTMLElement} - 생성된 카드 엘리먼트
 */
function createAdminCard(project) {
  const el = document.createElement("article");
  el.className = "card admin-project-card"; // 새 CSS 클래스 적용

  const formattedDate = new Date(project.createdAt).toLocaleDateString('ko-KR');
  // 태그는 최대 2개까지만 표시
  const tagsHtml = (project.tags || []).slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join("");
  // 대표 이미지가 있으면 썸네일로, 없으면 기본 아이콘 표시
  const mediaHtml = project.coverUrl
    ? `<img src="${project.coverUrl}" alt="${project.title}" class="card-thumbnail">`
    : `<span class="file-icon">📄</span>`;

  el.innerHTML = `
    <div class="card-media">${mediaHtml}</div>
    <div class="card-body">
      <h3 class="card-title">${project.title}</h3>
      <div class="card-tags">${tagsHtml}</div>
      <p class="card-date">${formattedDate} 생성</p>
    </div>
    <div class="card-actions">
      <a href="/admin?id=${project.id}" class="action-btn btn-edit">
        <span>✏️</span> 수정
      </a>
      <button class="action-btn btn-delete">
        <span>🗑️</span> 삭제
      </button>
    </div>
  `;

  // 삭제 버튼 이벤트 리스너 연결
  el.querySelector(".btn-delete").addEventListener("click", () => handleDelete(project.id, project.title));

  return el;
}

/**
 * 프로젝트 삭제 처리 함수
 * @param {number} id - 삭제할 프로젝트 ID
 * @param {string} title - 삭제할 프로젝트 제목
 */
async function handleDelete(id, title) {
  if (!confirm(`'${title}' 프로젝트를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
    return;
  }

  try {
    const res = await fetch(`/api/portfolios/${id}`, { method: "DELETE" });
    if (!res.ok) {
      throw new Error(`삭제 실패: ${res.statusText}`);
    }
    // 성공적으로 삭제되면, 화면에서 해당 카드를 제거
    document.querySelector(`[data-id="${id}"]`)?.closest('.card').remove();
    alert("프로젝트가 삭제되었습니다.");
    renderAdminList(); // 목록을 다시 렌더링하여 UI를 최신 상태로 유지
  } catch (error) {
    console.error("삭제 오류:", error);
    alert(`삭제 중 오류가 발생했습니다: ${error.message}`);
  }
}

/**
 * 전체 관리자 목록을 화면에 렌더링하는 메인 함수
 */
async function renderAdminList() {
  const list = $("#adminList");
  if (!list) return;

  // 기존에 동적으로 추가된 카드들을 모두 제거 ('새 프로젝트' 카드는 남김)
  $$('.admin-project-card').forEach(card => card.remove());
  $('.loading-container')?.remove();

  const projects = await fetchAllProjects();

  $('.loading-container')?.remove(); // 로딩 메시지 제거

  if (state.error) return; // 에러가 있으면 렌더링 중단

  if (projects.length === 0) {
    showEmpty();
  } else {
    projects.forEach((project, index) => {
      const card = createAdminCard(project);
      // 부드러운 등장을 위한 애니메이션 딜레이
      card.style.animation = `fadeInUp 0.5s ${index * 0.1}s both`;
      list.appendChild(card);
    });
  }
}

// '더보기' 메뉴 외 다른 곳을 클릭하면 메뉴가 닫히도록 이벤트 리스너 추가
document.addEventListener('click', function(event) {
    $$('.menu-dropdown.show').forEach(dropdown => {
        if (!dropdown.parentElement.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    });
});

// DOM이 로드되면 프로젝트 목록 렌더링 시작
document.addEventListener("DOMContentLoaded", renderAdminList);