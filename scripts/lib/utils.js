const fs = require('fs');
const path = require('path');
const { config } = require('process');
const xml2js = require('xml2js');

/**
 * <plugin name="cordova-plugin-device" spec="^1.1.0">
    <variable name="MY_VARIABLE" value="my_variable_value" />
</plugin>
 */

const VARIABLE_MATCHER = /ALIAS_([0-9]+)_.*/;

module.exports = {
  async getVariables(packagePath, configXMLPath) {
    let variables = {
      aliases: [],
    };

    if (fs.existsSync(configXMLPath)) {
      let configXML = fs.readFileSync(configXMLPath, 'utf8')
      configXML = await xml2js.parseStringPromise(configXML);

      if (configXML.widget.plugin) {
        configXML.widget.plugin.forEach((plugin) => {
          if (plugin.variable) {
            plugin.variable.forEach((variable) => {
              variables[variable.$.name] = variables[variable.$.value];
            });
          }
        });
      }

      if (configXML.widget['cordova-plugin-switch-app-icon']) {
        const aliasConfig = configXML.widget['cordova-plugin-switch-app-icon'][0];
        aliasConfig?.alias.forEach((alias) => {
          variables.aliases.push({
            icon: alias.$.icon,
            label: alias.$.label,
            name: alias.$.name,
            enabled: alias.$.enabled === 'true',
          });
        });
      }
    }

    if (fs.existsSync(packagePath)) {
      const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const packageVariables = package.cordova.plugins['cordova-plugin-switch-app-icon'] || {};

      Object.assign(variables, packageVariables);
    }

    const meteorFetchPath = path.join(packagePath, '..', 'plugins', 'fetch.json');
    if (fs.existsSync(meteorFetchPath)) {
      const meteorFetch = JSON.parse(fs.readFileSync(meteorFetchPath, 'utf8'));
      const meteorFetchVariables = meteorFetch["cordova-plugin-switch-app-icon"]
        ? meteorFetch["cordova-plugin-switch-app-icon"].variables : {};

      Object.assign(variables, meteorFetchVariables);
    }

    console.log(variables);
    return variables;
  },
  async getAppName(configXMLPath) {
    let configXML = fs.readFileSync(configXMLPath, 'utf8')
    configXML = await xml2js.parseStringPromise(configXML);

    return configXML.widget.name[0];
  },
};