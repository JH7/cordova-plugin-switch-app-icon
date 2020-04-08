const fs = require('fs');
const xml2js = require('xml2js');

/**
 * <plugin name="cordova-plugin-device" spec="^1.1.0">
    <variable name="MY_VARIABLE" value="my_variable_value" />
</plugin>
 */

const VARIABLE_MATCHER = /ALIAS_([0-9]+)_.*/;

module.exports = {
  async getVariables(packagePath, configXMLPath) {
    let variables = {};

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

    const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const packageVariables = package.cordova.plugins['cordova-plugin-switch-app-icon'] || {};

    Object.assign(variables, packageVariables);
    return variables;
  },
  getAliasesFromVariables(variables) {
    const aliases = [];

    const lastIdx = Object.keys(variables).reduce((acc, variable) => {
      const res = VARIABLE_MATCHER.exec(variable);
      if (res && res[1] && parseInt(res[1]) > acc) {
        return parseInt(res[1]);
      }

      return acc;
    }, 0);

    for (let i = 0; i <= lastIdx; i += 1) {
      aliases.push({
        icon: variables[`ALIAS_${i}_ICON`],
        label: variables[`ALIAS_${i}_LABEL`],
        name: variables[`ALIAS_${i}_NAME`],
        enabled: variables[`ALIAS_${i}_ENABLED`] === 'true',
      });
    }

    return aliases;
  },
  async getAppName(configXMLPath) {
    let configXML = fs.readFileSync(configXMLPath, 'utf8')
    configXML = await xml2js.parseStringPromise(configXML);

    return configXML.widget.name[0];
  },
};