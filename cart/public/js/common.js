require.config({
    baseUrl: "/js",
    paths: {
        'bootstrap': 'bootstrap.min',
        'jquery': 'jquery.min',
        'datetimepicker': 'jquery.datetimepicker'
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
        }
    }
});