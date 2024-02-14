package com.ll.eitcharge.domain.charger.chargerScheduler;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;

@XmlAccessorType(XmlAccessType.FIELD)
public class StreamItem {
    @XmlElement(name = "busiId")
    private String busiId;

    @XmlElement(name = "statId")
    private String statId;

    @XmlElement(name = "chgerId")
    private String chgerId;

    @XmlElement(name = "stat")
    private Integer stat;

    @XmlElement(name = "statUpdDt")
    private String statUpdDt;

    @XmlElement(name = "lastTsdt")
    private String lastTsdt;

    @XmlElement(name = "lastTedt")
    private String lastTedt;

    @XmlElement(name = "nowTsdt")
    private String nowTsdt;

    // getter, setter 메소드
    public String getBusiId() {
        return busiId;
    }

    public void setBusiId(String busiId) {
        this.busiId = busiId;
    }

    public String getStatId() {
        return statId;
    }

    public void setStatId(String statId) {
        this.statId = statId;
    }

    public String getChgerId() {
        return chgerId;
    }

    public void setChgerId(String chgerId) {
        this.chgerId = chgerId;
    }

    public Integer getStat() {
        return stat;
    }

    public void setStat(Integer stat) {
        this.stat = stat;
    }

    public String getStatUpdDt() {
        return statUpdDt;
    }

    public void setStatUpdDt(String statUpdDt) {
        this.statUpdDt = statUpdDt;
    }

    public String getLastTsdt() {
        return lastTsdt;
    }

    public void setLastTsdt(String lastTsdt) {
        this.lastTsdt = lastTsdt;
    }

    public String getLastTedt() {
        return lastTedt;
    }

    public void setLastTedt(String lastTedt) {
        this.lastTedt = lastTedt;
    }

    public String getNowTsdt() {
        return nowTsdt;
    }

    public void setNowTsdt(String nowTsdt) {
        this.nowTsdt = nowTsdt;
    }
}
