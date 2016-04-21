require.config({
    baseUrl: "/js",
    paths: {
        'bootstrap': 'bootstrap.min',
        'jquery': 'jquery.min',
        'datetimepicker': 'jquery.datetimepicker',
        'validate':'jquery.validate.min',
        'validate-methods':'validate-methods'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'datetimepicker': {
            deps: ['jquery']
        },
        'bootstrap':{
            deps:['jquery']
        },
        'validate':{
            deps:['jquery']
        },
        'validate-methods':{
            deps:['jquery','validate']
        }
    }
});