
const fs = require('fs');
const path = require('path');
const plist = require('plist');

const Utils = require('./lib/utils.js');

const IOS_PLIST_PATH = 'platforms/ios/*/*-Info.plist';

module.exports = async function(context) {
  const pathToUse = IOS_PLIST_PATH.replace(/\*/g, await Utils.getAppName(path.join(context.opts.projectRoot, 'config.xml')));
  const iosInfoPath = path.join(context.opts.projectRoot, pathToUse);

  let iosInfo = fs.readFileSync(iosInfoPath, 'utf8');

  iosInfo = plist.parse(iosInfo);

  const CFBundleAlternateIcons = {};

  const aliases = Utils.getAliasesFromVariables(await Utils.getVariables(
    path.join(context.opts.projectRoot, 'package.json'),
    path.join(context.opts.projectRoot, 'config.xml')
  ));

  aliases.forEach((alias) => {
    if (!CFBundleAlternateIcons[`icon-${alias.name}`]) {
      CFBundleAlternateIcons[`icon-${alias.name}`] = {
        UIPrerenderedIcon: true,
        CFBundleIconFiles: [
          `icon-${alias.name}`,
        ],
      }
    }
  });

  if (!iosInfo.CFBundleIcons) iosInfo.CFBundleIcons = { CFBundleAlternateIcons };
  if (!iosInfo['CFBundleIcons~ipad']) iosInfo['CFBundleIcons~ipad'] = { CFBundleAlternateIcons };

  const xml = plist.build(iosInfo);

  fs.writeFileSync(iosInfoPath, xml);
}
