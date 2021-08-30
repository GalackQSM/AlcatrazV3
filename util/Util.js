const crypto = require('crypto');
const yes = ['yes', 'y', 'ye', 'yeah', 'yup', 'yea', 'ya', 'hai', 'si', 'sí', 'oui', 'はい', 'correct'];
const no = ['no', 'n', 'nah', 'nope', 'nop', 'iie', 'いいえ', 'non', 'fuck off'];

module.exports = class Util {
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static shuffle(array) {
        const arr = array.slice(0);
        for (let i = arr.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    static list(arr, conj = 'and') {
        const len = arr.length;
        if (len === 0) return '';
        if (len === 1) return arr[0];
        return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
    }

    static shorten(text, maxLen = 2000) {
        return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
    }

    static randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static trimArray(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        }
        return arr;
    }

    static removeDuplicates(arr) {
        if (arr.length === 0 || arr.length === 1) return arr;
        const newArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (newArr.includes(arr[i])) continue;
            newArr.push(arr[i]);
        }
        return newArr;
    }

    static sortByName(arr, prop) {
        return arr.sort((a, b) => {
            if (prop) return a[prop].toLowerCase() > b[prop].toLowerCase() ? 1 : -1;
            return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
        });
    }

    static firstUpperCase(text, split = ' ') {
        return text.split(split).map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
    }

    static formatNumber(number, minimumFractionDigits = 0) {
        return Number.parseFloat(number).toLocaleString(undefined, {
            minimumFractionDigits,
            maximumFractionDigits: 2,
        });
    }

    static base64(text, mode = 'encode') {
        if (mode === 'encode') return Buffer.from(text).toString('base64');
        if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null;
        throw new TypeError(`${mode} is not a supported base64 mode.`);
    }

    static hash(text, algorithm) {
        return crypto.createHash(algorithm).update(text).digest('hex');
    }

    static streamToArray(stream) {
        if (!stream.readable) return Promise.resolve([]);
        return new Promise((resolve, reject) => {
            const array = [];
            function onData(data) {
                array.push(data);
            }
            function onEnd(error) {
                if (error) reject(error);
                else resolve(array);
                cleanup();
            }
            function onClose() {
                resolve(array);
                cleanup();
            }
            function cleanup() {
                stream.removeListener('data', onData);
                stream.removeListener('end', onEnd);
                stream.removeListener('error', onEnd);
                stream.removeListener('close', onClose);
            }
            stream.on('data', onData);
            stream.on('end', onEnd);
            stream.on('error', onEnd);
            stream.on('close', onClose);
        });
    }

    static percentColor(pct, percentColors) {
        let i = 1;
        for (i; i < percentColors.length - 1; i++) {
            if (pct < percentColors[i].pct) {
                break;
            }
        }
        const lower = percentColors[i - 1];
        const upper = percentColors[i];
        const range = upper.pct - lower.pct;
        const rangePct = (pct - lower.pct) / range;
        const pctLower = 1 - rangePct;
        const pctUpper = rangePct;
        const color = {
            r: Math.floor((lower.color.r * pctLower) + (upper.color.r * pctUpper)).toString(16).padStart(2, '0'),
            g: Math.floor((lower.color.g * pctLower) + (upper.color.g * pctUpper)).toString(16).padStart(2, '0'),
            b: Math.floor((lower.color.b * pctLower) + (upper.color.b * pctUpper)).toString(16).padStart(2, '0'),
        };
        return `#${color.r}${color.g}${color.b}`;
    }

    static today(timeZone) {
        const now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        if (timeZone) now.setUTCHours(now.getUTCHours() + timeZone);
        return now;
    }

    static tomorrow(timeZone) {
        const today = Util.today(timeZone);
        today.setDate(today.getDate() + 1);
        return today;
    }

    static embedURL(title, url, display) {
        return `[${title}](${url.replace(/\)/g, '%27')}${display ? ` "${display}"` : ''})`;
    }

    static async verify(channel, user, { time = 30000, extraYes = [], extraNo = [] } = {}) {
        const filter = res => {
            const value = res.content.toLowerCase();
            return (user ? res.author.id === user.id : true)
				&& (yes.includes(value) || no.includes(value) || extraYes.includes(value) || extraNo.includes(value));
        };
        const verify = await channel.awaitMessages(filter, {
            max: 1,
            time,
        });
        if (!verify.size) return 0;
        const choice = verify.first().content.toLowerCase();
        if (yes.includes(choice) || extraYes.includes(choice)) return true;
        if (no.includes(choice) || extraNo.includes(choice)) return false;
        return false;
    }

    static cleanAnilistHTML(html) {
        let clean = html
            .replace(/\r|\n|\f/g, '')
            .replace(/<br>/g, '\n')
            .replace(/&#039;/g, '\'')
            .replace(/&quot;/g, '"')
            .replace(/<\/?i>/g, '*')
            .replace(/<\/?b>/g, '**')
            .replace(/~!|!~/g, '||')
            .replace(/&mdash;/g, '—');
        if (clean.length > 2000) clean = `${clean.substr(0, 1995)}...`;
        const spoilers = (clean.match(/\|\|/g) || []).length;
        if (spoilers !== 0 && (spoilers && (spoilers % 2))) clean += '||';
        return clean;
    }
    static chunk(array, chunkSize) {
        const temp = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            temp.push(array.slice(i, i + chunkSize));
        }
        return temp;
    }
};