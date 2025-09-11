const $ = (sel, ctx = document) => ctx.querySelector(sel);

// 상태 관리
const state = {
  loading: false,
  projects: [],
  error: null
};

// 기본 placeholder 이미지 생성
function createPlaceholderImage(text = 'No Image', color = '#365cff') {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#fff" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `)}`;
}

// API 호출 함수
async function fetchProjects() {
  try {
    state.loading = true;
    showLoading();
    
    const res = await fetch("/api/portfolios");
    
    if (!res.ok) {
      throw new Error(`서버 오류: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    state.projects = data;
    state.error = null;
    
    return data;
  } catch (error) {
    state.error = error.message;
    console.error("프로젝트 조회 오류:", error);
    throw error;
  } finally {
    state.loading = false;
  }
}

// 로딩 상태 표시
function showLoading() {
  const list = $("#adminList");
  list.innerHTML = `
    <div class="loading-container" style="grid-column: 1/-1;">
      <div class="loading">프로젝트를 불러오는 중입니다...</div>
    </div>
  `;
}

// 에러 상태 표시
function showError(message) {
  const list = $("#adminList");
  list.innerHTML = `
    <div class="error-container" style="grid-column: 1/-1;">
      <div class="error-message">
        <h3>오류가 발생했습니다</h3>
        <p>${message}</p>
        <button class="btn-retry" onclick="renderAdminList()">다시 시도</button>
      </div>
    </div>
  `;
}

// 빈 상태 표시
function showEmpty() {
  const list = $("#adminList");
  list.innerHTML = `
    <div class="empty-container" style="grid-column: 1/-1;">
      <div class="note">
        <h3>등록된 프로젝트가 없습니다</h3>
        <p>새 프로젝트를 등록해보세요!</p>
      </div>
    </div>
  `;
}

// 관리자 카드 생성 (개선된 이미지 처리)
function createAdminCard(project) {
  const el = document.createElement("article");
  el.className = "card";
  
  // 날짜 포맷팅
  const formattedDate = project.createdAt ? 
    new Date(project.createdAt).toLocaleDateString('ko-KR') : '날짜 없음';
  
  // 설명 길이 제한
  const truncatedDesc = project.description && project.description.length > 100 ?
    project.description.substring(0, 100) + '...' : (project.description || '설명 없음');

  // 안전한 이미지 URL 처리
  const imageUrl = project.coverUrl || createPlaceholderImage('No Image');
  const fallbackImage = createPlaceholderImage('Image Error', '#f56565');

  el.innerHTML = `
    <figure class="card-media">
      <img src="${imageUrl}" 
           alt="${project.title}"
           onerror="this.src='${fallbackImage}'; this.onerror=null;">
    </figure>
    <div class="card-body">
      <h3 class="card-title">${project.title || '제목 없음'}</h3>
      <p class="card-desc">${truncatedDesc}</p>
      <div class="card-meta">
        <span>👤 ${project.creator || '작성자 미상'}</span>
        <span>📅 ${formattedDate}</span>
        <span>❤️ ${project.likes || 0}</span>
      </div>
    </div>
    <div class="card-actions">
      <button class="btn-edit" data-id="${project.id}">
        ✏️ 수정
      </button>
      <button class="btn-delete" data-id="${project.id}">
        🗑️ 삭제
      </button>
    </div>
  `;

  // 수정 버튼 이벤트
  const editBtn = el.querySelector(".btn-edit");
  editBtn.addEventListener("click", () => {
    location.href = `/admin?id=${project.id}`;
  });

  // 삭제 버튼 이벤트
  const deleteBtn = el.querySelector(".btn-delete");
  deleteBtn.addEventListener("click", () => handleDelete(project));

  return el;
}

// 프로젝트 삭제 처리
async function handleDelete(project) {
  // 삭제 확인
  const confirmMessage = `"${project.title}" 프로젝트를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`;
  if (!confirm(confirmMessage)) {
    return;
  }

  try {
    // 삭제 버튼 비활성화
    const deleteBtn = $(`[data-id="${project.id}"].btn-delete`);
    if (deleteBtn) {
      deleteBtn.disabled = true;
      deleteBtn.textContent = "삭제 중...";
    }

    const res = await fetch(`/api/portfolios/${project.id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      throw new Error(`삭제 실패: ${res.status} ${res.statusText}`);
    }

    // 성공 메시지
    alert("프로젝트가 삭제되었습니다!");
    
    // 목록에서 해당 카드 제거 (애니메이션 효과)
    const cardElement = deleteBtn.closest('.card');
    if (cardElement) {
      cardElement.style.opacity = '0';
      cardElement.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        cardElement.remove();
        
        // 빈 상태 확인
        if (!$("#adminList").children.length) {
          showEmpty();
        }
      }, 300);
    }

  } catch (error) {
    console.error("삭제 오류:", error);
    alert(`삭제 중 오류가 발생했습니다: ${error.message}`);
    
    // 버튼 복원
    const deleteBtn = $(`[data-id="${project.id}"].btn-delete`);
    if (deleteBtn) {
      deleteBtn.disabled = false;
      deleteBtn.innerHTML = "🗑️ 삭제";
    }
  }
}

// 관리자 목록 렌더링
async function renderAdminList() {
  const list = $("#adminList");
  
  try {
    const data = await fetchProjects();
    
    // 목록 초기화
    list.innerHTML = "";

    if (!data || data.length === 0) {
      showEmpty();
      return;
    }

    // 카드 생성 및 추가
    data.forEach((project, index) => {
      const card = createAdminCard(project);
      // 애니메이션 딜레이 설정
      card.style.animationDelay = `${(index * 0.1)}s`;
      list.appendChild(card);
    });

  } catch (error) {
    showError(error.message || "프로젝트를 불러오는 중 오류가 발생했습니다.");
  }
}

// 새로고침 함수
function refreshList() {
  renderAdminList();
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
  renderAdminList();
  
  // 전역 에러 핸들러
  window.addEventListener('unhandledrejection', (event) => {
    console.error('처리되지 않은 Promise 에러:', event.reason);
  });
});

// CSS 스타일 추가 (에러 메시지용)
const style = document.createElement('style');
style.textContent = `
  .error-message {
    text-align: center;
    padding: 3rem 2rem;
    background: #fff5f5;
    border: 2px solid #fed7d7;
    border-radius: 12px;
    color: #c53030;
  }
  
  .error-message h3 {
    margin: 0 0 1rem 0;
    color: #c53030;
  }
  
  .error-message p {
    margin: 0 0 1.5rem 0;
    color: #744210;
  }
  
  .btn-retry {
    background: #e53e3e;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s ease;
  }
  
  .btn-retry:hover {
    background: #c53030;
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
  
  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }
  
  .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }
`;
document.head.appendChild(style);