sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function (Controller, MessageToast, UIComponent) {
    "use strict";

    return Controller.extend("ehsm.controller.Dashboard", {
        onInit: function () {
            // Initialization logic
        },

        onNavToIncident: function () {
            this.getRouter().navTo("RouteIncident");
        },

        onNavToRisk: function () {
            this.getRouter().navTo("RouteRisk");
        },

        onLogout: function () {
            MessageToast.show("Logging Out...");
            // Optionally clear session data
            this.getRouter().navTo("RouteLogin");
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        }
    });
});
