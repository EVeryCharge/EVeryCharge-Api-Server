#필독
# 이 파일은 자바에서 사용할 수 없고 직접 db 클라이언트에서 실행시킬것.
#h2
INSERT INTO my_table SELECT * FROM csvread('/path/data_file') ;
#mysql
#mysql은 클라이언트에서 gui로 하면 더 편함.
#DBeaver기준 테이블 우클릭 -> 데이터 가져오기 -> csv -> 파일선택 -> 충전소 테이블의 경우 Transfer auto-generated columns 체크 해제 -> 진행버튼 누르면 ok
#외래키 제약 조건이 있으니 region -> region_detail -> charging_station -> charger 순으로 넣어야한다.
LOAD DATA LOCAL INFILE '/path/data_file' REPLACE INTO TABLE my_table FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' ;




