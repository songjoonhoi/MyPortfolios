// folio.js - 새로운 자기소개 페이지용 JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // 페이지 로드 애니메이션
    initPageAnimations();
    
    // 스킬 아이템 호버 효과
    initSkillHoverEffects();
    
    // 기하학적 패턴 애니메이션
    initGeometricAnimations();
});

/**
 * 페이지 로드 애니메이션 초기화
 */
function initPageAnimations() {
    // 프로필 섹션 애니메이션
    const profileContent = document.querySelector('.profile-content');
    if (profileContent) {
        profileContent.style.opacity = '0';
        profileContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            profileContent.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            profileContent.style.opacity = '1';
            profileContent.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // 정보 블록들 순차적 애니메이션
    const infoBlocks = document.querySelectorAll('.info-block');
    infoBlocks.forEach((block, index) => {
        block.style.opacity = '0';
        block.style.transform = 'translateX(30px)';
        
        setTimeout(() => {
            block.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            block.style.opacity = '1';
            block.style.transform = 'translateX(0)';
        }, 400 + (index * 150));
    });
}

/**
 * 스킬 아이템 호버 효과
 */
function initSkillHoverEffects() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        // 초기 스타일 설정
        item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 8px 20px rgba(54, 92, 255, 0.4)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

/**
 * 기하학적 패턴 애니메이션
 */
function initGeometricAnimations() {
    const shapes = document.querySelectorAll('.shape');
    
    // 초기 애니메이션 설정
    shapes.forEach((shape, index) => {
        shape.style.transition = 'transform 20s linear infinite';
        
        // 각각 다른 회전 속도로 설정
        const rotationSpeed = (index + 1) * 30;
        shape.style.animation = `rotate${index} ${rotationSpeed}s linear infinite`;
        
        // 동적으로 keyframes 생성
        const keyframes = `
            @keyframes rotate${index} {
                from { transform: rotate(${45 + index * 15}deg); }
                to { transform: rotate(${405 + index * 15}deg); }
            }
        `;
        
        // 스타일시트에 keyframes 추가
        if (!document.getElementById(`keyframes-${index}`)) {
            const style = document.createElement('style');
            style.id = `keyframes-${index}`;
            style.textContent = keyframes;
            document.head.appendChild(style);
        }
    });
}

/**
 * 스크롤에 따른 시차 효과
 */
function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3;
            const yPos = -(scrolled * speed);
            shape.style.transform = `translate(0, ${yPos}px) rotate(${45 + scrolled * 0.1}deg)`;
        });
    });
}

// 스크롤 시차 효과 초기화 (필요한 경우)
// initParallaxEffect();

/**
 * 연락처 아이템 클릭 이벤트 (복사 기능)
 */
document.addEventListener('DOMContentLoaded', function() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.textContent.trim();
            
            // 이메일이나 전화번호 형식인 경우에만 복사 기능 실행
            if (text.includes('@') || text.includes('010-') || text.includes('github')) {
                navigator.clipboard.writeText(text).then(() => {
                    // 복사 완료 피드백
                    const originalText = this.innerHTML;
                    this.style.color = '#10b981';
                    
                    setTimeout(() => {
                        this.style.color = '';
                    }, 1000);
                }).catch(err => {
                    console.log('복사 실패:', err);
                });
            }
        });
        
        // 호버 효과로 클릭 가능함을 표시
        item.style.cursor = 'pointer';
        item.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
        });
        item.addEventListener('mouseleave', function() {
            this.style.opacity = '0.9';
        });
    });
});

/**
 * 이미지 로드 에러 처리
 */
document.addEventListener('DOMContentLoaded', function() {
    const avatarImage = document.querySelector('.avatar-image');
    
    if (avatarImage) {
        avatarImage.addEventListener('error', function() {
            this.src = '/img/profile-default.jpg';
        });
    }
});