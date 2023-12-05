Ext.define('TestingAppExt.view.test.TestController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.testcontroller',

    init: function () {
        this.control({
            'button': {
                click: 'onButtonClick'
            }
        });
    },

    onButtonClick: function (button) {
        var value = button.value;
        console.log(value)
        this.authenticateYellowFinAndGenerate();
    },
    onCreateUserClick: function (button) {
        var value = button.value;
        console.log(value)
        this.createYellowFinUser();
    },

    createYellowFinUser: function () {

        let newUserData = JSON.stringify([
            {
                "userId": "email",
                "emailAddress": "email",
                "roleCode": "YFREPORTCONSUMER",
                "password": "password",
                "firstName": "fname",
                "lastName": "lname",
                "languageCode": "EN",
                "timeZoneCode": "AFRICA/NAIROBI"
            }
        ]);

        Ext.Ajax.request({
            url: "http://localhost:8083/api/refresh-tokens",
            method: 'POST',
            timeout: 0,
            headers: {
                'Authorization': 'YELLOWFIN ts=' + new Date().getTime() + ', nonce={{$randomInt}}',
                'Accept': 'application/vnd.yellowfin.api-v2+json',
                'Content-Type': 'application/json'
            },
            jsonData: JSON.stringify({
                "userName": "admin@yellowfin.com.au",
                "password": "test",
                "clientOrgRef": ""
            }),
            success: function (response) {
                let responseData = Ext.decode(response.responseText);
                var AccToken = responseData["_embedded"].accessToken.securityToken;
                Ext.Ajax.request({
                    url: "http://localhost:8083/api/admin/users",
                    method: 'POST',
                    timeout: 0,
                    headers: {
                        "Accept": "application/vnd.yellowfin.api-v2+json",
                        "Content-Type": "application/json",
                        "Authorization": 'YELLOWFIN ts=' + new Date().getTime() + ', nonce={{$randomInt}}, token='+AccToken+"",
                    },
                    jsonData: newUserData,
                    success: function (response) {
                        let responseData = Ext.decode(response.responseText);
                        console.log(responseData);
                        window.alert("User created successfully!");
                    },
                    failure: function (response) {
                        console.log(response.responseText);
                    }
                });
            },
            failure: function (response) {
                // Handle the failure response here
            }
        });
    },

    authenticateYellowFinAndGenerate: function () {
        let me = this;
        var authUserId = 'admin@yellowfin.com.au';
        var adminId = 'admin@yellowfin.com.au';
        var adminPassword = 'test';

        var json_text =  JSON.stringify({
            signOnUser: {
                userName: adminId,
                password: adminPassword,
                clientOrgRef: ""
            },
            noPassword: true,
            adminUser: {
                userName: adminId,
                password: adminPassword
            }
        });

        Ext.Ajax.request({
            url: "http://localhost:8083/api/rpc/login-tokens/create-sso-token",
            method: 'POST',
            timeout: 0,
            headers: {
                'Authorization': 'YELLOWFIN ts=' + new Date().getTime() + ', nonce={{$randomInt}}',
                'Accept': 'application/vnd.yellowfin.api-v2+json',
                'Content-Type': 'application/json'
            }, jsonData: json_text,
            success: function (response) {
                let responseData = Ext.decode(response.responseText);
                me.generateNLQ(responseData);
            },
            failure: function (response) {
                // Handle the failure response here
            }
        });
    },

    generateNLQ: function (responseData) {
        let securityToken = responseData.securityToken;
        let url = 'http://localhost:8083/JsAPI/v3?token=' + securityToken;
        let reportElement = Ext.getElementById('report1');

        Ext.Loader.loadScript({
            url: url,
            onLoad: function () {
                yellowfin.showLoginPrompt = false;
                console.log("It worked");
                let options = {
                    element: reportElement,
                    popup:false,
                    showWelcome:'NEVER',
                    viewUUID:'',
                    contentIntegrationOptions: {
                        controls: ['SAVE', 'ADD_TO']
                    }
                }

                yellowfin.init().then(() => {
                    yellowfin.loadNLQ(options)
                        .then(nlq => {
                            console.log("this worked too")
                            nlq.addEventListener('reportSaved', function (event){
                                event.preventDefault();
                                let reportUUID = event.reportUUID;
                                console.log("this worked too")
                                yellowfin.loadReport({
                                    reportId: reportUUID,
                                    element: reportElement,
                                    showToolbar: true,
                                    showInfo: true,
                                }).then(report => {
                                    console.log(report);
                                });
                            });
                    });
                });
            },
            onError: function () {
                // Handle error if the script fails to load
                console.error('Failed to load Yellowfin API script.');
            },
            scope: this
        });
    },



    generateReport: function (value) {
        var reportContainer = Ext.getCmp('report1');
        reportContainer.removeAll();
        yellowfin.loadReport({
            reportId: '93d46878-2cbd-4ba1-8e3f-696c577d3246',
            element: reportContainer.el.dom,
            showToolbar: true,
            filterValues: [
                {
                    filterId: 'scheme_id',
                    valueOne: 2
                    //valueTwo:4 //used in cases where we have between
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

    generateDashboard: function (value) {
        var reportContainer = Ext.getCmp('report1');
        reportContainer.removeAll();
        yellowfin.loadDashboard({
            dashboardUUID: '23273d74-c5f8-4373-ae7e-479aa29c06d8',
            element: reportContainer.el.dom,
            showToolbar: false,
        }).then(report => {
            console.log(report);
        });
    },

    anonymous1: function () {
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

// EMAIL_ADDRESS_IN_USE
