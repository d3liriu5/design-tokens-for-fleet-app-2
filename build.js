const StyleDictionaryPackage = require('style-dictionary');
const TinyColor = require('@ctrl/tinycolor');

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

function camelCase(str) {
  return str
    .split('-')
    .reduce((a, b) => a + b.charAt(0).toUpperCase() + b.slice(1));
}

StyleDictionaryPackage.registerTransform({
  name: 'android/colorName',
  type: 'name',
  matcher: function (token) {
    return token.type === 'color'
  },
  transformer: function (token) {
    return camelCase(token.path.slice(0).join(' '))
  }
})

StyleDictionaryPackage.registerTransform({
  name: 'android/pxToDp',
  type: 'value',
  matcher: function (token) {
    return token.type === 'dimension'
  },
  transformer: function (token) {
    return `${token.value}dp`
  }
})

StyleDictionaryPackage.registerTransform({
  name: 'android/colorToHex8',
  type: 'value',
  matcher: function (token) {
    return token.type === 'color'
  },
  transformer: function ({ value }) {
    return `${new TinyColor.TinyColor(value).toHex8String()}`
  }
})

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
        "transformGroup": "android",
        "buildPath": `output/android/${theme}/`,
        "files": [{
          "destination": "colors.xml",
          "format": "android/resources",
          "options": {
           "outputReferences": true
          }
        },{
          "destination": "dimens.xml",
          "format": "android/resources",
          "resourceType": "dimen",
          filter: (token) => token.type === 'dimension',
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
            "attributes": {
              "type": "color"
            }
          }
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
