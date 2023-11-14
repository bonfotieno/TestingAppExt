Ext.define('TestingAppExt.view.test.Test', {
    extend: 'Ext.container.Container',
    xtype: 'test',
    controller: 'testcontroller',
    scrollable: true,
    layout: 'vbox',
    defaults: {
        margin: 5
    },

    items: [
        {
            xtype: 'container',
            cls: 'button-group',
            layout: 'hbox',
            items: [
                {
                    xtype: 'button',
                    text: 'Dashboard 1',
                    handler: 'onButtonClick'
                },
                {
                    xtype: 'button',
                    text: 'Create User',
                    handler: 'onCreateUserClick',
                    value: 'Adventure'
                },
                {
                    xtype: 'button',
                    text: 'Dashboard 3',
                    value: 'Relaxation'
                },
            ]
        },
        {
            xtype: 'container',
            layout: 'fit',
            width: window.innerWidth-25,
            scrollable: true,
            style: {
                border: '1px solid #ccc',
                padding: '10px'
            },
            items: [
                {
                    xtype: 'container',
                    id: 'report1',
                    flex: 1,
                    listeners: {
                        afterrender: function(container) {
                            // Calculate the height based on the content
                            var contentHeight = container.getEl().getHeight();
                            container.setHeight(contentHeight);
                        }
                    },
                }
            ]
        }
    ],
});
