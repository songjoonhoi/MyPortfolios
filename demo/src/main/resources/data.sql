-- ===============================
-- 개인 Folio (자기소개) - 본인 정보로 수정 필요
-- ===============================
INSERT INTO folios (id, name, bio, profile_img, skills)
VALUES (1, '김개발자',
        'Java Spring Boot를 활용한 백엔드 개발자입니다. 문제 해결을 좋아하며, 사용자 중심의 서비스 개발에 관심이 많습니다. 팀 협업과 코드 품질 향상을 위해 지속적으로 학습하고 있습니다.',
        'https://via.placeholder.com/300x300/365cff/ffffff?text=Profile',
        'Java, Spring Boot, Spring Security, JPA, MySQL, JavaScript, HTML/CSS, Git, AWS');

-- ===============================
-- 개인 Projects (포트폴리오) - H2용 날짜 함수 사용
-- ===============================
INSERT INTO projects (id, title, creator, description, cover_url, link, likes, created_at)
VALUES (1, '개인 포트폴리오 웹사이트', '김개발자',
        'Spring Boot와 JPA를 활용하여 개발한 개인 포트폴리오 사이트입니다. 프로젝트 관리 기능과 관리자 페이지를 구현했으며, 반응형 웹 디자인을 적용했습니다.',
        'https://via.placeholder.com/800x500/365cff/ffffff?text=Portfolio+Site',
        'https://github.com/yourusername/portfolio',
        15,
        CURRENT_DATE);

INSERT INTO projects (id, title, creator, description, cover_url, link, likes, created_at)
VALUES (2, 'Spring Boot 게시판 시스템', '김개발자',
        'Spring Security를 활용한 인증/인가 시스템과 CRUD 기능을 갖춘 게시판입니다. 페이징, 검색, 파일 업로드 기능을 구현했습니다.',
        'https://via.placeholder.com/800x500/28a745/ffffff?text=Board+System',
        'https://github.com/yourusername/board-system',
        23,
        DATEADD('DAY', -30, CURRENT_DATE));

INSERT INTO projects (id, title, creator, description, cover_url, link, likes, created_at)
VALUES (3, 'REST API 서버 프로젝트', '김개발자',
        'RESTful API 설계 원칙을 적용하여 개발한 백엔드 서버입니다. JWT 토큰 기반 인증과 API 문서화를 구현했습니다.',
        'https://via.placeholder.com/800x500/dc3545/ffffff?text=REST+API',
        'https://github.com/yourusername/rest-api',
        18,
        DATEADD('DAY', -60, CURRENT_DATE));

INSERT INTO projects (id, title, creator, description, cover_url, link, likes, created_at)
VALUES (4, 'Java 알고리즘 스터디', '김개발자',
        '코딩테스트 대비를 위한 알고리즘 문제 풀이 저장소입니다. 백준, 프로그래머스 문제를 Java로 해결하고 정리했습니다.',
        'https://via.placeholder.com/800x500/6f42c1/ffffff?text=Algorithm+Study',
        'https://github.com/yourusername/algorithm-study',
        31,
        DATEADD('DAY', -90, CURRENT_DATE));

-- ===============================
-- Project Tags
-- ===============================
INSERT INTO project_tags (project_id, tags) VALUES (1, 'Spring Boot');
INSERT INTO project_tags (project_id, tags) VALUES (1, 'JPA');
INSERT INTO project_tags (project_id, tags) VALUES (1, 'Thymeleaf');
INSERT INTO project_tags (project_id, tags) VALUES (1, 'JavaScript');

INSERT INTO project_tags (project_id, tags) VALUES (2, 'Spring Boot');
INSERT INTO project_tags (project_id, tags) VALUES (2, 'Spring Security');
INSERT INTO project_tags (project_id, tags) VALUES (2, 'MySQL');
INSERT INTO project_tags (project_id, tags) VALUES (2, 'JPA');

INSERT INTO project_tags (project_id, tags) VALUES (3, 'Spring Boot');
INSERT INTO project_tags (project_id, tags) VALUES (3, 'REST API');
INSERT INTO project_tags (project_id, tags) VALUES (3, 'JWT');
INSERT INTO project_tags (project_id, tags) VALUES (3, 'Swagger');

INSERT INTO project_tags (project_id, tags) VALUES (4, 'Java');
INSERT INTO project_tags (project_id, tags) VALUES (4, 'Algorithm');
INSERT INTO project_tags (project_id, tags) VALUES (4, 'Data Structure');

-- ===============================
-- Project Details (상세 이미지/설명)
-- ===============================
-- 프로젝트 1 상세
INSERT INTO project_details (project_id, title, description, image_url)
VALUES (1, '메인 페이지', '프로젝트 목록과 검색 기능이 있는 메인 화면', 'https://via.placeholder.com/800x600/365cff/ffffff?text=Main+Page');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (1, '프로젝트 상세 페이지', '개별 프로젝트의 상세 정보와 갤러리 기능', 'https://via.placeholder.com/800x600/365cff/ffffff?text=Detail+Page');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (1, '관리자 페이지', '프로젝트 등록/수정/삭제가 가능한 관리자 인터페이스', 'https://via.placeholder.com/800x600/365cff/ffffff?text=Admin+Page');

-- 프로젝트 2 상세
INSERT INTO project_details (project_id, title, description, image_url)
VALUES (2, '게시판 목록', 'Bootstrap을 활용한 반응형 게시판 목록 화면', 'https://via.placeholder.com/800x600/28a745/ffffff?text=Board+List');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (2, '게시글 작성', '파일 업로드와 에디터가 포함된 게시글 작성 폼', 'https://via.placeholder.com/800x600/28a745/ffffff?text=Write+Post');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (2, '로그인 시스템', 'Spring Security를 활용한 로그인/회원가입 기능', 'https://via.placeholder.com/800x600/28a745/ffffff?text=Login+System');

-- 프로젝트 3 상세
INSERT INTO project_details (project_id, title, description, image_url)
VALUES (3, 'API 문서', 'Swagger UI를 통한 REST API 문서화', 'https://via.placeholder.com/800x600/dc3545/ffffff?text=API+Docs');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (3, '데이터베이스 설계', 'ERD와 테이블 구조 설계도', 'https://via.placeholder.com/800x600/dc3545/ffffff?text=Database+Design');

-- 프로젝트 4 상세
INSERT INTO project_details (project_id, title, description, image_url)
VALUES (4, '알고리즘 풀이', '문제별 해결 과정과 코드 설명', 'https://via.placeholder.com/800x600/6f42c1/ffffff?text=Algorithm+Solution');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (4, '성능 분석', '시간복잡도와 공간복잡도 분석 결과', 'https://via.placeholder.com/800x600/6f42c1/ffffff?text=Performance+Analysis');