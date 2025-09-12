const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// 전역 변수로 업로드된 이미지 URL과 상세 폼 데이터를 관리합니다.
let uploadedCoverUrl = "";
let detailForms = [];

// URL 파라미터에서 프로젝트 ID를 가져옵니다. (수정 모드 확인)
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id");

// projectId가 있는 경우 (수정 모드)
if (projectId) {
    const formTitle = $("#formTitle");
    const submitBtn = $("#submitBtn");

    // UI 텍스트를 '수정'에 맞게 변경
    if (formTitle) formTitle.textContent = "프로젝트 수정";
    if (submitBtn) submitBtn.textContent = "수정 완료";

    // 서버에서 기존 프로젝트 데이터를 가져와 폼에 채웁니다.
    fetch(`/api/portfolios/${projectId}`)
        .then(res => {
            if (!res.ok) throw new Error('프로젝트 데이터를 불러올 수 없습니다.');
            return res.json();
        })
        .then(p => {
            // 기본 정보 필드 채우기
            $("#projectId").value = p.id;
            $("#title").value = p.title;
            $("#creator").value = p.creator;
            $("#description").value = p.description;
            $("#link").value = p.link || '';
            $("#tags").value = (p.tags || []).join(", ");

            // ▼▼▼ [수정] 케이스 스터디 필드 채우기 ▼▼▼
            $("#introduction").value = p.introduction || '';
            $("#problem").value = p.problem || '';
            $("#roles").value = p.roles || '';
            $("#result").value = p.result || '';
            // ▲▲▲ [수정] 케이스 스터디 필드 채우기 ▲▲▲

            // 대표 이미지 미리보기 설정
            uploadedCoverUrl = p.coverUrl || '';
            if (p.coverUrl) {
                const previewEl = $("#preview");
                previewEl.src = p.coverUrl;
                previewEl.style.display = "block";
            }

            // 상세 갤러리 폼 추가
            if (p.details) {
                p.details.forEach(d => addDetailForm(d));
            }
        })
        .catch(error => {
            console.error('프로젝트 로드 오류:', error);
            alert('프로젝트 정보를 불러오는데 실패했습니다.');
        });
}

// 대표 이미지 파일(<input type="file">) 변경 이벤트 처리
$("#coverFile")?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 유효성 검사 (이미지 타입, 크기)
    if (!file.type.startsWith('image/')) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
        alert("파일 크기는 10MB 이하로 업로드해주세요.");
        return;
    }

    try {
        // 1. 프론트엔드에서 미리보기 구현
        const reader = new FileReader();
        reader.onload = ev => {
            const previewEl = $("#preview");
            previewEl.src = ev.target.result;
            previewEl.style.display = "block";
        };
        reader.readAsDataURL(file);

        // 2. 서버로 이미지 파일 업로드
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/uploads/images", { method: "POST", body: formData });

        if (res.ok) {
            uploadedCoverUrl = await res.text(); // 서버에서 반환된 이미지 URL 저장
            console.log("대표 이미지 업로드 성공:", uploadedCoverUrl);
        } else {
            throw new Error(await res.text());
        }
    } catch (error) {
        console.error("이미지 업로드 오류:", error);
        alert(`이미지 업로드에 실패했습니다: ${error.message}`);
    }
});

/**
 * 상세 갤러리 입력 폼을 동적으로 추가하는 함수
 * @param {object} detail - (수정 시) 기존 상세 갤러리 데이터
 */
