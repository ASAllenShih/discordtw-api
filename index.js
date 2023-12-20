const fetch = require('fix-esm').require('node-fetch').default;
async function requireData(url, method, AccessToken) {
	const headers = {};
	headers['Content-Type'] = 'application/json';
	if (AccessToken) headers['Authorization'] = `Bearer ${AccessToken}`;
	const get = await fetch(url, {
		method: method,
		headers: headers,
	});
	const data = await get.json();
	return data;
}
class Bot {
	/**
	 * 設定機器人ID和Cookie中的access_token
	 * @param {String} botId 機器人ID
	 * @param {String} AccessToken access_token
	 */
	constructor(botId, AccessToken) {
		this.botId = botId;
		this.AccessToken = AccessToken;
	}
	/**
	 * 置頂機器人
	 * @returns {boolean} 是否有成功置頂
	 */
	async bump() {
		const data = await requireData(`https://discordservers.tw/api/v2/user/bots/${this.botId}/bump`, 'POST', this.AccessToken);
		console.log(data);
		if (data.msg) throw new Error(data.msg);
		if (data.code !== 200 && data.code !== 403) throw new Error(data.code);
		if (data.code === 403) return false;
		return true;
	}
	/**
	 * 投票給機器人
	 * @returns {boolean} 是否有成功投票
	 */
	async vote() {
		const data = await requireData(`https://discordservers.tw/api/v2/user/bots/${this.botId}/vote`, 'POST', this.AccessToken);
		console.log(data);
		if (data.msg) throw new Error(data.msg);
		if (data.code !== 200 && data.code !== 403) throw new Error(data.code);
		if (data.code === 403) return false;
		return true;
	}
}
class Server {
	/**
	 * 設定伺服器ID和Cookie中的access_token
	 * @param {String} serverId 伺服器ID
	 * @param {String} AccessToken access_token
	 */
	constructor(serverId, AccessToken) {
		this.serverId = serverId;
		this.AccessToken = AccessToken;
	}
	/**
	 * 置頂伺服器
	 * @returns {boolean} 是否有成功置頂
	 */
	async bump() {
		const data = await requireData(`https://discordservers.tw/api/v2/user/servers/${this.serverId}/bump`, 'POST', this.AccessToken);
		if (data.msg) throw new Error(data.msg);
		if (data.code !== 200 && data.code !== 403) throw new Error(data.code);
		if (data.code === 403) return false;
		return true;
	}
	/**
	 * 投票給伺服器
	 * @returns {boolean} 是否有成功投票
	 */
	async vote() {
		const data = await requireData(`https://discordservers.tw/api/v2/user/servers/${this.serverId}/vote`, 'POST', this.AccessToken);
		console.log(data);
		if (data.msg) throw new Error(data.msg);
		if (data.code !== 200 && data.code !== 403) throw new Error(data.code);
		if (data.code === 403) return false;
		return true;
	}
}
class DiscordTW {
	/**
	 * 設定Cookie中的refresh_token(和access_token)
	 * @param {String} RefreshToken refresh_token
	 * @param {String} AccessToken access_token
	 */
	constructor(RefreshToken, AccessToken = undefined) {
		this.RefreshToken = RefreshToken;
		this.AccessToken = AccessToken;
	}
	/**
	 * 刷新access_token
	 */
	async tokenRefresh() {
		const get = await fetch('https://discordservers.tw/api/v2/guest/refresh_token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: `{ "token": "${this.RefreshToken}" }`,
		});
		const data = await get.json();
		if (data.code !== 200) throw new Error(data.message);
		this.AccessToken = data.data['access_token'];
		this.RefreshToken = data.data['refresh_token'];
		return data;
	}
	/**
	 * 伺服器
	 * @param {String} serverId 伺服器ID
	 * @returns {Server}
	 */
	server(serverId) {
		return new Server(serverId, this.AccessToken);
	}
	/**
	 * 機器人
	 * @param {String} botId 機器人ID
	 * @returns {Bot}
	 */
	bot(botId) {
		return new Bot(botId, this.AccessToken);
	}
}
module.exports = {
	Bot,
	Server,
	DiscordTW,
}