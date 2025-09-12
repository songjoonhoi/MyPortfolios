// /static/js/folio.js

document.addEventListener('DOMContentLoaded', function () {
    loadFolioInfo();
    loadProjects();
});

function loadFolioInfo() {
    // ✅ 수정: URL을 '/api/folios/1'로 고정
    fetch('/api/folios/1')
        .then(response => {
            if (!response.ok) {
                throw new Error(`서버 응답 오류: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                // ✅ 수정: profileImg 필드명 변경 (photo → profileImg)
                const profileImage = document.getElementById('profile-image');
                if (profileImage && data.profileImg) {
                    profileImage.src = data.profileImg;
                }
                
                const profileName = document.getElementById('profile-name');
                if (profileName) {
                    profileName.textContent = data.name || '이름';
                }
                
                // ✅ 수정: bio 필드명 변경 (intro → bio)
                const profileIntro = document.getElementById('profile-intro');
                if (profileIntro) {
                    profileIntro.textContent = data.bio || '한 줄 소개';
                }
                
                const skillsContainer = document.getElementById('skills-container');
                if (skillsContainer && data.skills) {
                    const skillsArray = data.skills.split(',').map(skill => skill.trim());
                    let skillsHtml = '';
                    skillsArray.forEach(skill => {
                        skillsHtml += `<span class="badge bg-secondary me-1 mb-1">${skill}</span>`;
                    });
                    skillsContainer.innerHTML = skillsHtml;
                }
            }
        })
        .catch(error => {
            console.error('자기소개 정보를 불러오는 중 에러가 발생했습니다:', error);
        });
}

function loadProjects() {
    fetch('/api/portfolios?page=0&size=6&sort=latest') // 최신 6개만 가져오기
        .then(response => {
            if (!response.ok) {
                throw new Error(`서버 응답 오류: ${response.status}`);
            }
            return response.json();
        })
        .then(pageObject => {
            const projectsGrid = document.getElementById('projects-grid');
            if (projectsGrid) {
                projectsGrid.innerHTML = '';

                // 실제 프로젝트 배열은 pageObject.content 안에 있습니다.
                const projects = pageObject.content; 

                if (projects.length === 0) {
                    projectsGrid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">등록된 프로젝트가 없습니다.</p>';
                    return;
                }

                projects.forEach(project => {
                    const projectCard = document.createElement('a');
                    projectCard.href = `/projects/${project.id}`;
                    projectCard.className = 'project-card';

                    // 기본 이미지 처리
                    const imageUrl = project.coverUrl || '/img/profile-default.jpg';

                    projectCard.innerHTML = `
                        <img src="${imageUrl}" alt="${project.title} 썸네일" loading="lazy">
                        <div class="project-card-body">
                            <h3 class="project-card-title">${project.title}</h3>
                        </div>
                    `;
                    
                    projectsGrid.appendChild(projectCard);
                });
            }
        })
        .catch(error => {
            console.error('프로젝트 목록을 불러오는 중 에러가 발생했습니다:', error);
            const projectsGrid = document.getElementById('projects-grid');
            if (projectsGrid) {
                projectsGrid.innerHTML = '<p style="text-align: center; color: #e53e3e; grid-column: 1/-1;">프로젝트를 불러오는데 실패했습니다.</p>';
            }
        });
}