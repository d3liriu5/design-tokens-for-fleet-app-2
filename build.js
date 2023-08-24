const StyleDictionaryPackage = require('style-dictionary');
const TinyColor = require('@ctrl/tinycolor');

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

StyleDictionaryPackage.registerTransform({
  name: 'size/pxToDp',
  type: 'value',
  matcher: function(prop) {
      return String(prop.value).match(/^[\d.]+px$/);
  },
  transformer: function(prop) {
      return String(prop.value).replace(/px$/, 'dp');
  }
});

StyleDictionaryPackage.registerTransform({
  name: 'unitless/dp-sp',
  type: 'value',
  matcher: function(prop) {
      return prop.type === 'typography' || prop.type === 'spacing';
  },
  transformer: function(prop) {
      // in Android font sizes are expressed in "sp" units
      let unit = (prop.type === 'typography') ? 'sp' : 'dp';
      return `${prop.value}${unit}`;
  }
});

StyleDictionaryPackage.registerTransformGroup({
  name: 'tokens-android',
  // to see the pre-defined "android" transformation use: console.log(StyleDictionaryPackage.transformGroup['android']);
  transforms: [ "attribute/cti", "name/cti/camel", "unitless/dp-sp"]
});

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
          "format": "css/variables",
          "options": {
           "outputReferences": true
          }
        }]
      },
      "android": {
        "transformGroup": "tokens-android",
        "buildPath": `output/android/${theme}/`,
        "files": [{
          "destination": "colors.xml",
          "format": "android/resources",
          "filter": {
            "type": "color"
          },
          "options": {
           "outputReferences": true
          }
        },{
          "destination": "dimens.xml",
          "format": "android/resources",
          "filter": {
            "type": "spacing"
          },
          "options": {
           "outputReferences": true
          }
        }]
      },
      "compose": {
        "transformGroup": "compose",
        "buildPath": `output/compose/${theme}/`,
        "files": [{
          "destination": "StyleDictionaryColor.kt",
          "format": "compose/object",
          "className": "StyleDictionaryColor",
          "packageName": "StyleDictionaryColor",
          "filter": {
            "type": "color"
          },
        },{
          "destination": "StyleDictionarySize.kt",
          "format": "compose/object",
          "className": "StyleDictionarySize",
          "packageName": "StyleDictionarySize",
          "type": "float",
          "filter": {
            "attributes": {
              "category": "size"
            }
          }
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

console.log('Android pre-defined transformations:' + StyleDictionaryPackage.transformGroup['android']);
console.log('iOS pre-defined transformations:' + StyleDictionaryPackage.transformGroup['ios']);
console.log('Compose pre-defined transformations:' + StyleDictionaryPackage.transformGroup['compose']);

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['light', 'dark'].map(function (theme) {
  ['web', 'ios', 'android', 'compose'].map(function (platform) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${platform}] [${theme}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, platform));

    StyleDictionary.buildPlatform(platform);

    console.log('\nEnd processing');

  })
})

console.log('\n==============================================');
console.log('\nBuild completed, yayy!');
