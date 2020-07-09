function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZODATA_PGI_DELIVERY_LIST_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}