// /static/js/folio.js

document.addEventListener('DOMContentLoaded', function () {
    loadFolioInfo();
    loadProjects();
});

function loadFolioInfo() {
    // [수정된 부분 1] URL을 '/api/folios/1'로 변경
    fetch('/api/folios/1')
        .then(response => {
            if (!response.ok) {
                throw new Error(`서버 응답 오류: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                // (이하 내용은 동일)
                const profileImage = document.getElementById('profile-image');
                if (profileImage && data.photo) {
                    profileImage.src = data.photo;
                }
                const profileName = document.getElementById('profile-name');
                if (profileName) {
                    profileName.textContent = data.name || '이름';
                }
                const profileIntro = document.getElementById('profile-intro');
                if (profileIntro) {
                    profileIntro.textContent = data.intro || '한 줄 소개';
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
    fetch('/api/portfolios')
        .then(response => {
            if (!response.ok) {
                throw new Error(`서버 응답 오류: ${response.status}`);
            }
            return response.json();
        })
        // [수정된 부분 2] pageObject에서 실제 데이터 배열인 .content를 꺼내 사용
        .then(pageObject => {
            const projectsGrid = document.getElementById('projects-grid');
            if (projectsGrid) {
                projectsGrid.innerHTML = '';

                // 실제 프로젝트 배열은 pageObject.content 안에 있습니다.
                const projects = pageObject.content; 

                projects.forEach(project => {
                    const colDiv = document.createElement('div');
                    colDiv.className = 'col';

                    colDiv.innerHTML = `
                        <a href="/detail/${project.id}" class="card-link">
                            <div class="card h-100">
                                <img src="${project.thumbnail}" class="card-img-top" alt="${project.title} 썸네일">
                                <div class="card-body">
                                    <h5 class="card-title">${project.title}</h5>
                                </div>
                            </div>
                        </a>
                    `;
                    projectsGrid.appendChild(colDiv);
                });
            }
        })
        .catch(error => {
            console.error('프로젝트 목록을 불러오는 중 에러가 발생했습니다:', error);
        });
}