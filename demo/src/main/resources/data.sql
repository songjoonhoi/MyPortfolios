-- ===============================
-- 개인 Folio (자기소개) - placeholder 이미지 사용
-- ===============================
INSERT INTO folios (name, bio, profile_img, skills)
VALUES ('김개발자',
        'Java Spring Boot를 활용한 백엔드 개발자입니다. 문제 해결을 좋아하며, 사용자 중심의 서비스 개발에 관심이 많습니다. 팀 협업과 코드 품질 향상을 위해 지속적으로 학습하고 있습니다.',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzY1Y2ZmIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPktpbTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RGV2PC90ZXh0Pjwvc3ZnPg==',
        'Java, Spring Boot, Spring Security, JPA, MySQL, JavaScript, HTML/CSS, Git, AWS');

-- ===============================
-- 개인 Projects (포트폴리오) - placeholder 이미지 사용
-- ===============================
INSERT INTO projects (title, creator, description, cover_url, link, likes, created_at)
VALUES ('개인 포트폴리오 웹사이트', '김개발자',
        'Spring Boot와 JPA를 활용하여 개발한 개인 포트폴리오 사이트입니다. 프로젝트 관리 기능과 관리자 페이지를 구현했으며, 반응형 웹 디자인을 적용했습니다.',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzY1Y2ZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPi4uLnBvcnRmb2xpby4uLjwvdGV4dD48L3N2Zz4=',
        'https://github.com/yourusername/portfolio',
        15,
        CURRENT_DATE);

INSERT INTO projects (title, creator, description, cover_url, link, likes, created_at)
VALUES ('Spring Boot 게시판 시스템', '김개발자',
        'Spring Security를 활용한 인증/인가 시스템과 CRUD 기능을 갖춘 게시판입니다. 페이징, 검색, 파일 업로드 기능을 구현했습니다.',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjhhNzQ1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPi4uLmJvYXJkLi4uPC90ZXh0Pjwvc3ZnPg==',
        'https://github.com/yourusername/board-system',
        23,
        DATEADD('DAY', -30, CURRENT_DATE));

INSERT INTO projects (title, creator, description, cover_url, link, likes, created_at)
VALUES ('REST API 서버 프로젝트', '김개발자',
        'RESTful API 설계 원칙을 적용하여 개발한 백엔드 서버입니다. JWT 토큰 기반 인증과 API 문서화를 구현했습니다.',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGMzNTQ1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPi4uLmFwaS4uLjwvdGV4dD48L3N2Zz4=',
        'https://github.com/yourusername/rest-api',
        18,
        DATEADD('DAY', -60, CURRENT_DATE));

INSERT INTO projects (title, creator, description, cover_url, link, likes, created_at)
VALUES ('Java 알고리즘 스터디', '김개발자',
        '코딩테스트 대비를 위한 알고리즘 문제 풀이 저장소입니다. 백준, 프로그래머스 문제를 Java로 해결하고 정리했습니다.',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjUxOWZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPi4uLmFsZ28uLi48L3RleHQ+PC9zdmc+',
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
-- Project Details (상세 이미지/설명) - placeholder 이미지 사용
-- ===============================
INSERT INTO project_details (project_id, title, description, image_url)
VALUES (1, '메인 페이지', '프로젝트 목록과 검색 기능이 있는 메인 화면', 
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1haW4gUGFnZTwvdGV4dD48L3N2Zz4=');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (1, '프로젝트 상세 페이지', '개별 프로젝트의 상세 정보와 갤러리 기능', 
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVmMmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzM2NWNmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRldGFpbCBQYWdlPC90ZXh0Pjwvc3ZnPg==');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (1, '관리자 페이지', '프로젝트 등록/수정/삭제가 가능한 관리자 인터페이스', 
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2RjMzU0NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFkbWluIFBhZ2U8L3RleHQ+PC9zdmc+');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (2, '게시판 목록', 'Bootstrap을 활용한 반응형 게시판 목록 화면', 
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzI4YTc0NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJvYXJkIExpc3Q8L3RleHQ+PC9zdmc+');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (2, '게시글 작성', '파일 업로드와 에디터가 포함된 게시글 작성 폼', 
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmZmY0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzI4YTc0NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPldyaXRlIEZvcm08L3RleHQ+PC9zdmc+');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (2, '로그인 시스템', 'Spring Security를 활용한 로그인/회원가입 기능', 
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmNGY4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzJkM2E0OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvZ2luPC90ZXh0Pjwvc3ZnPg==');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (3, 'API 문서', 'Swagger UI를 통한 REST API 문서화', 
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2RjMzU0NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFQSSBEb2NzPC90ZXh0Pjwvc3ZnPg==');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (3, '데이터베이스 설계', 'ERD와 테이블 구조 설계도', 
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmFmYWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRhdGFiYXNlPC90ZXh0Pjwvc3ZnPg==');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (4, '알고리즘 풀이', '문제별 해결 과정과 코드 설명', 
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmM2ZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY1MTlmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFsZ29yaXRobTwvdGV4dD48L3N2Zz4=');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (4, '성능 분석', '시간복잡도와 공간복잡도 분석 결과', 
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzJkM2E0OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFuYWx5c2lzPC90ZXh0Pjwvc3ZnPg==');