# 해당 쿼리는 init 쿼리가 아니므로 직접 추가/수정 및 아카이브용임

# 03.19. 전북특별자치도 추가
INSERT INTO region (zcode, region_name)
VALUES
    ('52', '전북특별자치도');

# 03.19. 전북특별자치도 소속지역 추가    ===================================================================
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

# 03.19. 신규 기관 추가   ===============================================================================
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

# 03.19. 기관명 일부 수정  ===============================================================================
UPDATE operating_company
SET bnm = 'SK일렉링크', is_primary = 'Y' WHERE busi_id = 'ST'; # 에스트래픽 → SK일렉링크

UPDATE operating_company
SET bnm = '대구시설공공관리공단' WHERE busi_id = 'DE'; # 대구공단 → 대구시설공공관리공단

UPDATE operating_company
SET bnm = '투이스이브이씨', is_primary = 'Y' WHERE busi_id = 'SS'; # 삼성이브이씨 → 투이스이브이씨

UPDATE operating_company
SET bnm = '이브이시스', is_primary = 'Y' WHERE busi_id = 'JA'; # 중앙제어 → 이브이시스

# 03.24. 삭제 여부 및 삭제 사유 필드 충전소 -> 충전기 테이블로 칼럼 이동 (칼럼 인서트는 hibernate에 의해 실행)  =====
alter table charging_station drop column del_yn;
alter table charging_station drop column del_detail;

# 03.29. 공간 인덱스 도입  ===============================================================================
# hibernate update로 스키마 구성 시 공간 인덱스가 걸리지 않음 (spatial Index)
# 따라서 실행 전 charging_station 포함 연관관계 매핑되어 있는 모든 테이블을 삭제
# charging_station은 아래의 스키마를 통해 테이블 재구성, 인덱스 생성
# 그 외의 테이블은 기존과 동일하게 hibernate ddl update로 생성

# charging_station과 연관 테이블 드랍
drop table review;
drop table report;
drop table charger;
drop table technical_manager;
drop table charging_station;

# charging_station 스키마 재생성, 공간 인덱스 생성
CREATE TABLE charging_station (
  stat_id VARCHAR(255) NOT NULL PRIMARY KEY,
  zscode VARCHAR(255),
  busi_id VARCHAR(255),
  stat_nm VARCHAR(255),
  addr VARCHAR(255),
  location VARCHAR(255),
  use_time VARCHAR(255),
  lat DOUBLE NOT NULL,
  lng DOUBLE NOT NULL,
  parking_free VARCHAR(255),
  note VARCHAR(255),
  limit_yn VARCHAR(255),
  limit_detail VARCHAR(255),
  traffic_yn VARCHAR(255),
  kind VARCHAR(255),
  kind_detail VARCHAR(255),
  point POINT NOT NULL SRID 4326,
  CONSTRAINT fk_zscode FOREIGN KEY (zscode) REFERENCES region_detail (zscode),
  CONSTRAINT fk_busi_id FOREIGN KEY (busi_id) REFERENCES operating_company (busi_id)
);

CREATE SPATIAL INDEX idx_point ON charging_station (point);

# 12.22. 충전소 요금변동 시 소수점 한자리수로 보정
UPDATE charge_fee SET member_fee_change = ROUND(member_fee_change, 1);
UPDATE charge_fee SET non_member_fee_change = ROUND(member_fee_change, 1);
