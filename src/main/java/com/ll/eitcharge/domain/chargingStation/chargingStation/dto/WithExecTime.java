package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WithExecTime<T> {
    private String execTime;
    private T Dto;

    public static <T> WithExecTime<T> of(String executionTimeResult, T Dto) {
        return new WithExecTime<>(executionTimeResult, Dto);
    }
}