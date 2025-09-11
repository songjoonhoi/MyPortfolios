const $ = (sel, ctx = document) => ctx.querySelector(sel);

let uploadedProfileUrl = "";
const folioId = $("#folioId").value;

// ===== 페이지 로드 시 기존 자기소개 데이터 불러오기 =====
document.addEventListener("DOMContentLoaded", () => {
  fetch(`/api/folios/${folioId}`)
    .then(res => res.json())
    .then(folio => {
      $("#name").value = folio.name;
      $("#bio").value = folio.bio;
      $("#skills").value = folio.skills;
      
      uploadedProfileUrl = folio.profileImg; // 기존 이미지 URL 저장
      if (folio.profileImg) {
        $("#preview").src = folio.profileImg;
        $("#preview").style.display = "block";
      }
    });
});

// ===== 프로필 이미지 업로드 이벤트 =====
$("#profileFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert("이미지 파일만 업로드 가능합니다.");
    return;
  }
  if (file.size > 10 * 1024 * 1024) { // 10MB
    alert("파일 크기는 10MB 이하로 업로드해주세요.");
    return;
  }

  try {
    const reader = new FileReader();
    reader.onload = ev => {
      $("#preview").src = ev.target.result;
      $("#preview").style.display = "block";
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch("/api/uploads/images", { method: "POST", body: formData });
    
    if (res.ok) {
      uploadedProfileUrl = await res.text();
      console.log("프로필 이미지 업로드 성공:", uploadedProfileUrl);
    } else {
      throw new Error("이미지 업로드 실패");
    }
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    alert("이미지 업로드에 실패했습니다.");
  }
});

// ===== 수정 완료 버튼 클릭 이벤트 =====
$("#submitBtn").addEventListener("click", async () => {
  const name = $("#name").value.trim();
  const bio = $("#bio").value.trim();
  
  if (!name || !bio) {
    alert("이름과 자기소개는 필수 입력 항목입니다.");
    return;
  }

  try {
    const data = {
      // id: folioId, // ID는 백엔드에서 설정하므로 여기서 보낼 필요 없음
      name: name,
      bio: bio,
      skills: $("#skills").value.trim(),
      profileImg: uploadedProfileUrl,
    };

    // ===== ✅ 요청 URL 및 메서드 변경 =====
    const res = await fetch(`/api/folios`, { // URL에서 ID 제거
      method: "POST", // 메서드를 POST로 변경
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert("자기소개가 성공적으로 저장되었습니다!"); // 메시지 변경
      location.href = `/folio/1`; 
    } else {
      const errorText = await res.text();
      throw new Error(`서버 오류: ${errorText}`);
    }
  } catch (error) {
    console.error("자기소개 저장 오류:", error);
    alert("자기소개 저장에 실패했습니다.");
  }
});