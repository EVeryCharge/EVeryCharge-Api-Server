# 해당 쿼리는 init 쿼리가 아니므로 직접 추가/수정 및 아카이브용임

# 03.19. 전북특별자치도 추가
INSERT INTO region (zcode, region_name)
VALUES
    ('52', '전북특별자치도');

# 03.19. 전북특별자치도 소속지역 추가
INSERT INTO region_detail (zcode, zscode, region_detail_name)
VALUES
    ('52', '52110', '전주시'),
    ('52', '52130', '군산시'),
    ('52', '52140', '익산시'),
    ('52', '52180', '정읍시'),
    ('52', '52190', '남원시'),
    ('52', '52210', '김제시'),
    ('52', '52710', '완주군'),
    ('52', '52720', '진안군'),
    ('52', '52730', '무주군'),
    ('52', '52740', '장수군'),
    ('52', '52750', '임실군'),
    ('52', '52770', '순창군'),
    ('52', '52790', '고창군'),
    ('52', '52800', '부안군');

# 03.19. 신규 기관 추가
INSERT INTO operating_company (busi_id, bnm, is_primary)
VALUES
    ('AP', '애플망고', 'N'),
    ('CH', '채움모빌리티', 'N'),
    ('CN', '에바씨엔피', 'N'),
    ('GD', '그린도트', 'N'),
    ('GK', 'KH에너지', 'N'),
    ('SL', '에스에스기전', 'N'),
    ('TE', '테슬라', 'Y'),
    ('TH', '태현교통', 'N'),
    ('TV', '아이토브', 'N');

# 03.19. 기관명 일부 수정
UPDATE operating_company
SET bnm = 'SK일렉링크', is_primary = 'Y' WHERE busi_id = 'ST';

UPDATE operating_company
SET bnm = '대구시설공공관리공단' WHERE busi_id = 'DE';

UPDATE operating_company
SET bnm = '투이스이브이씨', is_primary = 'Y' WHERE busi_id = 'SS';