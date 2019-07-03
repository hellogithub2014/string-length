const emoji = require('emoji-regex');

// 自然语言所对应的Unicode script列表，以及PM规定的字符长度
// 对照关系： https://en.wikipedia.org/wiki/List_of_languages_by_writing_system
// 此映射不是非常精确，只选取了最常见的
const LANG_SCRIPT_LENGTH = {
  chinese: {
    scripts: ['Han'],
    length: 2,
  },
  japanese: {
    scripts: ['Hiragana', 'Katakana'], // 只检测平假名、片假名， CJK字符使用中文标准判断
    length: 1,
  },
  english: {
    scripts: ['Latin'],
    length: 1,
  },
  spanish: {
    scripts: ['Latin'],
    length: 1,
  },
  italian: {
    scripts: ['Latin'],
    length: 1,
  },
  french: {
    scripts: ['Latin'],
    length: 1,
  },
  german: {
    scripts: ['Latin'],
    length: 1,
  },
  turkish: { // 土耳其语
    scripts: ['Latin'],
    length: 1,
  },
  indonesian: {
    scripts: ['Latin'],
    length: 1,
  },
  malay: { // 马来语
    scripts: ['Latin'],
    length: 1,
  },
  korean: {
    scripts: ['Hangul'],
    length: 2,
  },
  arabic: { // 阿拉伯语
    scripts: ['Arabic'],
    length: 1,
  },
  russian: {
    scripts: ['Cyrillic'],
    length: 1,
  },
  thai: { // 泰语
    scripts: ['Thai', 'Tai_Le', 'Tai_Tham'],
    length: 1,
  },
  vietnamese: { // 越南语
    scripts: ['Tai_Viet'],
    length: 1,
  },
  hindi: { // 印地语
    scripts: ['Devanagari'],
    length: 2,
  },
};

const LENGTH_MAP = {
  // 全角字符(部分全角字符和Latin存在重合，需要在它之前判断。https://unicode.org/charts/PDF/UFF00.pdf
  FullWidth: {
    // eslint-disable-next-line
    regex: /\u2502|[\u2590-\u2593]|\u25a0|\u25cb|[\u3001-\u3002\u300c-\u300d]|\u3099|\u309a[\u30a1-\u30ab]|\u30ad|\u30af|\u30b1|\u30b3|\u30b5|\u30b7|\u30b9|\u30bb|\u30bd|\u30bf|\u30c1|\u30c3|\u30c4|\u30c6|\u30c8|[\u30ca-\u30cf]|\u30d2|\u30d5|\u30d8|\u30db|\u30de|\u30df|[\u30e0-\u30ef\u30f2-\u30f3\u30fb-\u30fc\u3131-\u3164\uFF00-\uFF60\uFFe0-\uFFe6]/,
    length: 2,
  },
  // 半角字符，https://unicode.org/charts/PDF/UFF00.pdf
  HalfWidth: {
    regex: /[\u0020-\u007e\u00a2-\u00a3\u00a5-\u00a6]|\u00a9|\u00ac|\u00af|[\u2985-\u2986\uff61-\uffdc\uffe8-\uffee]/,
    length: 1,
  },
  Emoji: {
    regex: emoji(),
    length: 2,
    name: 'emoji',
  },
};

function init() {
  Object.values(LANG_SCRIPT_LENGTH).forEach(({ scripts = [], length = 1 }) => {
    scripts.forEach((script) => {
      if (LENGTH_MAP[script]) {
        return;
      }
      try {
        // eslint-disable-next-line
        const regex = require( `unicode-12.1.0/Script/${ script }/regex` );
        LENGTH_MAP[script] = {
          regex,
          length,
        };
      } catch (e) {
        console.error(`unicode-12.1.0/Script/${script}/regex 不存在`);
      }
    });
  });
}

init();

function getCharLength(char = '') {
  const target = Object.values(LENGTH_MAP).find(({ regex, name }) => {
    regex.lastIndex = 0; // 重置正则表达式匹配的起始索引
    return regex.test(char);
  });
  return target ? target.length : 1;
}

