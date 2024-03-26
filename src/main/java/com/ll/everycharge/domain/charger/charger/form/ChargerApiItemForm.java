package com.ll.everycharge.domain.charger.charger.form;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChargerApiItemForm {
	private String statNm;
	private String statId;
	private String chgerId;
	private String chgerType;
	private String addr;
	private String location;
	private Double lat;
	private Double lng;
	private String useTime;
	private String busiId;
	private String bnm;
	private String stat;
	private LocalDateTime statUpdDt;
	private LocalDateTime lastTsdt;
	private LocalDateTime lastTedt;
	private LocalDateTime nowTsdt;
	private String output;
	private String method;
	private String zcode;
	private String zscode;
	private String kind;
	private String kindDetail;
	private String parkingFree;
	private String note;
	private String limitYn;
	private String limitDetail;
	private String delYn;
	private String delDetail;
	private String trafficYn;

	public ChargerApiItemForm(Map<String, Object> item, DateTimeFormatter formatter) {
		this.statNm = (String)item.get("statNm");
		this.statId = (String)item.get("statId");
		this.chgerId = String.valueOf(Integer.parseInt((String)item.get("chgerId")));
		this.chgerType = String.valueOf(Integer.parseInt((String)item.get("chgerType")));
		this.addr = (String)item.get("addr");
		this.location = (String)item.get("location");
		this.lat = Double.valueOf((String)item.get("lat"));
		this.lng = Double.valueOf((String)item.get("lng"));
		this.useTime = (String)item.get("useTime");
		this.busiId = (String)item.get("busiId");
		this.bnm = (String)item.get("bnm");
		this.stat = (String)item.get("stat");
		this.statUpdDt = Optional.ofNullable((String)item.get("statUpdDt"))
			.filter(s ->!s.isEmpty())
            .map(s -> LocalDateTime.parse(s, formatter))
            .orElse(null);
		this.lastTsdt = Optional.ofNullable((String)item.get("lastTsdt"))
			.filter(s -> !s.isEmpty())
			.map(s -> LocalDateTime.parse(s, formatter))
			.orElse(null);
		this.lastTedt = Optional.ofNullable((String)item.get("lastTedt"))
			.filter(s ->!s.isEmpty())
            .map(s -> LocalDateTime.parse(s, formatter))
            .orElse(null);
        this.nowTsdt = Optional.ofNullable((String)item.get("nowTsdt"))
			.filter(s ->!s.isEmpty())
			.map(s -> LocalDateTime.parse(s, formatter))
			.orElse(null);
		this.output = (String)item.get("output");
		this.method = (String)item.get("method");
		this.zcode = (String)item.get("zcode");
		this.zscode = (item.get("zscode") != null && ((String) item.get("zscode")).length() == 5) ?
			((String) item.get("zscode")).substring(0, 4) + "0" : null;
		this.kind = (String)item.get("kind");
		this.kindDetail = (String)item.get("kindDetail");
		this.parkingFree = (String)item.get("parkingFree");
		this.note = (String)item.get("note");
		this.limitYn = (String)item.get("limitYn");
		this.limitDetail = (String)item.get("limitDetail");
		this.delYn = (String)item.get("delYn");
		this.delDetail = (String)item.get("delDetail");
		this.trafficYn = (String)item.get("trafficYn");
	}
}
