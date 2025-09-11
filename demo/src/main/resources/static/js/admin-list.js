const $ = (sel, ctx = document) => ctx.querySelector(sel);

async function fetchProjects() {
  const res = await fetch("/api/portfolios");
  return await res.json();
}

function createAdminCard(project) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <figure class="card-media">
      <img src="${project.coverUrl}" alt="${project.title}">
    </figure>
    <div class="card-body">
      <h3 class="card-title">${project.title}</h3>
      <p class="card-desc">${project.description || ""}</p>
      <div class="card-meta">
        <span>${project.creator}</span> • 
        <span>${project.createdAt}</span> • 
        ❤ ${project.likes}
      </div>
    </div>
    <div class="card-actions">
      <button class="btn-edit">✏ 수정</button>
      <button class="btn-delete">🗑 삭제</button>
    </div>
  `;

  // 수정 버튼 → admin.html?id=프로젝트ID
  el.querySelector(".btn-edit").addEventListener("click", () => {
    location.href = `/admin?id=${project.id}`;
  });

  // 삭제 버튼 → API 호출
  el.querySelector(".btn-delete").addEventListener("click", async () => {
    if (!confirm(`"${project.title}" 프로젝트를 삭제하시겠습니까?`)) return;

    const res = await fetch(`/api/portfolios/${project.id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("삭제되었습니다!");
      el.remove(); // 카드 즉시 삭제
    } else {
      alert("삭제 실패");
    }
  });

  return el;
}

async function renderAdminList() {
  const list = $("#adminList");
  list.innerHTML = "<p>로딩 중...</p>";

  const data = await fetchProjects();
  list.innerHTML = "";

  if (!data.length) {
    list.innerHTML = `<p class="note">등록된 프로젝트가 없습니다.</p>`;
    return;
  }

  data.forEach(p => list.appendChild(createAdminCard(p)));
}

document.addEventListener("DOMContentLoaded", renderAdminList);
