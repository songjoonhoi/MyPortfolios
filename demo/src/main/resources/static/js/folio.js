const $ = (sel, ctx = document) => ctx.querySelector(sel);

const state = {
  folioId: 1
};

async function fetchFolio(id) {
  try {
    const res = await fetch(`/api/folios/${id}`);
    if (!res.ok) {
      throw new Error("자기소개 데이터 로드 실패");
    }
    return await res.json();
  } catch (error) {
    console.error("자기소개 데이터 로드 실패:", error);
    return null;
  }
}

function renderFolio(folio) {
  const el = $("#folioDetail");
  if (!el) return;

  const skillsArray = folio.skills ? folio.skills.split(",") : [];
  
  el.innerHTML = `
    <div class="folio-header">
      <img class="profile-img" src="${folio.profileImg || ''}" alt="${folio.name} 프로필 사진" />
      <h1 class="folio-name">${folio.name || '이름 없음'}</h1>
    </div>
    <p class="folio-bio">${folio.bio || '자기소개가 없습니다.'}</p>
    <h2 class="folio-skill-title">기술 스택</h2>
    <ul class="folio-skills">
      ${skillsArray.map(skill => `<li class="skill-tag">${skill.trim()}</li>`).join("")}
    </ul>
  `;

  el.setAttribute("aria-busy", "false");
}

async function init() {
  const path = location.pathname;
  const match = path.match(/\/folio\/(\d+)/);
  if (match) {
    state.folioId = match[1];
  }

  const folio = await fetchFolio(state.folioId);
  if (folio) {
    renderFolio(folio);
  } else {
    const el = $("#folioDetail");
    if (el) {
      el.innerHTML = '<div class="note">자기소개 정보를 불러올 수 없습니다.</div>';
    }
  }
}

document.addEventListener("DOMContentLoaded", init);