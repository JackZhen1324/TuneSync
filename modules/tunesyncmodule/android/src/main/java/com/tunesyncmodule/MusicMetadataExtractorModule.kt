package com.tunesyncmodule

import android.media.MediaMetadataRetriever
import android.util.Base64
import com.facebook.react.bridge.*

class MusicMetadataExtractorModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MusicMetadataExtractor"
    }

    @ReactMethod
    fun extractMetadataFromURL(url: String, promise: Promise) {
        val retriever = MediaMetadataRetriever()
        try {
            retriever.setDataSource(url, hashMapOf())
            val title = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_TITLE)
            val artist = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ARTIST)
            val album = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ALBUM)
            val genre = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_GENRE)
            val releaseDate = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DATE)

            val art = retriever.embeddedPicture
            val artwork = if (art != null) Base64.encodeToString(art, Base64.DEFAULT) else null

            val result = Arguments.createMap()
            result.putString("title", title)
            result.putString("artist", artist)
            result.putString("album", album)
            result.putString("genre", genre)
            result.putString("releaseDate", releaseDate)
            result.putString("artwork", artwork)

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("Error", "Failed to retrieve metadata.")
        } finally {
            retriever.release()
        }
    }
}
