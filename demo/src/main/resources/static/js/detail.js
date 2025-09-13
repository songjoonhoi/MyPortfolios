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
  // [수정] URL에서 ID를 추출하는 대신, HTML에 주입된 변수를 사용합니다.
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
    const data = await res.json();
    console.log('Fetched project data:', data); // 디버그 로그 추가
    return data;
  } catch (error) {
    console.error('프로젝트 로드 오류:', error);
    return null;
  }
}

/**
 * ⭐ [수정] 받아온 프로젝트 데이터로 상세 페이지 UI를 채우는 함수
 * @param {object} p - 프로젝트 데이터 객체
 */
function renderDetail(p) {
  console.log('Rendering project detail:', p); // 디버그 로그 추가
  
  // document.title을 프로젝트 제목으로 변경하여 SEO에 유리하게 만듭니다.
  document.title = `My Portfolio - ${p.title}`;

  // 기본 정보 섹션 채우기
  const titleEl = $('#projectTitle');
  const descriptionEl = $('#projectDescription');
  const creatorEl = $('#projectCreator');
  const dateEl = $('#projectDate');
  const linkEl = $('#projectLink');
  const tagsEl = $('#projectTags');

  if (titleEl) titleEl.textContent = p.title;
  if (descriptionEl) descriptionEl.textContent = p.description;
  if (creatorEl) creatorEl.textContent = `by ${p.creator}`;
  if (dateEl) dateEl.textContent = new Date(p.createdAt).toLocaleDateString('ko-KR');
  if (linkEl) {
    linkEl.href = p.link || '#';
    if (!p.link) linkEl.style.display = 'none';
  }
  if (tagsEl) {
    tagsEl.innerHTML = (p.tags || []).map(t => `<span class="tech">${t}</span>`).join("");
  }

  // 케이스 스터디 섹션 채우기
  const introductionEl = $('#projectIntroduction');
  const problemEl = $('#projectProblem');
  const rolesEl = $('#projectRoles');
  const resultEl = $('#projectResult');

  // ⭐ 안전하게 null/undefined 체크하고 기본값 처리
  if (introductionEl) {
    introductionEl.innerHTML = (p.introduction || '도입부가 작성되지 않았습니다.').replace(/\n/g, '<br>');
  }
  if (problemEl) {
    problemEl.innerHTML = (p.problem || '문제 정의가 작성되지 않았습니다.').replace(/\n/g, '<br>');
  }
  if (rolesEl) {
    rolesEl.innerHTML = (p.roles || '역할 및 기여가 작성되지 않았습니다.').replace(/\n/g, '<br>');
  }
  if (resultEl) {
    resultEl.innerHTML = (p.result || '결과 및 회고가 작성되지 않았습니다.').replace(/\n/g, '<br>');
  }

  console.log('케이스 스터디 필드들:', {
    introduction: p.introduction,
    problem: p.problem,
    roles: p.roles,
    result: p.result
  }); // 디버그 로그 추가
}

/**
 * 상세 갤러리 이미지를 렌더링하는 함수
 * @param {Array} details - 상세 갤러리 데이터 배열
 */
function renderGallery(details) {
  const grid = $("#galleryGrid");
  if (!grid) return;
  
  console.log('Rendering gallery with details:', details); // 디버그 로그 추가
  
  if (!details || details.length === 0) {
    grid.innerHTML = '<p class="note">등록된 상세 이미지가 없습니다.</p>';
    return;
  }
  
  state.gallery = details;
  grid.innerHTML = "";
  
  details.forEach((detail, index) => {
    // 이미지가 없는 항목은 건너뛰기
    if (!detail.imageUrl) {
      console.warn('Detail item without image:', detail);
      return;
    }
    
    const card = document.createElement("article");
    card.className = "gallery-card";
    card.innerHTML = `
      <img src="${detail.imageUrl}" alt="${detail.title || '상세 이미지'}" loading="lazy">
      <div class="card-caption">
        <h4>${detail.title || '제목 없음'}</h4>
        ${detail.description ? `<p>${detail.description}</p>` : ''}
      </div>
    `;
    card.addEventListener("click", () => openModal(index));
    grid.appendChild(card);
  });
}

/**
 * 모달 관련 이벤트를 설정하는 함수
 */
function setupModalEvents() {
    const modal = $("#imageModal");
    if (!modal) return;
    
    const modalClose = $("#modalClose");
    if (modalClose) {
        modalClose.addEventListener("click", () => modal.close());
    }
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.close();
    });
}

function openModal(index) {
  state.currentIndex = index;
  const detail = state.gallery[index];
  const modal = $("#imageModal");
  const modalImage = $("#modalImage");
  
  if (!modal || !detail) return;
  
  if (modalImage) {
    modalImage.src = detail.imageUrl || '';
    modalImage.alt = detail.title || '상세 이미지';
  }
  
  modal.showModal();
}