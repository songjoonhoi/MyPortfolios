-- 개인 Folio (자기소개)
INSERT INTO folios (name, bio, profile_img, skills)
VALUES ('송준회',
        'Java Spring Boot를 활용한 백엔드 개발자입니다. 문제 해결을 좋아하며, 사용자 중심의 서비스 개발에 관심이 많습니다.',
        'https://placehold.co/200x200/365cff/ffffff?text=Profile', 
        'Java, Spring Boot, Spring Security, JPA, MySQL, JavaScript, HTML/CSS, Git, AWS');

-- 학력 데이터
INSERT INTO educations (folio_id, period, title, subtitle) VALUES
(1, '2015.03 - 2019.02', '서울대학교', '컴퓨터공학과 학사'),
(1, '2019.03 - 2021.01', '카이스트', '경영대학 지식경영프로그램 석사');

-- 경력 데이터
INSERT INTO careers (folio_id, period, title, subtitle) VALUES
(1, '2019.01 - 2021.04', 'ABC 스타트업', '백엔드 개발자'),
(1, '2021.05 - 현재', 'XYZ 스타트업', 'CTO');

-- ▼▼▼ 새로 추가: 전문분야 데이터 ▼▼▼
INSERT INTO expertises (folio_id, description) VALUES
(1, 'AI 기반 시스템 설계 및 개발'),
(1, '복잡 CRUD 도메인의 동적 모듈'),
(1, 'DevOps 기반 확장 가능한 클라우드 인프라 구축');

-- 프로젝트 데이터 (기존과 동일)
-- 프로젝트 데이터 ([수정] cover_url, image_url에 플레이스홀더 추가)
INSERT INTO projects (title, creator, description, cover_url, link, likes, created_at, introduction, problem, roles, result)
VALUES ('개인 포트폴리오 웹사이트', '송준회',
        'Spring Boot와 JPA를 활용하여 개발한 개인 포트폴리오 사이트입니다. 프로젝트 관리 기능과 관리자 페이지를 구현했습니다.',
        'https://placehold.co/800x600/7E57C2/FFFFFF/png?text=Portfolio', 'https://github.com/your-id/portfolio', 15, CURRENT_DATE,
        '개발자로서 저의 프로젝트 경험과 기술 스택을 효과적으로 보여줄 수 있는 개인화된 공간이 필요했습니다. 이 프로젝트는 Spring Boot 기반의 웹 애플리케이션으로, 저만의 포트폴리오를 직접 구축하고 운영하는 것을 목표로 합니다.',
        '기존의 이력서나 GitHub만으로는 프로젝트의 배경, 고민의 과정, 그리고 최종 성과를 충분히 전달하기 어려웠습니다. 각 프로젝트의 스토리를 담아낼 수 있는 구조화된 포트폴리오 플랫폼이 부재하다는 문제점을 해결하고자 했습니다.',
        '- **백엔드 개발**: Spring Boot, Spring Security, JPA를 사용한 REST API 설계 및 구현\n- **프론트엔드 개발**: Thymeleaf, Vanilla JavaScript를 사용한 동적 UI 구현\n- **데이터베이스**: H2(개발), MySQL(운영) 설계 및 구축\n- **배포 및 인프라**: AWS EC2, RDS를 활용한 클라우드 배포 및 Nginx 설정',
        '프로젝트 등록부터 상세 페이지 조회까지 원활하게 작동하는 포트폴리오 웹사이트를 완성했습니다. 이 프로젝트를 통해 Spring Boot 생태계에 대한 깊은 이해와 풀스택 개발 경험을 쌓을 수 있었습니다. 향후 CI/CD 파이프라인을 구축하여 개발 및 배포 자동화를 구현할 계획입니다.');

INSERT INTO projects (title, creator, description, cover_url, link, likes, created_at, introduction, problem, roles, result)
VALUES ('Spring Boot 게시판 시스템', '송준회',
        'Spring Security를 활용한 인증/인가 시스템과 CRUD 기능을 갖춘 게시판입니다. 페이징, 검색, 파일 업로드 기능을 구현했습니다.',
        'https://placehold.co/800x600/42A5F5/FFFFFF/png?text=Board', 'https://github.com/your-id/board', 23, DATEADD('DAY', -30, CURRENT_DATE),
        '웹 개발의 가장 기본적인 기능인 게시판을 Spring Boot를 사용하여 처음부터 끝까지 구현한 프로젝트입니다. 사용자 인증, 게시글 관리, 파일 첨부 등 핵심적인 웹 애플리케이션 기능을 학습하는 것을 목표로 했습니다.',
        '단순히 기능만 구현하는 것을 넘어, Spring Security를 통한 안전한 인증/인가 처리와 대용량 데이터 처리를 위한 페이징 기술의 필요성을 느꼈습니다. 또한, 실무적인 파일 업로드 처리 방식을 학습하고자 했습니다.',
        '- **인증/인가**: Spring Security를 이용한 로그인, 회원가입, 권한 관리 기능 구현\n- **핵심 기능**: JPA를 활용한 게시글 CRUD, 페이징 및 검색 기능 구현\n- **파일 처리**: 로컬 서버 및 클라우드(S3) 환경을 고려한 파일 업로드/다운로드 기능 설계',
        '보안과 성능을 고려한 웹 게시판의 기본 구조를 성공적으로 구현했습니다. 특히 Spring Security의 작동 원리를 깊이 이해하게 되었고, 페이징 API 설계 능력을 향상시킬 수 있었습니다. 이 경험은 다른 웹 서비스 개발의 튼튼한 기반이 되었습니다.');

-- Project Tags
INSERT INTO project_tags (project_id, tags) VALUES (1, 'Spring Boot');
INSERT INTO project_tags (project_id, tags) VALUES (1, 'JPA');
INSERT INTO project_tags (project_id, tags) VALUES (1, 'Thymeleaf');

INSERT INTO project_tags (project_id, tags) VALUES (2, 'Spring Boot');
INSERT INTO project_tags (project_id, tags) VALUES (2, 'Spring Security');
INSERT INTO project_tags (project_id, tags) VALUES (2, 'MySQL');

-- Project Details ([수정] image_url에 플레이스홀더 추가)
INSERT INTO project_details (project_id, title, description, image_url) VALUES (1, '메인 페이지', '프로젝트 목록과 검색 기능이 있는 메인 화면', 'https://placehold.co/600x400/9575CD/FFFFFF/png?text=Main');
INSERT INTO project_details (project_id, title, description, image_url) VALUES (1, '프로젝트 상세 페이지', '개별 프로젝트의 상세 정보와 갤러리 기능', 'https://placehold.co/600x400/9575CD/FFFFFF/png?text=Detail');
INSERT INTO project_details (project_id, title, description, image_url) VALUES (1, '관리자 페이지', '프로젝트 등록/수정/삭제가 가능한 관리자 인터페이스', 'https://placehold.co/600x400/9575CD/FFFFFF/png?text=Admin');

INSERT INTO project_details (project_id, title, description, image_url) VALUES (2, '게시판 목록', 'Bootstrap을 활용한 반응형 게시판 목록 화면', 'https://placehold.co/600x400/64B5F6/FFFFFF/png?text=List');
INSERT INTO project_details (project_id, title, description, image_url) VALUES (2, '게시글 작성', '파일 업로드와 에디터가 포함된 게시글 작성 폼', 'https://placehold.co/600x400/64B5F6/FFFFFF/png?text=Write');