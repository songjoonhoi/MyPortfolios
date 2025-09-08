-- ===============================
-- 초기 Folio (자기소개)
-- ===============================
INSERT INTO folios (id, name, bio, profile_img, skills)
VALUES (1, '송준회',
        '백엔드 개발자 지망생입니다. Spring Boot, JPA, AWS를 중심으로 다양한 프로젝트를 진행했습니다.',
        'https://picsum.photos/seed/profile/300/300',
        'Java, Spring Boot, JPA, Thymeleaf, MySQL, AWS, React');

-- ===============================
-- 초기 Projects (포트폴리오)
-- ===============================
INSERT INTO projects (id, title, creator, description, cover_url, link, likes, created_at)
VALUES (1, '포트폴리오 사이트 제작', '송준회',
        'Spring Boot + Thymeleaf 기반으로 개인 포트폴리오 웹사이트를 제작했습니다. AWS에 배포하여 운영 경험을 쌓았습니다.',
        'https://picsum.photos/seed/portfolio/800/500',
        'https://github.com/example/portfolio',
        120,
        CURRENT_DATE);

INSERT INTO projects (id, title, creator, description, cover_url, link, likes, created_at)
VALUES (2, '쇼핑몰 웹사이트', '송준회',
        '상품 등록, 장바구니, 주문/결제 기능이 포함된 풀스택 쇼핑몰 프로젝트입니다.',
        'https://picsum.photos/seed/shop/800/500',
        'https://github.com/example/shop',
        95,
        CURRENT_DATE);

INSERT INTO projects (id, title, creator, description, cover_url, link, likes, created_at)
VALUES (3, '여행 계획 웹 서비스', '송준회',
        '사용자가 여행 일정을 검색, 저장, 공유할 수 있는 웹 서비스입니다. REST API와 i18n 다국어 지원을 구현했습니다.',
        'https://picsum.photos/seed/travel/800/500',
        'https://github.com/example/travel',
        180,
        CURRENT_DATE);

-- ===============================
-- Project Tags
-- ===============================
INSERT INTO project_tags (project_id, tags) VALUES (1, 'Spring Boot');
INSERT INTO project_tags (project_id, tags) VALUES (1, 'Thymeleaf');
INSERT INTO project_tags (project_id, tags) VALUES (1, 'AWS');

INSERT INTO project_tags (project_id, tags) VALUES (2, 'React');
INSERT INTO project_tags (project_id, tags) VALUES (2, 'MySQL');
INSERT INTO project_tags (project_id, tags) VALUES (2, 'JPA');

INSERT INTO project_tags (project_id, tags) VALUES (3, 'Spring Boot');
INSERT INTO project_tags (project_id, tags) VALUES (3, 'REST API');
INSERT INTO project_tags (project_id, tags) VALUES (3, 'i18n');

-- 프로젝트 1 상세
INSERT INTO project_details (project_id, title, description, image_url)
VALUES (1, '포트폴리오 화면', '메인 페이지 UI 스크린샷', 'https://picsum.photos/seed/portfolio1/800/600');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (1, '포트폴리오 소개', 'About 섹션 구성 화면', 'https://picsum.photos/seed/portfolio2/800/600');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (1, '포트폴리오 기능', '프로젝트 목록 페이지', 'https://picsum.photos/seed/portfolio3/800/600');

-- 프로젝트 2 상세
INSERT INTO project_details (project_id, title, description, image_url)
VALUES (2, '상품 목록', 'React 기반 쇼핑몰 상품 리스트', 'https://picsum.photos/seed/shop1/800/600');

INSERT INTO project_details (project_id, title, description, image_url)
VALUES (2, '장바구니', '장바구니 기능 구현 화면', 'https://picsum.photos/seed/shop2/800/600');