function addDetailForm(detail = { title: "", description: "", imageUrl: "" }) {
    const container = document.createElement("div");
    container.className = "detail-card";
    container.innerHTML = `
        <label>상세 제목</label>
        <input type="text" class="detail-title" value="${detail.title}" />
        <label>상세 설명</label>
        <textarea class="detail-desc">${detail.description}</textarea>
        <label>상세 이미지</label>
        <input type="file" class="detail-file" accept="image/*" />
        <img class="detail-preview" style="display:${detail.imageUrl ? "block" : "none"};" src="${detail.imageUrl || ""}" />
        <button type="button" class="btn-remove">삭제</button>
    `;
    $("#detailsContainer")?.appendChild(container);

    // 각 폼의 데이터를 관리할 객체 생성 및 배열에 추가
    const formState = { ...detail };
    detailForms.push(formState);

    // 각 입력 필드에 이벤트 리스너를 달아 formState 객체와 동기화
    container.querySelector(".detail-title").addEventListener("input", e => formState.title = e.target.value);
    container.querySelector(".detail-desc").addEventListener("input", e => formState.description = e.target.value);
    container.querySelector(".btn-remove").addEventListener("click", () => {
        container.remove();
        detailForms = detailForms.filter(d => d !== formState); // 배열에서 해당 폼 데이터 제거
    });

    // 상세 이미지 파일 변경 이벤트 처리
    container.querySelector(".detail-file").addEventListener("change", async (e) => {
        // ... (대표 이미지 업로드 로직과 동일)
    });
}

// '상세 추가' 버튼 클릭 이벤트
$("#addDetailBtn")?.addEventListener("click", () => addDetailForm());

// '등록/수정 완료' 버튼 클릭 이벤트
$("#submitBtn")?.addEventListener("click", async () => {
    // 폼 요소들 가져오기
    const titleEl = $("#title");
    const creatorEl = $("#creator");
    const descriptionEl = $("#description");
    // ▼▼▼ [수정] 케이스 스터디 폼 요소 가져오기 ▼▼▼
    const introductionEl = $("#introduction");
    const problemEl = $("#problem");
    const rolesEl = $("#roles");
    const resultEl = $("#result");
    // ▲▲▲ [수정] 케이스 스터디 폼 요소 가져오기 ▲▲▲

    // 폼 유효성 검사
    if (!titleEl.value.trim()) return alert("프로젝트 제목을 입력해주세요.");
    if (!creatorEl.value.trim()) return alert("작성자를 입력해주세요.");
    if (!descriptionEl.value.trim()) return alert("프로젝트 한 줄 요약을 입력해주세요.");
    if (!uploadedCoverUrl) return alert("대표 이미지를 업로드해주세요!");
    // ▼▼▼ [수정] 케이스 스터디 필드 유효성 검사 추가 ▼▼▼
    if (!introductionEl.value.trim()) return alert("프로젝트 도입부를 입력해주세요.");
    if (!problemEl.value.trim()) return alert("문제 정의를 입력해주세요.");
    if (!rolesEl.value.trim()) return alert("역할 및 기여를 입력해주세요.");
    if (!resultEl.value.trim()) return alert("결과 및 회고를 입력해주세요.");
    // ▲▲▲ [수정] 케이스 스터디 필드 유효성 검사 추가 ▲▲▲

    try {
        // 서버로 전송할 데이터 객체 생성
        const data = {
            id: projectId || null,
            title: titleEl.value.trim(),
            creator: creatorEl.value.trim(),
            description: descriptionEl.value.trim(),
            coverUrl: uploadedCoverUrl,
            link: $("#link").value.trim(),
            tags: $("#tags").value.split(",").map(t => t.trim()).filter(Boolean),
            // ▼▼▼ [수정] 케이스 스터디 데이터 추가 ▼▼▼
            introduction: introductionEl.value.trim(),
            problem: problemEl.value.trim(),
            roles: rolesEl.value.trim(),
            result: resultEl.value.trim(),
            // ▲▲▲ [수정] 케이스 스터디 데이터 추가 ▲▲▲
            details: detailForms
        };

        // 수정 모드이면 PUT, 등록 모드이면 POST
        const method = projectId ? "PUT" : "POST";
        const url = projectId ? `/api/portfolios/${projectId}` : "/api/portfolios";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert(projectId ? "프로젝트가 수정되었습니다!" : "프로젝트가 등록되었습니다!");
            location.href = "/admin-list"; // 성공 시 목록 페이지로 이동
        } else {
            throw new Error(await res.text());
        }
    } catch (error) {
        console.error("프로젝트 저장 오류:", error);
        alert(`프로젝트 저장에 실패했습니다: ${error.message}`);
    }
});