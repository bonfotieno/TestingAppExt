/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'TestingAppExt.Application',

    name: 'TestingAppExt',

    requires: [
        // This will automatically load all classes in the TestingAppExt namespace
        // so that application classes do not need to require each other.
        'TestingAppExt.*'
    ],

    // The name of the initial view to create.
    mainView: 'TestingAppExt.view.main.Main'
});
