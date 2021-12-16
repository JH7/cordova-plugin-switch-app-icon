package de.jh7.switchappicon;

import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;

import de.apothekendirekt.app.BuildConfig;

// https://stackoverflow.com/a/66029475/1502477
public class SwitchAppIconService extends Service {
    private const String TAG = "SwitchAppIconService";
    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        Log.d(TAG, "Service binded");
        return null;
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        Log.d(TAG, "Service removed");
        changeAppIcon();
        stopSelf();
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "ON DESTROY");
        changeAppIcon();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "Service started");
        return START_NOT_STICKY;
    }

    void changeAppIcon() {
        SharedPreferences sp = getSharedPreferences("SwitchAppIconSettings", Context.MODE_PRIVATE);

        String alias = sp.getString("currentIcon", "notset");
        if (alias != "notset" && !isAliasEnabled(alias)) {
            setAliasEnabled(alias);
        }
    }

    boolean isAliasEnabled(String aliasName) {
        return getPackageManager().getComponentEnabledSetting(
                new ComponentName(
                        this,
                        BuildConfig.APPLICATION_ID + "." + aliasName
                )
        ) == getPackageManager().COMPONENT_ENABLED_STATE_ENABLED;
    }

    void setAliasEnabled(String aliasName) {
        for (SwitchAppIcon.ICONS value : SwitchAppIcon.ICONS.values()) {
            int action = PackageManager.COMPONENT_ENABLED_STATE_DISABLED;
            if (value.toString().equals(aliasName)) {
                action = PackageManager.COMPONENT_ENABLED_STATE_ENABLED;
            }

            ComponentName compName = new ComponentName(BuildConfig.APPLICATION_ID, BuildConfig.APPLICATION_ID + "." + value.toString().toUpperCase());

            getPackageManager().setComponentEnabledSetting(
                    compName,
                    action,
                    PackageManager.DONT_KILL_APP
            );
        }
    }
}
