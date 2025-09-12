// admin-folio.js - 자기소개 관리 페이지용 JavaScript

const $ = (sel, ctx = document) => ctx.querySelector(sel);

// 전역 상태: 이미지 URL 및 동적 폼 데이터 관리
let uploadedProfileUrl = "";
let educations = [];
let careers = [];

// 자기소개 ID는 1로 고정
const folioId = 1;

/**
 * 페이지 로드 시 실행될 초기화 함수
 */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`/api/folios/${folioId}`);
    if (!res.ok) throw new Error('자기소개 데이터를 불러올 수 없습니다.');
    const folio = await res.json();

    // 기본 정보 채우기
    $("#name").value = folio.name || '';
    $("#bio").value = folio.bio || '';
    $("#skills").value = folio.skills || '';
    uploadedProfileUrl = folio.profileImg || '';
    
    if (folio.profileImg) {
      $("#preview").src = folio.profileImg;
      $("#preview").style.display = "block";
    }

    // 기존 학력/경력 데이터로 폼 렌더링
    educations = folio.educations || [];
    careers = folio.careers || [];
    renderLists();

  } catch (error) {
    console.error('자기소개 로드 오류:', error);
  }
});

/**
 * 학력/경력 목록을 화면에 렌더링하는 함수
 */
function renderLists() {
  const eduContainer = $("#educationsContainer");
  const carContainer = $("#careersContainer");
  
  eduContainer.innerHTML = '';
  carContainer.innerHTML = '';

  educations.forEach((edu, index) => {
    eduContainer.appendChild(createItemForm('education', edu, index));
  });
  
  careers.forEach((car, index) => {
    carContainer.appendChild(createItemForm('career', car, index));
  });
}

/**
 * 학력 또는 경력 입력 폼 1개를 생성하는 함수
 * @param {string} type - 'education' 또는 'career'
 * @param {object} item - 데이터 객체
 * @param {number} index - 배열 인덱스
 */
function createItemForm(type, item, index) {
  const container = document.createElement("div");
  container.className = "detail-card";
  container.innerHTML = `
    <label>기간</label>
    <input type="text" class="item-period" value="${item.period || ''}" 
           placeholder="예: 2020.01 - 2022.12">
    <label>제목</label>
    <input type="text" class="item-title" value="${item.title || ''}" 
           placeholder="예: OOO대학교 또는 OOO회사">
    <label>부제목</label>
    <input type="text" class="item-subtitle" value="${item.subtitle || ''}" 
           placeholder="예: 컴퓨터공학과 또는 백엔드 개발자">
    <button type="button" class="btn-remove">삭제</button>
  `;

  // 입력 시 데이터 배열에 즉시 반영
  const targetArray = (type === 'education' ? educations : careers);
  
  container.querySelector('.item-period').addEventListener('input', (e) => {
    targetArray[index].period = e.target.value;
  });
  
  container.querySelector('.item-title').addEventListener('input', (e) => {
    targetArray[index].title = e.target.value;
  });
  
  container.querySelector('.item-subtitle').addEventListener('input', (e) => {
    targetArray[index].subtitle = e.target.value;
  });

  // 삭제 버튼 클릭 시 배열에서 제거하고 다시 렌더링
  container.querySelector('.btn-remove').addEventListener('click', () => {
    if (type === 'education') {
      educations.splice(index, 1);
    } else {
      careers.splice(index, 1);
    }
    renderLists();
  });

  return container;
}

// '학력 추가' 버튼 이벤트
$("#addEducationBtn")?.addEventListener("click", () => {
  educations.push({period: '', title: '', subtitle: ''});
  renderLists();
});

// '경력 추가' 버튼 이벤트
$("#addCareerBtn")?.addEventListener("click", () => {
  careers.push({period: '', title: '', subtitle: ''});
  renderLists();
});

// 프로필 이미지 업로드 이벤트
$("#profileFile")?.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 파일 유효성 검사
  if (!file.type.startsWith('image/')) {
    alert("이미지 파일만 업로드 가능합니다.");
    e.target.value = '';
    return;
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB
    alert("파일 크기는 10MB 이하로 업로드해주세요.");
    e.target.value = '';
    return;
  }

  try {
    // 1. 프론트엔드에서 미리보기 구현
    const reader = new FileReader();
    reader.onload = ev => {
      const previewEl = $("#preview");
      if (previewEl) {
        previewEl.src = ev.target.result;
        previewEl.style.display = "block";
      }
    };
    reader.readAsDataURL(file);

    // 2. 서버로 이미지 파일 업로드
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch("/api/uploads/images", { 
      method: "POST", 
      body: formData 
    });

    if (res.ok) {
      uploadedProfileUrl = await res.text();
      console.log("프로필 이미지 업로드 성공:", uploadedProfileUrl);
    } else {
      const errorText = await res.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    alert(`이미지 업로드에 실패했습니다: ${error.message}`);
    
    // 업로드 실패 시 미리보기도 제거
    const previewEl = $("#preview");
    if (previewEl) {
      previewEl.style.display = "none";
      previewEl.src = "";
    }
    e.target.value = '';
  }
});

// '수정 완료' 버튼 이벤트
$("#submitBtn")?.addEventListener("click", async () => {
  // 필수 필드 검증
  const name = $("#name")?.value?.trim();
  const bio = $("#bio")?.value?.trim();
  
  if (!name) {
    alert("이름은 필수 입력 항목입니다.");
    $("#name")?.focus();
    return;
  }
  
  if (!bio) {
    alert("자기소개는 필수 입력 항목입니다.");
    $("#bio")?.focus();
    return;
  }

  // 화면의 모든 데이터를 종합하여 DTO 생성
  const folioDto = {
    id: folioId,
    name: name,
    bio: bio,
    skills: $("#skills")?.value?.trim() || '',
    profileImg: uploadedProfileUrl || '',
    educations: educations.filter(edu => edu.period || edu.title || edu.subtitle),
    careers: careers.filter(car => car.period || car.title || car.subtitle)
  };

  try {
    const res = await fetch(`/api/folios/${folioId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(folioDto)
    });

    if (res.ok) {
      alert("자기소개가 성공적으로 저장되었습니다!");
      // 저장 후 자기소개 공개 페이지로 이동
      window.location.href = `/folio/${folioId}`;
    } else {
      const errorText = await res.text();
      throw new Error(errorText || `서버 오류 (${res.status})`);
    }
  } catch (error) {
    console.error("자기소개 저장 오류:", error);
    alert(`자기소개 저장에 실패했습니다:\n${error.message}`);
  }
});