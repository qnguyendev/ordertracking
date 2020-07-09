/* global alasql:true */
/* global xlsx:true */
/* global moment:true */
/* global blob: true */
/* gloabl saveAs: true */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"../libs/xlsx",
	"../libs/moment",
	"../libs/blob"
], function (Controller, JSONModel, Filter, FilterOperator, Export, ExportTypeCSV, MessageToast, MessageBox, xlsxjs, momentjs, blobjs) {
	"use strict";
	return Controller.extend("luxottica.fiori.test.test01.controller.App", {
		onInit: function () {
			var day = moment().add(18, 'days');

			MessageBox.success("this is the day" + day);
		},
		/**
		 *@memberOf luxottica.fiori.test.test01.controller.App
		 */
		onUpload: function (e) {
			var fU = this.getView().byId("idfileUploader");
			var domRef = fU.getFocusDomRef();
			var file = domRef.files[0];
			// Create a File Reader object
			var reader = new FileReader();
			var t = this;
			reader.onload = function (e) {
				var strCSV = e.target.result;
				strCSV = strCSV.replace(/(\r\n|\n|\r)/gm, "");
				//var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
				var arrCSV = strCSV.match(/(\s*"[^"]+"\s*|\s*[^,]+|,)(?=,|$)/g);
				var noOfCols = 55;
				// To ignore the first row which is header
				var hdrRow = arrCSV.splice(0, noOfCols);
				var data = [];
				while (arrCSV.length > noOfCols) {
					var obj = {};
					// extract remaining rows one by one
					var row = arrCSV.splice(0, noOfCols);
					for (var i = 0; i < row.length; i++) {
						obj[hdrRow[i]] = row[i].trim();
					}
					// push row to an array
					data.push(obj);
				}
				// Bind the data to the Table
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({
					"items": data
				});
				var oTable = t.byId("idTable");
				oTable.setModel(oModel);
			};
			reader.readAsBinaryString(file);
			reader.onerror = function (e) {
				var messageItem = new sap.m.MessagePopoverItem({
					type: "Error",
					description: "Fail to read file"
				});
				var oMessage = new sap.m.MessagePopover();
				oMessage.insertItem(messageItem);
			};
		},
		/**
		 *@memberOf luxottica.fiori.test.test01.controller.App
		 */
		saveFile: function () {
			var aExportDataHeader = {},
				aExportDataItems = [],
				sCustomerPO,
				sCustomerPODate,
				sShipToName;
			var dataType = 'application/vnd.ms-excel';
			var oTable = this.getView().byId("idTable"),
				aItems = oTable.getItems(),
				oFilter = [],
				//	oModel = oTable.getModel();
				oModel = this.getView().getModel();

			// var oExport = new Export({
			// 	exportType: new ExportTypeCSV({
			// 		separatorChar: "\t",
			// 		mimeType: "application/vnd.ms-excel",
			// 		charset: "utf-8",
			// 		fileExtension: "xls"
			// 	}),
			// 	models: oModel,
			// 	rows: {
			// 		path: "/items"
			// 	},
			// 	columns: [{
			// 		name: "Customer PO",
			// 		template: {
			// 			content: "{CustomerPO}"
			// 		}
			// 	}, {
			// 		name: "Customer PO Date",
			// 		template: {
			// 			content: "{CustomerPODate}"
			// 		}
			// 	}, {
			// 		name: "Ship To Name",
			// 		template: {
			// 			content: "{ShipToName}"
			// 		}
			// 	}, {
			// 		name: "Tracking Number",
			// 		template: {
			// 			content: "{TrackingNumber}"
			// 		}
			// 	}]
			// });

			// oExport.saveFile().catch(function (oError) {

			// }).then(function () {
			// 	oExport.destroy();
			// });

			aExportDataHeader.CarrierId = "PRIO";
			for (var i = 0; i < 10; i++) {
				var aCells = aItems[i].getCells();
				for (var j = 0; j < aCells.length; j++)
					oFilter.push(new Filter({
						filters: [
							new Filter({
								path: "CarrierId",
								operator: FilterOperator.EQ,
								value1: "PRIO"
							}),
							new Filter({
								path: "Shipmentnumber",
								operator: FilterOperator.EQ,
								value1: ""
							})
						],
						and: true
					}));
			}

			aExportDataHeader.ExportDataItemSet = aExportDataItems;

			oModel.read("/ExportDataItemSet", {
				filters: oFilter,
				success: function (oData) {
					MessageBox.success("Shipments have been successfully updated with tracking information.", {
						title: "Success", // default
						onClose: null, // default
						styleClass: "", // default
						actions: sap.m.MessageBox.Action.OK, // default
						emphasizedAction: sap.m.MessageBox.Action.OK, // default
						initialFocus: null, // default
						textDirection: sap.ui.core.TextDirection.Inherit // default
					});
					if (oData.results) {
						oData.results.forEach(function (currVal, index, arr) {

						});
					}
				},
				error: function (oError) {
					sap.m.MessageBox.error("Fail to update shipments with tracking information", {
						title: "Error", // default
						onClose: null, // default
						styleClass: "", // default
						actions: sap.m.MessageBox.Action.Close, // default
						emphasizedAction: null, // default
						initialFocus: null, // default
						textDirection: sap.ui.core.TextDirection.Inherit // default
					});
				}
			});
		},
		fnSaveFile: function () {
			var aExcelData = [{
				"ProductId": "1239102",
				"Name": "Power Projector 4713",
				"Category": "Projector",
				"SupplierName": "Titanium",
				"Description": "A very powerful projector with special features for Internet usability, USB",
				"WeightMeasure": 1467,
				"WeightUnit": "g",
				"Price": 856.49,
				"CurrencyCode": "EUR",
				"Status": "Available",
				"Quantity": 3,
				"UoM": "PC",
				"Width": 51,
				"Depth": 42,
				"Height": 18,
				"DimUnit": "cm"
			}, {
				"ProductId": "2212-121-828",
				"Name": "Gladiator MX",
				"Category": "Graphics Card",
				"SupplierName": "Technocom",
				"Description": "Gladiator MX: DDR2 RoHS 128MB Supporting 512MB Clock rate: 350 MHz Memory Clock: 533 MHz, Bus Type: PCI-Express, Memory Type: DDR2 Memory Bus: 32-bit Highlighted Features: DVI Out, TV Out , HDTV",
				"WeightMeasure": 321,
				"WeightUnit": "g",
				"Price": 81.7,
				"CurrencyCode": "EUR",
				"Status": "Discontinued",
				"Quantity": 10,
				"UoM": "PC",
				"Width": 34,
				"Depth": 14,
				"Height": 2,
				"DimUnit": "cm",
			}];
			this.fnJSONToXLSXConvertor(aExcelData, "test.xlsx");
		},
		fnJSONToXLSXConvertor: function (JSONData, ReportTitle) {
			var aData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
			if (aData.length) {
				var aFinalXlsxData,
					aXlsxHeaderData;

				// Array variable to store header data in XLSX file
				aXlsxHeaderData = [];
				aFinalXlsxData = [];

				// Below loop to extract header data
				for (var iIndex in aData[0]) {
					switch (iIndex) {
					case "ProductId":
						aXlsxHeaderData.push("ProductId");
						break;
					case "Name":
						aXlsxHeaderData.push("Name");
						break;
					case "Status":
						aXlsxHeaderData.push("Status");
						break;
					}
					// Adding column header data in final XLSX data
					aFinalXlsxData.push(aXlsxHeaderData);

					// Below loop to extract data
					for (var i = 0; i < aData.length; i++) {
						// Array variable to store content data in XLSX file
						var aXlsxContentData = [];
						for (var iIndex in aData[i]) {
							switch (iIndex) {
							case "ProductId":
							case "Name":
							case "Status":
								aXlsxContentData.push(aData[i][iIndex]);
								break;
							}
						}
						// Adding content data in final XLSX data
						aFinalXlsxData.push(aXlsxContentData);
					}

					var Workbook = function Workbook() {
						if (!(this instanceof Workbook)) return new Workbook();
						this.SheetNames = [];
						this.Sheets = {};
					}
					var wb = Workbook();
					wb.SheetNames.push(ReportTitle);

					var sheet_from_array_of_arrays = function sheet_from_array_of_arrays(data, opts) {
						var ws = {};
						var range = {
							s: {
								c: 10000000,
								r: 10000000
							},
							e: {
								c: 0,
								r: 0
							}
						};
						for (var R = 0; R != data.length; ++R) {
							for (var C = 0; C != data[R].length; ++C) {
								if (range.s.r > R) range.s.r = R;
								if (range.s.c > C) range.s.c = C;
								if (range.e.r < R) range.e.r = R;
								if (range.e.c < C) range.e.c = C;
								var cell = {
									v: data[R][C]
								};
								if (cell.v == null) continue;
								var cell_ref = XLSX.utils.encode_cell({
									c: C,
									r: R
								});

								if (typeof cell.v === 'number') cell.t = 'n';
								else if (typeof cell.v === 'boolean') cell.t = 'b';
								else if (cell.v instanceof Date) {
									cell.t = 'n';
									cell.z = XLSX.SSF._table[14];
									cell.v = datenum(cell.v);
								} else cell.t = 's';

								ws[cell_ref] = cell;
							}
						}
						if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
						return ws;
					}

					var ws = sheet_from_array_of_arrays(aFinalXlsxData);

					// Setting up Excel column width
					ws['!cols'] = [{
						wch: 14
					}, {
						wch: 12
					}, {
						wch: 12
					}];
					wb.Sheets[ReportTitle] = ws; // wb.Sheets[ReportTitle] -> To set sheet name

					var wbout = XLSX.write(wb, {
						bookType: 'xlsx',
						bookSST: true,
						type: 'binary'
					});
					var s2ab = function s2ab(s) {
						var buf = new ArrayBuffer(s.length);
						var view = new Uint8Array(buf);
						for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
						return buf;
					};
					
					saveAs(new Blob([s2ab(wbout)], {
						type: "application/octet-stream"
					}), ReportTitle + ".xlsx");

				}
			} else {
				MessageBox.error(
					"No data..!", {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			}
		},
		fnExportToExcel: function(){
			var oModel = this.getView().byId("idTable").getModel();
			var aItems = oModel.getData();
			var workSheet = XLSX.utils.json_to_sheet(aItems["items"]);
			
			//create new workbook
			var workBook = XLSX.utils.book_new();
			
			//create a new sheet and append to workbook
			XLSX.utils.book_append_sheet(workBook, workSheet, "My Data Export");
			var sFilename = "My Data Export.xlsx";
			XLSX.writeFile(workBook, sFilename);
		}
	})
});