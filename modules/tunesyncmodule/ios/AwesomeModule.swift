import AVFoundation
@objc(AwesomeModule)
class AwesomeModule: NSObject {

    @objc
    func extractMetadataFromURL(_ url: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        let assetUrl: URL
        if url.hasPrefix("http://") || url.hasPrefix("https://") {
            // 网络资源
            guard let audioUrl = URL(string: url) else {
                rejecter("error", "Invalid URL", NSError(domain: "", code: 200, userInfo: nil))
                return
            }
            assetUrl = audioUrl
        } else {
            
            // 本地文件路径（相对路径或绝对路径）
            let filePath = URL(fileURLWithPath: url)
            assetUrl = filePath
        }

        let asset = AVAsset(url: assetUrl)
        // 在某些情况下，AVAsset的metadata可能需要加载完成后才能读取
        // 我们使用asset.loadValuesAsynchronously(forKeys: ...)异步加载
        asset.loadValuesAsynchronously(forKeys: ["commonMetadata"]) {
            DispatchQueue.main.async {
                let status = asset.statusOfValue(forKey: "commonMetadata", error: nil)
                guard status == .loaded else {
                    rejecter("error", "Failed to load metadata", NSError(domain: "", code: 201, userInfo: nil))
                    return
                }

                let metadataItems = asset.commonMetadata
                var result: [String: Any] = [:]

                // 提取通用元数据
                for item in metadataItems {
                    guard let key = item.commonKey?.rawValue else { continue }

                    if let stringValue = item.stringValue {
                        result[key] = stringValue
                    } else if let numberValue = item.numberValue {
                        result[key] = numberValue
                    } else if let dataValue = item.dataValue, key == "artwork" {
                        // 将artwork转为Base64编码字符串，方便在JS中使用
                        result[key] = dataValue.base64EncodedString()
                    }
                }

                resolver(result)
            }
        }
    }
}