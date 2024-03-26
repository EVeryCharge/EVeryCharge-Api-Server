package com.ll.everycharge.global.exceptions;
import com.ll.everycharge.standard.base.Empty;
import com.ll.everycharge.global.rsData.RsData;
import lombok.Getter;

@Getter
public class GlobalException extends RuntimeException {
    private final RsData<Empty> rsData;

    public GlobalException() {
        this("400-0", "에러");
    }

    public GlobalException(String msg) {
        this("400-0", msg);
    }

    public GlobalException(String resultCode, String msg) {
        super("resultCode=" + resultCode + ",msg=" + msg);
        this.rsData = RsData.of(resultCode, msg);
    }

    public static class E404 extends GlobalException {
        public E404() {
            super("404-0", "데이터를 찾을 수 없습니다.");
        }
    }

    public static class E403 extends GlobalException {
        public E403() {
            super("403-0", "잘못된 접근입니다.");
        }
    }

    public static class STATION_NOT_FOUND extends GlobalException {
        public STATION_NOT_FOUND() {
            super("STATION_NOT_FOUND", "충전소가 존재하지 않습니다.");
        }
    }
}