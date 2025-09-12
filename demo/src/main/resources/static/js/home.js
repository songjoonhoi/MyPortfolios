// 전역 상태 객체
const state = {
  isLoading: false,
  projects: [],
};

/**
 * 프로젝트 데이터를 가져와 스토리형 레이아웃을 생성하는 메인 함수
 */
async function initProjectShowcase() {
  state.isLoading = true;
  const showcaseContainer = document.getElementById('project-showcase');
  if (!showcaseContainer) return;

  try {
    // API로부터 모든 프로젝트 데이터를 가져옵니다.
    const res = await fetch('/api/portfolios?page=0&size=10&sort=latest');
    if (!res.ok) throw new Error('데이터를 불러오는데 실패했습니다.');
    
    const pageData = await res.json();
    state.projects = pageData.content;

    if (state.projects.length === 0) {
      showcaseContainer.innerHTML = `<p class="note">등록된 프로젝트가 없습니다.</p>`;
      return;
    }

    // 각 프로젝트 데이터로 섹션을 생성하여 컨테이너에 추가
    state.projects.forEach((project, index) => {
      // index를 전달하여 좌우 레이아웃을 교차 배치합니다.
      const projectSection = createProjectSection(project, index);
      showcaseContainer.appendChild(projectSection);
    });

  } catch (error) {
    console.error("쇼케이스 초기화 오류:", error);
    showcaseContainer.innerHTML = `<p class="note error">프로젝트를 불러올 수 없습니다.</p>`;
  } finally {
    state.isLoading = false;
  }
}

/**
 * 프로젝트 데이터로 스토리형 섹션 엘리먼트를 생성하는 함수
 * @param {object} project - 프로젝트 데이터 객체
 * @param {number} index - 프로젝트의 인덱스 (0부터 시작)
 * @returns {HTMLElement} - 생성된 섹션 엘리먼트
 */
function createProjectSection(project, index) {
  const section = document.createElement('section');
  section.className = 'project-entry';

  // index가 짝수이면 'image-left', 홀수이면 'image-right' 클래스 추가
  const layoutType = index % 2 === 0 ? 'image-left' : 'image-right';
  section.classList.add(layoutType);

  const imageUrl = project.coverUrl || 'https://via.placeholder.com/800x600/eee/ccc?text=No+Image';
  const tagsHtml = (project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');

  section.innerHTML = `
    <div class="project-image-wrapper">
      <img src="${imageUrl}" alt="${project.title} 대표 이미지">
    </div>
    <div class="project-details-wrapper">
      <h2 class="project-title">${project.title}</h2>
      <div class="project-tags">${tagsHtml}</div>
      <p class="project-summary">${project.description}</p>
      <a href="/projects/${project.id}" class="btn primary">자세히 보기 &rarr;</a>
    </div>
  `;
  return section;
}

// (기존 코드는 생략) ...

// DOM이 로드되면 쇼케이스 초기화 함수 실행
document.addEventListener('DOMContentLoaded', () => {
    initProjectShowcase().then(() => {
        // 프로젝트 섹션이 모두 생성된 후에 스크롤 애니메이션 설정
        setupScrollAnimations();
    });
});

/**
 * ▼▼▼ [신규] 스크롤 애니메이션을 설정하는 함수 ▼▼▼
 */
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // 화면에 요소가 나타나면 'visible' 클래스 추가
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 한 번 나타난 요소는 다시 관찰할 필요 없음
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // 요소가 10% 보였을 때 애니메이션 시작
    });

    // 모든 프로젝트 섹션을 관찰 대상으로 등록
    document.querySelectorAll('.project-entry').forEach(section => {
        observer.observe(section);
    });
}
