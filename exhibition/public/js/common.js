require.config({
    baseUrl: "/js",
    paths: {
        'bootstrap': 'bootstrap.min',
        'jquery': 'jquery.min',
        'datetimepicker': 'jquery.datetimepicker',
        'validate':'jquery.validate.min',
        'validate-methods':'validate-methods',
        'paginator':'bootstrap-paginator',
        'moment':'moment'
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
        'paginator':{
            deps:['jquery','bootstrap.min']
        },
        'validate':{
            deps:['jquery']
        },
        'moment':{
            deps:['jquery']
        },
        'validate-methods':{
            deps:['jquery','validate']
        }
    }
});