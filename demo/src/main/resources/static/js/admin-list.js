const $ = (sel, ctx = document) => ctx.querySelector(sel);

const state = {
  loading: false,
  projects: [],
  error: null
};

function createPlaceholderImage(text = 'No Image', color = '#365cff') {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#fff" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `)}`;
}

async function fetchAllProjects() {
  try {
    state.loading = true;
    showLoading();
    
    const res = await fetch("/api/portfolios?page=0&size=200");
    
    if (!res.ok) {
      throw new Error(`서버 오류: ${res.status} ${res.statusText}`);
    }
    
    const pageData = await res.json();
    state.projects = pageData.content;
    state.error = null;
    
    return state.projects;

  } catch (error) {
    state.error = error.message;
    console.error("프로젝트 조회 오류:", error);
    throw error;
  } finally {
    state.loading = false;
  }
}

function showLoading() {
  const list = $("#adminList");
  if (list) {
    list.innerHTML = `<div class="loading-container" style="grid-column: 1/-1;"><div class="loading">프로젝트를 불러오는 중입니다...</div></div>`;
  }
}

function showError(message) {
  const list = $("#adminList");
  if (list) {
    list.innerHTML = `<div class="error-container" style="grid-column: 1/-1;"><div class="error-message"><h3>오류가 발생했습니다</h3><p>${message}</p><button class="btn-retry" onclick="renderAdminList()">다시 시도</button></div></div>`;
  }
}

function showEmpty() {
  const list = $("#adminList");
  if (list) {
    list.innerHTML = `<div class="empty-container" style="grid-column: 1/-1;"><div class="note"><h3>등록된 프로젝트가 없습니다</h3><p>새 프로젝트를 등록해보세요!</p></div></div>`;
  }
}

function createAdminCard(project) {
  const el = document.createElement("article");
  el.className = "card admin-project-card";
  const formattedDate = project.createdAt ? new Date(project.createdAt).toLocaleDateString('ko-KR') : '날짜 없음';
  const truncatedDesc = project.description && project.description.length > 100 ? project.description.substring(0, 100) + '...' : (project.description || '설명 없음');
  const imageUrl = project.coverUrl || createPlaceholderImage('No Image');
  const fallbackImage = createPlaceholderImage('Image Error', '#f56565');

  el.innerHTML = `
    <figure class="card-media"><img src="${imageUrl}" alt="${project.title}" onerror="this.src='${fallbackImage}'; this.onerror=null;"></figure>
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
      <button class="btn-edit" data-id="${project.id}">✏️ 수정</button>
      <button class="btn-delete" data-id="${project.id}">🗑️ 삭제</button>
    </div>
  `;

  el.querySelector(".btn-edit").addEventListener("click", () => { location.href = `/admin?id=${project.id}`; });
  el.querySelector(".btn-delete").addEventListener("click", () => handleDelete(project));
  return el;
}

async function handleDelete(project) {
  if (!confirm(`"${project.title}" 프로젝트를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) return;
  
  const deleteBtn = $(`[data-id="${project.id}"].btn-delete`);
  try {
    if (deleteBtn) {
      deleteBtn.disabled = true;
      deleteBtn.textContent = "삭제 중...";
    }
    const res = await fetch(`/api/portfolios/${project.id}`, { method: "DELETE" });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `삭제 실패: ${res.status}`);
    }
    
    alert("프로젝트가 삭제되었습니다!");
    const cardElement = deleteBtn.closest('.card');
    if (cardElement) {
      cardElement.style.opacity = '0';
      setTimeout(() => {
        cardElement.remove();
        const adminList = $("#adminList");
        if (adminList && !adminList.children.length) showEmpty();
      }, 300);
    }
  } catch (error) {
    console.error("삭제 오류:", error);
    alert(`삭제 중 오류가 발생했습니다: ${error.message}`);
    if (deleteBtn) {
      deleteBtn.disabled = false;
      deleteBtn.innerHTML = "🗑️ 삭제";
    }
  }
}

async function renderAdminList() {
  const list = $("#adminList");
  if (!list) return;
  
  try {
    const projects = await fetchAllProjects();
    list.innerHTML = "";
    if (!projects || projects.length === 0) {
      showEmpty();
      return;
    }
    projects.forEach((project, index) => {
      const card = createAdminCard(project);
      card.style.animationDelay = `${(index * 0.1)}s`;
      list.appendChild(card);
    });
  } catch (error) {
    showError(error.message || "프로젝트를 불러오는 중 오류가 발생했습니다.");
  }
}

document.addEventListener("DOMContentLoaded", renderAdminList);