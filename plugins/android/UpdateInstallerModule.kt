package com.lucas0706a.CardioSync.updateinstaller

import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.FileInputStream
import java.security.MessageDigest

class UpdateInstallerModule(
    private val context: ReactApplicationContext,
) : ReactContextBaseJavaModule(context) {
    override fun getName(): String = "CardioSyncUpdateInstaller"

    @ReactMethod
    fun canRequestPackageInstalls(promise: Promise) {
        try {
            promise.resolve(
                Build.VERSION.SDK_INT < Build.VERSION_CODES.O ||
                    context.packageManager.canRequestPackageInstalls(),
            )
        } catch (error: Exception) {
            promise.reject("E_INSTALL_PERMISSION_CHECK", error.message, error)
        }
    }

    @ReactMethod
    fun getInstalledAppInfo(promise: Promise) {
        try {
            val info = packageManagerGetInstalledInfo()
            promise.resolve(
                Arguments.createMap().apply {
                    putString("packageName", info.packageName)
                    putString("versionName", info.versionName.orEmpty())
                    putDouble("versionCode", info.versionCodeLong().toDouble())
                },
            )
        } catch (error: Exception) {
            promise.reject("E_INSTALLED_APP_INFO", error.message, error)
        }
    }

    @ReactMethod
    fun inspectApk(filePath: String, promise: Promise) {
        try {
            val uri = Uri.parse(filePath)
            val apk = if (uri.scheme == "file") {
                File(uri.path ?: throw IllegalArgumentException("La ruta del APK no es válida."))
            } else {
                File(filePath)
            }
            require(apk.isFile && apk.canRead()) {
                "El archivo APK no existe o no puede leerse."
            }

            val packageInfo = packageManagerGetArchiveInfo(apk.absolutePath)
                ?: throw IllegalArgumentException("Android no reconoce un APK válido.")
            require(packageInfo.splitNames.isNullOrEmpty()) {
                "El archivo contiene APK divididos y no es instalable como una actualización única."
            }
            val candidatePackage = packageInfo.packageName
            val installedInfo = packageManagerGetInstalledInfo()
            val signaturesMatch = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                val candidateSignatureInfo = packageInfo.signingInfo
                val installedSignatureInfo = installedInfo.signingInfo
                if (candidateSignatureInfo == null || installedSignatureInfo == null) {
                    false
                } else {
                    val candidateSigners = candidateSignatureInfo.apkContentsSigners
                        ?.map { it.toByteArray().toList() }
                        ?.toSet()
                        .orEmpty()
                    val installedSigners = installedSignatureInfo.apkContentsSigners
                        ?.map { it.toByteArray().toList() }
                        .orEmpty()

                    candidateSigners.isNotEmpty() &&
                        installedSigners.isNotEmpty() &&
                        (candidateSigners == installedSigners ||
                            installedSigners.all { signature ->
                                candidateSignatureInfo.hasSigningCertificate(
                                    signature.toByteArray(),
                                    PackageManager.CERT_INPUT_RAW,
                                )
                            })
                }
            } else {
                val candidateSigners =
                    packageInfo.signatures?.map { it.toByteArray().toList() }?.toSet().orEmpty()
                val installedSigners =
                    installedInfo.signatures?.map { it.toByteArray().toList() }?.toSet().orEmpty()
                candidateSigners.isNotEmpty() &&
                    installedSigners.isNotEmpty() &&
                    candidateSigners == installedSigners
            }

            val result = Arguments.createMap().apply {
                putString("packageName", candidatePackage)
                putString("versionName", packageInfo.versionName.orEmpty())
                putDouble("versionCode", packageInfo.versionCodeLong().toDouble())
                putDouble("installedVersionCode", installedInfo.versionCodeLong().toDouble())
                putString("sha256", sha256(apk))
                putBoolean("signatureCompatible", signaturesMatch)
            }
            promise.resolve(result)
        } catch (error: Exception) {
            promise.reject("E_APK_INSPECTION", error.message, error)
        }
    }

    private fun packageManagerGetInstalledInfo(): PackageInfo {
        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            PackageManager.GET_SIGNING_CERTIFICATES
        } else {
            @Suppress("DEPRECATION")
            PackageManager.GET_SIGNATURES
        }
        return context.packageManager.getPackageInfo(context.packageName, flags)
    }

    private fun packageManagerGetArchiveInfo(path: String): PackageInfo? {
        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            PackageManager.GET_SIGNING_CERTIFICATES
        } else {
            @Suppress("DEPRECATION")
            PackageManager.GET_SIGNATURES
        }
        return context.packageManager.getPackageArchiveInfo(path, flags)
    }

    private fun PackageInfo.versionCodeLong(): Long =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) longVersionCode else versionCode.toLong()

    private fun sha256(file: File): String {
        val digest = MessageDigest.getInstance("SHA-256")
        FileInputStream(file).use { input ->
            val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
            while (true) {
                val count = input.read(buffer)
                if (count < 0) break
                digest.update(buffer, 0, count)
            }
        }
        return digest.digest().joinToString("") { byte -> "%02x".format(byte.toInt() and 0xff) }
    }
}
