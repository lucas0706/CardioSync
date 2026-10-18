package __CARDIOSYNC_PACKAGE__.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import __CARDIOSYNC_PACKAGE__.MainActivity
import __CARDIOSYNC_PACKAGE__.R

class QuickMeasurementWidgetProvider : AppWidgetProvider() {

  companion object {
    private const val REQUEST_CODE = 5701
    private const val MEASUREMENT_URI = "cardiosync:///measurement/new"
  }

  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    val launchIntent = Intent(
      Intent.ACTION_VIEW,
      Uri.parse(MEASUREMENT_URI),
      context,
      MainActivity::class.java,
    ).apply {
      addFlags(
        Intent.FLAG_ACTIVITY_NEW_TASK or
          Intent.FLAG_ACTIVITY_CLEAR_TOP or
          Intent.FLAG_ACTIVITY_SINGLE_TOP,
      )
    }

    val pendingIntent = PendingIntent.getActivity(
      context,
      REQUEST_CODE,
      launchIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )

    appWidgetIds.forEach { appWidgetId ->
      val views = RemoteViews(
        context.packageName,
        R.layout.cardiosync_quick_measurement_widget,
      )

      views.setOnClickPendingIntent(
        R.id.cardiosync_widget_root,
        pendingIntent,
      )

      appWidgetManager.updateAppWidget(appWidgetId, views)
    }
  }
}
