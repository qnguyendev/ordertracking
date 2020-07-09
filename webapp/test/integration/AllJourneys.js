/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"luxottica/fiori/test/test01/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"luxottica/fiori/test/test01/test/integration/pages/App",
	"luxottica/fiori/test/test01/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "luxottica.fiori.test.test01.view.",
		autoWait: true
	});
});