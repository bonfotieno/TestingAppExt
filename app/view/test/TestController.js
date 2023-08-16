Ext.define('TestingAppExt.view.test.TestController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.testcontroller',

    init: function () {
        this.control({
            'button': {
                click: 'onButtonClick'
            }
        });

        // Load the Yellowfin API script dynamically before initializing the application
        Ext.Loader.loadScript({
            url: 'http://localhost:8083/JsAPI/v3?username=admin@yellowfin.com.au&password=test',
            onLoad: function () {
                yellowfin.init().then(() => {
                    yellowfin.showLoginPrompt = false;
                });
            },
            onError: function () {
                // Handle error if the script fails to load
                console.error('Failed to load Yellowfin API script.');
            },
            scope: this // Make sure the scope is set to the controller for "this.a()" to work
        });
    },

    onButtonClick: function (button) {
        var value = button.value;
        console.log(value)
        this.m0(value);
    },

    generateDashboard: function (value) {
        var reportContainer = Ext.getCmp('report1');
        reportContainer.removeAll();
        yellowfin.loadReport({
            reportId: '93d46878-2cbd-4ba1-8e3f-696c577d3246',
            element: reportContainer.el.dom,
            showToolbar: true,
            filterValues: [{
                filterId: 'scheme_id',
                valueOne: 2
                //valueTwo:4 used in cases where we have between
                //valueList: [2] used when having a list of value filters
            },
                {
                    filterId: 'member_d',
                    valueOne: 2,
                    valueTwo: 4 //used in cases where we have between
                    //valueList: [2] used when having a list of value filters
                }]
        }).then(report => {
            console.log(report);
        });
    },

    m0: function (value) {
        var reportContainer = Ext.getCmp('report1');
        reportContainer.removeAll();
        yellowfin.loadDashboard({
            dashboardUUID: '3b7ec8f7-6fc5-42bf-9f23-4ce0878e9ecf',
            element: reportContainer.el.dom,
            showToolbar: true,
        }).then(report => {
            console.log(report);
        });
    },

    a: function () {
        var reportContainer = Ext.getCmp('report1');
        reportContainer.removeAll();

        yellowfin.loadReport({
            reportId: '28c8eb02-845b-4f45-b685-4154b8aafd6e',
            element: reportContainer.el.dom,
            showToolbar: false
        }).then(report => {
            console.log(report);
        });
    }
});
