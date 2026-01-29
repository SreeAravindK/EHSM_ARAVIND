sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/UIComponent"
], function (Controller, MessageToast, MessageBox, UIComponent) {
    "use strict";

    return Controller.extend("ehsm.controller.Login", {
        onInit: function () {
            // Initialization logic
        },

        onLogin: function () {
            var sEmployeeId = this.getView().byId("employeeIdInput").getValue();
            var sPassword = this.getView().byId("passwordInput").getValue();

            if (!sEmployeeId || !sPassword) {
                MessageToast.show("Please enter both Employee ID and Password.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var aFilters = [
                new sap.ui.model.Filter("EmployeeId", sap.ui.model.FilterOperator.EQ, sEmployeeId),
                new sap.ui.model.Filter("Password", sap.ui.model.FilterOperator.EQ, sPassword)
            ];

            sap.ui.core.BusyIndicator.show(0);

            oModel.read("/LoginSet", {
                filters: aFilters,
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();

                    var aResults = (oData && oData.results) ? oData.results : [];
                    console.log("Login Results from backend:", aResults);

                    // Strict validation: check both ID and Password from the returned data
                    // We normalize the ID by removing leading zeros just in case one is padded and the other isn't
                    var oUser = aResults.find(function (user) {
                        var sNormalizedInputId = sEmployeeId.toString().replace(/^0+/, '');
                        var sNormalizedRecordId = (user.EmployeeId || "").toString().replace(/^0+/, '');

                        return sNormalizedRecordId === sNormalizedInputId &&
                            user.Password === sPassword &&
                            user.Status === 'Success';
                    });

                    if (oUser) {
                        MessageToast.show("Login Successful");
                        this.getRouter().navTo("RouteDashboard");
                    } else {
                        console.error("Login Failed: No matching user found in results.");
                        MessageBox.error("Login Failed: Invalid Credentials or unauthorized access.");
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    console.error("Login Error Details:", oError);
                    var sErrorMsg = "Connection Error (" + oError.statusCode + " " + oError.statusText + "): ";
                    try {
                        var oResponse = JSON.parse(oError.responseText);
                        sErrorMsg += oResponse.error.message.value;
                    } catch (e) {
                        if (oError.statusCode === 0) {
                            sErrorMsg += "The backend service is unreachable. This usually means you are not on the correct VPN/network or the server is down.";
                        } else {
                            sErrorMsg += "The backend returned an error. Please check the network tab for details.";
                        }
                    }
                    MessageBox.error(sErrorMsg);
                }.bind(this)
            });
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        }
    });
});
