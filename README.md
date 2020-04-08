# cordova-plugin-switch-app-icon
This plugin allows you to switch/change your app icon of your cordova app. On Android you can change the name of the app aswell.

## Caveats
* Please note that I have not battle-tested this plugin.
* This plugins re-writes your `AndroidManifest.xml` and `*-Info.plist` so please make sure you have a backup. The re-writing is a bit "hacky" so please make sure that it works with your cordova project.

## Usage
### Variables
Please use this variable syntax: `ALIAS_${IDX}_${PROPERTY}`. `${IDX}` has to start at `0`. `${PROPERTY}` can be one of the following:
* `ICON`: Specifing the icon for Android. Example: `@mipmap/ic_icon`.
* `LABEL`: The label for the Android activity.
* `NAME`: The name for the Android activity. This is the name that must be specified when using this plugin. Please do not use any special characters here including whitespace.
* `ENABLED`: Whether this activity should be enabled by default on Android. Default value is `false`.

If you use iOS only, you have to specifiy `NAME` only.
### Icons
Please specifiy the icons as a resource file in your `config.xml`. For iOS:
```xml
<platform name="ios">
    ...
    <resource-file src="icon-TEST.png" target="icon-TEST.png" />
    ...
</platform>
```
For Android:
```xml
<platform name="android">
    ...
    <resource-file src="icon-TEST.png" target="app/src/main/res/drawable-mdpi/icon_TEST.png" />
    ...
</platform>
```
### API
```javascript
SwitchAppIcon.appIconExists('TEST', (res) => {
    // res === 1 if the icon exists
    // res === 0 if the icon does not exist
}, (err) => {
});
```
```javascript
SwitchAppIcon.changeAppIcon('TEST', (res) => {
    // res === 'OK' if the icon was changed successfully
}, (err) => {
});
```
## Special thanks
Special thanks to https://github.com/EddyVerbruggen/cordova-plugin-app-icon-changer @EddyVerbruggen. The iOS implementation is mostly copied from his code.

## Contributing
Feel free to contribute! Open a PR at any time.

## License
MIT