package com.BTBbuscatubajoncl.cl

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen

class SplashActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    val splashScreen = installSplashScreen()
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_splash)

    splashScreen.setKeepOnScreenCondition{true}
    Thread.sleep(200)

    val intent = Intent(this, MainActivity::class.java)
    startActivity(intent)
    finishAffinity()
  }
}
