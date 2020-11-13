/*
This code is based on a large part from
https://github.com/EddyVerbruggen/cordova-plugin-app-icon-changer/blob/master/src/ios/AppIconChanger.m
The code is licensed under the following MIT:

---
The MIT License (MIT)

Copyright (c) 2016 Eddy Verbruggen

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
---

The MIT License (MIT)

Copyright (c) 2020 Jonas Hillebrand

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
*/

#import "Cordova/CDV.h"
#import "SwitchAppIcon.h"

@implementation SwitchAppIcon

- (void) isSupported:(CDVInvokedUrlCommand*)command
{
  CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:[self supportsAlternateIcons]];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) changeAppIcon:(CDVInvokedUrlCommand*)command
{
  if (![self supportsAlternateIcons]) {
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"This version of iOS doesn't support alternate icons"] callbackId:command.callbackId];
    return;
  }

    BOOL suppressUserNotification = false;
    NSString *iconName = [command.arguments objectAtIndex:0];;
    /* if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSString class]]) {
        NSDictionary *argDict =
        iconName = argDict[@"iconName"];
        suppressUserNotification = [argDict[@"supressUserNotification"] boolValue];
    } else {
        iconName = [command.arguments objectAtIndex:0];
    } */

  if (iconName == nil) {
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"The 'iconName' parameter is mandatory"] callbackId:command.callbackId];
    return;
  }

  NSString *iconNameTogether = [@"icon-" stringByAppendingString:iconName];
  [[UIApplication sharedApplication] setAlternateIconName:iconNameTogether completionHandler:^(NSError *error) {
      if (error != nil) {
        NSString *errMsg = error.localizedDescription;
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errMsg] callbackId:command.callbackId];
      } else {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
      }
  }];


  if (suppressUserNotification) {
    [self suppressUserNotification];
  }
}

- (void) appIconExists:(CDVInvokedUrlCommand*)command
{
    NSString *iconName = [command.arguments objectAtIndex:0];
    NSString *iconNameTogether = [@"icon-" stringByAppendingString:iconName];

    NSDictionary *bundleIcons = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleIcons"];
    NSDictionary *bundleAlternateIcons = [bundleIcons objectForKey:@"CFBundleAlternateIcons"];
    NSArray *icons = [bundleAlternateIcons allKeys];
    BOOL exist = [icons containsObject:iconNameTogether];
    int existInt = 0;
    if (exist) {
        existInt = 1;
    }
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:existInt];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


#pragma mark - Helper functions

- (BOOL) supportsAlternateIcons
{
    return [[UIApplication sharedApplication] supportsAlternateIcons];
}

- (void) suppressUserNotification
{
  UIViewController* suppressAlertVC = [UIViewController new];
  [self.viewController presentViewController:suppressAlertVC animated:NO completion:^{
      [suppressAlertVC dismissViewControllerAnimated:NO completion: nil];
  }];
}

@end
