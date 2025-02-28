import AVFoundation
import AudioToolbox  // 用于解析 FLAC 等在 AVAsset 不支持的格式

@objc(AwesomeModule)
class AwesomeModule: NSObject {

    /// 导出给 React Native 调用的方法
    @objc
    func extractMetadataFromURL(_ url: String,
                                resolver: @escaping RCTPromiseResolveBlock,
                                rejecter: @escaping RCTPromiseRejectBlock) {
        
        // 根据传入的字符串获取 URL
        let assetUrl: URL
        if url.hasPrefix("http://") || url.hasPrefix("https://") {
            // 网络资源
            print("Remote file: \(url)")
            guard let audioUrl = URL(string: url) else {
                rejecter("error", "Invalid URL", NSError(domain: "", code: 200, userInfo: nil))
                return
            }
            assetUrl = audioUrl
        } else {
            // 本地文件路径（相对或绝对）
            print("Local file: \(url)")
            let filePath = URL(fileURLWithPath: url)
            assetUrl = filePath
        }
        
        // 如果是本地 FLAC 文件，则单独用 AudioToolbox 来解析
        // 注意：对远程 FLAC，需要先下载才能用 AudioFileOpenURL 打开
        if assetUrl.isFileURL && assetUrl.pathExtension.lowercased() == "flac" {
            print("Detected local FLAC file, using AudioToolbox for metadata.")
            do {
                let flacMetadata = try self.extractFLACMetadata(fileUrl: assetUrl)
                resolver(flacMetadata)
            } catch {
                rejecter("error", "Failed to parse FLAC: \(error.localizedDescription)", error)
            }
            return
        }

        // 其他格式，或远程资源，依旧沿用 AVAsset 的做法
        let asset = AVAsset(url: assetUrl)
        print("Using AVAsset: \(asset)")
        
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
                        // 将artwork转为Base64编码字符串
                        result[key] = dataValue.base64EncodedString()
                    }
                }

                resolver(result)
            }
        }
    }
    
    /// 利用 AudioToolbox 读取本地 FLAC 文件的元数据
    private func extractFLACMetadata(fileUrl: URL) throws -> [String: Any] {
        var result: [String: Any] = [:]

        // 打开音频文件
        var audioFileID: AudioFileID?
        let status = AudioFileOpenURL(fileUrl as CFURL,
                                      AudioFilePermissions.readPermission,
                                      0,
                                      &audioFileID)
        guard status == noErr, let audioFile = audioFileID else {
            throw NSError(domain: "AwesomeModule",
                          code: Int(status),
                          userInfo: [NSLocalizedDescriptionKey: "AudioFileOpenURL failed."])
        }
        
        defer {
            // 函数结束时关闭文件
            AudioFileClose(audioFile)
        }

        // 获取 kAudioFilePropertyInfoDictionary（包含了常见的标签信息）
        var dictionarySize: UInt32 = 0
       var isWritableUInt32: UInt32 = 0
        let propInfoStatus = AudioFileGetPropertyInfo(audioFile,
                                                      kAudioFilePropertyInfoDictionary,
                                                      &dictionarySize,
                                                      &isWritableUInt32)
        guard propInfoStatus == noErr else {
            throw NSError(domain: "AwesomeModule",
                          code: Int(propInfoStatus),
                          userInfo: [NSLocalizedDescriptionKey: "AudioFileGetPropertyInfo failed."])
        }

        var cfDict: CFDictionary?
        let propGetStatus = AudioFileGetProperty(audioFile,
                                                 kAudioFilePropertyInfoDictionary,
                                                 &dictionarySize,
                                                 &cfDict)
        guard propGetStatus == noErr, let metaDict = cfDict as? [String: Any] else {
            throw NSError(domain: "AwesomeModule",
                          code: Int(propGetStatus),
                          userInfo: [NSLocalizedDescriptionKey: "AudioFileGetProperty failed or invalid dictionary."])
        }

        // metaDict 里面可能有常见键，如 "title", "artist", "album" 等
        // 可以根据需求筛选/重命名，这里直接全部返回
        for (key, value) in metaDict {
            result[key] = value
        }

        return result
    }
}