import AVFoundation
@objc(AwesomeModule)
class AwesomeModule: NSObject {

    @objc
    func extractMetadataFromURL(_ url: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard let audioUrl = URL(string: url) else {
            rejecter("error", "Invalid URL", NSError(domain: "", code: 200, userInfo: nil))
            return
        }

        let asset = AVAsset(url: audioUrl)
        let metadataItems = asset.commonMetadata
        var result: [String: Any] = [:]

        // Extracting common metadata
        for item in metadataItems {
            guard let key = item.commonKey?.rawValue else { continue }

            if let stringValue = item.stringValue {
                result[key] = stringValue
            } else if let numberValue = item.numberValue {
                result[key] = numberValue
            } else if let dataValue = item.dataValue, key == "artwork" {
                result[key] = dataValue.base64EncodedString()
            }
        }

        resolver(result)
    }
}
