sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function (Controller, MessageToast, UIComponent) {
    "use strict";

    return Controller.extend("ehsm.controller.Login", {
        onInit: function () {
            // Initialization logic if needed...
        },

        onLogin: function () {
            var sEmployeeId = this.getView().byId("employeeIdInput").getValue();
            var sPassword = this.getView().byId("passwordInput").getValue();

            if (!sEmployeeId || !sPassword) {
                MessageToast.show("Please enter both Employee ID and Password.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel(); // Default model ZEHSM1_SRV
            var sPath = "/LoginSet(EmployeeId='" + sEmployeeId + "',Password='" + sPassword + "')";

            // Assuming that LoginSet is an EntitySet and we are reading a single entity or using a function import.
            // Based on the user instruction: "Call /LoginSet. Check Status === 'Success'".
            // Usually, this would involve a create or a read with a specific key or a function import.
            // Since it mentions Status === 'Success', I'll assume we read an entity or create one.
            // Let's assume reading by key first, as it's cleaner for RESTful OData. 
            // However, a password in the key is bad practice, but I must follow instructions.
            // If it's a function import, we would use callFunction.
            // Given "Call /LoginSet", I will try a read with filters or just keys if possible.
            // The user didn't specify the key structure of LoginSet.
            // I'll assume it's a READ operation with keys.

            // To be safe and more aligned with common practices if the user didn't specify keys:
            // I'll use a filter or key read.
            // If the user meant a Function Import, it would be different.
            // Let's try to fetch a specific record. 

            // Actually, best guess: A read with filters? Or keys?
            // "Call /LoginSet" could mean reading the set.
            // Let's perform a read with filters to find the user.

            var aFilters = [
                new sap.ui.model.Filter("EmployeeId", sap.ui.model.FilterOperator.EQ, sEmployeeId),
                new sap.ui.model.Filter("Password", sap.ui.model.FilterOperator.EQ, sPassword)
            ];

            oModel.read("/LoginSet", {
                filters: aFilters,
                success: function (oData) {
                    // Check if we got any results and if the status is success
                    if (oData.results && oData.results.length > 0) {
                        var oUser = oData.results[0];
                        if (oUser.Status === 'Success') {
                            MessageToast.show("Login Successful");
                            this.getRouter().navTo("RouteDashboard");
                        } else {
                            MessageToast.show("Login Failed: " + (oUser.Message || "Invalid Credentials"));
                        }
                    } else {
                        MessageToast.show("Login Failed: User not found or invalid credentials.");
                    }
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Login Error: " + oError.message);
                }
            });
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        }
    });
});
