const path = require('path');

module.exports =
    {
        mode: 'development',
        entry: './src/js/app.js',

        output:
            {
                filename:'bundle.js',
                path: path.resolve(__dirname,'dist'),

            },
        resolve:
            {
                modules: ['./node_modules']
            },
        devServer:
            {
                static:
                    [
                        {
                            directory: path.join(__dirname,'./public'),
                        },
                    ],
                open: true,
                compress: true,
                port: 9000,
            },


    }