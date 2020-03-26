const { override, fixBabelImports, addLessLoader, useBabelRc } = require('customize-cra');
const path = require('path');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  fixBabelImports('formik-antd', {
    libraryName: 'formik-antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      hack: `true; @import "${path.resolve(__dirname, './src/assets/antd-custom.less')}";`
    }
  }),
  useBabelRc()
);
