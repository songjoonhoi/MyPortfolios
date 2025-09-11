const $ = (sel, ctx = document) => ctx.querySelector(sel);

let uploadedProfileUrl = "";
const folioId = $("#folioId") ? $("#folioId").value : "1";

document.addEventListener("DOMContentLoaded", () => {
  fetch(`/api/folios/${folioId}`)
    .then(res => {
      if (!res.ok) throw new Error('자기소개 데이터를 불러올 수 없습니다.');
      return res.json();
    })
    .then(folio => {
      const nameEl = $("#name");
      const bioEl = $("#bio");
      const skillsEl = $("#skills");
      const previewEl = $("#preview");
      
      if (nameEl) nameEl.value = folio.name || '';
      if (bioEl) bioEl.value = folio.bio || '';
      if (skillsEl) skillsEl.value = folio.skills || '';
      
      uploadedProfileUrl = folio.profileImg || '';
      if (folio.profileImg && previewEl) {
        previewEl.src = folio.profileImg;
        previewEl.style.display = "block";
      }
    })
    .catch(error => {
      console.error('자기소개 로드 오류:', error);
      // 첫 접근 시 데이터가 없을 수 있으므로 에러 메시지는 표시하지 않음
    });
});

const profileFileEl = $("#profileFile");
if (profileFileEl) {
  profileFileEl.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("파일 크기는 10MB 이하로 업로드해주세요.");
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
      
      const res = await fetch("/api/uploads/images", { method: "POST", body: formData });
      
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
    }
  });
}

const submitBtnEl = $("#submitBtn");
if (submitBtnEl) {
  submitBtnEl.addEventListener("click", async () => {
    const nameEl = $("#name");
    const bioEl = $("#bio");
    const skillsEl = $("#skills");
    
    const name = nameEl ? nameEl.value.trim() : '';
    const bio = bioEl ? bioEl.value.trim() : '';
    
    if (!name || !bio) {
      alert("이름과 자기소개는 필수 입력 항목입니다.");
      return;
    }

    try {
      const data = {
        name: name,
        bio: bio,
        skills: skillsEl ? skillsEl.value.trim() : '',
        profileImg: uploadedProfileUrl,
      };

      const res = await fetch(`/api/folios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        alert("자기소개가 성공적으로 저장되었습니다!");
        location.href = `/folio/1`; 
      } else {
        const errorText = await res.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("자기소개 저장 오류:", error);
      alert(`자기소개 저장에 실패했습니다: ${error.message}`);
    }
  });
}