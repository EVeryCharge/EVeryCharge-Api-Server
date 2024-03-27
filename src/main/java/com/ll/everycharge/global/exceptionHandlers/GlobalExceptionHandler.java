package com.ll.everycharge.global.exceptionHandlers;
import com.ll.everycharge.global.exceptions.GlobalException;
import com.ll.everycharge.global.rq.Rq;
import com.ll.everycharge.global.rsData.RsData;
import com.ll.everycharge.standard.base.Empty;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    private final Rq rq;

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(Exception ex) {
        // 아래 `throw ex;` 코드는 API 요청이 아닌 경우에만 실행된다.
        // if (rq.isApi()) throw ex; // 어짜피 이 서버(스프링부트)를 API서버로만 이용할 것이므로 이 코드는 필요 없다.

        return handleApiException(ex);
    }

    // 자연스럽게 발생시킨 예외처리
    private ResponseEntity<Object> handleApiException(Exception ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("resultCode", "500-1");
        body.put("statusCode", 500);
        body.put("msg", ex.getLocalizedMessage());

        LinkedHashMap<String, Object> data = new LinkedHashMap<>();
        body.put("data", data);

        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        ex.printStackTrace(pw);
        data.put("trace", sw.toString().replace("\t", "    ").split("\\r\\n"));

        String path = rq.getCurrentUrlPath();
        data.put("path", path);

        body.put("success", false);
        body.put("fail", true);

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 개발자가 명시적으로 발생시킨 예외처리
    @ExceptionHandler(GlobalException.class)
    @ResponseStatus // 참고로 이 코드의 역할은 error 내용의 스키마를 타입스크립트화 하는데 있다.
    public ResponseEntity<RsData<Empty>> handle(GlobalException ex) {
        HttpStatus status = HttpStatus.valueOf(ex.getRsData().getStatusCode());
        rq.setStatusCode(ex.getRsData().getStatusCode());

        return new ResponseEntity<>(ex.getRsData(), status);
    }
}