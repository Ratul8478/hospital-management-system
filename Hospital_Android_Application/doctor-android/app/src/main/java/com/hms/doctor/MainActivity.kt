package com.hms.doctor

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.*
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.hms.doctor.core.ui.theme.HmsDoctorTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private var webView: WebView? = null
    private var fileChooserCallback: ValueCallback<Array<Uri>>? = null

    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val intent = result.data
            val uris = WebChromeClient.FileChooserParams.parseResult(result.resultCode, intent)
                ?: intent?.data?.let { arrayOf(it) }
            fileChooserCallback?.onReceiveValue(uris)
        } else {
            fileChooserCallback?.onReceiveValue(null)
        }
        fileChooserCallback = null
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            HmsDoctorTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Color(0xFF070B11)
                ) {
                    MedixContainerScreen()
                }
            }
        }
    }

    @Composable
    fun MedixContainerScreen() {
        var isLoading by remember { mutableStateOf(true) }
        var currentWebView by remember { mutableStateOf<WebView?>(null) }

        BackHandler(enabled = currentWebView?.canGoBack() == true) {
            currentWebView?.goBack()
        }

        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFF070B11))
        ) {
            AndroidView(
                factory = { context ->
                    WebView(context).apply {
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )
                        settings.apply {
                            javaScriptEnabled = true
                            domStorageEnabled = true
                            databaseEnabled = true
                            allowFileAccess = true
                            allowContentAccess = true
                            @Suppress("DEPRECATION")
                            allowFileAccessFromFileURLs = false
                            @Suppress("DEPRECATION")
                            allowUniversalAccessFromFileURLs = false
                            loadWithOverviewMode = true
                            useWideViewPort = true
                            builtInZoomControls = false
                            displayZoomControls = false
                            cacheMode = WebSettings.LOAD_DEFAULT
                            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
                        }
                        webViewClient = object : WebViewClient() {
                            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                                val url = request?.url?.toString() ?: return false
                                if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("sms:") || url.startsWith("geo:")) {
                                    try {
                                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse(url))
                                        context.startActivity(intent)
                                        return true
                                    } catch (e: Exception) {
                                        e.printStackTrace()
                                    }
                                }
                                return false
                            }

                            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                                super.onPageStarted(view, url, favicon)
                                isLoading = true
                            }

                            override fun onPageFinished(view: WebView?, url: String?) {
                                super.onPageFinished(view, url)
                                isLoading = false
                            }
                        }
                        webChromeClient = object : WebChromeClient() {
                            override fun onShowFileChooser(
                                webView: WebView?,
                                filePathCallback: ValueCallback<Array<Uri>>?,
                                fileChooserParams: FileChooserParams?
                            ): Boolean {
                                fileChooserCallback?.onReceiveValue(null)
                                fileChooserCallback = filePathCallback

                                val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                                    addCategory(Intent.CATEGORY_OPENABLE)
                                    type = "image/*"
                                }

                                return try {
                                    fileChooserLauncher.launch(intent)
                                    true
                                } catch (e: Exception) {
                                    fileChooserCallback?.onReceiveValue(null)
                                    fileChooserCallback = null
                                    false
                                }
                            }
                        }
                        loadUrl("file:///android_asset/medix/index.html")
                        currentWebView = this
                        this@MainActivity.webView = this
                    }
                },
                modifier = Modifier.fillMaxSize()
            )

            if (isLoading) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xFF070B11)),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(
                        color = Color(0xFF2563EB),
                        strokeWidth = 3.dp
                    )
                }
            }
        }
    }

    override fun onDestroy() {
        fileChooserCallback?.onReceiveValue(null)
        fileChooserCallback = null
        webView?.destroy()
        super.onDestroy()
    }
}
