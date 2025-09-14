// admin-folio.js - 자기소개 관리 페이지용 JavaScript

const $ = (sel, ctx = document) => ctx.querySelector(sel);

// 전역 상태: 이미지 URL 및 동적 폼 데이터 관리
let uploadedProfileUrl = "";
let educations = [];
let careers = [];
let expertises = [];

// 자기소개 ID는 1로 고정
const folioId = 1;

/**
 * 페이지 로드 시 실행될 초기화 함수
 */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`/api/admin/folios/${folioId}`);
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

    // 기존 데이터로 폼 렌더링
    educations = folio.educations || [];
    careers = folio.careers || [];
    expertises = folio.expertises || [];
    
    // 빈 데이터일 때 플레이스홀더 폼 추가
    if (educations.length === 0) addPlaceholderEducation();
    if (careers.length === 0) addPlaceholderCareer();
    if (expertises.length === 0) addPlaceholderExpertise();
    
    renderLists();

  } catch (error) {
    console.error('자기소개 로드 오류:', error);
    // 오류 발생 시 빈 폼들 추가
    addPlaceholderEducation();
    addPlaceholderCareer();
    addPlaceholderExpertise();
    renderLists();
  }
});

/**
 * 빈 학력 폼 추가
 */
function addPlaceholderEducation() {
  educations.push({ period: '', title: '', subtitle: '' });
}

/**
 * 빈 경력 폼 추가
 */
function addPlaceholderCareer() {
  careers.push({ period: '', title: '', subtitle: '' });
}

/**
 * 빈 전문분야 폼 추가
 */
function addPlaceholderExpertise() {
  expertises.push({ description: '' });
}

/**
 * 학력/경력/전문분야 목록을 화면에 렌더링하는 함수
 */
function renderLists() {
  const eduContainer = $("#educationsContainer");
  const carContainer = $("#careersContainer");
  const expContainer = $("#expertisesContainer");
  
  eduContainer.innerHTML = '';
  carContainer.innerHTML = '';
  expContainer.innerHTML = '';

  educations.forEach((edu, index) => {
    eduContainer.appendChild(createItemForm('education', edu, index));
  });
  
  careers.forEach((car, index) => {
    carContainer.appendChild(createItemForm('career', car, index));
  });

  expertises.forEach((exp, index) => {
    expContainer.appendChild(createItemForm('expertise', exp, index));
  });
}

/**
 * 학력, 경력, 전문분야 입력 폼 1개를 생성하는 함수
 * @param {string} type - 'education', 'career', 'expertise'
 * @param {object} item - 데이터 객체
 * @param {number} index - 배열 인덱스
 */
function createItemForm(type, item, index) {
  const container = document.createElement("div");
  container.className = "detail-card";
  
  if (type === 'expertise') {
    const inputId = `expertise-${index}`;
    
    container.innerHTML = `
      <label for="${inputId}">전문 분야</label>
      <input type="text" id="${inputId}" name="${inputId}" class="item-description" value="${item.description || ''}" 
             placeholder="예: AI 기반 시스템 설계 및 개발">
      <button type="button" class="btn-remove">삭제</button>
    `;

    // 입력 시 데이터 배열에 즉시 반영
    container.querySelector('.item-description').addEventListener('input', (e) => {
      expertises[index].description = e.target.value;
    });

    // 삭제 버튼 클릭 시
    container.querySelector('.btn-remove').addEventListener('click', () => {
      expertises.splice(index, 1);
      if (expertises.length === 0) {
        addPlaceholderExpertise();
      }
      renderLists();
    });

  } else {
    // 기존 education, career 로직
    const placeholders = {
      education: {
        period: "예: 2020.03 - 2024.02",
        title: "예: 서울대학교",
        subtitle: "예: 컴퓨터공학과 학사"
      },
      career: {
        period: "예: 2021.01 - 현재",
        title: "예: 카카오",
        subtitle: "예: 백엔드 개발자"
      }
    };
    
    const ph = placeholders[type];
    const periodId = `${type}-period-${index}`;
    const titleId = `${type}-title-${index}`;
    const subtitleId = `${type}-subtitle-${index}`;
    
    container.innerHTML = `
      <label for="${periodId}">기간</label>
      <input type="text" id="${periodId}" name="${periodId}" class="item-period" value="${item.period || ''}" 
             placeholder="${ph.period}">
      <label for="${titleId}">${type === 'education' ? '학교명' : '회사명'}</label>
      <input type="text" id="${titleId}" name="${titleId}" class="item-title" value="${item.title || ''}" 
             placeholder="${ph.title}">
      <label for="${subtitleId}">${type === 'education' ? '전공 및 학위' : '직책'}</label>
      <input type="text" id="${subtitleId}" name="${subtitleId}" class="item-subtitle" value="${item.subtitle || ''}" 
             placeholder="${ph.subtitle}">
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

    // 삭제 버튼 클릭 시
    container.querySelector('.btn-remove').addEventListener('click', () => {
      if (type === 'education') {
        educations.splice(index, 1);
        if (educations.length === 0) addPlaceholderEducation();
      } else {
        careers.splice(index, 1);
        if (careers.length === 0) addPlaceholderCareer();
      }
      renderLists();
    });
  }

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

// '전문분야 추가' 버튼 이벤트
$("#addExpertiseBtn")?.addEventListener("click", () => {
  expertises.push({description: ''});
  renderLists();
});

// 프로필 이미지 업로드 이벤트
$("#profileFile")?.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert("이미지 파일만 업로드 가능합니다.");
    e.target.value = '';
    return;
  }
  
  if (file.size > 10 * 1024 * 1024) {
    alert("파일 크기는 10MB 이하로 업로드해주세요.");
    e.target.value = '';
    return;
  }

  try {
    const reader = new FileReader();
    reader.onload = ev => {
      const previewEl = $("#preview");
      if (previewEl) {
        previewEl.src = ev.target.result;
        previewEl.style.display = "block";
      }
    };
    reader.readAsDataURL(file);

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

  const folioDto = {
    id: folioId,
    name: name,
    bio: bio,
    skills: $("#skills")?.value?.trim() || '',
    profileImg: uploadedProfileUrl || '',
    educations: educations.filter(edu => edu.period?.trim() || edu.title?.trim() || edu.subtitle?.trim()),
    careers: careers.filter(car => car.period?.trim() || car.title?.trim() || car.subtitle?.trim()),
    expertises: expertises.filter(exp => exp.description?.trim())
  };

  try {
    const res = await fetch(`/api/folios/${folioId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(folioDto)
    });

    if (res.ok) {
      alert("자기소개가 성공적으로 저장되었습니다!");
      window.location.href = `/folio/${folioId}?t=${Date.now()}`;
    } else {
      const errorText = await res.text();
      throw new Error(errorText || `서버 오류 (${res.status})`);
    }
  } catch (error) {
    console.error("자기소개 저장 오류:", error);
    alert(`자기소개 저장에 실패했습니다:\n${error.message}`);
  }
});