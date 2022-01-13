const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const Utils = require('./lib/utils.js');

const ANDROID_MANIFEST_PATH = 'platforms/android/app/src/main/AndroidManifest.xml';
const SWITCH_APP_ICON_JAVA_PATH = 'platforms/android/app/src/main/java/de/jh7/switchappicon/Icons.java'

module.exports = async function(context) {
  const variables = await Utils.getVariables(
    path.join(context.opts.projectRoot, 'package.json'),
    path.join(context.opts.projectRoot, 'config.xml')
  );

  const projectAndroidManifest = path.join(context.opts.projectRoot, ANDROID_MANIFEST_PATH);

  let androidManifest = fs.readFileSync(projectAndroidManifest, 'utf8');

  androidManifest = await xml2js.parseStringPromise(androidManifest);

  let mainActivityObj = {};

  // Removing <category android:name="android.intent.category.LAUNCHER" />
  // from the main activity
  androidManifest.manifest.application[0].activity = androidManifest.manifest.application[0].activity
    .map((activity) => {
      if (activity.$['android:name'] === 'MainActivity') {
        mainActivityObj = { ...activity };
        if (activity['intent-filter']
          && activity['intent-filter'][0]
          && activity['intent-filter'][0]['category']) {
            activity['intent-filter'][0]['category'] = activity['intent-filter'][0]['category']
              .filter((category) => {
                if (category.$['android:name'] === 'android.intent.category.LAUNCHER') {
                  return false;
                }

                return true;
              });

            if (activity['intent-filter'][0]['category'].length === 0) {
              delete activity['intent-filter'][0]['category'];
            }
        }

        if (variables.COPY_INTENT_FILTERS) {
          // When copying intent filters from the activity to its aliases,
          // remove the filter from the activity.
          activity['intent-filter'] = [activity['intent-filter'][0]]
        }
      }

      return activity
    });

  const { aliases } = variables;

  if (aliases.length === 0) {
    console.error('cordova-plugin-switch-app-icon needs at least one alias!');
    process.exit(-1);
  }

  const mainActivityIntentFilters = [];

  if (variables.COPY_INTENT_FILTERS && mainActivityObj['intent-filter']) {
    mainActivityObj['intent-filter'].forEach((filter) => {
      const isMain = filter['action'].some((action) => {
        if (action.$['android:name'] === 'android.intent.action.MAIN') {
          return true;
        }

        return false;
      });

      if (!isMain) {
        mainActivityIntentFilters.push(filter);
      }
    });
  }

  // Add activity aliases
  const newAliases = aliases
    .filter((entry) => {
      if (!androidManifest.manifest.application[0]['activity-alias']) {
        return true;
      }

      const found = androidManifest.manifest.application[0]['activity-alias']
        .findIndex(activity => activity.$['android:name'] === `.${entry.name}`);
      return found === -1;
    })
    .map((entry) => {
      const obj = {};
      const entryAttributes = { ...mainActivityObj.$ };
      entryAttributes['android:targetActivity'] = '.MainActivity';
      entryAttributes['android:name'] = `.${entry.name}`;
      entryAttributes['android:label'] = entry.label;
      entryAttributes['android:icon'] = entry.icon;
      entryAttributes['android:enabled'] = (!!entry.enabled).toString();

      obj.$ = entryAttributes;
      obj['intent-filter'] = [
        {
          $: { 'android:label': entry.label },
          action: [
            {
              $: { 'android:name': 'android.intent.action.MAIN' }
            }
          ],
          category: [
            {
              $: { 'android:name': 'android.intent.category.LAUNCHER' }
            }
          ]
        },
        ...mainActivityIntentFilters,
      ];

      return obj;
    });

  if (!androidManifest.manifest.application[0]['activity-alias'])
    androidManifest.manifest.application[0]['activity-alias'] = [];
    androidManifest.manifest.application[0]['activity-alias'] = 
      androidManifest.manifest.application[0]['activity-alias'].concat(newAliases);



  const builder = new xml2js.Builder();
  const xml = builder.buildObject(androidManifest);

  fs.writeFileSync(projectAndroidManifest, xml);

  // Override the enum in SwitchAppIcon.java
  const javaPath = path.join(context.opts.projectRoot, SWITCH_APP_ICON_JAVA_PATH);
  let javaFile = `package de.jh7.switchappicon;

public enum Icons {
  ${aliases.map((alias) => alias.name).join(',')}
}
`;

  if (!fs.existsSync(path.dirname(javaPath))) {
    fs.mkdirSync(path.dirname(javaPath), { recursive: true });
  }
  fs.writeFileSync(javaPath, javaFile);
}
