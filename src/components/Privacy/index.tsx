import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import * as RNLocalize from 'react-native-localize'

const privacyPolicyContent = {
	en: {
		title: 'Privacy Policy',
		sections: [
			{
				sectionTitle: 'Introduction',
				text: 'Welcome to TuneSync (hereinafter referred to as "we" or "the app"). This privacy policy aims to explain how we collect, use, share, and protect your personal information. Please read the following content carefully to understand our privacy practices.',
			},
			{
				sectionTitle: 'Login Information',
				text: 'To use the app, you must provide authentication information for the corresponding services (including but not limited to WebDAV, SMB, Google Drive, etc.) to facilitate our reading of your service files. The app developer promises never to collect your personal account and password information.\n\nHowever, please be aware that for user experience design considerations, your account will be stored on the device you use to access the app (including but not limited to your iPhone, iPad, or Mac; the app may cover more devices in the future). These privacy-sensitive information will not be shared through the network to any other location. When you delete the app from your device, this information will be permanently deleted. We save your login account and password for the following purposes:\n1. Save login account and password so you do not need to re-enter them on the login page next time.\n2. Save device connection address (your custom domain) and login token to automatically connect and log in to the device when you open the app.\nWe will do our best to protect your information security.',
			},
			{
				sectionTitle: 'Music Content',
				text: 'All content visible in the app comes from your network storage device (NAS). The app will never provide any open public resources. Please confirm the usage rights of all music resources on your device. The app is not responsible for the resources on your device and the content played.\n\nAs a third-party music player, our server will not actively collect or store your personal music data on your server (NAS).\nHowever, in the following situations, our server can know the music data content you are currently playing, but these data will not and cannot be associated with your personal account (our server will never collect your personal account information):\n1. Online Lyrics: When you use the online lyrics provided by the app, the currently playing music, artist, and album information will be transmitted to the app server for lyrics search and matching.\n2. Cover Matching: When you use the cover matching provided by the app, the corresponding song, album, and artist information will be transmitted to the app server.\nWe will do our best to protect your information security.',
			},
			{
				sectionTitle: 'Information Security',
				text: 'We take various technical measures to protect your personal information from unauthorized access, use, or disclosure. However, due to the openness of the internet, we cannot guarantee the absolute security of the information.',
			},
			{
				sectionTitle: 'Privacy Choices',
				text: 'You may choose not to provide certain information, but this may affect your use of some features of the app. The app will never integrate ads, so your information will not be used to precisely target personalized ads.',
			},
			{
				sectionTitle: 'Changes to This Policy',
				text: 'We reserve the right to modify this privacy policy at any time. Before the changes take effect, we will notify you through the app or other appropriate methods.\nIf there are multiple language versions of this policy, all non-Simplified Chinese versions are machine translations. In the event of any conflict or ambiguity between different language descriptions of the privacy statement, the Simplified Chinese version shall prevail.',
			},
			{
				sectionTitle: 'Contact Us',
				text: 'If you have any questions about this privacy policy or our privacy practices, please contact us. The developer will be happy to answer your questions or inquiries. You can contact the developer via email at zqian15@asu.edu for feedback and inquiries.\n\nThank you again for using TuneSync!',
			},
		],
	},
	zh: {
		title: '隐私政策',
		sections: [
			{
				sectionTitle: '介绍',
				text: '欢迎使用 TuneSync（以下简称"我们"或"本应用"）。本隐私协议旨在向您解释我们如何收集、使用、共享和保护您的个人信息。请仔细阅读以下内容，以了解我们的隐私做法。',
			},
			{
				sectionTitle: '登录信息',
				text: '为了使用本应用，您必须提供对应服务（包括并不限于WebDAV，SMB，Google Drive等）的认证信息以方便我们读取您的服务下文件信息。本应用开发者绝不可能也承诺永远不会收集您的个人账号和密码信息。\n\n但请您知悉，出于用户体验设计的考虑，您的账号会被保存在您使用本应用的设备上（包括但可能不限于您的iPhone、iPad或Mac，本应用在未来可能也会覆盖更多的设备端），这些隐私敏感信息不会通过网络共享到任何其他位置。当您从您的设备上删除本应用后，这些信息会被永久删除。我们保存您的登录账号和密码包括但不限于以下用途：\n1. 保存登录账户和密码，下次在登录页面不需要重新输入账户和密码。\n2. 保存设备连接地址（您的自定义域名）和登录令牌，每次打开本应用为您自动连接设备和自动登录。\n我们会尽可能保护您的信息安全。',
			},
			{
				sectionTitle: '音乐内容',
				text: '本应用内您可见的所有内容都来自于您的网络存储设备（NAS），本应用永远不会提供任何开放的公共资源，请确认您设备上所有音乐资源的使用权，本应用不会对您设备上的资源和播放的内容负责。\n\n本应用作为第三方音乐播放器，我们的服务端不会主动收集、存储您服务器（NAS）中的个人音乐数据。\n但以下情况下，我们服务端可以知晓您当前正在播放的音乐数据内容，但这些数据不会也无法与您的个人账户进行关联（我们的服务端永远不会收集您的个人账户信息）：\n1. 在线歌词：当您使用本应用提供的在线歌词时，您当前播放的音乐、艺人和专辑信息会被传输到本应用的服务端用于歌词的搜索和匹配。\n2. 封面匹配：当您使用本应用提供的歌曲、专辑、艺人等封面图片匹配时，对应的歌曲、专辑和艺人信息会被传输到本应用服务端。\n我们会尽可能保护您的信息安全。',
			},
			{
				sectionTitle: '信息安全',
				text: '我们尽可能采取多种技术手段来保护您的个人信息免受未经授权的访问、使用或泄露。然而，由于互联网的开放性，我们无法保证信息的绝对安全。',
			},
			{
				sectionTitle: '隐私权选择',
				text: '您可以选择不提供某些信息，但这可能影响您使用本应用的某些功能。本应用永远不会集成广告，所以您的信息不会被用来精准投放个人性化广告。',
			},
			{
				sectionTitle: '隐私政策的修改',
				text: '我们保留随时修改本隐私协议的权利。在修改生效之前，我们将通过本应用或其他适当的方式通知您。\n若本协议提供多语言版本，除了简体中文外均为机器翻译的内容，当不同语言对于隐私声明描述的内容存在冲突或歧义时，最终以简体中文语言版本描述的为准。',
			},
			{
				sectionTitle: '联系我们',
				text: '如果您对本隐私协议或我们的隐私做法有任何疑问，请与我们联系沟通。开发者将竭诚解答您的疑惑或咨询，有任何问题都可以通过联系开发者邮箱zqian15@asu.edu进行反馈和咨询。\n\n再次感谢您使用 TuneSync！',
			},
		],
	},
}

