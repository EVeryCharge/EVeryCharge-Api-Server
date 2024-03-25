package com.ll.eitcharge.domain.operatingCompany.operatingCompany.form;

import com.ll.eitcharge.domain.charger.charger.form.ChargerApiItemForm;

import lombok.Getter;

@Getter
public class OperatingCompanyUpdateForm {
	private String busiId;
	private String bnm;
	private String isPrimary;

	public OperatingCompanyUpdateForm(ChargerApiItemForm item) {
		this.busiId = item.getBusiId();
		this.bnm = item.getBnm();
		this.isPrimary = "N";
	}
}
