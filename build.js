const StyleDictionaryPackage = require('style-dictionary');

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

function getStyleDictionaryConfig(theme, platform) {
  return {
    "source": [
      `input/themes/${theme}/*.json`,
      "input/globals/**/*.json"
    ],
    "platforms": {
      "web": {
        "transformGroup": "web",
        "buildPath": `output/web/${theme}/`,
        "files": [{
          "destination": "tokens.css",
          "format": "css/variables"
        }]
      },
      "android": {
        transforms: [
          'name/cti/camel',
          'android/colorName',
          'android/fontSize',
          'android/pxToDp',
          'android/color'
        ],
        "buildPath": `output/android/${theme}/`,
        "files": [{
          "destination": "colors.xml",
          "format": "android/colors",
          resourceType: 'color',
          filter: (token) => token.type === 'color'
        },{
          "destination": "dimens.xml",
          "format": "android/dimens",
          resourceType: 'dimen',
          filter: (token) => token.type === 'dimension'
        },{
          "destination": "tokens.font_dimens.xml",
          "format": "android/fontDimens"
        }]
      },
      "ios": {
        "transformGroup": "ios",
        "buildPath": `output/ios/${theme}/`,
        "files": [{
          "destination": "tokens.h",
          "format": "ios/macros"
        }]
      }
    }
  };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['light', 'dark'].map(function (theme) {
  ['web', 'ios', 'android'].map(function (platform) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${platform}] [${theme}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, platform));

    StyleDictionary.buildPlatform(platform);

    console.log('\nEnd processing');

  })
})

console.log('\n==============================================');
console.log('\nBuild completed, yayy!');