const getLanguage = () => {
	const locales = RNLocalize.getLocales()
	if (Array.isArray(locales)) {
		return locales[0].languageCode
	}
	return 'en' // default to English if no locales found
}

const PrivacyPolicy = () => {
	const language = getLanguage()
	const content = privacyPolicyContent[language] || privacyPolicyContent.en

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>{content.title}</Text>
			</View>
			<View style={styles.content}>
				{content.sections.map((section, index) => (
					<View key={index} style={styles.sectionContainer}>
						<Text style={styles.sectionTitle}>{section.sectionTitle}</Text>
						<Text style={styles.text}>{section.text}</Text>
					</View>
				))}
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: 'black',
	},
	container: {
		padding: 16,
		backgroundColor: 'black',
	},
	header: {
		marginBottom: 16,
	},
	title: {
		color: '#FFFFFF',
		fontSize: 26,
		fontWeight: 'bold',
	},
	content: {
		flex: 1,
		paddingBottom: 200,
	},
	sectionContainer: {
		marginBottom: 24,
	},
	sectionTitle: {
		color: '#F2F2F7',
		fontSize: 22,
		fontWeight: '600',
		marginTop: 16,
		marginBottom: 8,
	},
	text: {
		color: '#F2F2F7',
		fontSize: 18,
		lineHeight: 26,
	},
})

export default PrivacyPolicy
