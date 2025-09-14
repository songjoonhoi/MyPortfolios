// detail.js - 기존 파일에서 renderGallery 함수만 교체

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
  if (!projectId) {
    document.body.innerHTML = "<h1>잘못된 접근입니다.</h1>";
    return;
  }

  const project = await fetchProject(projectId);
  if (project) {
    renderDetail(project);
    // ⭐ 여기를 renderStoryGallery로 변경
    renderStoryGallery(project.details || []);
    setupModalEvents();
  } else {
    document.querySelector('main').innerHTML = `<p class="note error">프로젝트 정보를 불러올 수 없습니다.</p>`;
  }
});

/**
 * 특정 ID의 프로젝트 데이터를 API로 요청하는 함수
 */
async function fetchProject(id) {
  try {
    const res = await fetch(`/api/portfolios/${id}`);
    if (!res.ok) throw new Error('프로젝트 정보를 불러오는데 실패했습니다.');
    const data = await res.json();
    console.log('Fetched project data:', data);
    return data;
  } catch (error) {
    console.error('프로젝트 로드 오류:', error);
    return null;
  }
}

/**
 * 프로젝트 상세 정보를 렌더링하는 함수
 */
function renderDetail(p) {
  console.log('Rendering project detail:', p);
  
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
}

/**
 * ⭐ 새로운 스토리형 갤러리를 렌더링하는 함수
 */
function renderStoryGallery(details) {
  const grid = $("#galleryGrid");
  if (!grid) return;
  
  console.log('🎨 Rendering STORY gallery with details:', details);
  
  if (!details || details.length === 0) {
    grid.innerHTML = '<div class="gallery-empty">등록된 상세 이미지가 없습니다.</div>';
    return;
  }
  
  // 이미지가 있는 항목만 필터링
  const validDetails = details.filter(detail => detail.imageUrl && detail.imageUrl.trim());
  
  if (validDetails.length === 0) {
    grid.innerHTML = '<div class="gallery-empty">표시할 수 있는 이미지가 없습니다.</div>';
    return;
  }
  
  state.gallery = validDetails;
  grid.innerHTML = "";
  
  // 각 상세 항목을 스토리형 레이아웃으로 생성
  validDetails.forEach((detail, index) => {
    const storyItem = document.createElement("article");
    storyItem.className = "gallery-story-item";
    
    storyItem.innerHTML = `
      <div class="gallery-image-wrapper" data-index="${index}">
        <img src="${detail.imageUrl}" 
             alt="${detail.title || '상세 이미지'}" 
             loading="lazy">
      </div>
      <div class="gallery-content-wrapper">
        <h4>${detail.title || `단계 ${index + 1}`}</h4>
        <p>${detail.description || '상세 설명이 없습니다.'}</p>
      </div>
    `;
    
    // 이미지 클릭 시 모달 열기
    const imageWrapper = storyItem.querySelector('.gallery-image-wrapper');
    imageWrapper.addEventListener('click', () => openModal(index));
    
    grid.appendChild(storyItem);
  });
  
  console.log('✅ Story gallery rendered successfully');
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