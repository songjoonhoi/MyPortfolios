// ===== 공통 유틸 =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);

const state = {
  folioId: 1 // 기본적으로 /folio/1 을 보여준다고 가정
};

// ===== API 호출 =====
async function fetchFolio(id) {
  const res = await fetch(`/api/folios/${id}`);
  if (!res.ok) {
    console.error("자기소개 데이터 로드 실패:", res.statusText);
    return null;
  }
  return await res.json();
}

// ===== 렌더링 =====
function renderFolio(folio) {
  const el = $("#folioDetail");
  if (!el) return;

  el.innerHTML = `
    <div class="folio-header">
      <img class="profile-img" src="${folio.profileImg}" alt="${folio.name} 프로필 사진" />
      <h1 class="folio-name">${folio.name}</h1>
    </div>
    <p class="folio-bio">${folio.bio}</p>
    <h2 class="folio-skill-title">기술 스택</h2>
    <ul class="folio-skills">
      ${folio.skills.split(",").map(skill => `<li class="skill-tag">${skill.trim()}</li>`).join("")}
    </ul>
  `;

  el.setAttribute("aria-busy", "false");
}

// ===== 초기화 =====
async function init() {
  const path = location.pathname;
  const match = path.match(/\/folio\/(\d+)/);
  if (match) {
    state.folioId = match[1];
  }

  const folio = await fetchFolio(state.folioId);
  if (folio) {
    renderFolio(folio);
  }
}

document.addEventListener("DOMContentLoaded", init);
