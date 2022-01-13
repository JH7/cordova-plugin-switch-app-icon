# cordova-plugin-switch-app-icon
This plugin allows you to switch/change your app icon of your cordova app. On Android you can change the name of the app aswell.

## Caveats
* Please note that I have not battle-tested this plugin.
* This plugins re-writes your `AndroidManifest.xml` and `*-Info.plist` so please make sure you have a backup. The re-writing is a bit "hacky" so please make sure that it works with your cordova project.

## Usage
### Configuration
```xml
<cordova-plugin-switch-app-icon>
  <alias icon="@mipmap/ic_launcher" label="Standard App" name="standard" enabled="true" />
  <alias icon="@drawable/icon_teest" label="Test App" name="test" />
</cordova-plugin-switch-app-icon>
```
* `icon`: Specifing the icon for Android. Example: `@mipmap/ic_icon`.
* `label`: The label for the Android activity.
* `name`: The name for the Android activity. This is the name that must be specified when using this plugin. Please do not use any special characters here including whitespace.
* `enabled`: Whether this activity should be enabled by default on Android. Default value is `false`.

If you use iOS only, you have to specifiy `name` only.

Set `COPY_INTENT_FILTERS` to true to move all intent filters from the main activity on Android to the activity aliases.
### Icons
Please specifiy the icons as a resource file in your `config.xml`. For iOS, you need four icon dimensions:
* 120x120 (`icon-TEST-120x120.png`)
* 144x144 (`icon-TEST-144x144.png`)
* 152x152 (`icon-TEST-152x152.png`)
* 167x167 (`icon-TEST-167x167.png`)

Specify these like so:
```xml
<platform name="ios">
    ...
    <resource-file src="icon-TEST-120x120.png" target="icon-TEST-120x120.png" />
    <resource-file src="icon-TEST-144x144.png" target="icon-TEST-144x144.png" />
    <resource-file src="icon-TEST-152x152.png" target="icon-TEST-152x152.png" />
    <resource-file src="icon-TEST-167x167.png" target="icon-TEST-167x167.png" />
    ...
</platform>
```
For Android, you only need one dimension (144x144), but other dimensions can be easily added by copying them to the corresponding `drawable-Xdpi` directory:
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

The MIT License (MIT)

Copyright (c) 2021 Jonas M. Hillebrand

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.