// babel translation of this regexp:  /(\P{Mark})(\p{Mark}+)/gu
// eslint-disable-next-line
const regexSymbolWithCombiningMarks = /((?:[\0-\u02FF\u0370-\u0482\u048A-\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u060F\u061B-\u064A\u0660-\u066F\u0671-\u06D5\u06DD\u06DE\u06E5\u06E6\u06E9\u06EE-\u0710\u0712-\u072F\u074B-\u07A5\u07B1-\u07EA\u07F4-\u07FC\u07FE-\u0815\u081A\u0824\u0828\u082E-\u0858\u085C-\u08D2\u08E2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0964-\u0980\u0984-\u09BB\u09BD\u09C5\u09C6\u09C9\u09CA\u09CE-\u09D6\u09D8-\u09E1\u09E4-\u09FD\u09FF\u0A00\u0A04-\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A6F\u0A72-\u0A74\u0A76-\u0A80\u0A84-\u0ABB\u0ABD\u0AC6\u0ACA\u0ACE-\u0AE1\u0AE4-\u0AF9\u0B00\u0B04-\u0B3B\u0B3D\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B61\u0B64-\u0B81\u0B83-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE-\u0BD6\u0BD8-\u0BFF\u0C05-\u0C3D\u0C45\u0C49\u0C4E-\u0C54\u0C57-\u0C61\u0C64-\u0C80\u0C84-\u0CBB\u0CBD\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CE1\u0CE4-\u0CFF\u0D04-\u0D3A\u0D3D\u0D45\u0D49\u0D4E-\u0D56\u0D58-\u0D61\u0D64-\u0D81\u0D84-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF4-\u0E30\u0E32\u0E33\u0E3B-\u0E46\u0E4F-\u0EB0\u0EB2\u0EB3\u0EBD-\u0EC7\u0ECE-\u0F17\u0F1A-\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F40-\u0F70\u0F85\u0F88-\u0F8C\u0F98\u0FBD-\u0FC5\u0FC7-\u102A\u103F-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u109E-\u135C\u1360-\u1711\u1715-\u1731\u1735-\u1751\u1754-\u1771\u1774-\u17B3\u17D4-\u17DC\u17DE-\u180A\u180E-\u1884\u1887-\u18A8\u18AA-\u191F\u192C-\u192F\u193C-\u1A16\u1A1C-\u1A54\u1A5F\u1A7D\u1A7E\u1A80-\u1AAF\u1ABF-\u1AFF\u1B05-\u1B33\u1B45-\u1B6A\u1B74-\u1B7F\u1B83-\u1BA0\u1BAE-\u1BE5\u1BF4-\u1C23\u1C38-\u1CCF\u1CD3\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA-\u1DBF\u1DFA\u1E00-\u20CF\u20F1-\u2CEE\u2CF2-\u2D7E\u2D80-\u2DDF\u2E00-\u3029\u3030-\u3098\u309B-\uA66E\uA673\uA67E-\uA69D\uA6A0-\uA6EF\uA6F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA828-\uA87F\uA882-\uA8B3\uA8C6-\uA8DF\uA8F2-\uA8FE\uA900-\uA925\uA92E-\uA946\uA954-\uA97F\uA984-\uA9B2\uA9C1-\uA9E4\uA9E6-\uAA28\uAA37-\uAA42\uAA44-\uAA4B\uAA4E-\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2-\uAAEA\uAAF0-\uAAF4\uAAF7-\uABE2\uABEB\uABEE-\uD7FF\uE000-\uFB1D\uFB1F-\uFDFF\uFE10-\uFE1F\uFE30-\uFFFF]|\uD800[\uDC00-\uDDFC\uDDFE-\uDEDF\uDEE1-\uDF75\uDF7B-\uDFFF]|[\uD801\uD808-\uD819\uD81C-\uD82E\uD830-\uD833\uD835\uD837\uD839\uD83B-\uDB3F\uDB41-\uDBFF][\uDC00-\uDFFF]|\uD802[\uDC00-\uDE00\uDE04\uDE07-\uDE0B\uDE10-\uDE37\uDE3B-\uDE3E\uDE40-\uDEE4\uDEE7-\uDFFF]|\uD803[\uDC00-\uDD23\uDD28-\uDF45\uDF51-\uDFFF]|\uD804[\uDC03-\uDC37\uDC47-\uDC7E\uDC83-\uDCAF\uDCBB-\uDCFF\uDD03-\uDD26\uDD35-\uDD44\uDD47-\uDD72\uDD74-\uDD7F\uDD83-\uDDB2\uDDC1-\uDDC8\uDDCD-\uDE2B\uDE38-\uDE3D\uDE3F-\uDEDE\uDEEB-\uDEFF\uDF04-\uDF3A\uDF3D\uDF45\uDF46\uDF49\uDF4A\uDF4E-\uDF56\uDF58-\uDF61\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD805[\uDC00-\uDC34\uDC47-\uDC5D\uDC5F-\uDCAF\uDCC4-\uDDAE\uDDB6\uDDB7\uDDC1-\uDDDB\uDDDE-\uDE2F\uDE41-\uDEAA\uDEB8-\uDF1C\uDF2C-\uDFFF]|\uD806[\uDC00-\uDC2B\uDC3B-\uDDD0\uDDD8\uDDD9\uDDE1-\uDDE3\uDDE5-\uDE00\uDE0B-\uDE32\uDE3A\uDE3F-\uDE46\uDE48-\uDE50\uDE5C-\uDE89\uDE9A-\uDFFF]|\uD807[\uDC00-\uDC2E\uDC37\uDC40-\uDC91\uDCA8\uDCB7-\uDD30\uDD37-\uDD39\uDD3B\uDD3E\uDD46\uDD48-\uDD89\uDD8F\uDD92\uDD98-\uDEF2\uDEF7-\uDFFF]|\uD81A[\uDC00-\uDEEF\uDEF5-\uDF2F\uDF37-\uDFFF]|\uD81B[\uDC00-\uDF4E\uDF50\uDF88-\uDF8E\uDF93-\uDFFF]|\uD82F[\uDC00-\uDC9C\uDC9F-\uDFFF]|\uD834[\uDC00-\uDD64\uDD6A-\uDD6C\uDD73-\uDD7A\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDE41\uDE45-\uDFFF]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD838[\uDC07\uDC19\uDC1A\uDC22\uDC25\uDC2B-\uDD2F\uDD37-\uDEEB\uDEF0-\uDFFF]|\uD83A[\uDC00-\uDCCF\uDCD7-\uDD43\uDD4B-\uDFFF]|\uDB40[\uDC00-\uDCFF\uDDF0-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))((?:[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDF46-\uDF50]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC7F-\uDC82\uDCB0-\uDCBA\uDD00-\uDD02\uDD27-\uDD34\uDD45\uDD46\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDDC9-\uDDCC\uDE2C-\uDE37\uDE3E\uDEDF-\uDEEA\uDF00-\uDF03\uDF3B\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC35-\uDC46\uDC5E\uDCB0-\uDCC3\uDDAF-\uDDB5\uDDB8-\uDDC0\uDDDC\uDDDD\uDE30-\uDE40\uDEAB-\uDEB7\uDF1D-\uDF2B]|\uD806[\uDC2C-\uDC3A\uDDD1-\uDDD7\uDDDA-\uDDE0\uDDE4\uDE01-\uDE0A\uDE33-\uDE39\uDE3B-\uDE3E\uDE47\uDE51-\uDE5B\uDE8A-\uDE99]|\uD807[\uDC2F-\uDC36\uDC38-\uDC3F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD8A-\uDD8E\uDD90\uDD91\uDD93-\uDD97\uDEF3-\uDEF6]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF4F\uDF51-\uDF87\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDD30-\uDD36\uDEEC-\uDEEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uDB40[\uDD00-\uDDEF])+)/g;

function stringLength(str = '') {
  // 预处理组合字符，返回多个简单字符的合成字符
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
  // 目前不能识别三个或三个以上字符的合成,例如印地语
  // const normalized = str.normalize();

  //  删除任何组合字符，只留下它们所属的字符。  https://my.oschina.net/u/3375885/blog/2998185
  // 正则表达式利用了ES2018新特性 Unicode属性类。 http://es6.ruanyifeng.com/#docs/regex#Unicode-%E5%B1%9E%E6%80%A7%E7%B1%BB
  // const regexSymbolWithCombiningMarks = /(\P{Mark})(\p{Mark}+)/gu;
  const normalized = str.replace(regexSymbolWithCombiningMarks, ($0, symbol, combiningMarks) => symbol);

  let length = 0;
  for (const symbol of normalized) {
    length += getCharLength(symbol);
  }
  return length;
}

// eslint-disable-next-line
function unitTest () {
  const unitCases = [
    {
      id: '中文',
      text: '字符校验规则统一测试 case', // 中文
      len: 25,
    },
    {
      id: '日本语',
      // 3*2+4+1+2*3+1*6
      text: 'ルールcaseをテストしてｸださい', // 日语
      len: 18,
    },
    {
      id: 'English',
      text: 'Character verification rule unified test case １', // 英语
      len: 48,
    },
    {
      id: 'Español（西班牙语）',
      text: 'Caso de prueba unificada regla de verificación de caracteres', // 西班牙语
      len: 60,
    },
    {
      id: 'Français（法语）',
      text: 'Cas de test unifié de la règle de vérification des caractères', // 法语
      len: 61,
    },
    {
      id: 'Deutsch（德语）',
      text: 'Einheitlicher Testfall der Zeichenüberprüfungsregel', // 德语
      len: 51,
    },
    {
      id: 'Pусский（俄语）',
      text: 'Правило проверки символов унифицированный контрольный пример', // 俄语
      len: 60,
    },
    {
      id: 'Italiano（意大利语）',
      text: 'Caso di test unificato per la regola di verifica dei caratteri', // 意大利语
      len: 62,
    },
    {
      id: '한국어（韩语）',
      text: '문자 검증 규칙 통합 테스트 케이스', // 韩语
      len: 33,
    },
    {
      id: 'Türkçe（土耳其语）',
      text: 'Karakter doğrulama kuralı birleşik test durumu', // 土耳其语
      len: 46,
    },
    {
      id: 'ภาษาไทย（泰语）',
      text: 'กฎการตรวจสอบตัวละครแบบครบวงจรกรณีทดสอบ', // 泰语
      len: 36,
    },
    {
      id: 'Tiếng Việt（越南语）',
      text: 'Quy tắc xác minh nhân vật thống nhất trường hợp kiểm tra', // 越南语
      len: 56,
    },
    {
      id: 'Bahasa  Indonesia（印尼语）',
      text: 'Aturan verifikasi karakter kasus uji terpadu', // 印尼语
      len: 44,
    },
    {
      id: 'Bahasa Melayu（马来语)',
      text: 'Peraturan pengesahan watak bersatu kes ujian', // 马来语
      len: 44,
    },
    {
      id: 'لعربية（阿拉伯语）',
      text: 'حكم التحقق من صحة حالة اختبار موحدة', // 阿拉伯语
      len: 35,
    },
    {
      id: 'हिन्दी（印地语）',
      text: 'चरित्र सत्यापन नियम एकीकृत परीक्षण मामला', // 印地语
      len: 53,
    },
    {
      id: '全角符号、数字、字母等',
      text: '１２３４５６７８９０、。」あaA', // 全角符号、数字、字母
      len: 29,
    },
    {
      id: '半角符号、数字、字母等',
      text: '1234567890，.;[laA', // 半角符号、数字、字母
      len: 18,
    },
    {
      id: '多语言混排',
      // 4*2+4+1+2+2+2+10+2+3+2
      text: '문자校验caseをテストé วละครแắc，.;0０', // 混合多种语言
      len: 36,
    },
    {
      id: 'emoji表情',
      text: '🙃😸123',
      len: 7,
    },
  ];

  unitCases.forEach(({ text, len, id }) => {
    const realLen = stringLength(text);

    if (len !== realLen) {
      console.error(`【${id}】FAILED，目标长度${len},实际长度${realLen}。 对应的文本 =>${text}`);
    }
  });
}

// unitTest();
