package com.BTBbuscatubajoncl.cl;

import android.app.Activity;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Toast;
import android.Manifest;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  private boolean isBackPressedOnce = false;
  private Toast toast = null;
  Handler handler = new Handler();

  protected void onCreate(Bundle savedInstanceState) {

    super.onCreate(savedInstanceState);


    if (ContextCompat.checkSelfPermission(MainActivity.this,
      Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED){
      if (ActivityCompat.shouldShowRequestPermissionRationale(MainActivity.this,
        Manifest.permission.ACCESS_FINE_LOCATION)){
        ActivityCompat.requestPermissions(MainActivity.this,
          new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1);
      }else{
        ActivityCompat.requestPermissions(MainActivity.this,
          new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1);
      }
    }

    if (Build.VERSION.SDK_INT >= 19 && Build.VERSION.SDK_INT < 21) {
      setWindowFlag(this, WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS, true);
    }
    if (Build.VERSION.SDK_INT >= 19) {
      getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    }
    //make fully Android Transparent Status bar
    if (Build.VERSION.SDK_INT >= 21) {
      setWindowFlag(this, WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS, false);
      getWindow().setStatusBarColor(Color.TRANSPARENT);
    }

  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions,
                                         int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    switch (requestCode) {
      case 1: {
        if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
          if (ContextCompat.checkSelfPermission(MainActivity.this,
            Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(this, "Permiso Concedido", Toast.LENGTH_SHORT).show();
          }
        } else {
          Toast.makeText(this, "Permiso Denegado", Toast.LENGTH_SHORT).show();
        }
        return;
      }
    }
  }


  public static void setWindowFlag(Activity activity, final int bits, boolean on) {

    Window win = activity.getWindow();
    WindowManager.LayoutParams winParams = win.getAttributes();
    if (on) {
      winParams.flags |= bits;
    } else {
      winParams.flags &= ~bits;
    }
    win.setAttributes(winParams);
  }

}
