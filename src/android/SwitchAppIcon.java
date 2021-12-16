/*
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

package de.jh7.switchappicon;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaInterface;

import org.json.JSONArray;
import org.json.JSONException;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import org.json.JSONObject;

import android.content.pm.PackageManager;
import android.content.ComponentName;

import de.apothekendirekt.app.BuildConfig;

public class SwitchAppIcon extends CordovaPlugin {

    /**
     * This will be set by the cordova post_prepare hook of this plugin.
     */
    public enum ICONS { };

    private const String TAG = "SwitchAppIcon";

    private Intent intent;

    @Override
    public void onStop() {
        Log.d(TAG, "Activity stopped");

        if (intent != null) {
            cordova.getActivity().stopService(intent);
        }
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        if (action.equals("changeAppIcon")) {
            String appIcon = args.getString(0);
            this.changeAppIcon(appIcon, callbackContext);
            return true;
        }
        if (action.equals("appIconExists")) {
            String appIcon = args.getString(0);
            this.appIconExists(appIcon, callbackContext);
            return true;
        }
        return false;
    }

    private void appIconExists(String appIcon, CallbackContext callbackContext) {
        for (ICONS value : ICONS.values()) {
            if (value.toString().equals(appIcon)) {
                callbackContext.success(1);
                return;
            }
        }

        callbackContext.success(0);
    }

    private void changeAppIcon(String appIcon, CallbackContext callbackContext) {
        if (intent == null) {
            Log.d(TAG, "Starting service!");
            intent = new Intent(cordova.getActivity(), de.jh7.switchappicon.SwitchAppIconService.class);
            cordova.getActivity().startService(intent);
        }
        
        SharedPreferences sp = cordova.getActivity().getSharedPreferences("SwitchAppIconSettings", Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = sp.edit();
        edit.putString("currentIcon", appIcon);
        edit.commit();

        callbackContext.success("OK");
    }
}
