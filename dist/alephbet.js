(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.AlephBet = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory();
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory();
	}
}(this, function () {

	/**
	 * CryptoJS core components.
	 */
	var CryptoJS = CryptoJS || (function (Math, undefined) {
	    /*
	     * Local polyfil of Object.create
	     */
	    var create = Object.create || (function () {
	        function F() {};

	        return function (obj) {
	            var subtype;

	            F.prototype = obj;

	            subtype = new F();

	            F.prototype = null;

	            return subtype;
	        };
	    }())

	    /**
	     * CryptoJS namespace.
	     */
	    var C = {};

	    /**
	     * Library namespace.
	     */
	    var C_lib = C.lib = {};

	    /**
	     * Base object for prototypal inheritance.
	     */
	    var Base = C_lib.Base = (function () {


	        return {
	            /**
	             * Creates a new object that inherits from this object.
	             *
	             * @param {Object} overrides Properties to copy into the new object.
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         field: 'value',
	             *
	             *         method: function () {
	             *         }
	             *     });
	             */
	            extend: function (overrides) {
	                // Spawn
	                var subtype = create(this);

	                // Augment
	                if (overrides) {
	                    subtype.mixIn(overrides);
	                }

	                // Create default initializer
	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
	                    subtype.init = function () {
	                        subtype.$super.init.apply(this, arguments);
	                    };
	                }

	                // Initializer's prototype is the subtype object
	                subtype.init.prototype = subtype;

	                // Reference supertype
	                subtype.$super = this;

	                return subtype;
	            },

	            /**
	             * Extends this object and runs the init method.
	             * Arguments to create() will be passed to init().
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var instance = MyType.create();
	             */
	            create: function () {
	                var instance = this.extend();
	                instance.init.apply(instance, arguments);

	                return instance;
	            },

	            /**
	             * Initializes a newly created object.
	             * Override this method to add some logic when your objects are created.
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         init: function () {
	             *             // ...
	             *         }
	             *     });
	             */
	            init: function () {
	            },

	            /**
	             * Copies properties into this object.
	             *
	             * @param {Object} properties The properties to mix in.
	             *
	             * @example
	             *
	             *     MyType.mixIn({
	             *         field: 'value'
	             *     });
	             */
	            mixIn: function (properties) {
	                for (var propertyName in properties) {
	                    if (properties.hasOwnProperty(propertyName)) {
	                        this[propertyName] = properties[propertyName];
	                    }
	                }

	                // IE won't copy toString using the loop above
	                if (properties.hasOwnProperty('toString')) {
	                    this.toString = properties.toString;
	                }
	            },

	            /**
	             * Creates a copy of this object.
	             *
	             * @return {Object} The clone.
	             *
	             * @example
	             *
	             *     var clone = instance.clone();
	             */
	            clone: function () {
	                return this.init.prototype.extend(this);
	            }
	        };
	    }());

	    /**
	     * An array of 32-bit words.
	     *
	     * @property {Array} words The array of 32-bit words.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var WordArray = C_lib.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of 32-bit words.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.create();
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 4;
	            }
	        },

	        /**
	         * Converts this word array to a string.
	         *
	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	         *
	         * @return {string} The stringified word array.
	         *
	         * @example
	         *
	         *     var string = wordArray + '';
	         *     var string = wordArray.toString();
	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	         */
	        toString: function (encoder) {
	            return (encoder || Hex).stringify(this);
	        },

	        /**
	         * Concatenates a word array to this word array.
	         *
	         * @param {WordArray} wordArray The word array to append.
	         *
	         * @return {WordArray} This word array.
	         *
	         * @example
	         *
	         *     wordArray1.concat(wordArray2);
	         */
	        concat: function (wordArray) {
	            // Shortcuts
	            var thisWords = this.words;
	            var thatWords = wordArray.words;
	            var thisSigBytes = this.sigBytes;
	            var thatSigBytes = wordArray.sigBytes;

	            // Clamp excess bits
	            this.clamp();

	            // Concat
	            if (thisSigBytes % 4) {
	                // Copy one byte at a time
	                for (var i = 0; i < thatSigBytes; i++) {
	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
	                }
	            } else {
	                // Copy one word at a time
	                for (var i = 0; i < thatSigBytes; i += 4) {
	                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
	                }
	            }
	            this.sigBytes += thatSigBytes;

	            // Chainable
	            return this;
	        },

	        /**
	         * Removes insignificant bits.
	         *
	         * @example
	         *
	         *     wordArray.clamp();
	         */
	        clamp: function () {
	            // Shortcuts
	            var words = this.words;
	            var sigBytes = this.sigBytes;

	            // Clamp
	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
	            words.length = Math.ceil(sigBytes / 4);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = wordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone.words = this.words.slice(0);

	            return clone;
	        },

	        /**
	         * Creates a word array filled with random bytes.
	         *
	         * @param {number} nBytes The number of random bytes to generate.
	         *
	         * @return {WordArray} The random word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
	         */
	        random: function (nBytes) {
	            var words = [];

	            var r = (function (m_w) {
	                var m_w = m_w;
	                var m_z = 0x3ade68b1;
	                var mask = 0xffffffff;

	                return function () {
	                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
	                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
	                    var result = ((m_z << 0x10) + m_w) & mask;
	                    result /= 0x100000000;
	                    result += 0.5;
	                    return result * (Math.random() > .5 ? 1 : -1);
	                }
	            });

	            for (var i = 0, rcache; i < nBytes; i += 4) {
	                var _r = r((rcache || Math.random()) * 0x100000000);

	                rcache = _r() * 0x3ade67b7;
	                words.push((_r() * 0x100000000) | 0);
	            }

	            return new WordArray.init(words, nBytes);
	        }
	    });

	    /**
	     * Encoder namespace.
	     */
	    var C_enc = C.enc = {};

	    /**
	     * Hex encoding strategy.
	     */
	    var Hex = C_enc.Hex = {
	        /**
	         * Converts a word array to a hex string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The hex string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var hexChars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                hexChars.push((bite >>> 4).toString(16));
	                hexChars.push((bite & 0x0f).toString(16));
	            }

	            return hexChars.join('');
	        },

	        /**
	         * Converts a hex string to a word array.
	         *
	         * @param {string} hexStr The hex string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	         */
	        parse: function (hexStr) {
	            // Shortcut
	            var hexStrLength = hexStr.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < hexStrLength; i += 2) {
	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
	            }

	            return new WordArray.init(words, hexStrLength / 2);
	        }
	    };

	    /**
	     * Latin1 encoding strategy.
	     */
	    var Latin1 = C_enc.Latin1 = {
	        /**
	         * Converts a word array to a Latin1 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Latin1 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var latin1Chars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                latin1Chars.push(String.fromCharCode(bite));
	            }

	            return latin1Chars.join('');
	        },

	        /**
	         * Converts a Latin1 string to a word array.
	         *
	         * @param {string} latin1Str The Latin1 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	         */
	        parse: function (latin1Str) {
	            // Shortcut
	            var latin1StrLength = latin1Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < latin1StrLength; i++) {
	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
	            }

	            return new WordArray.init(words, latin1StrLength);
	        }
	    };

	    /**
	     * UTF-8 encoding strategy.
	     */
	    var Utf8 = C_enc.Utf8 = {
	        /**
	         * Converts a word array to a UTF-8 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-8 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            try {
	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
	            } catch (e) {
	                throw new Error('Malformed UTF-8 data');
	            }
	        },

	        /**
	         * Converts a UTF-8 string to a word array.
	         *
	         * @param {string} utf8Str The UTF-8 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	         */
	        parse: function (utf8Str) {
	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	        }
	    };

	    /**
	     * Abstract buffered block algorithm template.
	     *
	     * The property blockSize must be implemented in a concrete subtype.
	     *
	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	     */
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
	        /**
	         * Resets this block algorithm's data buffer to its initial state.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm.reset();
	         */
	        reset: function () {
	            // Initial values
	            this._data = new WordArray.init();
	            this._nDataBytes = 0;
	        },

	        /**
	         * Adds new data to this block algorithm's buffer.
	         *
	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm._append('data');
	         *     bufferedBlockAlgorithm._append(wordArray);
	         */
	        _append: function (data) {
	            // Convert string to WordArray, else assume WordArray already
	            if (typeof data == 'string') {
	                data = Utf8.parse(data);
	            }

	            // Append
	            this._data.concat(data);
	            this._nDataBytes += data.sigBytes;
	        },

	        /**
	         * Processes available data blocks.
	         *
	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	         *
	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	         *
	         * @return {WordArray} The processed data.
	         *
	         * @example
	         *
	         *     var processedData = bufferedBlockAlgorithm._process();
	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	         */
	        _process: function (doFlush) {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var dataSigBytes = data.sigBytes;
	            var blockSize = this.blockSize;
	            var blockSizeBytes = blockSize * 4;

	            // Count blocks ready
	            var nBlocksReady = dataSigBytes / blockSizeBytes;
	            if (doFlush) {
	                // Round up to include partial blocks
	                nBlocksReady = Math.ceil(nBlocksReady);
	            } else {
	                // Round down to include only full blocks,
	                // less the number of blocks that must remain in the buffer
	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
	            }

	            // Count words ready
	            var nWordsReady = nBlocksReady * blockSize;

	            // Count bytes ready
	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

	            // Process blocks
	            if (nWordsReady) {
	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
	                    // Perform concrete-algorithm logic
	                    this._doProcessBlock(dataWords, offset);
	                }

	                // Remove processed words
	                var processedWords = dataWords.splice(0, nWordsReady);
	                data.sigBytes -= nBytesReady;
	            }

	            // Return processed words
	            return new WordArray.init(processedWords, nBytesReady);
	        },

	        /**
	         * Creates a copy of this object.
	         *
	         * @return {Object} The clone.
	         *
	         * @example
	         *
	         *     var clone = bufferedBlockAlgorithm.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone._data = this._data.clone();

	            return clone;
	        },

	        _minBufferSize: 0
	    });

	    /**
	     * Abstract hasher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	     */
	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         */
	        cfg: Base.extend(),

	        /**
	         * Initializes a newly created hasher.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	         *
	         * @example
	         *
	         *     var hasher = CryptoJS.algo.SHA256.create();
	         */
	        init: function (cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this hasher to its initial state.
	         *
	         * @example
	         *
	         *     hasher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-hasher logic
	            this._doReset();
	        },

	        /**
	         * Updates this hasher with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {Hasher} This hasher.
	         *
	         * @example
	         *
	         *     hasher.update('message');
	         *     hasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            // Append
	            this._append(messageUpdate);

	            // Update the hash
	            this._process();

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the hash computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The hash.
	         *
	         * @example
	         *
	         *     var hash = hasher.finalize();
	         *     var hash = hasher.finalize('message');
	         *     var hash = hasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Final message update
	            if (messageUpdate) {
	                this._append(messageUpdate);
	            }

	            // Perform concrete-hasher logic
	            var hash = this._doFinalize();

	            return hash;
	        },

	        blockSize: 512/32,

	        /**
	         * Creates a shortcut function to a hasher's object interface.
	         *
	         * @param {Hasher} hasher The hasher to create a helper for.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	         */
	        _createHelper: function (hasher) {
	            return function (message, cfg) {
	                return new hasher.init(cfg).finalize(message);
	            };
	        },

	        /**
	         * Creates a shortcut function to the HMAC's object interface.
	         *
	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	         */
	        _createHmacHelper: function (hasher) {
	            return function (message, key) {
	                return new C_algo.HMAC.init(hasher, key).finalize(message);
	            };
	        }
	    });

	    /**
	     * Algorithm namespace.
	     */
	    var C_algo = C.algo = {};

	    return C;
	}(Math));


	return CryptoJS;

}));
},{}],2:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-1 hash algorithm.
	     */
	    var SHA1 = C_algo.SHA1 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0x67452301, 0xefcdab89,
	                0x98badcfe, 0x10325476,
	                0xc3d2e1f0
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];

	            // Computation
	            for (var i = 0; i < 80; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
	                    W[i] = (n << 1) | (n >>> 31);
	                }

	                var t = ((a << 5) | (a >>> 27)) + e + W[i];
	                if (i < 20) {
	                    t += ((b & c) | (~b & d)) + 0x5a827999;
	                } else if (i < 40) {
	                    t += (b ^ c ^ d) + 0x6ed9eba1;
	                } else if (i < 60) {
	                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
	                } else /* if (i < 80) */ {
	                    t += (b ^ c ^ d) - 0x359d3e2a;
	                }

	                e = d;
	                d = c;
	                c = (b << 30) | (b >>> 2);
	                b = a;
	                a = t;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA1('message');
	     *     var hash = CryptoJS.SHA1(wordArray);
	     */
	    C.SHA1 = Hasher._createHelper(SHA1);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA1(message, key);
	     */
	    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
	}());


	return CryptoJS.SHA1;

}));
},{"./core":1}],3:[function(require,module,exports){
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

(function() {
  var _global = this;

  // Unique ID creation requires a high quality random # generator.  We feature
  // detect to determine the best RNG source, normalizing to a function that
  // returns 128-bits of randomness, since that's what's usually required
  var _rng;

  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
  //
  // Moderately fast, high quality
  if (typeof(_global.require) == 'function') {
    try {
      var _rb = _global.require('crypto').randomBytes;
      _rng = _rb && function() {return _rb(16);};
    } catch(e) {}
  }

  if (!_rng && _global.crypto && crypto.getRandomValues) {
    // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
    //
    // Moderately fast, high quality
    var _rnds8 = new Uint8Array(16);
    _rng = function whatwgRNG() {
      crypto.getRandomValues(_rnds8);
      return _rnds8;
    };
  }

  if (!_rng) {
    // Math.random()-based (RNG)
    //
    // If all else fails, use Math.random().  It's fast, but is of unspecified
    // quality.
    var  _rnds = new Array(16);
    _rng = function() {
      for (var i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
      }

      return _rnds;
    };
  }

  // Buffer class to use
  var BufferClass = typeof(_global.Buffer) == 'function' ? _global.Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[oct];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs != null ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options == 'binary' ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;

  if (typeof define === 'function' && define.amd) {
    // Publish as AMD module
    define(function() {return uuid;});
  } else if (typeof(module) != 'undefined' && module.exports) {
    // Publish as node.js module
    module.exports = uuid;
  } else {
    // Publish as global (in browsers)
    var _previousRoot = _global.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _global.uuid = _previousRoot;
      return uuid;
    };

    _global.uuid = uuid;
  }
}).call(this);

},{}],4:[function(require,module,exports){
var engine = require('../src/store-engine')

var storages = require('../storages/all')
var plugins = [require('../plugins/json2')]

module.exports = engine.createStore(storages, plugins)

},{"../plugins/json2":5,"../src/store-engine":7,"../storages/all":9}],5:[function(require,module,exports){
module.exports = json2Plugin

function json2Plugin() {
	require('./lib/json2')
	return {}
}

},{"./lib/json2":6}],6:[function(require,module,exports){
/* eslint-disable */

//  json2.js
//  2016-10-28
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  See http://www.JSON.org/js.html
//  This code should be minified before deployment.
//  See http://javascript.crockford.com/jsmin.html

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
//                          +a[5], +a[6]));
//                  }
//              }
//              return value;
//          });

//          myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
//              var d;
//              if (typeof value === "string" &&
//                      value.slice(0, 5) === "Date(" &&
//                      value.slice(-1) === ")") {
//                  d = new Date(value.slice(5, -1));
//                  if (d) {
//                      return d;
//                  }
//              }
//              return value;
//          });

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== "object") {
    JSON = {};
}

(function () {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10
            ? "0" + n
            : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + "-" +
                        f(this.getUTCMonth() + 1) + "-" +
                        f(this.getUTCDate()) + "T" +
                        f(this.getUTCHours()) + ":" +
                        f(this.getUTCMinutes()) + ":" +
                        f(this.getUTCSeconds()) + "Z"
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i;          // The loop counter.
        var k;          // The member key.
        var v;          // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === "object" &&
                typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case "string":
            return quote(value);

        case "number":

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value)
                ? String(value)
                : "null";

        case "boolean":
        case "null":

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce "null". The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is "object", we might be dealing with an object or an array or
// null.

        case "object":

// Due to a specification blunder in ECMAScript, typeof null is "object",
// so watch out for that case.

            if (!value) {
                return "null";
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === "[object Array]") {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? "[]"
                    : gap
                        ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
                        : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? "{}"
                : gap
                    ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                    : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" &&
                    (typeof replacer !== "object" ||
                    typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }

// Make a fake root object containing our value under the key of "".
// Return the result of stringifying the value.

            return str("", {"": value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return "\\u" +
                            ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with "()" and "new"
// because they can cause invocation, and "=" because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
// replace all simple value tokens with "]" characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or "]" or
// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The "{" operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function")
                    ? walk({"": j}, "")
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
}());
},{}],7:[function(require,module,exports){
var util = require('./util')
var slice = util.slice
var pluck = util.pluck
var each = util.each
var bind = util.bind
var create = util.create
var isList = util.isList
var isFunction = util.isFunction
var isObject = util.isObject

module.exports = {
	createStore: createStore
}

var storeAPI = {
	version: '2.0.12',
	enabled: false,
	
	// get returns the value of the given key. If that value
	// is undefined, it returns optionalDefaultValue instead.
	get: function(key, optionalDefaultValue) {
		var data = this.storage.read(this._namespacePrefix + key)
		return this._deserialize(data, optionalDefaultValue)
	},

	// set will store the given value at key and returns value.
	// Calling set with value === undefined is equivalent to calling remove.
	set: function(key, value) {
		if (value === undefined) {
			return this.remove(key)
		}
		this.storage.write(this._namespacePrefix + key, this._serialize(value))
		return value
	},

	// remove deletes the key and value stored at the given key.
	remove: function(key) {
		this.storage.remove(this._namespacePrefix + key)
	},

	// each will call the given callback once for each key-value pair
	// in this store.
	each: function(callback) {
		var self = this
		this.storage.each(function(val, namespacedKey) {
			callback.call(self, self._deserialize(val), (namespacedKey || '').replace(self._namespaceRegexp, ''))
		})
	},

	// clearAll will remove all the stored key-value pairs in this store.
	clearAll: function() {
		this.storage.clearAll()
	},

	// additional functionality that can't live in plugins
	// ---------------------------------------------------

	// hasNamespace returns true if this store instance has the given namespace.
	hasNamespace: function(namespace) {
		return (this._namespacePrefix == '__storejs_'+namespace+'_')
	},

	// createStore creates a store.js instance with the first
	// functioning storage in the list of storage candidates,
	// and applies the the given mixins to the instance.
	createStore: function() {
		return createStore.apply(this, arguments)
	},
	
	addPlugin: function(plugin) {
		this._addPlugin(plugin)
	},
	
	namespace: function(namespace) {
		return createStore(this.storage, this.plugins, namespace)
	}
}

function _warn() {
	var _console = (typeof console == 'undefined' ? null : console)
	if (!_console) { return }
	var fn = (_console.warn ? _console.warn : _console.log)
	fn.apply(_console, arguments)
}

function createStore(storages, plugins, namespace) {
	if (!namespace) {
		namespace = ''
	}
	if (storages && !isList(storages)) {
		storages = [storages]
	}
	if (plugins && !isList(plugins)) {
		plugins = [plugins]
	}

	var namespacePrefix = (namespace ? '__storejs_'+namespace+'_' : '')
	var namespaceRegexp = (namespace ? new RegExp('^'+namespacePrefix) : null)
	var legalNamespaces = /^[a-zA-Z0-9_\-]*$/ // alpha-numeric + underscore and dash
	if (!legalNamespaces.test(namespace)) {
		throw new Error('store.js namespaces can only have alphanumerics + underscores and dashes')
	}
	
	var _privateStoreProps = {
		_namespacePrefix: namespacePrefix,
		_namespaceRegexp: namespaceRegexp,

		_testStorage: function(storage) {
			try {
				var testStr = '__storejs__test__'
				storage.write(testStr, testStr)
				var ok = (storage.read(testStr) === testStr)
				storage.remove(testStr)
				return ok
			} catch(e) {
				return false
			}
		},

		_assignPluginFnProp: function(pluginFnProp, propName) {
			var oldFn = this[propName]
			this[propName] = function pluginFn() {
				var args = slice(arguments, 0)
				var self = this

				// super_fn calls the old function which was overwritten by
				// this mixin.
				function super_fn() {
					if (!oldFn) { return }
					each(arguments, function(arg, i) {
						args[i] = arg
					})
					return oldFn.apply(self, args)
				}

				// Give mixing function access to super_fn by prefixing all mixin function
				// arguments with super_fn.
				var newFnArgs = [super_fn].concat(args)

				return pluginFnProp.apply(self, newFnArgs)
			}
		},

		_serialize: function(obj) {
			return JSON.stringify(obj)
		},

		_deserialize: function(strVal, defaultVal) {
			if (!strVal) { return defaultVal }
			// It is possible that a raw string value has been previously stored
			// in a storage without using store.js, meaning it will be a raw
			// string value instead of a JSON serialized string. By defaulting
			// to the raw string value in case of a JSON parse error, we allow
			// for past stored values to be forwards-compatible with store.js
			var val = ''
			try { val = JSON.parse(strVal) }
			catch(e) { val = strVal }

			return (val !== undefined ? val : defaultVal)
		},
		
		_addStorage: function(storage) {
			if (this.enabled) { return }
			if (this._testStorage(storage)) {
				this.storage = storage
				this.enabled = true
			}
		},

		_addPlugin: function(plugin) {
			var self = this

			// If the plugin is an array, then add all plugins in the array.
			// This allows for a plugin to depend on other plugins.
			if (isList(plugin)) {
				each(plugin, function(plugin) {
					self._addPlugin(plugin)
				})
				return
			}

			// Keep track of all plugins we've seen so far, so that we
			// don't add any of them twice.
			var seenPlugin = pluck(this.plugins, function(seenPlugin) {
				return (plugin === seenPlugin)
			})
			if (seenPlugin) {
				return
			}
			this.plugins.push(plugin)

			// Check that the plugin is properly formed
			if (!isFunction(plugin)) {
				throw new Error('Plugins must be function values that return objects')
			}

			var pluginProperties = plugin.call(this)
			if (!isObject(pluginProperties)) {
				throw new Error('Plugins must return an object of function properties')
			}

			// Add the plugin function properties to this store instance.
			each(pluginProperties, function(pluginFnProp, propName) {
				if (!isFunction(pluginFnProp)) {
					throw new Error('Bad plugin property: '+propName+' from plugin '+plugin.name+'. Plugins should only return functions.')
				}
				self._assignPluginFnProp(pluginFnProp, propName)
			})
		},
		
		// Put deprecated properties in the private API, so as to not expose it to accidential
		// discovery through inspection of the store object.
		
		// Deprecated: addStorage
		addStorage: function(storage) {
			_warn('store.addStorage(storage) is deprecated. Use createStore([storages])')
			this._addStorage(storage)
		}
	}

	var store = create(_privateStoreProps, storeAPI, {
		plugins: []
	})
	store.raw = {}
	each(store, function(prop, propName) {
		if (isFunction(prop)) {
			store.raw[propName] = bind(store, prop)			
		}
	})
	each(storages, function(storage) {
		store._addStorage(storage)
	})
	each(plugins, function(plugin) {
		store._addPlugin(plugin)
	})
	return store
}

},{"./util":8}],8:[function(require,module,exports){
(function (global){
var assign = make_assign()
var create = make_create()
var trim = make_trim()
var Global = (typeof window !== 'undefined' ? window : global)

module.exports = {
	assign: assign,
	create: create,
	trim: trim,
	bind: bind,
	slice: slice,
	each: each,
	map: map,
	pluck: pluck,
	isList: isList,
	isFunction: isFunction,
	isObject: isObject,
	Global: Global
}

function make_assign() {
	if (Object.assign) {
		return Object.assign
	} else {
		return function shimAssign(obj, props1, props2, etc) {
			for (var i = 1; i < arguments.length; i++) {
				each(Object(arguments[i]), function(val, key) {
					obj[key] = val
				})
			}			
			return obj
		}
	}
}

function make_create() {
	if (Object.create) {
		return function create(obj, assignProps1, assignProps2, etc) {
			var assignArgsList = slice(arguments, 1)
			return assign.apply(this, [Object.create(obj)].concat(assignArgsList))
		}
	} else {
		function F() {} // eslint-disable-line no-inner-declarations
		return function create(obj, assignProps1, assignProps2, etc) {
			var assignArgsList = slice(arguments, 1)
			F.prototype = obj
			return assign.apply(this, [new F()].concat(assignArgsList))
		}
	}
}

function make_trim() {
	if (String.prototype.trim) {
		return function trim(str) {
			return String.prototype.trim.call(str)
		}
	} else {
		return function trim(str) {
			return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
		}
	}
}

function bind(obj, fn) {
	return function() {
		return fn.apply(obj, Array.prototype.slice.call(arguments, 0))
	}
}

function slice(arr, index) {
	return Array.prototype.slice.call(arr, index || 0)
}

function each(obj, fn) {
	pluck(obj, function(val, key) {
		fn(val, key)
		return false
	})
}

function map(obj, fn) {
	var res = (isList(obj) ? [] : {})
	pluck(obj, function(v, k) {
		res[k] = fn(v, k)
		return false
	})
	return res
}

function pluck(obj, fn) {
	if (isList(obj)) {
		for (var i=0; i<obj.length; i++) {
			if (fn(obj[i], i)) {
				return obj[i]
			}
		}
	} else {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (fn(obj[key], key)) {
					return obj[key]
				}
			}
		}
	}
}

function isList(val) {
	return (val != null && typeof val != 'function' && typeof val.length == 'number')
}

function isFunction(val) {
	return val && {}.toString.call(val) === '[object Function]'
}

function isObject(val) {
	return val && {}.toString.call(val) === '[object Object]'
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],9:[function(require,module,exports){
module.exports = [
	// Listed in order of usage preference
	require('./localStorage'),
	require('./oldFF-globalStorage'),
	require('./oldIE-userDataStorage'),
	require('./cookieStorage'),
	require('./sessionStorage'),
	require('./memoryStorage')
]

},{"./cookieStorage":10,"./localStorage":11,"./memoryStorage":12,"./oldFF-globalStorage":13,"./oldIE-userDataStorage":14,"./sessionStorage":15}],10:[function(require,module,exports){
// cookieStorage is useful Safari private browser mode, where localStorage
// doesn't work but cookies do. This implementation is adopted from
// https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage

var util = require('../src/util')
var Global = util.Global
var trim = util.trim

module.exports = {
	name: 'cookieStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var doc = Global.document

function read(key) {
	if (!key || !_has(key)) { return null }
	var regexpStr = "(?:^|.*;\\s*)" +
		escape(key).replace(/[\-\.\+\*]/g, "\\$&") +
		"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"
	return unescape(doc.cookie.replace(new RegExp(regexpStr), "$1"))
}

function each(callback) {
	var cookies = doc.cookie.split(/; ?/g)
	for (var i = cookies.length - 1; i >= 0; i--) {
		if (!trim(cookies[i])) {
			continue
		}
		var kvp = cookies[i].split('=')
		var key = unescape(kvp[0])
		var val = unescape(kvp[1])
		callback(val, key)
	}
}

function write(key, data) {
	if(!key) { return }
	doc.cookie = escape(key) + "=" + escape(data) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/"
}

function remove(key) {
	if (!key || !_has(key)) {
		return
	}
	doc.cookie = escape(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
}

function clearAll() {
	each(function(_, key) {
		remove(key)
	})
}

function _has(key) {
	return (new RegExp("(?:^|;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(doc.cookie)
}

},{"../src/util":8}],11:[function(require,module,exports){
var util = require('../src/util')
var Global = util.Global

module.exports = {
	name: 'localStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

function localStorage() {
	return Global.localStorage
}

function read(key) {
	return localStorage().getItem(key)
}

function write(key, data) {
	return localStorage().setItem(key, data)
}

function each(fn) {
	for (var i = localStorage().length - 1; i >= 0; i--) {
		var key = localStorage().key(i)
		fn(read(key), key)
	}
}

function remove(key) {
	return localStorage().removeItem(key)
}

function clearAll() {
	return localStorage().clear()
}

},{"../src/util":8}],12:[function(require,module,exports){
// memoryStorage is a useful last fallback to ensure that the store
// is functions (meaning store.get(), store.set(), etc will all function).
// However, stored values will not persist when the browser navigates to
// a new page or reloads the current page.

module.exports = {
	name: 'memoryStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var memoryStorage = {}

function read(key) {
	return memoryStorage[key]
}

function write(key, data) {
	memoryStorage[key] = data
}

function each(callback) {
	for (var key in memoryStorage) {
		if (memoryStorage.hasOwnProperty(key)) {
			callback(memoryStorage[key], key)
		}
	}
}

function remove(key) {
	delete memoryStorage[key]
}

function clearAll(key) {
	memoryStorage = {}
}

},{}],13:[function(require,module,exports){
// oldFF-globalStorage provides storage for Firefox
// versions 6 and 7, where no localStorage, etc
// is available.

var util = require('../src/util')
var Global = util.Global

module.exports = {
	name: 'oldFF-globalStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var globalStorage = Global.globalStorage

function read(key) {
	return globalStorage[key]
}

function write(key, data) {
	globalStorage[key] = data
}

function each(fn) {
	for (var i = globalStorage.length - 1; i >= 0; i--) {
		var key = globalStorage.key(i)
		fn(globalStorage[key], key)
	}
}

function remove(key) {
	return globalStorage.removeItem(key)
}

function clearAll() {
	each(function(key, _) {
		delete globalStorage[key]
	})
}

},{"../src/util":8}],14:[function(require,module,exports){
// oldIE-userDataStorage provides storage for Internet Explorer
// versions 6 and 7, where no localStorage, sessionStorage, etc
// is available.

var util = require('../src/util')
var Global = util.Global

module.exports = {
	name: 'oldIE-userDataStorage',
	write: write,
	read: read,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var storageName = 'storejs'
var doc = Global.document
var _withStorageEl = _makeIEStorageElFunction()
var disable = (Global.navigator ? Global.navigator.userAgent : '').match(/ (MSIE 8|MSIE 9|MSIE 10)\./) // MSIE 9.x, MSIE 10.x

function write(unfixedKey, data) {
	if (disable) { return }
	var fixedKey = fixKey(unfixedKey)
	_withStorageEl(function(storageEl) {
		storageEl.setAttribute(fixedKey, data)
		storageEl.save(storageName)
	})
}

function read(unfixedKey) {
	if (disable) { return }
	var fixedKey = fixKey(unfixedKey)
	var res = null
	_withStorageEl(function(storageEl) {
		res = storageEl.getAttribute(fixedKey)
	})
	return res
}

function each(callback) {
	_withStorageEl(function(storageEl) {
		var attributes = storageEl.XMLDocument.documentElement.attributes
		for (var i=attributes.length-1; i>=0; i--) {
			var attr = attributes[i]
			callback(storageEl.getAttribute(attr.name), attr.name)
		}
	})
}

function remove(unfixedKey) {
	var fixedKey = fixKey(unfixedKey)
	_withStorageEl(function(storageEl) {
		storageEl.removeAttribute(fixedKey)
		storageEl.save(storageName)
	})
}

function clearAll() {
	_withStorageEl(function(storageEl) {
		var attributes = storageEl.XMLDocument.documentElement.attributes
		storageEl.load(storageName)
		for (var i=attributes.length-1; i>=0; i--) {
			storageEl.removeAttribute(attributes[i].name)
		}
		storageEl.save(storageName)
	})
}

// Helpers
//////////

// In IE7, keys cannot start with a digit or contain certain chars.
// See https://github.com/marcuswestin/store.js/issues/40
// See https://github.com/marcuswestin/store.js/issues/83
var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
function fixKey(key) {
	return key.replace(/^\d/, '___$&').replace(forbiddenCharsRegex, '___')
}

function _makeIEStorageElFunction() {
	if (!doc || !doc.documentElement || !doc.documentElement.addBehavior) {
		return null
	}
	var scriptTag = 'script',
		storageOwner,
		storageContainer,
		storageEl

	// Since #userData storage applies only to specific paths, we need to
	// somehow link our data to a specific path.  We choose /favicon.ico
	// as a pretty safe option, since all browsers already make a request to
	// this URL anyway and being a 404 will not hurt us here.  We wrap an
	// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
	// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
	// since the iframe access rules appear to allow direct access and
	// manipulation of the document element, even for a 404 page.  This
	// document can be used instead of the current document (which would
	// have been limited to the current path) to perform #userData storage.
	try {
		/* global ActiveXObject */
		storageContainer = new ActiveXObject('htmlfile')
		storageContainer.open()
		storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
		storageContainer.close()
		storageOwner = storageContainer.w.frames[0].document
		storageEl = storageOwner.createElement('div')
	} catch(e) {
		// somehow ActiveXObject instantiation failed (perhaps some special
		// security settings or otherwse), fall back to per-path storage
		storageEl = doc.createElement('div')
		storageOwner = doc.body
	}

	return function(storeFunction) {
		var args = [].slice.call(arguments, 0)
		args.unshift(storageEl)
		// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
		// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
		storageOwner.appendChild(storageEl)
		storageEl.addBehavior('#default#userData')
		storageEl.load(storageName)
		storeFunction.apply(this, args)
		storageOwner.removeChild(storageEl)
		return
	}
}

},{"../src/util":8}],15:[function(require,module,exports){
var util = require('../src/util')
var Global = util.Global

module.exports = {
	name: 'sessionStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll
}

function sessionStorage() {
	return Global.sessionStorage
}

function read(key) {
	return sessionStorage().getItem(key)
}

function write(key, data) {
	return sessionStorage().setItem(key, data)
}

function each(fn) {
	for (var i = sessionStorage().length - 1; i >= 0; i--) {
		var key = sessionStorage().key(i)
		fn(read(key), key)
	}
}

function remove(key) {
	return sessionStorage().removeItem(key)
}

function clearAll() {
	return sessionStorage().clear()
}

},{"../src/util":8}],16:[function(require,module,exports){
var Adapters, Storage, utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

utils = require('./utils');

Storage = require('./storage');

Adapters = (function() {
  function Adapters() {}

  Adapters.GimelAdapter = (function() {
    GimelAdapter.prototype.queue_name = '_gimel_queue';

    function GimelAdapter(url, namespace, storage) {
      if (storage == null) {
        storage = Adapters.LocalStorageAdapter;
      }
      this.goal_complete = bind(this.goal_complete, this);
      this.experiment_start = bind(this.experiment_start, this);
      this._storage = storage;
      this.url = url;
      this.namespace = namespace;
      this._queue = JSON.parse(this._storage.get(this.queue_name) || '[]');
      this._flush();
    }

    GimelAdapter.prototype._remove_quuid = function(quuid) {
      return (function(_this) {
        return function(err, res) {
          if (err) {
            return;
          }
          utils.remove(_this._queue, function(el) {
            return el.properties._quuid === quuid;
          });
          return _this._storage.set(_this.queue_name, JSON.stringify(_this._queue));
        };
      })(this);
    };

    GimelAdapter.prototype._jquery_get = function(url, data, callback) {
      utils.log('send request using jQuery');
      return window.jQuery.ajax({
        method: 'GET',
        url: url,
        data: data,
        success: callback
      });
    };

    GimelAdapter.prototype._plain_js_get = function(url, data, callback) {
      var k, params, v, xhr;
      utils.log('fallback on plain js xhr');
      xhr = new XMLHttpRequest();
      params = (function() {
        var results;
        results = [];
        for (k in data) {
          v = data[k];
          results.push((encodeURIComponent(k)) + "=" + (encodeURIComponent(v)));
        }
        return results;
      })();
      params = params.join('&').replace(/%20/g, '+');
      xhr.open('GET', url + "?" + params);
      xhr.onload = function() {
        if (xhr.status === 200) {
          return callback();
        }
      };
      return xhr.send();
    };

    GimelAdapter.prototype._ajax_get = function(url, data, callback) {
      var ref;
      if ((ref = window.jQuery) != null ? ref.ajax : void 0) {
        return this._jquery_get(url, data, callback);
      } else {
        return this._plain_js_get(url, data, callback);
      }
    };

    GimelAdapter.prototype._flush = function() {
      var callback, i, item, len, ref, results;
      ref = this._queue;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        callback = this._remove_quuid(item.properties._quuid);
        this._ajax_get(this.url, utils.omit(item.properties, '_quuid'), callback);
        results.push(null);
      }
      return results;
    };

    GimelAdapter.prototype._user_uuid = function(experiment, goal) {
      if (!experiment.user_id) {
        return utils.uuid();
      }
      if (!goal.unique) {
        return utils.uuid();
      }
      return utils.sha1(this.namespace + "." + experiment.name + "." + experiment.user_id);
    };

    GimelAdapter.prototype._track = function(experiment, variant, goal) {
      utils.log("Persistent Queue Gimel track: " + this.namespace + ", " + experiment.name + ", " + variant + ", " + goal.name);
      if (this._queue.length > 100) {
        this._queue.shift();
      }
      this._queue.push({
        properties: {
          experiment: experiment.name,
          _quuid: utils.uuid(),
          uuid: this._user_uuid(experiment, goal),
          variant: variant,
          event: goal.name,
          namespace: this.namespace
        }
      });
      this._storage.set(this.queue_name, JSON.stringify(this._queue));
      return this._flush();
    };

    GimelAdapter.prototype.experiment_start = function(experiment, variant) {
      return this._track(experiment, variant, {
        name: 'participate',
        unique: true
      });
    };

    GimelAdapter.prototype.goal_complete = function(experiment, variant, goal_name, props) {
      return this._track(experiment, variant, utils.defaults({
        name: goal_name
      }, props));
    };

    return GimelAdapter;

  })();

  Adapters.PersistentQueueGoogleAnalyticsAdapter = (function() {
    PersistentQueueGoogleAnalyticsAdapter.prototype.namespace = 'alephbet';

    PersistentQueueGoogleAnalyticsAdapter.prototype.queue_name = '_ga_queue';

    function PersistentQueueGoogleAnalyticsAdapter(storage) {
      if (storage == null) {
        storage = Adapters.LocalStorageAdapter;
      }
      this.goal_complete = bind(this.goal_complete, this);
      this.experiment_start = bind(this.experiment_start, this);
      this._storage = storage;
      this._queue = JSON.parse(this._storage.get(this.queue_name) || '[]');
      this._flush();
    }

    PersistentQueueGoogleAnalyticsAdapter.prototype._remove_uuid = function(uuid) {
      return (function(_this) {
        return function() {
          utils.remove(_this._queue, function(el) {
            return el.uuid === uuid;
          });
          return _this._storage.set(_this.queue_name, JSON.stringify(_this._queue));
        };
      })(this);
    };

    PersistentQueueGoogleAnalyticsAdapter.prototype._flush = function() {
      var callback, i, item, len, ref, results;
      if (typeof ga !== 'function') {
        throw 'ga not defined. Please make sure your Universal analytics is set up correctly';
      }
      ref = this._queue;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        callback = this._remove_uuid(item.uuid);
        results.push(ga('send', 'event', item.category, item.action, item.label, {
          'hitCallback': callback,
          'nonInteraction': 1
        }));
      }
      return results;
    };

    PersistentQueueGoogleAnalyticsAdapter.prototype._track = function(category, action, label) {
      utils.log("Persistent Queue Google Universal Analytics track: " + category + ", " + action + ", " + label);
      if (this._queue.length > 100) {
        this._queue.shift();
      }
      this._queue.push({
        uuid: utils.uuid(),
        category: category,
        action: action,
        label: label
      });
      this._storage.set(this.queue_name, JSON.stringify(this._queue));
      return this._flush();
    };

    PersistentQueueGoogleAnalyticsAdapter.prototype.experiment_start = function(experiment, variant) {
      return this._track(this.namespace, experiment.name + " | " + variant, 'Visitors');
    };

    PersistentQueueGoogleAnalyticsAdapter.prototype.goal_complete = function(experiment, variant, goal_name, _props) {
      return this._track(this.namespace, experiment.name + " | " + variant, goal_name);
    };

    return PersistentQueueGoogleAnalyticsAdapter;

  })();

  Adapters.PersistentQueueKeenAdapter = (function() {
    PersistentQueueKeenAdapter.prototype.queue_name = '_keen_queue';

    function PersistentQueueKeenAdapter(keen_client, storage) {
      if (storage == null) {
        storage = Adapters.LocalStorageAdapter;
      }
      this.goal_complete = bind(this.goal_complete, this);
      this.experiment_start = bind(this.experiment_start, this);
      this.client = keen_client;
      this._storage = storage;
      this._queue = JSON.parse(this._storage.get(this.queue_name) || '[]');
      this._flush();
    }

    PersistentQueueKeenAdapter.prototype._remove_quuid = function(quuid) {
      return (function(_this) {
        return function(err, res) {
          if (err) {
            return;
          }
          utils.remove(_this._queue, function(el) {
            return el.properties._quuid === quuid;
          });
          return _this._storage.set(_this.queue_name, JSON.stringify(_this._queue));
        };
      })(this);
    };

    PersistentQueueKeenAdapter.prototype._flush = function() {
      var callback, i, item, len, ref, results;
      ref = this._queue;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        callback = this._remove_quuid(item.properties._quuid);
        results.push(this.client.addEvent(item.experiment_name, utils.omit(item.properties, '_quuid'), callback));
      }
      return results;
    };

    PersistentQueueKeenAdapter.prototype._user_uuid = function(experiment, goal) {
      if (!experiment.user_id) {
        return utils.uuid();
      }
      if (!goal.unique) {
        return utils.uuid();
      }
      return utils.sha1(this.namespace + "." + experiment.name + "." + experiment.user_id);
    };

    PersistentQueueKeenAdapter.prototype._track = function(experiment, variant, goal) {
      utils.log("Persistent Queue Keen track: " + experiment.name + ", " + variant + ", " + event);
      if (this._queue.length > 100) {
        this._queue.shift();
      }
      this._queue.push({
        experiment_name: experiment.name,
        properties: {
          _quuid: utils.uuid(),
          uuid: this._user_uuid(experiment, goal),
          variant: variant,
          event: goal.name
        }
      });
      this._storage.set(this.queue_name, JSON.stringify(this._queue));
      return this._flush();
    };

    PersistentQueueKeenAdapter.prototype.experiment_start = function(experiment, variant) {
      return this._track(experiment, variant, {
        name: 'participate',
        unique: true
      });
    };

    PersistentQueueKeenAdapter.prototype.goal_complete = function(experiment, variant, goal_name, props) {
      return this._track(experiment, variant, utils.defaults({
        name: goal_name
      }, props));
    };

    return PersistentQueueKeenAdapter;

  })();

  Adapters.GoogleUniversalAnalyticsAdapter = (function() {
    function GoogleUniversalAnalyticsAdapter() {}

    GoogleUniversalAnalyticsAdapter.namespace = 'alephbet';

    GoogleUniversalAnalyticsAdapter._track = function(category, action, label) {
      utils.log("Google Universal Analytics track: " + category + ", " + action + ", " + label);
      if (typeof ga !== 'function') {
        throw 'ga not defined. Please make sure your Universal analytics is set up correctly';
      }
      return ga('send', 'event', category, action, label, {
        'nonInteraction': 1
      });
    };

    GoogleUniversalAnalyticsAdapter.experiment_start = function(experiment, variant) {
      return GoogleUniversalAnalyticsAdapter._track(GoogleUniversalAnalyticsAdapter.namespace, experiment.name + " | " + variant, 'Visitors');
    };

    GoogleUniversalAnalyticsAdapter.goal_complete = function(experiment, variant, goal_name, _props) {
      return GoogleUniversalAnalyticsAdapter._track(GoogleUniversalAnalyticsAdapter.namespace, experiment.name + " | " + variant, goal_name);
    };

    return GoogleUniversalAnalyticsAdapter;

  })();

  Adapters.LocalStorageAdapter = (function() {
    function LocalStorageAdapter() {}

    LocalStorageAdapter.namespace = 'alephbet';

    LocalStorageAdapter.set = function(key, value) {
      return new Storage(this.namespace).set(key, value);
    };

    LocalStorageAdapter.get = function(key) {
      return new Storage(this.namespace).get(key);
    };

    return LocalStorageAdapter;

  })();

  return Adapters;

})();

module.exports = Adapters;


},{"./storage":19,"./utils":20}],17:[function(require,module,exports){
var AlephBet, adapters, options, utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

utils = require('./utils');

adapters = require('./adapters');

options = require('./options');

AlephBet = (function() {
  function AlephBet() {}

  AlephBet.options = options;

  AlephBet.utils = utils;

  AlephBet.GimelAdapter = adapters.GimelAdapter;

  AlephBet.PersistentQueueGoogleAnalyticsAdapter = adapters.PersistentQueueGoogleAnalyticsAdapter;

  AlephBet.PersistentQueueKeenAdapter = adapters.PersistentQueueKeenAdapter;

  AlephBet.Experiment = (function() {
    var _run, _validate;

    Experiment._options = {
      name: null,
      variants: null,
      user_id: null,
      sample: 1.0,
      trigger: function() {
        return true;
      },
      tracking_adapter: adapters.GoogleUniversalAnalyticsAdapter,
      storage_adapter: adapters.LocalStorageAdapter
    };

    function Experiment(options1) {
      this.options = options1 != null ? options1 : {};
      this.add_goals = bind(this.add_goals, this);
      this.add_goal = bind(this.add_goal, this);
      utils.defaults(this.options, Experiment._options);
      _validate.call(this);
      this.name = this.options.name;
      this.variants = this.options.variants;
      this.user_id = this.options.user_id;
      this.variant_names = utils.keys(this.variants);
      _run.call(this);
    }

    Experiment.prototype.run = function() {
      var variant;
      utils.log("running with options: " + (JSON.stringify(this.options)));
      if (variant = this.get_stored_variant()) {
        utils.log(variant + " active");
        return this.activate_variant(variant);
      } else {
        return this.conditionally_activate_variant();
      }
    };

    _run = function() {
      return this.run();
    };

    Experiment.prototype.activate_variant = function(variant) {
      var ref;
      if ((ref = this.variants[variant]) != null) {
        ref.activate(this);
      }
      return this.storage().set(this.options.name + ":variant", variant);
    };

    Experiment.prototype.conditionally_activate_variant = function() {
      var variant;
      if (!this.options.trigger()) {
        return;
      }
      utils.log('trigger set');
      if (!this.in_sample()) {
        return;
      }
      utils.log('in sample');
      variant = this.pick_variant();
      this.tracking().experiment_start(this, variant);
      return this.activate_variant(variant);
    };

    Experiment.prototype.goal_complete = function(goal_name, props) {
      var variant;
      if (props == null) {
        props = {};
      }
      utils.defaults(props, {
        unique: true
      });
      if (props.unique && this.storage().get(this.options.name + ":" + goal_name)) {
        return;
      }
      variant = this.get_stored_variant();
      if (!variant) {
        return;
      }
      if (props.unique) {
        this.storage().set(this.options.name + ":" + goal_name, true);
      }
      utils.log("experiment: " + this.options.name + " variant:" + variant + " goal:" + goal_name + " complete");
      return this.tracking().goal_complete(this, variant, goal_name, props);
    };

    Experiment.prototype.get_stored_variant = function() {
      return this.storage().get(this.options.name + ":variant");
    };

    Experiment.prototype.pick_variant = function() {
      var chosen_partition, partitions, variant;
      partitions = 1.0 / this.variant_names.length;
      chosen_partition = Math.floor(this._random('variant') / partitions);
      variant = this.variant_names[chosen_partition];
      utils.log(variant + " picked");
      return variant;
    };

    Experiment.prototype.in_sample = function() {
      var active;
      active = this.storage().get(this.options.name + ":in_sample");
      if (typeof active !== 'undefined') {
        return active;
      }
      active = this._random('sample') <= this.options.sample;
      this.storage().set(this.options.name + ":in_sample", active);
      return active;
    };

    Experiment.prototype._random = function(salt) {
      var seed;
      if (!this.user_id) {
        return utils.random();
      }
      seed = this.name + "." + salt + "." + this.user_id;
      return utils.random(seed);
    };

    Experiment.prototype.add_goal = function(goal) {
      return goal.add_experiment(this);
    };

    Experiment.prototype.add_goals = function(goals) {
      var goal, i, len, results;
      results = [];
      for (i = 0, len = goals.length; i < len; i++) {
        goal = goals[i];
        results.push(this.add_goal(goal));
      }
      return results;
    };

    Experiment.prototype.storage = function() {
      return this.options.storage_adapter;
    };

    Experiment.prototype.tracking = function() {
      return this.options.tracking_adapter;
    };

    _validate = function() {
      if (this.options.name === null) {
        throw 'an experiment name must be specified';
      }
      if (this.options.variants === null) {
        throw 'variants must be provided';
      }
      if (typeof this.options.trigger !== 'function') {
        throw 'trigger must be a function';
      }
    };

    return Experiment;

  })();

  AlephBet.Goal = (function() {
    function Goal(name, props1) {
      this.name = name;
      this.props = props1 != null ? props1 : {};
      utils.defaults(this.props, {
        unique: true
      });
      this.experiments = [];
    }

    Goal.prototype.add_experiment = function(experiment) {
      return this.experiments.push(experiment);
    };

    Goal.prototype.add_experiments = function(experiments) {
      var experiment, i, len, results;
      results = [];
      for (i = 0, len = experiments.length; i < len; i++) {
        experiment = experiments[i];
        results.push(this.add_experiment(experiment));
      }
      return results;
    };

    Goal.prototype.complete = function() {
      var experiment, i, len, ref, results;
      ref = this.experiments;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        experiment = ref[i];
        results.push(experiment.goal_complete(this.name, this.props));
      }
      return results;
    };

    return Goal;

  })();

  return AlephBet;

})();

module.exports = AlephBet;


},{"./adapters":16,"./options":18,"./utils":20}],18:[function(require,module,exports){
module.exports = {
  debug: false
};


},{}],19:[function(require,module,exports){
var Storage, store;

store = require('store');

Storage = (function() {
  function Storage(namespace) {
    this.namespace = namespace != null ? namespace : 'alephbet';
    if (!store.enabled) {
      throw 'local storage not supported';
    }
    this.storage = store.get(this.namespace) || {};
  }

  Storage.prototype.set = function(key, value) {
    this.storage[key] = value;
    store.set(this.namespace, this.storage);
    return value;
  };

  Storage.prototype.get = function(key) {
    return this.storage[key];
  };

  return Storage;

})();

module.exports = Storage;


},{"store":4}],20:[function(require,module,exports){
var Utils, _, options, sha1, uuid;

_ = require('../vendor/lodash.custom.min');

uuid = require('node-uuid');

sha1 = require('crypto-js/sha1');

options = require('./options');

Utils = (function() {
  function Utils() {}

  Utils.defaults = _.defaults;

  Utils.keys = _.keys;

  Utils.remove = _.remove;

  Utils.omit = _.omit;

  Utils.log = function(message) {
    if (options.debug) {
      return console.log(message);
    }
  };

  Utils.uuid = uuid.v4;

  Utils.sha1 = function(text) {
    return sha1(text).toString();
  };

  Utils.random = function(seed) {
    if (!seed) {
      return Math.random();
    }
    return parseInt(this.sha1(seed).substr(0, 13), 16) / 0xFFFFFFFFFFFFF;
  };

  return Utils;

})();

module.exports = Utils;


},{"../vendor/lodash.custom.min":21,"./options":18,"crypto-js/sha1":2,"node-uuid":3}],21:[function(require,module,exports){
(function (global){
/**
 * @license
 * lodash 3.10.1 (Custom Build) lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 * Build: `lodash -p include="keys,defaults,remove,omit" exports="node" -o ./vendor/lodash.custom.min.js`
 */
;(function(){function r(r,n,e){if(n!==n)return t(r,e);for(var u=e-1,o=r.length;++u<o;)if(r[u]===n)return u;return-1}function n(r){return null==r?"":r+""}function t(r,n,t){for(var e=r.length,u=n+(t?0:-1);t?u--:++u<e;){var o=r[u];if(o!==o)return u}return-1}function e(r){return!!r&&typeof r=="object"}function u(){}function o(r){var n=r?r.length:0;for(this.data={hash:_n(null),set:new In};n--;)this.push(r[n])}function a(r,n){var t=r.data,e=typeof n=="string"||hr(n)?t.set.has(n):t.hash[n];return e?0:-1}
function c(r){var n=this.data;typeof r=="string"||hr(r)?n.set.add(r):n.hash[r]=true}function i(r,n){var t=-1,e=r.length;for(n||(n=Array(e));++t<e;)n[t]=r[t];return n}function f(r,n){for(var t=-1,e=r.length;++t<e&&n(r[t],t,r)!==false;);return r}function l(r,n){for(var t=-1,e=r.length,u=Array(e);++t<e;)u[t]=n(r[t],t,r);return u}function s(r,n){for(var t=-1,e=n.length,u=r.length;++t<e;)r[u+t]=n[t];return r}function p(r,n){for(var t=-1,e=r.length;++t<e;)if(n(r[t],t,r))return true;return false}function v(r,n){return r===xr?n:r;
}function h(r,n,t){for(var e=-1,u=Jn(n),o=u.length;++e<o;){var a=u[e],c=r[a],i=t(c,n[a],a,r,n);(i===i?i===c:c!==c)&&(c!==xr||a in r)||(r[a]=i)}return r}function y(r,n){return null==n?r:g(n,Jn(n),r)}function g(r,n,t){t||(t={});for(var e=-1,u=n.length;++e<u;){var o=n[e];t[o]=r[o]}return t}function b(r,n,t){var e=typeof r;return"function"==e?n===xr?r:M(r,n,t):null==r?wr:"object"==e?I(r):n===xr?Or(r):P(r,n)}function j(r,n,t,e,u,o,a){var c;if(t&&(c=u?t(r,e,u):t(r)),c!==xr)return c;if(!hr(r))return r;var l=zn(r);
if(l){if(c=J(r),!n)return i(r,c)}else{var s=On.call(r),p=s==Fr;if(s!=Tr&&s!=Pr&&(!p||u))return an[s]?Q(r,s,n):u?r:{};if(gn(r))return u?r:{};if(c=K(p?{}:r),!n)return y(c,r)}o||(o=[]),a||(a=[]);for(var v=o.length;v--;)if(o[v]==r)return a[v];return o.push(r),a.push(c),(l?f:A)(r,function(e,u){c[u]=j(e,n,t,u,r,o,a)}),c}function d(n,t){var e=n?n.length:0,u=[];if(!e)return u;var o=-1,c=z(),i=c===r,f=i&&t.length>=Er?N(t):null,l=t.length;f&&(c=a,i=false,t=f);r:for(;++o<e;){var s=n[o];if(i&&s===s){for(var p=l;p--;)if(t[p]===s)continue r;
u.push(s)}else c(t,s,0)<0&&u.push(s)}return u}function m(r,n,t,u){u||(u=[]);for(var o=-1,a=r.length;++o<a;){var c=r[o];e(c)&&X(c)&&(t||zn(c)||pr(c))?n?m(c,n,t,u):s(u,c):t||(u[u.length]=c)}return u}function w(r,n){return Wn(r,n,jr)}function A(r,n){return Wn(r,n,Jn)}function O(r,n,t){if(null!=r){r=ar(r),t!==xr&&t in r&&(n=[t]);for(var e=0,u=n.length;null!=r&&e<u;)r=ar(r)[n[e++]];return e&&e==u?r:xr}}function x(r,n,t,u,o,a){return r===n?true:null==r||null==n||!hr(r)&&!e(n)?r!==r&&n!==n:S(r,n,x,t,u,o,a);
}function S(r,n,t,e,u,o,a){var c=zn(r),i=zn(n),f=$r,l=$r;c||(f=On.call(r),f==Pr?f=Tr:f!=Tr&&(c=br(r))),i||(l=On.call(n),l==Pr?l=Tr:l!=Tr&&(i=br(n)));var s=f==Tr&&!gn(r),p=l==Tr&&!gn(n),v=f==l;if(v&&!c&&!s)return V(r,n,f);if(!u){var h=s&&An.call(r,"__wrapped__"),y=p&&An.call(n,"__wrapped__");if(h||y)return t(h?r.value():r,y?n.value():n,e,u,o,a)}if(!v)return false;o||(o=[]),a||(a=[]);for(var g=o.length;g--;)if(o[g]==r)return a[g]==n;o.push(r),a.push(n);var b=(c?D:W)(r,n,t,e,u,o,a);return o.pop(),a.pop(),
b}function E(r,n,t){var e=n.length,u=e,o=!t;if(null==r)return!u;for(r=ar(r);e--;){var a=n[e];if(o&&a[2]?a[1]!==r[a[0]]:!(a[0]in r))return false}for(;++e<u;){a=n[e];var c=a[0],i=r[c],f=a[1];if(o&&a[2]){if(i===xr&&!(c in r))return false}else{var l=t?t(i,f,c):xr;if(!(l===xr?x(f,i,t,true):l))return false}}return true}function I(r){var n=G(r);if(1==n.length&&n[0][2]){var t=n[0][0],e=n[0][1];return function(r){return null==r?false:(r=ar(r),r[t]===e&&(e!==xr||t in r))}}return function(r){return E(r,n)}}function P(r,n){var t=zn(r),e=rr(r)&&tr(n),u=r+"";
return r=cr(r),function(o){if(null==o)return false;var a=u;if(o=ar(o),(t||!e)&&!(a in o)){if(o=1==r.length?o:O(o,k(r,0,-1)),null==o)return false;a=fr(r),o=ar(o)}return o[a]===n?n!==xr||a in o:x(n,o[a],xr,true)}}function $(r){return function(n){return null==n?xr:ar(n)[r]}}function _(r){var n=r+"";return r=cr(r),function(t){return O(t,r,n)}}function U(r,n){for(var t=r?n.length:0;t--;){var e=n[t];if(e!=u&&Y(e)){var u=e;Pn.call(r,e,1)}}return r}function k(r,n,t){var e=-1,u=r.length;n=null==n?0:+n||0,n<0&&(n=-n>u?0:u+n),
t=t===xr||t>u?u:+t||0,t<0&&(t+=u),u=n>t?0:t-n>>>0,n>>>=0;for(var o=Array(u);++e<u;)o[e]=r[e+n];return o}function F(r,n,t){var e=0,u=r?r.length:e;if(typeof n=="number"&&n===n&&u<=Ln){for(;e<u;){var o=e+u>>>1,a=r[o];(t?a<=n:a<n)&&null!==a?e=o+1:u=o}return u}return C(r,n,wr,t)}function C(r,n,t,e){n=t(n);for(var u=0,o=r?r.length:0,a=n!==n,c=null===n,i=n===xr;u<o;){var f=Un((u+o)/2),l=t(r[f]),s=l!==xr,p=l===l;if(a)var v=p||e;else v=c?p&&s&&(e||null!=l):i?p&&(e||s):null==l?false:e?l<=n:l<n;v?u=f+1:o=f}return Mn(o,Bn);
}function M(r,n,t){if(typeof r!="function")return wr;if(n===xr)return r;switch(t){case 1:return function(t){return r.call(n,t)};case 3:return function(t,e,u){return r.call(n,t,e,u)};case 4:return function(t,e,u,o){return r.call(n,t,e,u,o)};case 5:return function(t,e,u,o,a){return r.call(n,t,e,u,o,a)}}return function(){return r.apply(n,arguments)}}function T(r){var n=new Sn(r.byteLength),t=new $n(n);return t.set(new $n(r)),n}function B(r){return sr(function(n,t){var e=-1,u=null==n?0:t.length,o=u>2?t[u-2]:xr,a=u>2?t[2]:xr,c=u>1?t[u-1]:xr;
for(typeof o=="function"?(o=M(o,c,5),u-=2):(o=typeof c=="function"?c:xr,u-=o?1:0),a&&Z(t[0],t[1],a)&&(o=u<3?xr:o,u=1);++e<u;){var i=t[e];i&&r(n,i,o)}return n})}function L(r){return function(n,t,e){for(var u=ar(n),o=e(n),a=o.length,c=r?a:-1;r?c--:++c<a;){var i=o[c];if(t(u[i],i,u)===false)break}return n}}function N(r){return _n&&In?new o(r):null}function R(r,n){return sr(function(t){var e=t[0];return null==e?e:(t.push(n),r.apply(xr,t))})}function D(r,n,t,e,u,o,a){var c=-1,i=r.length,f=n.length;if(i!=f&&(!u||f<=i))return false;
for(;++c<i;){var l=r[c],s=n[c],v=e?e(u?s:l,u?l:s,c):xr;if(v!==xr){if(v)continue;return false}if(u){if(!p(n,function(r){return l===r||t(l,r,e,u,o,a)}))return false}else if(l!==s&&!t(l,s,e,u,o,a))return false}return true}function V(r,n,t){switch(t){case _r:case Ur:return+r==+n;case kr:return r.name==n.name&&r.message==n.message;case Mr:return r!=+r?n!=+n:r==+n;case Br:case Nr:return r==n+""}return false}function W(r,n,t,e,u,o,a){var c=Jn(r),i=c.length,f=Jn(n),l=f.length;if(i!=l&&!u)return false;for(var s=i;s--;){var p=c[s];
if(!(u?p in n:An.call(n,p)))return false}for(var v=u;++s<i;){p=c[s];var h=r[p],y=n[p],g=e?e(u?y:h,u?h:y,p):xr;if(!(g===xr?t(h,y,e,u,o,a):g))return false;v||(v="constructor"==p)}if(!v){var b=r.constructor,j=n.constructor;if(b!=j&&"constructor"in r&&"constructor"in n&&!(typeof b=="function"&&b instanceof b&&typeof j=="function"&&j instanceof j))return false}return true}function q(r,n,t){var e=u.callback||mr;return e=e===mr?b:e,t?e(r,n,t):e}function z(n,t,e){var o=u.indexOf||ir;return o=o===ir?r:o,n?o(n,t,e):o}function G(r){
for(var n=dr(r),t=n.length;t--;)n[t][2]=tr(n[t][1]);return n}function H(r,n){var t=null==r?xr:r[n];return yr(t)?t:xr}function J(r){var n=r.length,t=new r.constructor(n);return n&&"string"==typeof r[0]&&An.call(r,"index")&&(t.index=r.index,t.input=r.input),t}function K(r){var n=r.constructor;return typeof n=="function"&&n instanceof n||(n=Object),new n}function Q(r,n,t){var e=r.constructor;switch(n){case Dr:return T(r);case _r:case Ur:return new e(+r);case Vr:case Wr:case qr:case zr:case Gr:case Hr:
case Jr:case Kr:case Qr:e instanceof e&&(e=Rn[n]);var u=r.buffer;return new e(t?T(u):u,r.byteOffset,r.length);case Mr:case Nr:return new e(r);case Br:var o=new e(r.source,nn.exec(r));o.lastIndex=r.lastIndex}return o}function X(r){return null!=r&&nr(qn(r))}function Y(r,n){return r=typeof r=="number"||en.test(r)?+r:-1,n=null==n?Nn:n,r>-1&&r%1==0&&r<n}function Z(r,n,t){if(!hr(t))return false;var e=typeof n;if("number"==e?X(t)&&Y(n,t.length):"string"==e&&n in t){var u=t[n];return r===r?r===u:u!==u}return false;
}function rr(r,n){var t=typeof r;if("string"==t&&Yr.test(r)||"number"==t)return true;if(zn(r))return false;var e=!Xr.test(r);return e||null!=n&&r in ar(n)}function nr(r){return typeof r=="number"&&r>-1&&r%1==0&&r<=Nn}function tr(r){return r===r&&!hr(r)}function er(r,n){r=ar(r);for(var t=-1,e=n.length,u={};++t<e;){var o=n[t];o in r&&(u[o]=r[o])}return u}function ur(r,n){var t={};return w(r,function(r,e,u){n(r,e,u)&&(t[e]=r)}),t}function or(r){for(var n=jr(r),t=n.length,e=t&&r.length,u=!!e&&nr(e)&&(zn(r)||pr(r)||gr(r)),o=-1,a=[];++o<t;){
var c=n[o];(u&&Y(c,e)||An.call(r,c))&&a.push(c)}return a}function ar(r){if(u.support.unindexedChars&&gr(r)){for(var n=-1,t=r.length,e=Object(r);++n<t;)e[n]=r.charAt(n);return e}return hr(r)?r:Object(r)}function cr(r){if(zn(r))return r;var t=[];return n(r).replace(Zr,function(r,n,e,u){t.push(e?u.replace(rn,"$1"):n||r)}),t}function ir(n,t,e){var u=n?n.length:0;if(!u)return-1;if(typeof e=="number")e=e<0?Cn(u+e,0):e;else if(e){var o=F(n,t);return o<u&&(t===t?t===n[o]:n[o]!==n[o])?o:-1}return r(n,t,e||0);
}function fr(r){var n=r?r.length:0;return n?r[n-1]:xr}function lr(r,n,t){var e=[];if(!r||!r.length)return e;var u=-1,o=[],a=r.length;for(n=q(n,t,3);++u<a;){var c=r[u];n(c,u,r)&&(e.push(c),o.push(u))}return U(r,o),e}function sr(r,n){if(typeof r!="function")throw new TypeError(Ir);return n=Cn(n===xr?r.length-1:+n||0,0),function(){for(var t=arguments,e=-1,u=Cn(t.length-n,0),o=Array(u);++e<u;)o[e]=t[n+e];switch(n){case 0:return r.call(this,o);case 1:return r.call(this,t[0],o);case 2:return r.call(this,t[0],t[1],o);
}var a=Array(n+1);for(e=-1;++e<n;)a[e]=t[e];return a[n]=o,r.apply(this,a)}}function pr(r){return e(r)&&X(r)&&An.call(r,"callee")&&!En.call(r,"callee")}function vr(r){return hr(r)&&On.call(r)==Fr}function hr(r){var n=typeof r;return!!r&&("object"==n||"function"==n)}function yr(r){return null==r?false:vr(r)?xn.test(wn.call(r)):e(r)&&(gn(r)?xn:tn).test(r)}function gr(r){return typeof r=="string"||e(r)&&On.call(r)==Nr}function br(r){return e(r)&&nr(r.length)&&!!on[On.call(r)]}function jr(r){if(null==r)return[];
hr(r)||(r=Object(r));var n=r.length,t=u.support;n=n&&nr(n)&&(zn(r)||pr(r)||gr(r))&&n||0;for(var e=r.constructor,o=-1,a=vr(e)&&e.prototype||dn,c=a===r,i=Array(n),f=n>0,l=t.enumErrorProps&&(r===jn||r instanceof Error),s=t.enumPrototypes&&vr(r);++o<n;)i[o]=o+"";for(var p in r)s&&"prototype"==p||l&&("message"==p||"name"==p)||f&&Y(p,n)||"constructor"==p&&(c||!An.call(r,p))||i.push(p);if(t.nonEnumShadows&&r!==dn){var v=r===mn?Nr:r===jn?kr:On.call(r),h=Dn[v]||Dn[Tr];for(v==Tr&&(a=dn),n=un.length;n--;){p=un[n];
var y=h[p];c&&y||(y?!An.call(r,p):r[p]===a[p])||i.push(p)}}return i}function dr(r){r=ar(r);for(var n=-1,t=Jn(r),e=t.length,u=Array(e);++n<e;){var o=t[n];u[n]=[o,r[o]]}return u}function mr(r,n,t){return t&&Z(r,n,t)&&(n=xr),e(r)?Ar(r):b(r,n)}function wr(r){return r}function Ar(r){return I(j(r,true))}function Or(r){return rr(r)?$(r):_(r)}var xr,Sr="3.10.1",Er=200,Ir="Expected a function",Pr="[object Arguments]",$r="[object Array]",_r="[object Boolean]",Ur="[object Date]",kr="[object Error]",Fr="[object Function]",Cr="[object Map]",Mr="[object Number]",Tr="[object Object]",Br="[object RegExp]",Lr="[object Set]",Nr="[object String]",Rr="[object WeakMap]",Dr="[object ArrayBuffer]",Vr="[object Float32Array]",Wr="[object Float64Array]",qr="[object Int8Array]",zr="[object Int16Array]",Gr="[object Int32Array]",Hr="[object Uint8Array]",Jr="[object Uint8ClampedArray]",Kr="[object Uint16Array]",Qr="[object Uint32Array]",Xr=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,Yr=/^\w*$/,Zr=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,rn=/\\(\\)?/g,nn=/\w*$/,tn=/^\[object .+?Constructor\]$/,en=/^\d+$/,un=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],on={};
on[Vr]=on[Wr]=on[qr]=on[zr]=on[Gr]=on[Hr]=on[Jr]=on[Kr]=on[Qr]=true,on[Pr]=on[$r]=on[Dr]=on[_r]=on[Ur]=on[kr]=on[Fr]=on[Cr]=on[Mr]=on[Tr]=on[Br]=on[Lr]=on[Nr]=on[Rr]=false;var an={};an[Pr]=an[$r]=an[Dr]=an[_r]=an[Ur]=an[Vr]=an[Wr]=an[qr]=an[zr]=an[Gr]=an[Mr]=an[Tr]=an[Br]=an[Nr]=an[Hr]=an[Jr]=an[Kr]=an[Qr]=true,an[kr]=an[Fr]=an[Cr]=an[Lr]=an[Rr]=false;var cn={"function":true,object:true},fn=cn[typeof exports]&&exports&&!exports.nodeType&&exports,ln=cn[typeof module]&&module&&!module.nodeType&&module,sn=fn&&ln&&typeof global=="object"&&global&&global.Object&&global,pn=cn[typeof self]&&self&&self.Object&&self,vn=cn[typeof window]&&window&&window.Object&&window,hn=ln&&ln.exports===fn&&fn,yn=sn||vn!==(this&&this.window)&&vn||pn||this,gn=function(){
try{Object({toString:0}+"")}catch(r){return function(){return false}}return function(r){return typeof r.toString!="function"&&typeof(r+"")=="string"}}(),bn=Array.prototype,jn=Error.prototype,dn=Object.prototype,mn=String.prototype,wn=Function.prototype.toString,An=dn.hasOwnProperty,On=dn.toString,xn=RegExp("^"+wn.call(An).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Sn=yn.ArrayBuffer,En=dn.propertyIsEnumerable,In=H(yn,"Set"),Pn=bn.splice,$n=yn.Uint8Array,_n=H(Object,"create"),Un=Math.floor,kn=H(Array,"isArray"),Fn=H(Object,"keys"),Cn=Math.max,Mn=Math.min,Tn=4294967295,Bn=Tn-1,Ln=Tn>>>1,Nn=9007199254740991,Rn={};
Rn[Vr]=yn.Float32Array,Rn[Wr]=yn.Float64Array,Rn[qr]=yn.Int8Array,Rn[zr]=yn.Int16Array,Rn[Gr]=yn.Int32Array,Rn[Hr]=$n,Rn[Jr]=yn.Uint8ClampedArray,Rn[Kr]=yn.Uint16Array,Rn[Qr]=yn.Uint32Array;var Dn={};Dn[$r]=Dn[Ur]=Dn[Mr]={constructor:true,toLocaleString:true,toString:true,valueOf:true},Dn[_r]=Dn[Nr]={constructor:true,toString:true,valueOf:true},Dn[kr]=Dn[Fr]=Dn[Br]={constructor:true,toString:true},Dn[Tr]={constructor:true},f(un,function(r){for(var n in Dn)if(An.call(Dn,n)){var t=Dn[n];t[r]=An.call(t,r)}});var Vn=u.support={};
!function(r){var n=function(){this.x=r},t={0:r,length:r},e=[];n.prototype={valueOf:r,y:r};for(var u in new n)e.push(u);Vn.enumErrorProps=En.call(jn,"message")||En.call(jn,"name"),Vn.enumPrototypes=En.call(n,"prototype"),Vn.nonEnumShadows=!/valueOf/.test(e),Vn.spliceObjects=(Pn.call(t,0,1),!t[0]),Vn.unindexedChars="x"[0]+Object("x")[0]!="xx"}(1,0);var Wn=L(),qn=$("length"),zn=kn||function(r){return e(r)&&nr(r.length)&&On.call(r)==$r},Gn=B(function(r,n,t){return t?h(r,n,t):y(r,n)}),Hn=R(Gn,v),Jn=Fn?function(r){
var n=null==r?xr:r.constructor;return typeof n=="function"&&n.prototype===r||(typeof r=="function"?u.support.enumPrototypes:X(r))?or(r):hr(r)?Fn(r):[]}:or,Kn=sr(function(r,n){if(null==r)return{};if("function"!=typeof n[0]){var n=l(m(n),String);return er(r,d(jr(r),n))}var t=M(n[0],n[1],3);return ur(r,function(r,n,e){return!t(r,n,e)})});o.prototype.push=c,u.assign=Gn,u.callback=mr,u.defaults=Hn,u.keys=Jn,u.keysIn=jr,u.matches=Ar,u.omit=Kn,u.pairs=dr,u.property=Or,u.remove=lr,u.restParam=sr,u.extend=Gn,
u.iteratee=mr,u.identity=wr,u.indexOf=ir,u.isArguments=pr,u.isArray=zn,u.isFunction=vr,u.isNative=yr,u.isObject=hr,u.isString=gr,u.isTypedArray=br,u.last=fr,u.VERSION=Sr,fn&&ln&&hn&&((ln.exports=u)._=u)}).call(this);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[17])(17)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY3J5cHRvLWpzL2NvcmUuanMiLCJub2RlX21vZHVsZXMvY3J5cHRvLWpzL3NoYTEuanMiLCJub2RlX21vZHVsZXMvbm9kZS11dWlkL3V1aWQuanMiLCJub2RlX21vZHVsZXMvc3RvcmUvZGlzdC9zdG9yZS5sZWdhY3kuanMiLCJub2RlX21vZHVsZXMvc3RvcmUvcGx1Z2lucy9qc29uMi5qcyIsIm5vZGVfbW9kdWxlcy9zdG9yZS9wbHVnaW5zL2xpYi9qc29uMi5qcyIsIm5vZGVfbW9kdWxlcy9zdG9yZS9zcmMvc3RvcmUtZW5naW5lLmpzIiwibm9kZV9tb2R1bGVzL3N0b3JlL3NyYy91dGlsLmpzIiwibm9kZV9tb2R1bGVzL3N0b3JlL3N0b3JhZ2VzL2FsbC5qcyIsIm5vZGVfbW9kdWxlcy9zdG9yZS9zdG9yYWdlcy9jb29raWVTdG9yYWdlLmpzIiwibm9kZV9tb2R1bGVzL3N0b3JlL3N0b3JhZ2VzL2xvY2FsU3RvcmFnZS5qcyIsIm5vZGVfbW9kdWxlcy9zdG9yZS9zdG9yYWdlcy9tZW1vcnlTdG9yYWdlLmpzIiwibm9kZV9tb2R1bGVzL3N0b3JlL3N0b3JhZ2VzL29sZEZGLWdsb2JhbFN0b3JhZ2UuanMiLCJub2RlX21vZHVsZXMvc3RvcmUvc3RvcmFnZXMvb2xkSUUtdXNlckRhdGFTdG9yYWdlLmpzIiwibm9kZV9tb2R1bGVzL3N0b3JlL3N0b3JhZ2VzL3Nlc3Npb25TdG9yYWdlLmpzIiwic3JjL2FkYXB0ZXJzLmNvZmZlZSIsInNyYy9hbGVwaGJldC5jb2ZmZWUiLCJzcmMvb3B0aW9ucy5jb2ZmZWUiLCJzcmMvc3RvcmFnZS5jb2ZmZWUiLCJzcmMvdXRpbHMuY29mZmVlIiwidmVuZG9yL2xvZGFzaC5jdXN0b20ubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdnZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuXHRcdC8vIENvbW1vbkpTXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZmFjdG9yeSgpO1xuXHR9XG5cdGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gQU1EXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBHbG9iYWwgKGJyb3dzZXIpXG5cdFx0cm9vdC5DcnlwdG9KUyA9IGZhY3RvcnkoKTtcblx0fVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cblx0LyoqXG5cdCAqIENyeXB0b0pTIGNvcmUgY29tcG9uZW50cy5cblx0ICovXG5cdHZhciBDcnlwdG9KUyA9IENyeXB0b0pTIHx8IChmdW5jdGlvbiAoTWF0aCwgdW5kZWZpbmVkKSB7XG5cdCAgICAvKlxuXHQgICAgICogTG9jYWwgcG9seWZpbCBvZiBPYmplY3QuY3JlYXRlXG5cdCAgICAgKi9cblx0ICAgIHZhciBjcmVhdGUgPSBPYmplY3QuY3JlYXRlIHx8IChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgZnVuY3Rpb24gRigpIHt9O1xuXG5cdCAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopIHtcblx0ICAgICAgICAgICAgdmFyIHN1YnR5cGU7XG5cblx0ICAgICAgICAgICAgRi5wcm90b3R5cGUgPSBvYmo7XG5cblx0ICAgICAgICAgICAgc3VidHlwZSA9IG5ldyBGKCk7XG5cblx0ICAgICAgICAgICAgRi5wcm90b3R5cGUgPSBudWxsO1xuXG5cdCAgICAgICAgICAgIHJldHVybiBzdWJ0eXBlO1xuXHQgICAgICAgIH07XG5cdCAgICB9KCkpXG5cblx0ICAgIC8qKlxuXHQgICAgICogQ3J5cHRvSlMgbmFtZXNwYWNlLlxuXHQgICAgICovXG5cdCAgICB2YXIgQyA9IHt9O1xuXG5cdCAgICAvKipcblx0ICAgICAqIExpYnJhcnkgbmFtZXNwYWNlLlxuXHQgICAgICovXG5cdCAgICB2YXIgQ19saWIgPSBDLmxpYiA9IHt9O1xuXG5cdCAgICAvKipcblx0ICAgICAqIEJhc2Ugb2JqZWN0IGZvciBwcm90b3R5cGFsIGluaGVyaXRhbmNlLlxuXHQgICAgICovXG5cdCAgICB2YXIgQmFzZSA9IENfbGliLkJhc2UgPSAoZnVuY3Rpb24gKCkge1xuXG5cblx0ICAgICAgICByZXR1cm4ge1xuXHQgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoaXMgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3ZlcnJpZGVzIFByb3BlcnRpZXMgdG8gY29weSBpbnRvIHRoZSBuZXcgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBuZXcgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICB2YXIgTXlUeXBlID0gQ3J5cHRvSlMubGliLkJhc2UuZXh0ZW5kKHtcblx0ICAgICAgICAgICAgICogICAgICAgICBmaWVsZDogJ3ZhbHVlJyxcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogICAgICAgICBtZXRob2Q6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICogICAgICAgICB9XG5cdCAgICAgICAgICAgICAqICAgICB9KTtcblx0ICAgICAgICAgICAgICovXG5cdCAgICAgICAgICAgIGV4dGVuZDogZnVuY3Rpb24gKG92ZXJyaWRlcykge1xuXHQgICAgICAgICAgICAgICAgLy8gU3Bhd25cblx0ICAgICAgICAgICAgICAgIHZhciBzdWJ0eXBlID0gY3JlYXRlKHRoaXMpO1xuXG5cdCAgICAgICAgICAgICAgICAvLyBBdWdtZW50XG5cdCAgICAgICAgICAgICAgICBpZiAob3ZlcnJpZGVzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgc3VidHlwZS5taXhJbihvdmVycmlkZXMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAvLyBDcmVhdGUgZGVmYXVsdCBpbml0aWFsaXplclxuXHQgICAgICAgICAgICAgICAgaWYgKCFzdWJ0eXBlLmhhc093blByb3BlcnR5KCdpbml0JykgfHwgdGhpcy5pbml0ID09PSBzdWJ0eXBlLmluaXQpIHtcblx0ICAgICAgICAgICAgICAgICAgICBzdWJ0eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN1YnR5cGUuJHN1cGVyLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9O1xuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAvLyBJbml0aWFsaXplcidzIHByb3RvdHlwZSBpcyB0aGUgc3VidHlwZSBvYmplY3Rcblx0ICAgICAgICAgICAgICAgIHN1YnR5cGUuaW5pdC5wcm90b3R5cGUgPSBzdWJ0eXBlO1xuXG5cdCAgICAgICAgICAgICAgICAvLyBSZWZlcmVuY2Ugc3VwZXJ0eXBlXG5cdCAgICAgICAgICAgICAgICBzdWJ0eXBlLiRzdXBlciA9IHRoaXM7XG5cblx0ICAgICAgICAgICAgICAgIHJldHVybiBzdWJ0eXBlO1xuXHQgICAgICAgICAgICB9LFxuXG5cdCAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgKiBFeHRlbmRzIHRoaXMgb2JqZWN0IGFuZCBydW5zIHRoZSBpbml0IG1ldGhvZC5cblx0ICAgICAgICAgICAgICogQXJndW1lbnRzIHRvIGNyZWF0ZSgpIHdpbGwgYmUgcGFzc2VkIHRvIGluaXQoKS5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgbmV3IG9iamVjdC5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiAgICAgdmFyIGluc3RhbmNlID0gTXlUeXBlLmNyZWF0ZSgpO1xuXHQgICAgICAgICAgICAgKi9cblx0ICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLmV4dGVuZCgpO1xuXHQgICAgICAgICAgICAgICAgaW5zdGFuY2UuaW5pdC5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcblxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuXHQgICAgICAgICAgICB9LFxuXG5cdCAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgKiBJbml0aWFsaXplcyBhIG5ld2x5IGNyZWF0ZWQgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKiBPdmVycmlkZSB0aGlzIG1ldGhvZCB0byBhZGQgc29tZSBsb2dpYyB3aGVuIHlvdXIgb2JqZWN0cyBhcmUgY3JlYXRlZC5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogICAgIHZhciBNeVR5cGUgPSBDcnlwdG9KUy5saWIuQmFzZS5leHRlbmQoe1xuXHQgICAgICAgICAgICAgKiAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICogICAgICAgICAgICAgLy8gLi4uXG5cdCAgICAgICAgICAgICAqICAgICAgICAgfVxuXHQgICAgICAgICAgICAgKiAgICAgfSk7XG5cdCAgICAgICAgICAgICAqL1xuXHQgICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIH0sXG5cblx0ICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAqIENvcGllcyBwcm9wZXJ0aWVzIGludG8gdGhpcyBvYmplY3QuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wZXJ0aWVzIFRoZSBwcm9wZXJ0aWVzIHRvIG1peCBpbi5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogICAgIE15VHlwZS5taXhJbih7XG5cdCAgICAgICAgICAgICAqICAgICAgICAgZmllbGQ6ICd2YWx1ZSdcblx0ICAgICAgICAgICAgICogICAgIH0pO1xuXHQgICAgICAgICAgICAgKi9cblx0ICAgICAgICAgICAgbWl4SW46IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gcHJvcGVydGllcykge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wZXJ0eU5hbWVdID0gcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gSUUgd29uJ3QgY29weSB0b1N0cmluZyB1c2luZyB0aGUgbG9vcCBhYm92ZVxuXHQgICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkoJ3RvU3RyaW5nJykpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnRvU3RyaW5nID0gcHJvcGVydGllcy50b1N0cmluZztcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblxuXHQgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICogQ3JlYXRlcyBhIGNvcHkgb2YgdGhpcyBvYmplY3QuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGNsb25lLlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiAgICAgdmFyIGNsb25lID0gaW5zdGFuY2UuY2xvbmUoKTtcblx0ICAgICAgICAgICAgICovXG5cdCAgICAgICAgICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pbml0LnByb3RvdHlwZS5leHRlbmQodGhpcyk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9O1xuXHQgICAgfSgpKTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBBbiBhcnJheSBvZiAzMi1iaXQgd29yZHMuXG5cdCAgICAgKlxuXHQgICAgICogQHByb3BlcnR5IHtBcnJheX0gd29yZHMgVGhlIGFycmF5IG9mIDMyLWJpdCB3b3Jkcy5cblx0ICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaWdCeXRlcyBUaGUgbnVtYmVyIG9mIHNpZ25pZmljYW50IGJ5dGVzIGluIHRoaXMgd29yZCBhcnJheS5cblx0ICAgICAqL1xuXHQgICAgdmFyIFdvcmRBcnJheSA9IENfbGliLldvcmRBcnJheSA9IEJhc2UuZXh0ZW5kKHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBJbml0aWFsaXplcyBhIG5ld2x5IGNyZWF0ZWQgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IHdvcmRzIChPcHRpb25hbCkgQW4gYXJyYXkgb2YgMzItYml0IHdvcmRzLlxuXHQgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzaWdCeXRlcyAoT3B0aW9uYWwpIFRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgYnl0ZXMgaW4gdGhlIHdvcmRzLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoKTtcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKFsweDAwMDEwMjAzLCAweDA0MDUwNjA3XSk7XG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZShbMHgwMDAxMDIwMywgMHgwNDA1MDYwN10sIDYpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGluaXQ6IGZ1bmN0aW9uICh3b3Jkcywgc2lnQnl0ZXMpIHtcblx0ICAgICAgICAgICAgd29yZHMgPSB0aGlzLndvcmRzID0gd29yZHMgfHwgW107XG5cblx0ICAgICAgICAgICAgaWYgKHNpZ0J5dGVzICE9IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5zaWdCeXRlcyA9IHNpZ0J5dGVzO1xuXHQgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5zaWdCeXRlcyA9IHdvcmRzLmxlbmd0aCAqIDQ7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ29udmVydHMgdGhpcyB3b3JkIGFycmF5IHRvIGEgc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtFbmNvZGVyfSBlbmNvZGVyIChPcHRpb25hbCkgVGhlIGVuY29kaW5nIHN0cmF0ZWd5IHRvIHVzZS4gRGVmYXVsdDogQ3J5cHRvSlMuZW5jLkhleFxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgc3RyaW5naWZpZWQgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHN0cmluZyA9IHdvcmRBcnJheSArICcnO1xuXHQgICAgICAgICAqICAgICB2YXIgc3RyaW5nID0gd29yZEFycmF5LnRvU3RyaW5nKCk7XG5cdCAgICAgICAgICogICAgIHZhciBzdHJpbmcgPSB3b3JkQXJyYXkudG9TdHJpbmcoQ3J5cHRvSlMuZW5jLlV0ZjgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoZW5jb2Rlcikge1xuXHQgICAgICAgICAgICByZXR1cm4gKGVuY29kZXIgfHwgSGV4KS5zdHJpbmdpZnkodGhpcyk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbmNhdGVuYXRlcyBhIHdvcmQgYXJyYXkgdG8gdGhpcyB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl9IHdvcmRBcnJheSBUaGUgd29yZCBhcnJheSB0byBhcHBlbmQuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoaXMgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgd29yZEFycmF5MS5jb25jYXQod29yZEFycmF5Mik7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgY29uY2F0OiBmdW5jdGlvbiAod29yZEFycmF5KSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICB2YXIgdGhpc1dvcmRzID0gdGhpcy53b3Jkcztcblx0ICAgICAgICAgICAgdmFyIHRoYXRXb3JkcyA9IHdvcmRBcnJheS53b3Jkcztcblx0ICAgICAgICAgICAgdmFyIHRoaXNTaWdCeXRlcyA9IHRoaXMuc2lnQnl0ZXM7XG5cdCAgICAgICAgICAgIHZhciB0aGF0U2lnQnl0ZXMgPSB3b3JkQXJyYXkuc2lnQnl0ZXM7XG5cblx0ICAgICAgICAgICAgLy8gQ2xhbXAgZXhjZXNzIGJpdHNcblx0ICAgICAgICAgICAgdGhpcy5jbGFtcCgpO1xuXG5cdCAgICAgICAgICAgIC8vIENvbmNhdFxuXHQgICAgICAgICAgICBpZiAodGhpc1NpZ0J5dGVzICUgNCkge1xuXHQgICAgICAgICAgICAgICAgLy8gQ29weSBvbmUgYnl0ZSBhdCBhIHRpbWVcblx0ICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhhdFNpZ0J5dGVzOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgdGhhdEJ5dGUgPSAodGhhdFdvcmRzW2kgPj4+IDJdID4+PiAoMjQgLSAoaSAlIDQpICogOCkpICYgMHhmZjtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzV29yZHNbKHRoaXNTaWdCeXRlcyArIGkpID4+PiAyXSB8PSB0aGF0Qnl0ZSA8PCAoMjQgLSAoKHRoaXNTaWdCeXRlcyArIGkpICUgNCkgKiA4KTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIC8vIENvcHkgb25lIHdvcmQgYXQgYSB0aW1lXG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoYXRTaWdCeXRlczsgaSArPSA0KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpc1dvcmRzWyh0aGlzU2lnQnl0ZXMgKyBpKSA+Pj4gMl0gPSB0aGF0V29yZHNbaSA+Pj4gMl07XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgdGhpcy5zaWdCeXRlcyArPSB0aGF0U2lnQnl0ZXM7XG5cblx0ICAgICAgICAgICAgLy8gQ2hhaW5hYmxlXG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBSZW1vdmVzIGluc2lnbmlmaWNhbnQgYml0cy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgd29yZEFycmF5LmNsYW1wKCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgY2xhbXA6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IHRoaXMud29yZHM7XG5cdCAgICAgICAgICAgIHZhciBzaWdCeXRlcyA9IHRoaXMuc2lnQnl0ZXM7XG5cblx0ICAgICAgICAgICAgLy8gQ2xhbXBcblx0ICAgICAgICAgICAgd29yZHNbc2lnQnl0ZXMgPj4+IDJdICY9IDB4ZmZmZmZmZmYgPDwgKDMyIC0gKHNpZ0J5dGVzICUgNCkgKiA4KTtcblx0ICAgICAgICAgICAgd29yZHMubGVuZ3RoID0gTWF0aC5jZWlsKHNpZ0J5dGVzIC8gNCk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoaXMgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIGNsb25lLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgY2xvbmUgPSB3b3JkQXJyYXkuY2xvbmUoKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICB2YXIgY2xvbmUgPSBCYXNlLmNsb25lLmNhbGwodGhpcyk7XG5cdCAgICAgICAgICAgIGNsb25lLndvcmRzID0gdGhpcy53b3Jkcy5zbGljZSgwKTtcblxuXHQgICAgICAgICAgICByZXR1cm4gY2xvbmU7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgYSB3b3JkIGFycmF5IGZpbGxlZCB3aXRoIHJhbmRvbSBieXRlcy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuQnl0ZXMgVGhlIG51bWJlciBvZiByYW5kb20gYnl0ZXMgdG8gZ2VuZXJhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSByYW5kb20gd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkucmFuZG9tKDE2KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICByYW5kb206IGZ1bmN0aW9uIChuQnl0ZXMpIHtcblx0ICAgICAgICAgICAgdmFyIHdvcmRzID0gW107XG5cblx0ICAgICAgICAgICAgdmFyIHIgPSAoZnVuY3Rpb24gKG1fdykge1xuXHQgICAgICAgICAgICAgICAgdmFyIG1fdyA9IG1fdztcblx0ICAgICAgICAgICAgICAgIHZhciBtX3ogPSAweDNhZGU2OGIxO1xuXHQgICAgICAgICAgICAgICAgdmFyIG1hc2sgPSAweGZmZmZmZmZmO1xuXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIG1feiA9ICgweDkwNjkgKiAobV96ICYgMHhGRkZGKSArIChtX3ogPj4gMHgxMCkpICYgbWFzaztcblx0ICAgICAgICAgICAgICAgICAgICBtX3cgPSAoMHg0NjUwICogKG1fdyAmIDB4RkZGRikgKyAobV93ID4+IDB4MTApKSAmIG1hc2s7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9ICgobV96IDw8IDB4MTApICsgbV93KSAmIG1hc2s7XG5cdCAgICAgICAgICAgICAgICAgICAgcmVzdWx0IC89IDB4MTAwMDAwMDAwO1xuXHQgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSAwLjU7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCAqIChNYXRoLnJhbmRvbSgpID4gLjUgPyAxIDogLTEpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgcmNhY2hlOyBpIDwgbkJ5dGVzOyBpICs9IDQpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBfciA9IHIoKHJjYWNoZSB8fCBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDAwMDAwKTtcblxuXHQgICAgICAgICAgICAgICAgcmNhY2hlID0gX3IoKSAqIDB4M2FkZTY3Yjc7XG5cdCAgICAgICAgICAgICAgICB3b3Jkcy5wdXNoKChfcigpICogMHgxMDAwMDAwMDApIHwgMCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gbmV3IFdvcmRBcnJheS5pbml0KHdvcmRzLCBuQnl0ZXMpO1xuXHQgICAgICAgIH1cblx0ICAgIH0pO1xuXG5cdCAgICAvKipcblx0ICAgICAqIEVuY29kZXIgbmFtZXNwYWNlLlxuXHQgICAgICovXG5cdCAgICB2YXIgQ19lbmMgPSBDLmVuYyA9IHt9O1xuXG5cdCAgICAvKipcblx0ICAgICAqIEhleCBlbmNvZGluZyBzdHJhdGVneS5cblx0ICAgICAqL1xuXHQgICAgdmFyIEhleCA9IENfZW5jLkhleCA9IHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIHdvcmQgYXJyYXkgdG8gYSBoZXggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl9IHdvcmRBcnJheSBUaGUgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGhleCBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBoZXhTdHJpbmcgPSBDcnlwdG9KUy5lbmMuSGV4LnN0cmluZ2lmeSh3b3JkQXJyYXkpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgdmFyIHdvcmRzID0gd29yZEFycmF5LndvcmRzO1xuXHQgICAgICAgICAgICB2YXIgc2lnQnl0ZXMgPSB3b3JkQXJyYXkuc2lnQnl0ZXM7XG5cblx0ICAgICAgICAgICAgLy8gQ29udmVydFxuXHQgICAgICAgICAgICB2YXIgaGV4Q2hhcnMgPSBbXTtcblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaWdCeXRlczsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgYml0ZSA9ICh3b3Jkc1tpID4+PiAyXSA+Pj4gKDI0IC0gKGkgJSA0KSAqIDgpKSAmIDB4ZmY7XG5cdCAgICAgICAgICAgICAgICBoZXhDaGFycy5wdXNoKChiaXRlID4+PiA0KS50b1N0cmluZygxNikpO1xuXHQgICAgICAgICAgICAgICAgaGV4Q2hhcnMucHVzaCgoYml0ZSAmIDB4MGYpLnRvU3RyaW5nKDE2KSk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gaGV4Q2hhcnMuam9pbignJyk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIGEgaGV4IHN0cmluZyB0byBhIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gaGV4U3RyIFRoZSBoZXggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmVuYy5IZXgucGFyc2UoaGV4U3RyaW5nKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBwYXJzZTogZnVuY3Rpb24gKGhleFN0cikge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dFxuXHQgICAgICAgICAgICB2YXIgaGV4U3RyTGVuZ3RoID0gaGV4U3RyLmxlbmd0aDtcblxuXHQgICAgICAgICAgICAvLyBDb252ZXJ0XG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IFtdO1xuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhleFN0ckxlbmd0aDsgaSArPSAyKSB7XG5cdCAgICAgICAgICAgICAgICB3b3Jkc1tpID4+PiAzXSB8PSBwYXJzZUludChoZXhTdHIuc3Vic3RyKGksIDIpLCAxNikgPDwgKDI0IC0gKGkgJSA4KSAqIDQpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIG5ldyBXb3JkQXJyYXkuaW5pdCh3b3JkcywgaGV4U3RyTGVuZ3RoIC8gMik7XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBMYXRpbjEgZW5jb2Rpbmcgc3RyYXRlZ3kuXG5cdCAgICAgKi9cblx0ICAgIHZhciBMYXRpbjEgPSBDX2VuYy5MYXRpbjEgPSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ29udmVydHMgYSB3b3JkIGFycmF5IHRvIGEgTGF0aW4xIHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fSB3b3JkQXJyYXkgVGhlIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBMYXRpbjEgc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgbGF0aW4xU3RyaW5nID0gQ3J5cHRvSlMuZW5jLkxhdGluMS5zdHJpbmdpZnkod29yZEFycmF5KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh3b3JkQXJyYXkpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IHdvcmRBcnJheS53b3Jkcztcblx0ICAgICAgICAgICAgdmFyIHNpZ0J5dGVzID0gd29yZEFycmF5LnNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENvbnZlcnRcblx0ICAgICAgICAgICAgdmFyIGxhdGluMUNoYXJzID0gW107XG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2lnQnl0ZXM7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgdmFyIGJpdGUgPSAod29yZHNbaSA+Pj4gMl0gPj4+ICgyNCAtIChpICUgNCkgKiA4KSkgJiAweGZmO1xuXHQgICAgICAgICAgICAgICAgbGF0aW4xQ2hhcnMucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGJpdGUpKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHJldHVybiBsYXRpbjFDaGFycy5qb2luKCcnKTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ29udmVydHMgYSBMYXRpbjEgc3RyaW5nIHRvIGEgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYXRpbjFTdHIgVGhlIExhdGluMSBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMuZW5jLkxhdGluMS5wYXJzZShsYXRpbjFTdHJpbmcpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAobGF0aW4xU3RyKSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0XG5cdCAgICAgICAgICAgIHZhciBsYXRpbjFTdHJMZW5ndGggPSBsYXRpbjFTdHIubGVuZ3RoO1xuXG5cdCAgICAgICAgICAgIC8vIENvbnZlcnRcblx0ICAgICAgICAgICAgdmFyIHdvcmRzID0gW107XG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF0aW4xU3RyTGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIHdvcmRzW2kgPj4+IDJdIHw9IChsYXRpbjFTdHIuY2hhckNvZGVBdChpKSAmIDB4ZmYpIDw8ICgyNCAtIChpICUgNCkgKiA4KTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQod29yZHMsIGxhdGluMVN0ckxlbmd0aCk7XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBVVEYtOCBlbmNvZGluZyBzdHJhdGVneS5cblx0ICAgICAqL1xuXHQgICAgdmFyIFV0ZjggPSBDX2VuYy5VdGY4ID0ge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIGEgd29yZCBhcnJheSB0byBhIFVURi04IHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fSB3b3JkQXJyYXkgVGhlIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBVVEYtOCBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB1dGY4U3RyaW5nID0gQ3J5cHRvSlMuZW5jLlV0Zjguc3RyaW5naWZ5KHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAod29yZEFycmF5KSB7XG5cdCAgICAgICAgICAgIHRyeSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVzY2FwZShMYXRpbjEuc3RyaW5naWZ5KHdvcmRBcnJheSkpKTtcblx0ICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuXHQgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNYWxmb3JtZWQgVVRGLTggZGF0YScpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIGEgVVRGLTggc3RyaW5nIHRvIGEgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1dGY4U3RyIFRoZSBVVEYtOCBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMuZW5jLlV0ZjgucGFyc2UodXRmOFN0cmluZyk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgcGFyc2U6IGZ1bmN0aW9uICh1dGY4U3RyKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBMYXRpbjEucGFyc2UodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHV0ZjhTdHIpKSk7XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBBYnN0cmFjdCBidWZmZXJlZCBibG9jayBhbGdvcml0aG0gdGVtcGxhdGUuXG5cdCAgICAgKlxuXHQgICAgICogVGhlIHByb3BlcnR5IGJsb2NrU2l6ZSBtdXN0IGJlIGltcGxlbWVudGVkIGluIGEgY29uY3JldGUgc3VidHlwZS5cblx0ICAgICAqXG5cdCAgICAgKiBAcHJvcGVydHkge251bWJlcn0gX21pbkJ1ZmZlclNpemUgVGhlIG51bWJlciBvZiBibG9ja3MgdGhhdCBzaG91bGQgYmUga2VwdCB1bnByb2Nlc3NlZCBpbiB0aGUgYnVmZmVyLiBEZWZhdWx0OiAwXG5cdCAgICAgKi9cblx0ICAgIHZhciBCdWZmZXJlZEJsb2NrQWxnb3JpdGhtID0gQ19saWIuQnVmZmVyZWRCbG9ja0FsZ29yaXRobSA9IEJhc2UuZXh0ZW5kKHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBSZXNldHMgdGhpcyBibG9jayBhbGdvcml0aG0ncyBkYXRhIGJ1ZmZlciB0byBpdHMgaW5pdGlhbCBzdGF0ZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5yZXNldCgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIC8vIEluaXRpYWwgdmFsdWVzXG5cdCAgICAgICAgICAgIHRoaXMuX2RhdGEgPSBuZXcgV29yZEFycmF5LmluaXQoKTtcblx0ICAgICAgICAgICAgdGhpcy5fbkRhdGFCeXRlcyA9IDA7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIEFkZHMgbmV3IGRhdGEgdG8gdGhpcyBibG9jayBhbGdvcml0aG0ncyBidWZmZXIuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYXBwZW5kLiBTdHJpbmdzIGFyZSBjb252ZXJ0ZWQgdG8gYSBXb3JkQXJyYXkgdXNpbmcgVVRGLTguXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uX2FwcGVuZCgnZGF0YScpO1xuXHQgICAgICAgICAqICAgICBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9hcHBlbmQod29yZEFycmF5KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBfYXBwZW5kOiBmdW5jdGlvbiAoZGF0YSkge1xuXHQgICAgICAgICAgICAvLyBDb252ZXJ0IHN0cmluZyB0byBXb3JkQXJyYXksIGVsc2UgYXNzdW1lIFdvcmRBcnJheSBhbHJlYWR5XG5cdCAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PSAnc3RyaW5nJykge1xuXHQgICAgICAgICAgICAgICAgZGF0YSA9IFV0ZjgucGFyc2UoZGF0YSk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBBcHBlbmRcblx0ICAgICAgICAgICAgdGhpcy5fZGF0YS5jb25jYXQoZGF0YSk7XG5cdCAgICAgICAgICAgIHRoaXMuX25EYXRhQnl0ZXMgKz0gZGF0YS5zaWdCeXRlcztcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogUHJvY2Vzc2VzIGF2YWlsYWJsZSBkYXRhIGJsb2Nrcy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIFRoaXMgbWV0aG9kIGludm9rZXMgX2RvUHJvY2Vzc0Jsb2NrKG9mZnNldCksIHdoaWNoIG11c3QgYmUgaW1wbGVtZW50ZWQgYnkgYSBjb25jcmV0ZSBzdWJ0eXBlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBkb0ZsdXNoIFdoZXRoZXIgYWxsIGJsb2NrcyBhbmQgcGFydGlhbCBibG9ja3Mgc2hvdWxkIGJlIHByb2Nlc3NlZC5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIHByb2Nlc3NlZCBkYXRhLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgcHJvY2Vzc2VkRGF0YSA9IGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uX3Byb2Nlc3MoKTtcblx0ICAgICAgICAgKiAgICAgdmFyIHByb2Nlc3NlZERhdGEgPSBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9wcm9jZXNzKCEhJ2ZsdXNoJyk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgX3Byb2Nlc3M6IGZ1bmN0aW9uIChkb0ZsdXNoKSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuX2RhdGE7XG5cdCAgICAgICAgICAgIHZhciBkYXRhV29yZHMgPSBkYXRhLndvcmRzO1xuXHQgICAgICAgICAgICB2YXIgZGF0YVNpZ0J5dGVzID0gZGF0YS5zaWdCeXRlcztcblx0ICAgICAgICAgICAgdmFyIGJsb2NrU2l6ZSA9IHRoaXMuYmxvY2tTaXplO1xuXHQgICAgICAgICAgICB2YXIgYmxvY2tTaXplQnl0ZXMgPSBibG9ja1NpemUgKiA0O1xuXG5cdCAgICAgICAgICAgIC8vIENvdW50IGJsb2NrcyByZWFkeVxuXHQgICAgICAgICAgICB2YXIgbkJsb2Nrc1JlYWR5ID0gZGF0YVNpZ0J5dGVzIC8gYmxvY2tTaXplQnl0ZXM7XG5cdCAgICAgICAgICAgIGlmIChkb0ZsdXNoKSB7XG5cdCAgICAgICAgICAgICAgICAvLyBSb3VuZCB1cCB0byBpbmNsdWRlIHBhcnRpYWwgYmxvY2tzXG5cdCAgICAgICAgICAgICAgICBuQmxvY2tzUmVhZHkgPSBNYXRoLmNlaWwobkJsb2Nrc1JlYWR5KTtcblx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIC8vIFJvdW5kIGRvd24gdG8gaW5jbHVkZSBvbmx5IGZ1bGwgYmxvY2tzLFxuXHQgICAgICAgICAgICAgICAgLy8gbGVzcyB0aGUgbnVtYmVyIG9mIGJsb2NrcyB0aGF0IG11c3QgcmVtYWluIGluIHRoZSBidWZmZXJcblx0ICAgICAgICAgICAgICAgIG5CbG9ja3NSZWFkeSA9IE1hdGgubWF4KChuQmxvY2tzUmVhZHkgfCAwKSAtIHRoaXMuX21pbkJ1ZmZlclNpemUsIDApO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gQ291bnQgd29yZHMgcmVhZHlcblx0ICAgICAgICAgICAgdmFyIG5Xb3Jkc1JlYWR5ID0gbkJsb2Nrc1JlYWR5ICogYmxvY2tTaXplO1xuXG5cdCAgICAgICAgICAgIC8vIENvdW50IGJ5dGVzIHJlYWR5XG5cdCAgICAgICAgICAgIHZhciBuQnl0ZXNSZWFkeSA9IE1hdGgubWluKG5Xb3Jkc1JlYWR5ICogNCwgZGF0YVNpZ0J5dGVzKTtcblxuXHQgICAgICAgICAgICAvLyBQcm9jZXNzIGJsb2Nrc1xuXHQgICAgICAgICAgICBpZiAobldvcmRzUmVhZHkpIHtcblx0ICAgICAgICAgICAgICAgIGZvciAodmFyIG9mZnNldCA9IDA7IG9mZnNldCA8IG5Xb3Jkc1JlYWR5OyBvZmZzZXQgKz0gYmxvY2tTaXplKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgLy8gUGVyZm9ybSBjb25jcmV0ZS1hbGdvcml0aG0gbG9naWNcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9kb1Byb2Nlc3NCbG9jayhkYXRhV29yZHMsIG9mZnNldCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBwcm9jZXNzZWQgd29yZHNcblx0ICAgICAgICAgICAgICAgIHZhciBwcm9jZXNzZWRXb3JkcyA9IGRhdGFXb3Jkcy5zcGxpY2UoMCwgbldvcmRzUmVhZHkpO1xuXHQgICAgICAgICAgICAgICAgZGF0YS5zaWdCeXRlcyAtPSBuQnl0ZXNSZWFkeTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIC8vIFJldHVybiBwcm9jZXNzZWQgd29yZHNcblx0ICAgICAgICAgICAgcmV0dXJuIG5ldyBXb3JkQXJyYXkuaW5pdChwcm9jZXNzZWRXb3JkcywgbkJ5dGVzUmVhZHkpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgY29weSBvZiB0aGlzIG9iamVjdC5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGNsb25lLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgY2xvbmUgPSBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLmNsb25lKCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgdmFyIGNsb25lID0gQmFzZS5jbG9uZS5jYWxsKHRoaXMpO1xuXHQgICAgICAgICAgICBjbG9uZS5fZGF0YSA9IHRoaXMuX2RhdGEuY2xvbmUoKTtcblxuXHQgICAgICAgICAgICByZXR1cm4gY2xvbmU7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIF9taW5CdWZmZXJTaXplOiAwXG5cdCAgICB9KTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBBYnN0cmFjdCBoYXNoZXIgdGVtcGxhdGUuXG5cdCAgICAgKlxuXHQgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGJsb2NrU2l6ZSBUaGUgbnVtYmVyIG9mIDMyLWJpdCB3b3JkcyB0aGlzIGhhc2hlciBvcGVyYXRlcyBvbi4gRGVmYXVsdDogMTYgKDUxMiBiaXRzKVxuXHQgICAgICovXG5cdCAgICB2YXIgSGFzaGVyID0gQ19saWIuSGFzaGVyID0gQnVmZmVyZWRCbG9ja0FsZ29yaXRobS5leHRlbmQoe1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbmZpZ3VyYXRpb24gb3B0aW9ucy5cblx0ICAgICAgICAgKi9cblx0ICAgICAgICBjZmc6IEJhc2UuZXh0ZW5kKCksXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBJbml0aWFsaXplcyBhIG5ld2x5IGNyZWF0ZWQgaGFzaGVyLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGNmZyAoT3B0aW9uYWwpIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgdG8gdXNlIGZvciB0aGlzIGhhc2ggY29tcHV0YXRpb24uXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBoYXNoZXIgPSBDcnlwdG9KUy5hbGdvLlNIQTI1Ni5jcmVhdGUoKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBpbml0OiBmdW5jdGlvbiAoY2ZnKSB7XG5cdCAgICAgICAgICAgIC8vIEFwcGx5IGNvbmZpZyBkZWZhdWx0c1xuXHQgICAgICAgICAgICB0aGlzLmNmZyA9IHRoaXMuY2ZnLmV4dGVuZChjZmcpO1xuXG5cdCAgICAgICAgICAgIC8vIFNldCBpbml0aWFsIHZhbHVlc1xuXHQgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIFJlc2V0cyB0aGlzIGhhc2hlciB0byBpdHMgaW5pdGlhbCBzdGF0ZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgaGFzaGVyLnJlc2V0KCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgLy8gUmVzZXQgZGF0YSBidWZmZXJcblx0ICAgICAgICAgICAgQnVmZmVyZWRCbG9ja0FsZ29yaXRobS5yZXNldC5jYWxsKHRoaXMpO1xuXG5cdCAgICAgICAgICAgIC8vIFBlcmZvcm0gY29uY3JldGUtaGFzaGVyIGxvZ2ljXG5cdCAgICAgICAgICAgIHRoaXMuX2RvUmVzZXQoKTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogVXBkYXRlcyB0aGlzIGhhc2hlciB3aXRoIGEgbWVzc2FnZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZVVwZGF0ZSBUaGUgbWVzc2FnZSB0byBhcHBlbmQuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtIYXNoZXJ9IFRoaXMgaGFzaGVyLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICBoYXNoZXIudXBkYXRlKCdtZXNzYWdlJyk7XG5cdCAgICAgICAgICogICAgIGhhc2hlci51cGRhdGUod29yZEFycmF5KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChtZXNzYWdlVXBkYXRlKSB7XG5cdCAgICAgICAgICAgIC8vIEFwcGVuZFxuXHQgICAgICAgICAgICB0aGlzLl9hcHBlbmQobWVzc2FnZVVwZGF0ZSk7XG5cblx0ICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBoYXNoXG5cdCAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3MoKTtcblxuXHQgICAgICAgICAgICAvLyBDaGFpbmFibGVcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIEZpbmFsaXplcyB0aGUgaGFzaCBjb21wdXRhdGlvbi5cblx0ICAgICAgICAgKiBOb3RlIHRoYXQgdGhlIGZpbmFsaXplIG9wZXJhdGlvbiBpcyBlZmZlY3RpdmVseSBhIGRlc3RydWN0aXZlLCByZWFkLW9uY2Ugb3BlcmF0aW9uLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBtZXNzYWdlVXBkYXRlIChPcHRpb25hbCkgQSBmaW5hbCBtZXNzYWdlIHVwZGF0ZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIGhhc2guXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBoYXNoID0gaGFzaGVyLmZpbmFsaXplKCk7XG5cdCAgICAgICAgICogICAgIHZhciBoYXNoID0gaGFzaGVyLmZpbmFsaXplKCdtZXNzYWdlJyk7XG5cdCAgICAgICAgICogICAgIHZhciBoYXNoID0gaGFzaGVyLmZpbmFsaXplKHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgZmluYWxpemU6IGZ1bmN0aW9uIChtZXNzYWdlVXBkYXRlKSB7XG5cdCAgICAgICAgICAgIC8vIEZpbmFsIG1lc3NhZ2UgdXBkYXRlXG5cdCAgICAgICAgICAgIGlmIChtZXNzYWdlVXBkYXRlKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLl9hcHBlbmQobWVzc2FnZVVwZGF0ZSk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBQZXJmb3JtIGNvbmNyZXRlLWhhc2hlciBsb2dpY1xuXHQgICAgICAgICAgICB2YXIgaGFzaCA9IHRoaXMuX2RvRmluYWxpemUoKTtcblxuXHQgICAgICAgICAgICByZXR1cm4gaGFzaDtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgYmxvY2tTaXplOiA1MTIvMzIsXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgc2hvcnRjdXQgZnVuY3Rpb24gdG8gYSBoYXNoZXIncyBvYmplY3QgaW50ZXJmYWNlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtIYXNoZXJ9IGhhc2hlciBUaGUgaGFzaGVyIHRvIGNyZWF0ZSBhIGhlbHBlciBmb3IuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIHNob3J0Y3V0IGZ1bmN0aW9uLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgU0hBMjU2ID0gQ3J5cHRvSlMubGliLkhhc2hlci5fY3JlYXRlSGVscGVyKENyeXB0b0pTLmFsZ28uU0hBMjU2KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBfY3JlYXRlSGVscGVyOiBmdW5jdGlvbiAoaGFzaGVyKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSwgY2ZnKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGhhc2hlci5pbml0KGNmZykuZmluYWxpemUobWVzc2FnZSk7XG5cdCAgICAgICAgICAgIH07XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgYSBzaG9ydGN1dCBmdW5jdGlvbiB0byB0aGUgSE1BQydzIG9iamVjdCBpbnRlcmZhY2UuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge0hhc2hlcn0gaGFzaGVyIFRoZSBoYXNoZXIgdG8gdXNlIGluIHRoaXMgSE1BQyBoZWxwZXIuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIHNob3J0Y3V0IGZ1bmN0aW9uLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgSG1hY1NIQTI1NiA9IENyeXB0b0pTLmxpYi5IYXNoZXIuX2NyZWF0ZUhtYWNIZWxwZXIoQ3J5cHRvSlMuYWxnby5TSEEyNTYpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIF9jcmVhdGVIbWFjSGVscGVyOiBmdW5jdGlvbiAoaGFzaGVyKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSwga2V5KSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENfYWxnby5ITUFDLmluaXQoaGFzaGVyLCBrZXkpLmZpbmFsaXplKG1lc3NhZ2UpO1xuXHQgICAgICAgICAgICB9O1xuXHQgICAgICAgIH1cblx0ICAgIH0pO1xuXG5cdCAgICAvKipcblx0ICAgICAqIEFsZ29yaXRobSBuYW1lc3BhY2UuXG5cdCAgICAgKi9cblx0ICAgIHZhciBDX2FsZ28gPSBDLmFsZ28gPSB7fTtcblxuXHQgICAgcmV0dXJuIEM7XG5cdH0oTWF0aCkpO1xuXG5cblx0cmV0dXJuIENyeXB0b0pTO1xuXG59KSk7IiwiOyhmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcblx0XHQvLyBDb21tb25KU1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcIi4vY29yZVwiKSk7XG5cdH1cblx0ZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyBBTURcblx0XHRkZWZpbmUoW1wiLi9jb3JlXCJdLCBmYWN0b3J5KTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBHbG9iYWwgKGJyb3dzZXIpXG5cdFx0ZmFjdG9yeShyb290LkNyeXB0b0pTKTtcblx0fVxufSh0aGlzLCBmdW5jdGlvbiAoQ3J5cHRvSlMpIHtcblxuXHQoZnVuY3Rpb24gKCkge1xuXHQgICAgLy8gU2hvcnRjdXRzXG5cdCAgICB2YXIgQyA9IENyeXB0b0pTO1xuXHQgICAgdmFyIENfbGliID0gQy5saWI7XG5cdCAgICB2YXIgV29yZEFycmF5ID0gQ19saWIuV29yZEFycmF5O1xuXHQgICAgdmFyIEhhc2hlciA9IENfbGliLkhhc2hlcjtcblx0ICAgIHZhciBDX2FsZ28gPSBDLmFsZ287XG5cblx0ICAgIC8vIFJldXNhYmxlIG9iamVjdFxuXHQgICAgdmFyIFcgPSBbXTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBTSEEtMSBoYXNoIGFsZ29yaXRobS5cblx0ICAgICAqL1xuXHQgICAgdmFyIFNIQTEgPSBDX2FsZ28uU0hBMSA9IEhhc2hlci5leHRlbmQoe1xuXHQgICAgICAgIF9kb1Jlc2V0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIHRoaXMuX2hhc2ggPSBuZXcgV29yZEFycmF5LmluaXQoW1xuXHQgICAgICAgICAgICAgICAgMHg2NzQ1MjMwMSwgMHhlZmNkYWI4OSxcblx0ICAgICAgICAgICAgICAgIDB4OThiYWRjZmUsIDB4MTAzMjU0NzYsXG5cdCAgICAgICAgICAgICAgICAweGMzZDJlMWYwXG5cdCAgICAgICAgICAgIF0pO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICBfZG9Qcm9jZXNzQmxvY2s6IGZ1bmN0aW9uIChNLCBvZmZzZXQpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRcblx0ICAgICAgICAgICAgdmFyIEggPSB0aGlzLl9oYXNoLndvcmRzO1xuXG5cdCAgICAgICAgICAgIC8vIFdvcmtpbmcgdmFyaWFibGVzXG5cdCAgICAgICAgICAgIHZhciBhID0gSFswXTtcblx0ICAgICAgICAgICAgdmFyIGIgPSBIWzFdO1xuXHQgICAgICAgICAgICB2YXIgYyA9IEhbMl07XG5cdCAgICAgICAgICAgIHZhciBkID0gSFszXTtcblx0ICAgICAgICAgICAgdmFyIGUgPSBIWzRdO1xuXG5cdCAgICAgICAgICAgIC8vIENvbXB1dGF0aW9uXG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgODA7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgaWYgKGkgPCAxNikge1xuXHQgICAgICAgICAgICAgICAgICAgIFdbaV0gPSBNW29mZnNldCArIGldIHwgMDtcblx0ICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSBXW2kgLSAzXSBeIFdbaSAtIDhdIF4gV1tpIC0gMTRdIF4gV1tpIC0gMTZdO1xuXHQgICAgICAgICAgICAgICAgICAgIFdbaV0gPSAobiA8PCAxKSB8IChuID4+PiAzMSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIHZhciB0ID0gKChhIDw8IDUpIHwgKGEgPj4+IDI3KSkgKyBlICsgV1tpXTtcblx0ICAgICAgICAgICAgICAgIGlmIChpIDwgMjApIHtcblx0ICAgICAgICAgICAgICAgICAgICB0ICs9ICgoYiAmIGMpIHwgKH5iICYgZCkpICsgMHg1YTgyNzk5OTtcblx0ICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA8IDQwKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdCArPSAoYiBeIGMgXiBkKSArIDB4NmVkOWViYTE7XG5cdCAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPCA2MCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHQgKz0gKChiICYgYykgfCAoYiAmIGQpIHwgKGMgJiBkKSkgLSAweDcwZTQ0MzI0O1xuXHQgICAgICAgICAgICAgICAgfSBlbHNlIC8qIGlmIChpIDwgODApICovIHtcblx0ICAgICAgICAgICAgICAgICAgICB0ICs9IChiIF4gYyBeIGQpIC0gMHgzNTlkM2UyYTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgZSA9IGQ7XG5cdCAgICAgICAgICAgICAgICBkID0gYztcblx0ICAgICAgICAgICAgICAgIGMgPSAoYiA8PCAzMCkgfCAoYiA+Pj4gMik7XG5cdCAgICAgICAgICAgICAgICBiID0gYTtcblx0ICAgICAgICAgICAgICAgIGEgPSB0O1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gSW50ZXJtZWRpYXRlIGhhc2ggdmFsdWVcblx0ICAgICAgICAgICAgSFswXSA9IChIWzBdICsgYSkgfCAwO1xuXHQgICAgICAgICAgICBIWzFdID0gKEhbMV0gKyBiKSB8IDA7XG5cdCAgICAgICAgICAgIEhbMl0gPSAoSFsyXSArIGMpIHwgMDtcblx0ICAgICAgICAgICAgSFszXSA9IChIWzNdICsgZCkgfCAwO1xuXHQgICAgICAgICAgICBIWzRdID0gKEhbNF0gKyBlKSB8IDA7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIF9kb0ZpbmFsaXplOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuX2RhdGE7XG5cdCAgICAgICAgICAgIHZhciBkYXRhV29yZHMgPSBkYXRhLndvcmRzO1xuXG5cdCAgICAgICAgICAgIHZhciBuQml0c1RvdGFsID0gdGhpcy5fbkRhdGFCeXRlcyAqIDg7XG5cdCAgICAgICAgICAgIHZhciBuQml0c0xlZnQgPSBkYXRhLnNpZ0J5dGVzICogODtcblxuXHQgICAgICAgICAgICAvLyBBZGQgcGFkZGluZ1xuXHQgICAgICAgICAgICBkYXRhV29yZHNbbkJpdHNMZWZ0ID4+PiA1XSB8PSAweDgwIDw8ICgyNCAtIG5CaXRzTGVmdCAlIDMyKTtcblx0ICAgICAgICAgICAgZGF0YVdvcmRzWygoKG5CaXRzTGVmdCArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNF0gPSBNYXRoLmZsb29yKG5CaXRzVG90YWwgLyAweDEwMDAwMDAwMCk7XG5cdCAgICAgICAgICAgIGRhdGFXb3Jkc1soKChuQml0c0xlZnQgKyA2NCkgPj4+IDkpIDw8IDQpICsgMTVdID0gbkJpdHNUb3RhbDtcblx0ICAgICAgICAgICAgZGF0YS5zaWdCeXRlcyA9IGRhdGFXb3Jkcy5sZW5ndGggKiA0O1xuXG5cdCAgICAgICAgICAgIC8vIEhhc2ggZmluYWwgYmxvY2tzXG5cdCAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3MoKTtcblxuXHQgICAgICAgICAgICAvLyBSZXR1cm4gZmluYWwgY29tcHV0ZWQgaGFzaFxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5faGFzaDtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgdmFyIGNsb25lID0gSGFzaGVyLmNsb25lLmNhbGwodGhpcyk7XG5cdCAgICAgICAgICAgIGNsb25lLl9oYXNoID0gdGhpcy5faGFzaC5jbG9uZSgpO1xuXG5cdCAgICAgICAgICAgIHJldHVybiBjbG9uZTtcblx0ICAgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBTaG9ydGN1dCBmdW5jdGlvbiB0byB0aGUgaGFzaGVyJ3Mgb2JqZWN0IGludGVyZmFjZS5cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gaGFzaC5cblx0ICAgICAqXG5cdCAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBoYXNoLlxuXHQgICAgICpcblx0ICAgICAqIEBzdGF0aWNcblx0ICAgICAqXG5cdCAgICAgKiBAZXhhbXBsZVxuXHQgICAgICpcblx0ICAgICAqICAgICB2YXIgaGFzaCA9IENyeXB0b0pTLlNIQTEoJ21lc3NhZ2UnKTtcblx0ICAgICAqICAgICB2YXIgaGFzaCA9IENyeXB0b0pTLlNIQTEod29yZEFycmF5KTtcblx0ICAgICAqL1xuXHQgICAgQy5TSEExID0gSGFzaGVyLl9jcmVhdGVIZWxwZXIoU0hBMSk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogU2hvcnRjdXQgZnVuY3Rpb24gdG8gdGhlIEhNQUMncyBvYmplY3QgaW50ZXJmYWNlLlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBoYXNoLlxuXHQgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBrZXkgVGhlIHNlY3JldCBrZXkuXG5cdCAgICAgKlxuXHQgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgSE1BQy5cblx0ICAgICAqXG5cdCAgICAgKiBAc3RhdGljXG5cdCAgICAgKlxuXHQgICAgICogQGV4YW1wbGVcblx0ICAgICAqXG5cdCAgICAgKiAgICAgdmFyIGhtYWMgPSBDcnlwdG9KUy5IbWFjU0hBMShtZXNzYWdlLCBrZXkpO1xuXHQgICAgICovXG5cdCAgICBDLkhtYWNTSEExID0gSGFzaGVyLl9jcmVhdGVIbWFjSGVscGVyKFNIQTEpO1xuXHR9KCkpO1xuXG5cblx0cmV0dXJuIENyeXB0b0pTLlNIQTE7XG5cbn0pKTsiLCIvLyAgICAgdXVpZC5qc1xuLy9cbi8vICAgICBDb3B5cmlnaHQgKGMpIDIwMTAtMjAxMiBSb2JlcnQgS2llZmZlclxuLy8gICAgIE1JVCBMaWNlbnNlIC0gaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBfZ2xvYmFsID0gdGhpcztcblxuICAvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgV2UgZmVhdHVyZVxuICAvLyBkZXRlY3QgdG8gZGV0ZXJtaW5lIHRoZSBiZXN0IFJORyBzb3VyY2UsIG5vcm1hbGl6aW5nIHRvIGEgZnVuY3Rpb24gdGhhdFxuICAvLyByZXR1cm5zIDEyOC1iaXRzIG9mIHJhbmRvbW5lc3MsIHNpbmNlIHRoYXQncyB3aGF0J3MgdXN1YWxseSByZXF1aXJlZFxuICB2YXIgX3JuZztcblxuICAvLyBOb2RlLmpzIGNyeXB0by1iYXNlZCBSTkcgLSBodHRwOi8vbm9kZWpzLm9yZy9kb2NzL3YwLjYuMi9hcGkvY3J5cHRvLmh0bWxcbiAgLy9cbiAgLy8gTW9kZXJhdGVseSBmYXN0LCBoaWdoIHF1YWxpdHlcbiAgaWYgKHR5cGVvZihfZ2xvYmFsLnJlcXVpcmUpID09ICdmdW5jdGlvbicpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIF9yYiA9IF9nbG9iYWwucmVxdWlyZSgnY3J5cHRvJykucmFuZG9tQnl0ZXM7XG4gICAgICBfcm5nID0gX3JiICYmIGZ1bmN0aW9uKCkge3JldHVybiBfcmIoMTYpO307XG4gICAgfSBjYXRjaChlKSB7fVxuICB9XG5cbiAgaWYgKCFfcm5nICYmIF9nbG9iYWwuY3J5cHRvICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBXSEFUV0cgY3J5cHRvLWJhc2VkIFJORyAtIGh0dHA6Ly93aWtpLndoYXR3Zy5vcmcvd2lraS9DcnlwdG9cbiAgICAvL1xuICAgIC8vIE1vZGVyYXRlbHkgZmFzdCwgaGlnaCBxdWFsaXR5XG4gICAgdmFyIF9ybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgICBfcm5nID0gZnVuY3Rpb24gd2hhdHdnUk5HKCkge1xuICAgICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhfcm5kczgpO1xuICAgICAgcmV0dXJuIF9ybmRzODtcbiAgICB9O1xuICB9XG5cbiAgaWYgKCFfcm5nKSB7XG4gICAgLy8gTWF0aC5yYW5kb20oKS1iYXNlZCAoUk5HKVxuICAgIC8vXG4gICAgLy8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBNYXRoLnJhbmRvbSgpLiAgSXQncyBmYXN0LCBidXQgaXMgb2YgdW5zcGVjaWZpZWRcbiAgICAvLyBxdWFsaXR5LlxuICAgIHZhciAgX3JuZHMgPSBuZXcgQXJyYXkoMTYpO1xuICAgIF9ybmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgMTY7IGkrKykge1xuICAgICAgICBpZiAoKGkgJiAweDAzKSA9PT0gMCkgciA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMDtcbiAgICAgICAgX3JuZHNbaV0gPSByID4+PiAoKGkgJiAweDAzKSA8PCAzKSAmIDB4ZmY7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfcm5kcztcbiAgICB9O1xuICB9XG5cbiAgLy8gQnVmZmVyIGNsYXNzIHRvIHVzZVxuICB2YXIgQnVmZmVyQ2xhc3MgPSB0eXBlb2YoX2dsb2JhbC5CdWZmZXIpID09ICdmdW5jdGlvbicgPyBfZ2xvYmFsLkJ1ZmZlciA6IEFycmF5O1xuXG4gIC8vIE1hcHMgZm9yIG51bWJlciA8LT4gaGV4IHN0cmluZyBjb252ZXJzaW9uXG4gIHZhciBfYnl0ZVRvSGV4ID0gW107XG4gIHZhciBfaGV4VG9CeXRlID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICBfYnl0ZVRvSGV4W2ldID0gKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKTtcbiAgICBfaGV4VG9CeXRlW19ieXRlVG9IZXhbaV1dID0gaTtcbiAgfVxuXG4gIC8vICoqYHBhcnNlKClgIC0gUGFyc2UgYSBVVUlEIGludG8gaXQncyBjb21wb25lbnQgYnl0ZXMqKlxuICBmdW5jdGlvbiBwYXJzZShzLCBidWYsIG9mZnNldCkge1xuICAgIHZhciBpID0gKGJ1ZiAmJiBvZmZzZXQpIHx8IDAsIGlpID0gMDtcblxuICAgIGJ1ZiA9IGJ1ZiB8fCBbXTtcbiAgICBzLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWzAtOWEtZl17Mn0vZywgZnVuY3Rpb24ob2N0KSB7XG4gICAgICBpZiAoaWkgPCAxNikgeyAvLyBEb24ndCBvdmVyZmxvdyFcbiAgICAgICAgYnVmW2kgKyBpaSsrXSA9IF9oZXhUb0J5dGVbb2N0XTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFplcm8gb3V0IHJlbWFpbmluZyBieXRlcyBpZiBzdHJpbmcgd2FzIHNob3J0XG4gICAgd2hpbGUgKGlpIDwgMTYpIHtcbiAgICAgIGJ1ZltpICsgaWkrK10gPSAwO1xuICAgIH1cblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICAvLyAqKmB1bnBhcnNlKClgIC0gQ29udmVydCBVVUlEIGJ5dGUgYXJyYXkgKGFsYSBwYXJzZSgpKSBpbnRvIGEgc3RyaW5nKipcbiAgZnVuY3Rpb24gdW5wYXJzZShidWYsIG9mZnNldCkge1xuICAgIHZhciBpID0gb2Zmc2V0IHx8IDAsIGJ0aCA9IF9ieXRlVG9IZXg7XG4gICAgcmV0dXJuICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXTtcbiAgfVxuXG4gIC8vICoqYHYxKClgIC0gR2VuZXJhdGUgdGltZS1iYXNlZCBVVUlEKipcbiAgLy9cbiAgLy8gSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL0xpb3NLL1VVSUQuanNcbiAgLy8gYW5kIGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS91dWlkLmh0bWxcblxuICAvLyByYW5kb20gIydzIHdlIG5lZWQgdG8gaW5pdCBub2RlIGFuZCBjbG9ja3NlcVxuICB2YXIgX3NlZWRCeXRlcyA9IF9ybmcoKTtcblxuICAvLyBQZXIgNC41LCBjcmVhdGUgYW5kIDQ4LWJpdCBub2RlIGlkLCAoNDcgcmFuZG9tIGJpdHMgKyBtdWx0aWNhc3QgYml0ID0gMSlcbiAgdmFyIF9ub2RlSWQgPSBbXG4gICAgX3NlZWRCeXRlc1swXSB8IDB4MDEsXG4gICAgX3NlZWRCeXRlc1sxXSwgX3NlZWRCeXRlc1syXSwgX3NlZWRCeXRlc1szXSwgX3NlZWRCeXRlc1s0XSwgX3NlZWRCeXRlc1s1XVxuICBdO1xuXG4gIC8vIFBlciA0LjIuMiwgcmFuZG9taXplICgxNCBiaXQpIGNsb2Nrc2VxXG4gIHZhciBfY2xvY2tzZXEgPSAoX3NlZWRCeXRlc1s2XSA8PCA4IHwgX3NlZWRCeXRlc1s3XSkgJiAweDNmZmY7XG5cbiAgLy8gUHJldmlvdXMgdXVpZCBjcmVhdGlvbiB0aW1lXG4gIHZhciBfbGFzdE1TZWNzID0gMCwgX2xhc3ROU2VjcyA9IDA7XG5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9icm9vZmEvbm9kZS11dWlkIGZvciBBUEkgZGV0YWlsc1xuICBmdW5jdGlvbiB2MShvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICAgIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuICAgIHZhciBiID0gYnVmIHx8IFtdO1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB2YXIgY2xvY2tzZXEgPSBvcHRpb25zLmNsb2Nrc2VxICE9IG51bGwgPyBvcHRpb25zLmNsb2Nrc2VxIDogX2Nsb2Nrc2VxO1xuXG4gICAgLy8gVVVJRCB0aW1lc3RhbXBzIGFyZSAxMDAgbmFuby1zZWNvbmQgdW5pdHMgc2luY2UgdGhlIEdyZWdvcmlhbiBlcG9jaCxcbiAgICAvLyAoMTU4Mi0xMC0xNSAwMDowMCkuICBKU051bWJlcnMgYXJlbid0IHByZWNpc2UgZW5vdWdoIGZvciB0aGlzLCBzb1xuICAgIC8vIHRpbWUgaXMgaGFuZGxlZCBpbnRlcm5hbGx5IGFzICdtc2VjcycgKGludGVnZXIgbWlsbGlzZWNvbmRzKSBhbmQgJ25zZWNzJ1xuICAgIC8vICgxMDAtbmFub3NlY29uZHMgb2Zmc2V0IGZyb20gbXNlY3MpIHNpbmNlIHVuaXggZXBvY2gsIDE5NzAtMDEtMDEgMDA6MDAuXG4gICAgdmFyIG1zZWNzID0gb3B0aW9ucy5tc2VjcyAhPSBudWxsID8gb3B0aW9ucy5tc2VjcyA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgLy8gUGVyIDQuMi4xLjIsIHVzZSBjb3VudCBvZiB1dWlkJ3MgZ2VuZXJhdGVkIGR1cmluZyB0aGUgY3VycmVudCBjbG9ja1xuICAgIC8vIGN5Y2xlIHRvIHNpbXVsYXRlIGhpZ2hlciByZXNvbHV0aW9uIGNsb2NrXG4gICAgdmFyIG5zZWNzID0gb3B0aW9ucy5uc2VjcyAhPSBudWxsID8gb3B0aW9ucy5uc2VjcyA6IF9sYXN0TlNlY3MgKyAxO1xuXG4gICAgLy8gVGltZSBzaW5jZSBsYXN0IHV1aWQgY3JlYXRpb24gKGluIG1zZWNzKVxuICAgIHZhciBkdCA9IChtc2VjcyAtIF9sYXN0TVNlY3MpICsgKG5zZWNzIC0gX2xhc3ROU2VjcykvMTAwMDA7XG5cbiAgICAvLyBQZXIgNC4yLjEuMiwgQnVtcCBjbG9ja3NlcSBvbiBjbG9jayByZWdyZXNzaW9uXG4gICAgaWYgKGR0IDwgMCAmJiBvcHRpb25zLmNsb2Nrc2VxID09IG51bGwpIHtcbiAgICAgIGNsb2Nrc2VxID0gY2xvY2tzZXEgKyAxICYgMHgzZmZmO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IG5zZWNzIGlmIGNsb2NrIHJlZ3Jlc3NlcyAobmV3IGNsb2Nrc2VxKSBvciB3ZSd2ZSBtb3ZlZCBvbnRvIGEgbmV3XG4gICAgLy8gdGltZSBpbnRlcnZhbFxuICAgIGlmICgoZHQgPCAwIHx8IG1zZWNzID4gX2xhc3RNU2VjcykgJiYgb3B0aW9ucy5uc2VjcyA9PSBudWxsKSB7XG4gICAgICBuc2VjcyA9IDA7XG4gICAgfVxuXG4gICAgLy8gUGVyIDQuMi4xLjIgVGhyb3cgZXJyb3IgaWYgdG9vIG1hbnkgdXVpZHMgYXJlIHJlcXVlc3RlZFxuICAgIGlmIChuc2VjcyA+PSAxMDAwMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1dWlkLnYxKCk6IENhblxcJ3QgY3JlYXRlIG1vcmUgdGhhbiAxME0gdXVpZHMvc2VjJyk7XG4gICAgfVxuXG4gICAgX2xhc3RNU2VjcyA9IG1zZWNzO1xuICAgIF9sYXN0TlNlY3MgPSBuc2VjcztcbiAgICBfY2xvY2tzZXEgPSBjbG9ja3NlcTtcblxuICAgIC8vIFBlciA0LjEuNCAtIENvbnZlcnQgZnJvbSB1bml4IGVwb2NoIHRvIEdyZWdvcmlhbiBlcG9jaFxuICAgIG1zZWNzICs9IDEyMjE5MjkyODAwMDAwO1xuXG4gICAgLy8gYHRpbWVfbG93YFxuICAgIHZhciB0bCA9ICgobXNlY3MgJiAweGZmZmZmZmYpICogMTAwMDAgKyBuc2VjcykgJSAweDEwMDAwMDAwMDtcbiAgICBiW2krK10gPSB0bCA+Pj4gMjQgJiAweGZmO1xuICAgIGJbaSsrXSA9IHRsID4+PiAxNiAmIDB4ZmY7XG4gICAgYltpKytdID0gdGwgPj4+IDggJiAweGZmO1xuICAgIGJbaSsrXSA9IHRsICYgMHhmZjtcblxuICAgIC8vIGB0aW1lX21pZGBcbiAgICB2YXIgdG1oID0gKG1zZWNzIC8gMHgxMDAwMDAwMDAgKiAxMDAwMCkgJiAweGZmZmZmZmY7XG4gICAgYltpKytdID0gdG1oID4+PiA4ICYgMHhmZjtcbiAgICBiW2krK10gPSB0bWggJiAweGZmO1xuXG4gICAgLy8gYHRpbWVfaGlnaF9hbmRfdmVyc2lvbmBcbiAgICBiW2krK10gPSB0bWggPj4+IDI0ICYgMHhmIHwgMHgxMDsgLy8gaW5jbHVkZSB2ZXJzaW9uXG4gICAgYltpKytdID0gdG1oID4+PiAxNiAmIDB4ZmY7XG5cbiAgICAvLyBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGAgKFBlciA0LjIuMiAtIGluY2x1ZGUgdmFyaWFudClcbiAgICBiW2krK10gPSBjbG9ja3NlcSA+Pj4gOCB8IDB4ODA7XG5cbiAgICAvLyBgY2xvY2tfc2VxX2xvd2BcbiAgICBiW2krK10gPSBjbG9ja3NlcSAmIDB4ZmY7XG5cbiAgICAvLyBgbm9kZWBcbiAgICB2YXIgbm9kZSA9IG9wdGlvbnMubm9kZSB8fCBfbm9kZUlkO1xuICAgIGZvciAodmFyIG4gPSAwOyBuIDwgNjsgbisrKSB7XG4gICAgICBiW2kgKyBuXSA9IG5vZGVbbl07XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZiA/IGJ1ZiA6IHVucGFyc2UoYik7XG4gIH1cblxuICAvLyAqKmB2NCgpYCAtIEdlbmVyYXRlIHJhbmRvbSBVVUlEKipcblxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWQgZm9yIEFQSSBkZXRhaWxzXG4gIGZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgLy8gRGVwcmVjYXRlZCAtICdmb3JtYXQnIGFyZ3VtZW50LCBhcyBzdXBwb3J0ZWQgaW4gdjEuMlxuICAgIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuXG4gICAgaWYgKHR5cGVvZihvcHRpb25zKSA9PSAnc3RyaW5nJykge1xuICAgICAgYnVmID0gb3B0aW9ucyA9PSAnYmluYXJ5JyA/IG5ldyBCdWZmZXJDbGFzcygxNikgOiBudWxsO1xuICAgICAgb3B0aW9ucyA9IG51bGw7XG4gICAgfVxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgX3JuZykoKTtcblxuICAgIC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcbiAgICBybmRzWzZdID0gKHJuZHNbNl0gJiAweDBmKSB8IDB4NDA7XG4gICAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuXG4gICAgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG4gICAgaWYgKGJ1Zikge1xuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IDE2OyBpaSsrKSB7XG4gICAgICAgIGJ1ZltpICsgaWldID0gcm5kc1tpaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZiB8fCB1bnBhcnNlKHJuZHMpO1xuICB9XG5cbiAgLy8gRXhwb3J0IHB1YmxpYyBBUElcbiAgdmFyIHV1aWQgPSB2NDtcbiAgdXVpZC52MSA9IHYxO1xuICB1dWlkLnY0ID0gdjQ7XG4gIHV1aWQucGFyc2UgPSBwYXJzZTtcbiAgdXVpZC51bnBhcnNlID0gdW5wYXJzZTtcbiAgdXVpZC5CdWZmZXJDbGFzcyA9IEJ1ZmZlckNsYXNzO1xuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBQdWJsaXNoIGFzIEFNRCBtb2R1bGVcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7cmV0dXJuIHV1aWQ7fSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mKG1vZHVsZSkgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAvLyBQdWJsaXNoIGFzIG5vZGUuanMgbW9kdWxlXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB1dWlkO1xuICB9IGVsc2Uge1xuICAgIC8vIFB1Ymxpc2ggYXMgZ2xvYmFsIChpbiBicm93c2VycylcbiAgICB2YXIgX3ByZXZpb3VzUm9vdCA9IF9nbG9iYWwudXVpZDtcblxuICAgIC8vICoqYG5vQ29uZmxpY3QoKWAgLSAoYnJvd3NlciBvbmx5KSB0byByZXNldCBnbG9iYWwgJ3V1aWQnIHZhcioqXG4gICAgdXVpZC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBfZ2xvYmFsLnV1aWQgPSBfcHJldmlvdXNSb290O1xuICAgICAgcmV0dXJuIHV1aWQ7XG4gICAgfTtcblxuICAgIF9nbG9iYWwudXVpZCA9IHV1aWQ7XG4gIH1cbn0pLmNhbGwodGhpcyk7XG4iLCJ2YXIgZW5naW5lID0gcmVxdWlyZSgnLi4vc3JjL3N0b3JlLWVuZ2luZScpXG5cbnZhciBzdG9yYWdlcyA9IHJlcXVpcmUoJy4uL3N0b3JhZ2VzL2FsbCcpXG52YXIgcGx1Z2lucyA9IFtyZXF1aXJlKCcuLi9wbHVnaW5zL2pzb24yJyldXG5cbm1vZHVsZS5leHBvcnRzID0gZW5naW5lLmNyZWF0ZVN0b3JlKHN0b3JhZ2VzLCBwbHVnaW5zKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBqc29uMlBsdWdpblxuXG5mdW5jdGlvbiBqc29uMlBsdWdpbigpIHtcblx0cmVxdWlyZSgnLi9saWIvanNvbjInKVxuXHRyZXR1cm4ge31cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlICovXG5cbi8vICBqc29uMi5qc1xuLy8gIDIwMTYtMTAtMjhcbi8vICBQdWJsaWMgRG9tYWluLlxuLy8gIE5PIFdBUlJBTlRZIEVYUFJFU1NFRCBPUiBJTVBMSUVELiBVU0UgQVQgWU9VUiBPV04gUklTSy5cbi8vICBTZWUgaHR0cDovL3d3dy5KU09OLm9yZy9qcy5odG1sXG4vLyAgVGhpcyBjb2RlIHNob3VsZCBiZSBtaW5pZmllZCBiZWZvcmUgZGVwbG95bWVudC5cbi8vICBTZWUgaHR0cDovL2phdmFzY3JpcHQuY3JvY2tmb3JkLmNvbS9qc21pbi5odG1sXG5cbi8vICBVU0UgWU9VUiBPV04gQ09QWS4gSVQgSVMgRVhUUkVNRUxZIFVOV0lTRSBUTyBMT0FEIENPREUgRlJPTSBTRVJWRVJTIFlPVSBET1xuLy8gIE5PVCBDT05UUk9MLlxuXG4vLyAgVGhpcyBmaWxlIGNyZWF0ZXMgYSBnbG9iYWwgSlNPTiBvYmplY3QgY29udGFpbmluZyB0d28gbWV0aG9kczogc3RyaW5naWZ5XG4vLyAgYW5kIHBhcnNlLiBUaGlzIGZpbGUgcHJvdmlkZXMgdGhlIEVTNSBKU09OIGNhcGFiaWxpdHkgdG8gRVMzIHN5c3RlbXMuXG4vLyAgSWYgYSBwcm9qZWN0IG1pZ2h0IHJ1biBvbiBJRTggb3IgZWFybGllciwgdGhlbiB0aGlzIGZpbGUgc2hvdWxkIGJlIGluY2x1ZGVkLlxuLy8gIFRoaXMgZmlsZSBkb2VzIG5vdGhpbmcgb24gRVM1IHN5c3RlbXMuXG5cbi8vICAgICAgSlNPTi5zdHJpbmdpZnkodmFsdWUsIHJlcGxhY2VyLCBzcGFjZSlcbi8vICAgICAgICAgIHZhbHVlICAgICAgIGFueSBKYXZhU2NyaXB0IHZhbHVlLCB1c3VhbGx5IGFuIG9iamVjdCBvciBhcnJheS5cbi8vICAgICAgICAgIHJlcGxhY2VyICAgIGFuIG9wdGlvbmFsIHBhcmFtZXRlciB0aGF0IGRldGVybWluZXMgaG93IG9iamVjdFxuLy8gICAgICAgICAgICAgICAgICAgICAgdmFsdWVzIGFyZSBzdHJpbmdpZmllZCBmb3Igb2JqZWN0cy4gSXQgY2FuIGJlIGFcbi8vICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9yIGFuIGFycmF5IG9mIHN0cmluZ3MuXG4vLyAgICAgICAgICBzcGFjZSAgICAgICBhbiBvcHRpb25hbCBwYXJhbWV0ZXIgdGhhdCBzcGVjaWZpZXMgdGhlIGluZGVudGF0aW9uXG4vLyAgICAgICAgICAgICAgICAgICAgICBvZiBuZXN0ZWQgc3RydWN0dXJlcy4gSWYgaXQgaXMgb21pdHRlZCwgdGhlIHRleHQgd2lsbFxuLy8gICAgICAgICAgICAgICAgICAgICAgYmUgcGFja2VkIHdpdGhvdXQgZXh0cmEgd2hpdGVzcGFjZS4gSWYgaXQgaXMgYSBudW1iZXIsXG4vLyAgICAgICAgICAgICAgICAgICAgICBpdCB3aWxsIHNwZWNpZnkgdGhlIG51bWJlciBvZiBzcGFjZXMgdG8gaW5kZW50IGF0IGVhY2hcbi8vICAgICAgICAgICAgICAgICAgICAgIGxldmVsLiBJZiBpdCBpcyBhIHN0cmluZyAoc3VjaCBhcyBcIlxcdFwiIG9yIFwiJm5ic3A7XCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgaXQgY29udGFpbnMgdGhlIGNoYXJhY3RlcnMgdXNlZCB0byBpbmRlbnQgYXQgZWFjaCBsZXZlbC5cbi8vICAgICAgICAgIFRoaXMgbWV0aG9kIHByb2R1Y2VzIGEgSlNPTiB0ZXh0IGZyb20gYSBKYXZhU2NyaXB0IHZhbHVlLlxuLy8gICAgICAgICAgV2hlbiBhbiBvYmplY3QgdmFsdWUgaXMgZm91bmQsIGlmIHRoZSBvYmplY3QgY29udGFpbnMgYSB0b0pTT05cbi8vICAgICAgICAgIG1ldGhvZCwgaXRzIHRvSlNPTiBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgYW5kIHRoZSByZXN1bHQgd2lsbCBiZVxuLy8gICAgICAgICAgc3RyaW5naWZpZWQuIEEgdG9KU09OIG1ldGhvZCBkb2VzIG5vdCBzZXJpYWxpemU6IGl0IHJldHVybnMgdGhlXG4vLyAgICAgICAgICB2YWx1ZSByZXByZXNlbnRlZCBieSB0aGUgbmFtZS92YWx1ZSBwYWlyIHRoYXQgc2hvdWxkIGJlIHNlcmlhbGl6ZWQsXG4vLyAgICAgICAgICBvciB1bmRlZmluZWQgaWYgbm90aGluZyBzaG91bGQgYmUgc2VyaWFsaXplZC4gVGhlIHRvSlNPTiBtZXRob2Rcbi8vICAgICAgICAgIHdpbGwgYmUgcGFzc2VkIHRoZSBrZXkgYXNzb2NpYXRlZCB3aXRoIHRoZSB2YWx1ZSwgYW5kIHRoaXMgd2lsbCBiZVxuLy8gICAgICAgICAgYm91bmQgdG8gdGhlIHZhbHVlLlxuXG4vLyAgICAgICAgICBGb3IgZXhhbXBsZSwgdGhpcyB3b3VsZCBzZXJpYWxpemUgRGF0ZXMgYXMgSVNPIHN0cmluZ3MuXG5cbi8vICAgICAgICAgICAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGYobikge1xuLy8gICAgICAgICAgICAgICAgICAgICAgLy8gRm9ybWF0IGludGVnZXJzIHRvIGhhdmUgYXQgbGVhc3QgdHdvIGRpZ2l0cy5cbi8vICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAobiA8IDEwKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgID8gXCIwXCIgKyBuXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuO1xuLy8gICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFVUQ0Z1bGxZZWFyKCkgICArIFwiLVwiICtcbi8vICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDTW9udGgoKSArIDEpICsgXCItXCIgK1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENEYXRlKCkpICAgICAgKyBcIlRcIiArXG4vLyAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ0hvdXJzKCkpICAgICArIFwiOlwiICtcbi8vICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDTWludXRlcygpKSAgICsgXCI6XCIgK1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENTZWNvbmRzKCkpICAgKyBcIlpcIjtcbi8vICAgICAgICAgICAgICB9O1xuXG4vLyAgICAgICAgICBZb3UgY2FuIHByb3ZpZGUgYW4gb3B0aW9uYWwgcmVwbGFjZXIgbWV0aG9kLiBJdCB3aWxsIGJlIHBhc3NlZCB0aGVcbi8vICAgICAgICAgIGtleSBhbmQgdmFsdWUgb2YgZWFjaCBtZW1iZXIsIHdpdGggdGhpcyBib3VuZCB0byB0aGUgY29udGFpbmluZ1xuLy8gICAgICAgICAgb2JqZWN0LiBUaGUgdmFsdWUgdGhhdCBpcyByZXR1cm5lZCBmcm9tIHlvdXIgbWV0aG9kIHdpbGwgYmVcbi8vICAgICAgICAgIHNlcmlhbGl6ZWQuIElmIHlvdXIgbWV0aG9kIHJldHVybnMgdW5kZWZpbmVkLCB0aGVuIHRoZSBtZW1iZXIgd2lsbFxuLy8gICAgICAgICAgYmUgZXhjbHVkZWQgZnJvbSB0aGUgc2VyaWFsaXphdGlvbi5cblxuLy8gICAgICAgICAgSWYgdGhlIHJlcGxhY2VyIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiBzdHJpbmdzLCB0aGVuIGl0IHdpbGwgYmVcbi8vICAgICAgICAgIHVzZWQgdG8gc2VsZWN0IHRoZSBtZW1iZXJzIHRvIGJlIHNlcmlhbGl6ZWQuIEl0IGZpbHRlcnMgdGhlIHJlc3VsdHNcbi8vICAgICAgICAgIHN1Y2ggdGhhdCBvbmx5IG1lbWJlcnMgd2l0aCBrZXlzIGxpc3RlZCBpbiB0aGUgcmVwbGFjZXIgYXJyYXkgYXJlXG4vLyAgICAgICAgICBzdHJpbmdpZmllZC5cblxuLy8gICAgICAgICAgVmFsdWVzIHRoYXQgZG8gbm90IGhhdmUgSlNPTiByZXByZXNlbnRhdGlvbnMsIHN1Y2ggYXMgdW5kZWZpbmVkIG9yXG4vLyAgICAgICAgICBmdW5jdGlvbnMsIHdpbGwgbm90IGJlIHNlcmlhbGl6ZWQuIFN1Y2ggdmFsdWVzIGluIG9iamVjdHMgd2lsbCBiZVxuLy8gICAgICAgICAgZHJvcHBlZDsgaW4gYXJyYXlzIHRoZXkgd2lsbCBiZSByZXBsYWNlZCB3aXRoIG51bGwuIFlvdSBjYW4gdXNlXG4vLyAgICAgICAgICBhIHJlcGxhY2VyIGZ1bmN0aW9uIHRvIHJlcGxhY2UgdGhvc2Ugd2l0aCBKU09OIHZhbHVlcy5cblxuLy8gICAgICAgICAgSlNPTi5zdHJpbmdpZnkodW5kZWZpbmVkKSByZXR1cm5zIHVuZGVmaW5lZC5cblxuLy8gICAgICAgICAgVGhlIG9wdGlvbmFsIHNwYWNlIHBhcmFtZXRlciBwcm9kdWNlcyBhIHN0cmluZ2lmaWNhdGlvbiBvZiB0aGVcbi8vICAgICAgICAgIHZhbHVlIHRoYXQgaXMgZmlsbGVkIHdpdGggbGluZSBicmVha3MgYW5kIGluZGVudGF0aW9uIHRvIG1ha2UgaXRcbi8vICAgICAgICAgIGVhc2llciB0byByZWFkLlxuXG4vLyAgICAgICAgICBJZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGlzIGEgbm9uLWVtcHR5IHN0cmluZywgdGhlbiB0aGF0IHN0cmluZyB3aWxsXG4vLyAgICAgICAgICBiZSB1c2VkIGZvciBpbmRlbnRhdGlvbi4gSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIG51bWJlciwgdGhlblxuLy8gICAgICAgICAgdGhlIGluZGVudGF0aW9uIHdpbGwgYmUgdGhhdCBtYW55IHNwYWNlcy5cblxuLy8gICAgICAgICAgRXhhbXBsZTpcblxuLy8gICAgICAgICAgdGV4dCA9IEpTT04uc3RyaW5naWZ5KFtcImVcIiwge3BsdXJpYnVzOiBcInVudW1cIn1dKTtcbi8vICAgICAgICAgIC8vIHRleHQgaXMgJ1tcImVcIix7XCJwbHVyaWJ1c1wiOlwidW51bVwifV0nXG5cbi8vICAgICAgICAgIHRleHQgPSBKU09OLnN0cmluZ2lmeShbXCJlXCIsIHtwbHVyaWJ1czogXCJ1bnVtXCJ9XSwgbnVsbCwgXCJcXHRcIik7XG4vLyAgICAgICAgICAvLyB0ZXh0IGlzICdbXFxuXFx0XCJlXCIsXFxuXFx0e1xcblxcdFxcdFwicGx1cmlidXNcIjogXCJ1bnVtXCJcXG5cXHR9XFxuXSdcblxuLy8gICAgICAgICAgdGV4dCA9IEpTT04uc3RyaW5naWZ5KFtuZXcgRGF0ZSgpXSwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbi8vICAgICAgICAgICAgICByZXR1cm4gdGhpc1trZXldIGluc3RhbmNlb2YgRGF0ZVxuLy8gICAgICAgICAgICAgICAgICA/IFwiRGF0ZShcIiArIHRoaXNba2V5XSArIFwiKVwiXG4vLyAgICAgICAgICAgICAgICAgIDogdmFsdWU7XG4vLyAgICAgICAgICB9KTtcbi8vICAgICAgICAgIC8vIHRleHQgaXMgJ1tcIkRhdGUoLS0tY3VycmVudCB0aW1lLS0tKVwiXSdcblxuLy8gICAgICBKU09OLnBhcnNlKHRleHQsIHJldml2ZXIpXG4vLyAgICAgICAgICBUaGlzIG1ldGhvZCBwYXJzZXMgYSBKU09OIHRleHQgdG8gcHJvZHVjZSBhbiBvYmplY3Qgb3IgYXJyYXkuXG4vLyAgICAgICAgICBJdCBjYW4gdGhyb3cgYSBTeW50YXhFcnJvciBleGNlcHRpb24uXG5cbi8vICAgICAgICAgIFRoZSBvcHRpb25hbCByZXZpdmVyIHBhcmFtZXRlciBpcyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGZpbHRlciBhbmRcbi8vICAgICAgICAgIHRyYW5zZm9ybSB0aGUgcmVzdWx0cy4gSXQgcmVjZWl2ZXMgZWFjaCBvZiB0aGUga2V5cyBhbmQgdmFsdWVzLFxuLy8gICAgICAgICAgYW5kIGl0cyByZXR1cm4gdmFsdWUgaXMgdXNlZCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCB2YWx1ZS5cbi8vICAgICAgICAgIElmIGl0IHJldHVybnMgd2hhdCBpdCByZWNlaXZlZCwgdGhlbiB0aGUgc3RydWN0dXJlIGlzIG5vdCBtb2RpZmllZC5cbi8vICAgICAgICAgIElmIGl0IHJldHVybnMgdW5kZWZpbmVkIHRoZW4gdGhlIG1lbWJlciBpcyBkZWxldGVkLlxuXG4vLyAgICAgICAgICBFeGFtcGxlOlxuXG4vLyAgICAgICAgICAvLyBQYXJzZSB0aGUgdGV4dC4gVmFsdWVzIHRoYXQgbG9vayBsaWtlIElTTyBkYXRlIHN0cmluZ3Mgd2lsbFxuLy8gICAgICAgICAgLy8gYmUgY29udmVydGVkIHRvIERhdGUgb2JqZWN0cy5cblxuLy8gICAgICAgICAgbXlEYXRhID0gSlNPTi5wYXJzZSh0ZXh0LCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuLy8gICAgICAgICAgICAgIHZhciBhO1xuLy8gICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcbi8vICAgICAgICAgICAgICAgICAgYSA9XG4vLyAgIC9eKFxcZHs0fSktKFxcZHsyfSktKFxcZHsyfSlUKFxcZHsyfSk6KFxcZHsyfSk6KFxcZHsyfSg/OlxcLlxcZCopPylaJC8uZXhlYyh2YWx1ZSk7XG4vLyAgICAgICAgICAgICAgICAgIGlmIChhKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoK2FbMV0sICthWzJdIC0gMSwgK2FbM10sICthWzRdLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICthWzVdLCArYVs2XSkpO1xuLy8gICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbi8vICAgICAgICAgIH0pO1xuXG4vLyAgICAgICAgICBteURhdGEgPSBKU09OLnBhcnNlKCdbXCJEYXRlKDA5LzA5LzIwMDEpXCJdJywgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbi8vICAgICAgICAgICAgICB2YXIgZDtcbi8vICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmXG4vLyAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zbGljZSgwLCA1KSA9PT0gXCJEYXRlKFwiICYmXG4vLyAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zbGljZSgtMSkgPT09IFwiKVwiKSB7XG4vLyAgICAgICAgICAgICAgICAgIGQgPSBuZXcgRGF0ZSh2YWx1ZS5zbGljZSg1LCAtMSkpO1xuLy8gICAgICAgICAgICAgICAgICBpZiAoZCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQ7XG4vLyAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuLy8gICAgICAgICAgfSk7XG5cbi8vICBUaGlzIGlzIGEgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uLiBZb3UgYXJlIGZyZWUgdG8gY29weSwgbW9kaWZ5LCBvclxuLy8gIHJlZGlzdHJpYnV0ZS5cblxuLypqc2xpbnRcbiAgICBldmFsLCBmb3IsIHRoaXNcbiovXG5cbi8qcHJvcGVydHlcbiAgICBKU09OLCBhcHBseSwgY2FsbCwgY2hhckNvZGVBdCwgZ2V0VVRDRGF0ZSwgZ2V0VVRDRnVsbFllYXIsIGdldFVUQ0hvdXJzLFxuICAgIGdldFVUQ01pbnV0ZXMsIGdldFVUQ01vbnRoLCBnZXRVVENTZWNvbmRzLCBoYXNPd25Qcm9wZXJ0eSwgam9pbixcbiAgICBsYXN0SW5kZXgsIGxlbmd0aCwgcGFyc2UsIHByb3RvdHlwZSwgcHVzaCwgcmVwbGFjZSwgc2xpY2UsIHN0cmluZ2lmeSxcbiAgICB0ZXN0LCB0b0pTT04sIHRvU3RyaW5nLCB2YWx1ZU9mXG4qL1xuXG5cbi8vIENyZWF0ZSBhIEpTT04gb2JqZWN0IG9ubHkgaWYgb25lIGRvZXMgbm90IGFscmVhZHkgZXhpc3QuIFdlIGNyZWF0ZSB0aGVcbi8vIG1ldGhvZHMgaW4gYSBjbG9zdXJlIHRvIGF2b2lkIGNyZWF0aW5nIGdsb2JhbCB2YXJpYWJsZXMuXG5cbmlmICh0eXBlb2YgSlNPTiAhPT0gXCJvYmplY3RcIikge1xuICAgIEpTT04gPSB7fTtcbn1cblxuKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciByeF9vbmUgPSAvXltcXF0sOnt9XFxzXSokLztcbiAgICB2YXIgcnhfdHdvID0gL1xcXFwoPzpbXCJcXFxcXFwvYmZucnRdfHVbMC05YS1mQS1GXXs0fSkvZztcbiAgICB2YXIgcnhfdGhyZWUgPSAvXCJbXlwiXFxcXFxcblxccl0qXCJ8dHJ1ZXxmYWxzZXxudWxsfC0/XFxkKyg/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/L2c7XG4gICAgdmFyIHJ4X2ZvdXIgPSAvKD86Xnw6fCwpKD86XFxzKlxcWykrL2c7XG4gICAgdmFyIHJ4X2VzY2FwYWJsZSA9IC9bXFxcXFwiXFx1MDAwMC1cXHUwMDFmXFx1MDA3Zi1cXHUwMDlmXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2c7XG4gICAgdmFyIHJ4X2Rhbmdlcm91cyA9IC9bXFx1MDAwMFxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nO1xuXG4gICAgZnVuY3Rpb24gZihuKSB7XG4gICAgICAgIC8vIEZvcm1hdCBpbnRlZ2VycyB0byBoYXZlIGF0IGxlYXN0IHR3byBkaWdpdHMuXG4gICAgICAgIHJldHVybiBuIDwgMTBcbiAgICAgICAgICAgID8gXCIwXCIgKyBuXG4gICAgICAgICAgICA6IG47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGhpc192YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVPZigpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgRGF0ZS5wcm90b3R5cGUudG9KU09OICE9PSBcImZ1bmN0aW9uXCIpIHtcblxuICAgICAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBpc0Zpbml0ZSh0aGlzLnZhbHVlT2YoKSlcbiAgICAgICAgICAgICAgICA/IHRoaXMuZ2V0VVRDRnVsbFllYXIoKSArIFwiLVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENNb250aCgpICsgMSkgKyBcIi1cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDRGF0ZSgpKSArIFwiVFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENIb3VycygpKSArIFwiOlwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENNaW51dGVzKCkpICsgXCI6XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ1NlY29uZHMoKSkgKyBcIlpcIlxuICAgICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICBCb29sZWFuLnByb3RvdHlwZS50b0pTT04gPSB0aGlzX3ZhbHVlO1xuICAgICAgICBOdW1iZXIucHJvdG90eXBlLnRvSlNPTiA9IHRoaXNfdmFsdWU7XG4gICAgICAgIFN0cmluZy5wcm90b3R5cGUudG9KU09OID0gdGhpc192YWx1ZTtcbiAgICB9XG5cbiAgICB2YXIgZ2FwO1xuICAgIHZhciBpbmRlbnQ7XG4gICAgdmFyIG1ldGE7XG4gICAgdmFyIHJlcDtcblxuXG4gICAgZnVuY3Rpb24gcXVvdGUoc3RyaW5nKSB7XG5cbi8vIElmIHRoZSBzdHJpbmcgY29udGFpbnMgbm8gY29udHJvbCBjaGFyYWN0ZXJzLCBubyBxdW90ZSBjaGFyYWN0ZXJzLCBhbmQgbm9cbi8vIGJhY2tzbGFzaCBjaGFyYWN0ZXJzLCB0aGVuIHdlIGNhbiBzYWZlbHkgc2xhcCBzb21lIHF1b3RlcyBhcm91bmQgaXQuXG4vLyBPdGhlcndpc2Ugd2UgbXVzdCBhbHNvIHJlcGxhY2UgdGhlIG9mZmVuZGluZyBjaGFyYWN0ZXJzIHdpdGggc2FmZSBlc2NhcGVcbi8vIHNlcXVlbmNlcy5cblxuICAgICAgICByeF9lc2NhcGFibGUubGFzdEluZGV4ID0gMDtcbiAgICAgICAgcmV0dXJuIHJ4X2VzY2FwYWJsZS50ZXN0KHN0cmluZylcbiAgICAgICAgICAgID8gXCJcXFwiXCIgKyBzdHJpbmcucmVwbGFjZShyeF9lc2NhcGFibGUsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSBtZXRhW2FdO1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYyA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICA/IGNcbiAgICAgICAgICAgICAgICAgICAgOiBcIlxcXFx1XCIgKyAoXCIwMDAwXCIgKyBhLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICAgICAgICB9KSArIFwiXFxcIlwiXG4gICAgICAgICAgICA6IFwiXFxcIlwiICsgc3RyaW5nICsgXCJcXFwiXCI7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBzdHIoa2V5LCBob2xkZXIpIHtcblxuLy8gUHJvZHVjZSBhIHN0cmluZyBmcm9tIGhvbGRlcltrZXldLlxuXG4gICAgICAgIHZhciBpOyAgICAgICAgICAvLyBUaGUgbG9vcCBjb3VudGVyLlxuICAgICAgICB2YXIgazsgICAgICAgICAgLy8gVGhlIG1lbWJlciBrZXkuXG4gICAgICAgIHZhciB2OyAgICAgICAgICAvLyBUaGUgbWVtYmVyIHZhbHVlLlxuICAgICAgICB2YXIgbGVuZ3RoO1xuICAgICAgICB2YXIgbWluZCA9IGdhcDtcbiAgICAgICAgdmFyIHBhcnRpYWw7XG4gICAgICAgIHZhciB2YWx1ZSA9IGhvbGRlcltrZXldO1xuXG4vLyBJZiB0aGUgdmFsdWUgaGFzIGEgdG9KU09OIG1ldGhvZCwgY2FsbCBpdCB0byBvYnRhaW4gYSByZXBsYWNlbWVudCB2YWx1ZS5cblxuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvSlNPTihrZXkpO1xuICAgICAgICB9XG5cbi8vIElmIHdlIHdlcmUgY2FsbGVkIHdpdGggYSByZXBsYWNlciBmdW5jdGlvbiwgdGhlbiBjYWxsIHRoZSByZXBsYWNlciB0b1xuLy8gb2J0YWluIGEgcmVwbGFjZW1lbnQgdmFsdWUuXG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXAgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdmFsdWUgPSByZXAuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xuICAgICAgICB9XG5cbi8vIFdoYXQgaGFwcGVucyBuZXh0IGRlcGVuZHMgb24gdGhlIHZhbHVlJ3MgdHlwZS5cblxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgICAgICByZXR1cm4gcXVvdGUodmFsdWUpO1xuXG4gICAgICAgIGNhc2UgXCJudW1iZXJcIjpcblxuLy8gSlNPTiBudW1iZXJzIG11c3QgYmUgZmluaXRlLiBFbmNvZGUgbm9uLWZpbml0ZSBudW1iZXJzIGFzIG51bGwuXG5cbiAgICAgICAgICAgIHJldHVybiBpc0Zpbml0ZSh2YWx1ZSlcbiAgICAgICAgICAgICAgICA/IFN0cmluZyh2YWx1ZSlcbiAgICAgICAgICAgICAgICA6IFwibnVsbFwiO1xuXG4gICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgIGNhc2UgXCJudWxsXCI6XG5cbi8vIElmIHRoZSB2YWx1ZSBpcyBhIGJvb2xlYW4gb3IgbnVsbCwgY29udmVydCBpdCB0byBhIHN0cmluZy4gTm90ZTpcbi8vIHR5cGVvZiBudWxsIGRvZXMgbm90IHByb2R1Y2UgXCJudWxsXCIuIFRoZSBjYXNlIGlzIGluY2x1ZGVkIGhlcmUgaW5cbi8vIHRoZSByZW1vdGUgY2hhbmNlIHRoYXQgdGhpcyBnZXRzIGZpeGVkIHNvbWVkYXkuXG5cbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuXG4vLyBJZiB0aGUgdHlwZSBpcyBcIm9iamVjdFwiLCB3ZSBtaWdodCBiZSBkZWFsaW5nIHdpdGggYW4gb2JqZWN0IG9yIGFuIGFycmF5IG9yXG4vLyBudWxsLlxuXG4gICAgICAgIGNhc2UgXCJvYmplY3RcIjpcblxuLy8gRHVlIHRvIGEgc3BlY2lmaWNhdGlvbiBibHVuZGVyIGluIEVDTUFTY3JpcHQsIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsXG4vLyBzbyB3YXRjaCBvdXQgZm9yIHRoYXQgY2FzZS5cblxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgICAgIH1cblxuLy8gTWFrZSBhbiBhcnJheSB0byBob2xkIHRoZSBwYXJ0aWFsIHJlc3VsdHMgb2Ygc3RyaW5naWZ5aW5nIHRoaXMgb2JqZWN0IHZhbHVlLlxuXG4gICAgICAgICAgICBnYXAgKz0gaW5kZW50O1xuICAgICAgICAgICAgcGFydGlhbCA9IFtdO1xuXG4vLyBJcyB0aGUgdmFsdWUgYW4gYXJyYXk/XG5cbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KHZhbHVlKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiKSB7XG5cbi8vIFRoZSB2YWx1ZSBpcyBhbiBhcnJheS4gU3RyaW5naWZ5IGV2ZXJ5IGVsZW1lbnQuIFVzZSBudWxsIGFzIGEgcGxhY2Vob2xkZXJcbi8vIGZvciBub24tSlNPTiB2YWx1ZXMuXG5cbiAgICAgICAgICAgICAgICBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpYWxbaV0gPSBzdHIoaSwgdmFsdWUpIHx8IFwibnVsbFwiO1xuICAgICAgICAgICAgICAgIH1cblxuLy8gSm9pbiBhbGwgb2YgdGhlIGVsZW1lbnRzIHRvZ2V0aGVyLCBzZXBhcmF0ZWQgd2l0aCBjb21tYXMsIGFuZCB3cmFwIHRoZW0gaW5cbi8vIGJyYWNrZXRzLlxuXG4gICAgICAgICAgICAgICAgdiA9IHBhcnRpYWwubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgICAgICAgID8gXCJbXVwiXG4gICAgICAgICAgICAgICAgICAgIDogZ2FwXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFwiW1xcblwiICsgZ2FwICsgcGFydGlhbC5qb2luKFwiLFxcblwiICsgZ2FwKSArIFwiXFxuXCIgKyBtaW5kICsgXCJdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogXCJbXCIgKyBwYXJ0aWFsLmpvaW4oXCIsXCIpICsgXCJdXCI7XG4gICAgICAgICAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgICAgIH1cblxuLy8gSWYgdGhlIHJlcGxhY2VyIGlzIGFuIGFycmF5LCB1c2UgaXQgdG8gc2VsZWN0IHRoZSBtZW1iZXJzIHRvIGJlIHN0cmluZ2lmaWVkLlxuXG4gICAgICAgICAgICBpZiAocmVwICYmIHR5cGVvZiByZXAgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSByZXAubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlcFtpXSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgayA9IHJlcFtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBzdHIoaywgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsLnB1c2gocXVvdGUoaykgKyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIjogXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCI6XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApICsgdik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4vLyBPdGhlcndpc2UsIGl0ZXJhdGUgdGhyb3VnaCBhbGwgb2YgdGhlIGtleXMgaW4gdGhlIG9iamVjdC5cblxuICAgICAgICAgICAgICAgIGZvciAoayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHN0cihrLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpYWwucHVzaChxdW90ZShrKSArIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiOiBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIjpcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgKyB2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuLy8gSm9pbiBhbGwgb2YgdGhlIG1lbWJlciB0ZXh0cyB0b2dldGhlciwgc2VwYXJhdGVkIHdpdGggY29tbWFzLFxuLy8gYW5kIHdyYXAgdGhlbSBpbiBicmFjZXMuXG5cbiAgICAgICAgICAgIHYgPSBwYXJ0aWFsLmxlbmd0aCA9PT0gMFxuICAgICAgICAgICAgICAgID8gXCJ7fVwiXG4gICAgICAgICAgICAgICAgOiBnYXBcbiAgICAgICAgICAgICAgICAgICAgPyBcIntcXG5cIiArIGdhcCArIHBhcnRpYWwuam9pbihcIixcXG5cIiArIGdhcCkgKyBcIlxcblwiICsgbWluZCArIFwifVwiXG4gICAgICAgICAgICAgICAgICAgIDogXCJ7XCIgKyBwYXJ0aWFsLmpvaW4oXCIsXCIpICsgXCJ9XCI7XG4gICAgICAgICAgICBnYXAgPSBtaW5kO1xuICAgICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgIH1cbiAgICB9XG5cbi8vIElmIHRoZSBKU09OIG9iamVjdCBkb2VzIG5vdCB5ZXQgaGF2ZSBhIHN0cmluZ2lmeSBtZXRob2QsIGdpdmUgaXQgb25lLlxuXG4gICAgaWYgKHR5cGVvZiBKU09OLnN0cmluZ2lmeSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIG1ldGEgPSB7ICAgIC8vIHRhYmxlIG9mIGNoYXJhY3RlciBzdWJzdGl0dXRpb25zXG4gICAgICAgICAgICBcIlxcYlwiOiBcIlxcXFxiXCIsXG4gICAgICAgICAgICBcIlxcdFwiOiBcIlxcXFx0XCIsXG4gICAgICAgICAgICBcIlxcblwiOiBcIlxcXFxuXCIsXG4gICAgICAgICAgICBcIlxcZlwiOiBcIlxcXFxmXCIsXG4gICAgICAgICAgICBcIlxcclwiOiBcIlxcXFxyXCIsXG4gICAgICAgICAgICBcIlxcXCJcIjogXCJcXFxcXFxcIlwiLFxuICAgICAgICAgICAgXCJcXFxcXCI6IFwiXFxcXFxcXFxcIlxuICAgICAgICB9O1xuICAgICAgICBKU09OLnN0cmluZ2lmeSA9IGZ1bmN0aW9uICh2YWx1ZSwgcmVwbGFjZXIsIHNwYWNlKSB7XG5cbi8vIFRoZSBzdHJpbmdpZnkgbWV0aG9kIHRha2VzIGEgdmFsdWUgYW5kIGFuIG9wdGlvbmFsIHJlcGxhY2VyLCBhbmQgYW4gb3B0aW9uYWxcbi8vIHNwYWNlIHBhcmFtZXRlciwgYW5kIHJldHVybnMgYSBKU09OIHRleHQuIFRoZSByZXBsYWNlciBjYW4gYmUgYSBmdW5jdGlvblxuLy8gdGhhdCBjYW4gcmVwbGFjZSB2YWx1ZXMsIG9yIGFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCB3aWxsIHNlbGVjdCB0aGUga2V5cy5cbi8vIEEgZGVmYXVsdCByZXBsYWNlciBtZXRob2QgY2FuIGJlIHByb3ZpZGVkLiBVc2Ugb2YgdGhlIHNwYWNlIHBhcmFtZXRlciBjYW5cbi8vIHByb2R1Y2UgdGV4dCB0aGF0IGlzIG1vcmUgZWFzaWx5IHJlYWRhYmxlLlxuXG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIGdhcCA9IFwiXCI7XG4gICAgICAgICAgICBpbmRlbnQgPSBcIlwiO1xuXG4vLyBJZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGlzIGEgbnVtYmVyLCBtYWtlIGFuIGluZGVudCBzdHJpbmcgY29udGFpbmluZyB0aGF0XG4vLyBtYW55IHNwYWNlcy5cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGFjZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzcGFjZTsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCArPSBcIiBcIjtcbiAgICAgICAgICAgICAgICB9XG5cbi8vIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBzdHJpbmcsIGl0IHdpbGwgYmUgdXNlZCBhcyB0aGUgaW5kZW50IHN0cmluZy5cblxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3BhY2UgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBpbmRlbnQgPSBzcGFjZTtcbiAgICAgICAgICAgIH1cblxuLy8gSWYgdGhlcmUgaXMgYSByZXBsYWNlciwgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uIG9yIGFuIGFycmF5LlxuLy8gT3RoZXJ3aXNlLCB0aHJvdyBhbiBlcnJvci5cblxuICAgICAgICAgICAgcmVwID0gcmVwbGFjZXI7XG4gICAgICAgICAgICBpZiAocmVwbGFjZXIgJiYgdHlwZW9mIHJlcGxhY2VyICE9PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiByZXBsYWNlciAhPT0gXCJvYmplY3RcIiB8fFxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgcmVwbGFjZXIubGVuZ3RoICE9PSBcIm51bWJlclwiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkpTT04uc3RyaW5naWZ5XCIpO1xuICAgICAgICAgICAgfVxuXG4vLyBNYWtlIGEgZmFrZSByb290IG9iamVjdCBjb250YWluaW5nIG91ciB2YWx1ZSB1bmRlciB0aGUga2V5IG9mIFwiXCIuXG4vLyBSZXR1cm4gdGhlIHJlc3VsdCBvZiBzdHJpbmdpZnlpbmcgdGhlIHZhbHVlLlxuXG4gICAgICAgICAgICByZXR1cm4gc3RyKFwiXCIsIHtcIlwiOiB2YWx1ZX0pO1xuICAgICAgICB9O1xuICAgIH1cblxuXG4vLyBJZiB0aGUgSlNPTiBvYmplY3QgZG9lcyBub3QgeWV0IGhhdmUgYSBwYXJzZSBtZXRob2QsIGdpdmUgaXQgb25lLlxuXG4gICAgaWYgKHR5cGVvZiBKU09OLnBhcnNlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgSlNPTi5wYXJzZSA9IGZ1bmN0aW9uICh0ZXh0LCByZXZpdmVyKSB7XG5cbi8vIFRoZSBwYXJzZSBtZXRob2QgdGFrZXMgYSB0ZXh0IGFuZCBhbiBvcHRpb25hbCByZXZpdmVyIGZ1bmN0aW9uLCBhbmQgcmV0dXJuc1xuLy8gYSBKYXZhU2NyaXB0IHZhbHVlIGlmIHRoZSB0ZXh0IGlzIGEgdmFsaWQgSlNPTiB0ZXh0LlxuXG4gICAgICAgICAgICB2YXIgajtcblxuICAgICAgICAgICAgZnVuY3Rpb24gd2Fsayhob2xkZXIsIGtleSkge1xuXG4vLyBUaGUgd2FsayBtZXRob2QgaXMgdXNlZCB0byByZWN1cnNpdmVseSB3YWxrIHRoZSByZXN1bHRpbmcgc3RydWN0dXJlIHNvXG4vLyB0aGF0IG1vZGlmaWNhdGlvbnMgY2FuIGJlIG1hZGUuXG5cbiAgICAgICAgICAgICAgICB2YXIgaztcbiAgICAgICAgICAgICAgICB2YXIgdjtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBob2xkZXJba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ID0gd2Fsayh2YWx1ZSwgayk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IHY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlW2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV2aXZlci5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cblxuLy8gUGFyc2luZyBoYXBwZW5zIGluIGZvdXIgc3RhZ2VzLiBJbiB0aGUgZmlyc3Qgc3RhZ2UsIHdlIHJlcGxhY2UgY2VydGFpblxuLy8gVW5pY29kZSBjaGFyYWN0ZXJzIHdpdGggZXNjYXBlIHNlcXVlbmNlcy4gSmF2YVNjcmlwdCBoYW5kbGVzIG1hbnkgY2hhcmFjdGVyc1xuLy8gaW5jb3JyZWN0bHksIGVpdGhlciBzaWxlbnRseSBkZWxldGluZyB0aGVtLCBvciB0cmVhdGluZyB0aGVtIGFzIGxpbmUgZW5kaW5ncy5cblxuICAgICAgICAgICAgdGV4dCA9IFN0cmluZyh0ZXh0KTtcbiAgICAgICAgICAgIHJ4X2Rhbmdlcm91cy5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgaWYgKHJ4X2Rhbmdlcm91cy50ZXN0KHRleHQpKSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZShyeF9kYW5nZXJvdXMsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlxcXFx1XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChcIjAwMDBcIiArIGEuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuLy8gSW4gdGhlIHNlY29uZCBzdGFnZSwgd2UgcnVuIHRoZSB0ZXh0IGFnYWluc3QgcmVndWxhciBleHByZXNzaW9ucyB0aGF0IGxvb2tcbi8vIGZvciBub24tSlNPTiBwYXR0ZXJucy4gV2UgYXJlIGVzcGVjaWFsbHkgY29uY2VybmVkIHdpdGggXCIoKVwiIGFuZCBcIm5ld1wiXG4vLyBiZWNhdXNlIHRoZXkgY2FuIGNhdXNlIGludm9jYXRpb24sIGFuZCBcIj1cIiBiZWNhdXNlIGl0IGNhbiBjYXVzZSBtdXRhdGlvbi5cbi8vIEJ1dCBqdXN0IHRvIGJlIHNhZmUsIHdlIHdhbnQgdG8gcmVqZWN0IGFsbCB1bmV4cGVjdGVkIGZvcm1zLlxuXG4vLyBXZSBzcGxpdCB0aGUgc2Vjb25kIHN0YWdlIGludG8gNCByZWdleHAgb3BlcmF0aW9ucyBpbiBvcmRlciB0byB3b3JrIGFyb3VuZFxuLy8gY3JpcHBsaW5nIGluZWZmaWNpZW5jaWVzIGluIElFJ3MgYW5kIFNhZmFyaSdzIHJlZ2V4cCBlbmdpbmVzLiBGaXJzdCB3ZVxuLy8gcmVwbGFjZSB0aGUgSlNPTiBiYWNrc2xhc2ggcGFpcnMgd2l0aCBcIkBcIiAoYSBub24tSlNPTiBjaGFyYWN0ZXIpLiBTZWNvbmQsIHdlXG4vLyByZXBsYWNlIGFsbCBzaW1wbGUgdmFsdWUgdG9rZW5zIHdpdGggXCJdXCIgY2hhcmFjdGVycy4gVGhpcmQsIHdlIGRlbGV0ZSBhbGxcbi8vIG9wZW4gYnJhY2tldHMgdGhhdCBmb2xsb3cgYSBjb2xvbiBvciBjb21tYSBvciB0aGF0IGJlZ2luIHRoZSB0ZXh0LiBGaW5hbGx5LFxuLy8gd2UgbG9vayB0byBzZWUgdGhhdCB0aGUgcmVtYWluaW5nIGNoYXJhY3RlcnMgYXJlIG9ubHkgd2hpdGVzcGFjZSBvciBcIl1cIiBvclxuLy8gXCIsXCIgb3IgXCI6XCIgb3IgXCJ7XCIgb3IgXCJ9XCIuIElmIHRoYXQgaXMgc28sIHRoZW4gdGhlIHRleHQgaXMgc2FmZSBmb3IgZXZhbC5cblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHJ4X29uZS50ZXN0KFxuICAgICAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShyeF90d28sIFwiQFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UocnhfdGhyZWUsIFwiXVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UocnhfZm91ciwgXCJcIilcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcblxuLy8gSW4gdGhlIHRoaXJkIHN0YWdlIHdlIHVzZSB0aGUgZXZhbCBmdW5jdGlvbiB0byBjb21waWxlIHRoZSB0ZXh0IGludG8gYVxuLy8gSmF2YVNjcmlwdCBzdHJ1Y3R1cmUuIFRoZSBcIntcIiBvcGVyYXRvciBpcyBzdWJqZWN0IHRvIGEgc3ludGFjdGljIGFtYmlndWl0eVxuLy8gaW4gSmF2YVNjcmlwdDogaXQgY2FuIGJlZ2luIGEgYmxvY2sgb3IgYW4gb2JqZWN0IGxpdGVyYWwuIFdlIHdyYXAgdGhlIHRleHRcbi8vIGluIHBhcmVucyB0byBlbGltaW5hdGUgdGhlIGFtYmlndWl0eS5cblxuICAgICAgICAgICAgICAgIGogPSBldmFsKFwiKFwiICsgdGV4dCArIFwiKVwiKTtcblxuLy8gSW4gdGhlIG9wdGlvbmFsIGZvdXJ0aCBzdGFnZSwgd2UgcmVjdXJzaXZlbHkgd2FsayB0aGUgbmV3IHN0cnVjdHVyZSwgcGFzc2luZ1xuLy8gZWFjaCBuYW1lL3ZhbHVlIHBhaXIgdG8gYSByZXZpdmVyIGZ1bmN0aW9uIGZvciBwb3NzaWJsZSB0cmFuc2Zvcm1hdGlvbi5cblxuICAgICAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHJldml2ZXIgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICAgICAgPyB3YWxrKHtcIlwiOiBqfSwgXCJcIilcbiAgICAgICAgICAgICAgICAgICAgOiBqO1xuICAgICAgICAgICAgfVxuXG4vLyBJZiB0aGUgdGV4dCBpcyBub3QgSlNPTiBwYXJzZWFibGUsIHRoZW4gYSBTeW50YXhFcnJvciBpcyB0aHJvd24uXG5cbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIkpTT04ucGFyc2VcIik7XG4gICAgICAgIH07XG4gICAgfVxufSgpKTsiLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpXG52YXIgc2xpY2UgPSB1dGlsLnNsaWNlXG52YXIgcGx1Y2sgPSB1dGlsLnBsdWNrXG52YXIgZWFjaCA9IHV0aWwuZWFjaFxudmFyIGJpbmQgPSB1dGlsLmJpbmRcbnZhciBjcmVhdGUgPSB1dGlsLmNyZWF0ZVxudmFyIGlzTGlzdCA9IHV0aWwuaXNMaXN0XG52YXIgaXNGdW5jdGlvbiA9IHV0aWwuaXNGdW5jdGlvblxudmFyIGlzT2JqZWN0ID0gdXRpbC5pc09iamVjdFxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y3JlYXRlU3RvcmU6IGNyZWF0ZVN0b3JlXG59XG5cbnZhciBzdG9yZUFQSSA9IHtcblx0dmVyc2lvbjogJzIuMC4xMicsXG5cdGVuYWJsZWQ6IGZhbHNlLFxuXHRcblx0Ly8gZ2V0IHJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBnaXZlbiBrZXkuIElmIHRoYXQgdmFsdWVcblx0Ly8gaXMgdW5kZWZpbmVkLCBpdCByZXR1cm5zIG9wdGlvbmFsRGVmYXVsdFZhbHVlIGluc3RlYWQuXG5cdGdldDogZnVuY3Rpb24oa2V5LCBvcHRpb25hbERlZmF1bHRWYWx1ZSkge1xuXHRcdHZhciBkYXRhID0gdGhpcy5zdG9yYWdlLnJlYWQodGhpcy5fbmFtZXNwYWNlUHJlZml4ICsga2V5KVxuXHRcdHJldHVybiB0aGlzLl9kZXNlcmlhbGl6ZShkYXRhLCBvcHRpb25hbERlZmF1bHRWYWx1ZSlcblx0fSxcblxuXHQvLyBzZXQgd2lsbCBzdG9yZSB0aGUgZ2l2ZW4gdmFsdWUgYXQga2V5IGFuZCByZXR1cm5zIHZhbHVlLlxuXHQvLyBDYWxsaW5nIHNldCB3aXRoIHZhbHVlID09PSB1bmRlZmluZWQgaXMgZXF1aXZhbGVudCB0byBjYWxsaW5nIHJlbW92ZS5cblx0c2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiB0aGlzLnJlbW92ZShrZXkpXG5cdFx0fVxuXHRcdHRoaXMuc3RvcmFnZS53cml0ZSh0aGlzLl9uYW1lc3BhY2VQcmVmaXggKyBrZXksIHRoaXMuX3NlcmlhbGl6ZSh2YWx1ZSkpXG5cdFx0cmV0dXJuIHZhbHVlXG5cdH0sXG5cblx0Ly8gcmVtb3ZlIGRlbGV0ZXMgdGhlIGtleSBhbmQgdmFsdWUgc3RvcmVkIGF0IHRoZSBnaXZlbiBrZXkuXG5cdHJlbW92ZTogZnVuY3Rpb24oa2V5KSB7XG5cdFx0dGhpcy5zdG9yYWdlLnJlbW92ZSh0aGlzLl9uYW1lc3BhY2VQcmVmaXggKyBrZXkpXG5cdH0sXG5cblx0Ly8gZWFjaCB3aWxsIGNhbGwgdGhlIGdpdmVuIGNhbGxiYWNrIG9uY2UgZm9yIGVhY2gga2V5LXZhbHVlIHBhaXJcblx0Ly8gaW4gdGhpcyBzdG9yZS5cblx0ZWFjaDogZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHR2YXIgc2VsZiA9IHRoaXNcblx0XHR0aGlzLnN0b3JhZ2UuZWFjaChmdW5jdGlvbih2YWwsIG5hbWVzcGFjZWRLZXkpIHtcblx0XHRcdGNhbGxiYWNrLmNhbGwoc2VsZiwgc2VsZi5fZGVzZXJpYWxpemUodmFsKSwgKG5hbWVzcGFjZWRLZXkgfHwgJycpLnJlcGxhY2Uoc2VsZi5fbmFtZXNwYWNlUmVnZXhwLCAnJykpXG5cdFx0fSlcblx0fSxcblxuXHQvLyBjbGVhckFsbCB3aWxsIHJlbW92ZSBhbGwgdGhlIHN0b3JlZCBrZXktdmFsdWUgcGFpcnMgaW4gdGhpcyBzdG9yZS5cblx0Y2xlYXJBbGw6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3RvcmFnZS5jbGVhckFsbCgpXG5cdH0sXG5cblx0Ly8gYWRkaXRpb25hbCBmdW5jdGlvbmFsaXR5IHRoYXQgY2FuJ3QgbGl2ZSBpbiBwbHVnaW5zXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdC8vIGhhc05hbWVzcGFjZSByZXR1cm5zIHRydWUgaWYgdGhpcyBzdG9yZSBpbnN0YW5jZSBoYXMgdGhlIGdpdmVuIG5hbWVzcGFjZS5cblx0aGFzTmFtZXNwYWNlOiBmdW5jdGlvbihuYW1lc3BhY2UpIHtcblx0XHRyZXR1cm4gKHRoaXMuX25hbWVzcGFjZVByZWZpeCA9PSAnX19zdG9yZWpzXycrbmFtZXNwYWNlKydfJylcblx0fSxcblxuXHQvLyBjcmVhdGVTdG9yZSBjcmVhdGVzIGEgc3RvcmUuanMgaW5zdGFuY2Ugd2l0aCB0aGUgZmlyc3Rcblx0Ly8gZnVuY3Rpb25pbmcgc3RvcmFnZSBpbiB0aGUgbGlzdCBvZiBzdG9yYWdlIGNhbmRpZGF0ZXMsXG5cdC8vIGFuZCBhcHBsaWVzIHRoZSB0aGUgZ2l2ZW4gbWl4aW5zIHRvIHRoZSBpbnN0YW5jZS5cblx0Y3JlYXRlU3RvcmU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBjcmVhdGVTdG9yZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG5cdH0sXG5cdFxuXHRhZGRQbHVnaW46IGZ1bmN0aW9uKHBsdWdpbikge1xuXHRcdHRoaXMuX2FkZFBsdWdpbihwbHVnaW4pXG5cdH0sXG5cdFxuXHRuYW1lc3BhY2U6IGZ1bmN0aW9uKG5hbWVzcGFjZSkge1xuXHRcdHJldHVybiBjcmVhdGVTdG9yZSh0aGlzLnN0b3JhZ2UsIHRoaXMucGx1Z2lucywgbmFtZXNwYWNlKVxuXHR9XG59XG5cbmZ1bmN0aW9uIF93YXJuKCkge1xuXHR2YXIgX2NvbnNvbGUgPSAodHlwZW9mIGNvbnNvbGUgPT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogY29uc29sZSlcblx0aWYgKCFfY29uc29sZSkgeyByZXR1cm4gfVxuXHR2YXIgZm4gPSAoX2NvbnNvbGUud2FybiA/IF9jb25zb2xlLndhcm4gOiBfY29uc29sZS5sb2cpXG5cdGZuLmFwcGx5KF9jb25zb2xlLCBhcmd1bWVudHMpXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0b3JlKHN0b3JhZ2VzLCBwbHVnaW5zLCBuYW1lc3BhY2UpIHtcblx0aWYgKCFuYW1lc3BhY2UpIHtcblx0XHRuYW1lc3BhY2UgPSAnJ1xuXHR9XG5cdGlmIChzdG9yYWdlcyAmJiAhaXNMaXN0KHN0b3JhZ2VzKSkge1xuXHRcdHN0b3JhZ2VzID0gW3N0b3JhZ2VzXVxuXHR9XG5cdGlmIChwbHVnaW5zICYmICFpc0xpc3QocGx1Z2lucykpIHtcblx0XHRwbHVnaW5zID0gW3BsdWdpbnNdXG5cdH1cblxuXHR2YXIgbmFtZXNwYWNlUHJlZml4ID0gKG5hbWVzcGFjZSA/ICdfX3N0b3JlanNfJytuYW1lc3BhY2UrJ18nIDogJycpXG5cdHZhciBuYW1lc3BhY2VSZWdleHAgPSAobmFtZXNwYWNlID8gbmV3IFJlZ0V4cCgnXicrbmFtZXNwYWNlUHJlZml4KSA6IG51bGwpXG5cdHZhciBsZWdhbE5hbWVzcGFjZXMgPSAvXlthLXpBLVowLTlfXFwtXSokLyAvLyBhbHBoYS1udW1lcmljICsgdW5kZXJzY29yZSBhbmQgZGFzaFxuXHRpZiAoIWxlZ2FsTmFtZXNwYWNlcy50ZXN0KG5hbWVzcGFjZSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ3N0b3JlLmpzIG5hbWVzcGFjZXMgY2FuIG9ubHkgaGF2ZSBhbHBoYW51bWVyaWNzICsgdW5kZXJzY29yZXMgYW5kIGRhc2hlcycpXG5cdH1cblx0XG5cdHZhciBfcHJpdmF0ZVN0b3JlUHJvcHMgPSB7XG5cdFx0X25hbWVzcGFjZVByZWZpeDogbmFtZXNwYWNlUHJlZml4LFxuXHRcdF9uYW1lc3BhY2VSZWdleHA6IG5hbWVzcGFjZVJlZ2V4cCxcblxuXHRcdF90ZXN0U3RvcmFnZTogZnVuY3Rpb24oc3RvcmFnZSkge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dmFyIHRlc3RTdHIgPSAnX19zdG9yZWpzX190ZXN0X18nXG5cdFx0XHRcdHN0b3JhZ2Uud3JpdGUodGVzdFN0ciwgdGVzdFN0cilcblx0XHRcdFx0dmFyIG9rID0gKHN0b3JhZ2UucmVhZCh0ZXN0U3RyKSA9PT0gdGVzdFN0cilcblx0XHRcdFx0c3RvcmFnZS5yZW1vdmUodGVzdFN0cilcblx0XHRcdFx0cmV0dXJuIG9rXG5cdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdF9hc3NpZ25QbHVnaW5GblByb3A6IGZ1bmN0aW9uKHBsdWdpbkZuUHJvcCwgcHJvcE5hbWUpIHtcblx0XHRcdHZhciBvbGRGbiA9IHRoaXNbcHJvcE5hbWVdXG5cdFx0XHR0aGlzW3Byb3BOYW1lXSA9IGZ1bmN0aW9uIHBsdWdpbkZuKCkge1xuXHRcdFx0XHR2YXIgYXJncyA9IHNsaWNlKGFyZ3VtZW50cywgMClcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzXG5cblx0XHRcdFx0Ly8gc3VwZXJfZm4gY2FsbHMgdGhlIG9sZCBmdW5jdGlvbiB3aGljaCB3YXMgb3ZlcndyaXR0ZW4gYnlcblx0XHRcdFx0Ly8gdGhpcyBtaXhpbi5cblx0XHRcdFx0ZnVuY3Rpb24gc3VwZXJfZm4oKSB7XG5cdFx0XHRcdFx0aWYgKCFvbGRGbikgeyByZXR1cm4gfVxuXHRcdFx0XHRcdGVhY2goYXJndW1lbnRzLCBmdW5jdGlvbihhcmcsIGkpIHtcblx0XHRcdFx0XHRcdGFyZ3NbaV0gPSBhcmdcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdHJldHVybiBvbGRGbi5hcHBseShzZWxmLCBhcmdzKVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gR2l2ZSBtaXhpbmcgZnVuY3Rpb24gYWNjZXNzIHRvIHN1cGVyX2ZuIGJ5IHByZWZpeGluZyBhbGwgbWl4aW4gZnVuY3Rpb25cblx0XHRcdFx0Ly8gYXJndW1lbnRzIHdpdGggc3VwZXJfZm4uXG5cdFx0XHRcdHZhciBuZXdGbkFyZ3MgPSBbc3VwZXJfZm5dLmNvbmNhdChhcmdzKVxuXG5cdFx0XHRcdHJldHVybiBwbHVnaW5GblByb3AuYXBwbHkoc2VsZiwgbmV3Rm5BcmdzKVxuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRfc2VyaWFsaXplOiBmdW5jdGlvbihvYmopIHtcblx0XHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopXG5cdFx0fSxcblxuXHRcdF9kZXNlcmlhbGl6ZTogZnVuY3Rpb24oc3RyVmFsLCBkZWZhdWx0VmFsKSB7XG5cdFx0XHRpZiAoIXN0clZhbCkgeyByZXR1cm4gZGVmYXVsdFZhbCB9XG5cdFx0XHQvLyBJdCBpcyBwb3NzaWJsZSB0aGF0IGEgcmF3IHN0cmluZyB2YWx1ZSBoYXMgYmVlbiBwcmV2aW91c2x5IHN0b3JlZFxuXHRcdFx0Ly8gaW4gYSBzdG9yYWdlIHdpdGhvdXQgdXNpbmcgc3RvcmUuanMsIG1lYW5pbmcgaXQgd2lsbCBiZSBhIHJhd1xuXHRcdFx0Ly8gc3RyaW5nIHZhbHVlIGluc3RlYWQgb2YgYSBKU09OIHNlcmlhbGl6ZWQgc3RyaW5nLiBCeSBkZWZhdWx0aW5nXG5cdFx0XHQvLyB0byB0aGUgcmF3IHN0cmluZyB2YWx1ZSBpbiBjYXNlIG9mIGEgSlNPTiBwYXJzZSBlcnJvciwgd2UgYWxsb3dcblx0XHRcdC8vIGZvciBwYXN0IHN0b3JlZCB2YWx1ZXMgdG8gYmUgZm9yd2FyZHMtY29tcGF0aWJsZSB3aXRoIHN0b3JlLmpzXG5cdFx0XHR2YXIgdmFsID0gJydcblx0XHRcdHRyeSB7IHZhbCA9IEpTT04ucGFyc2Uoc3RyVmFsKSB9XG5cdFx0XHRjYXRjaChlKSB7IHZhbCA9IHN0clZhbCB9XG5cblx0XHRcdHJldHVybiAodmFsICE9PSB1bmRlZmluZWQgPyB2YWwgOiBkZWZhdWx0VmFsKVxuXHRcdH0sXG5cdFx0XG5cdFx0X2FkZFN0b3JhZ2U6IGZ1bmN0aW9uKHN0b3JhZ2UpIHtcblx0XHRcdGlmICh0aGlzLmVuYWJsZWQpIHsgcmV0dXJuIH1cblx0XHRcdGlmICh0aGlzLl90ZXN0U3RvcmFnZShzdG9yYWdlKSkge1xuXHRcdFx0XHR0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlXG5cdFx0XHRcdHRoaXMuZW5hYmxlZCA9IHRydWVcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0X2FkZFBsdWdpbjogZnVuY3Rpb24ocGx1Z2luKSB7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXNcblxuXHRcdFx0Ly8gSWYgdGhlIHBsdWdpbiBpcyBhbiBhcnJheSwgdGhlbiBhZGQgYWxsIHBsdWdpbnMgaW4gdGhlIGFycmF5LlxuXHRcdFx0Ly8gVGhpcyBhbGxvd3MgZm9yIGEgcGx1Z2luIHRvIGRlcGVuZCBvbiBvdGhlciBwbHVnaW5zLlxuXHRcdFx0aWYgKGlzTGlzdChwbHVnaW4pKSB7XG5cdFx0XHRcdGVhY2gocGx1Z2luLCBmdW5jdGlvbihwbHVnaW4pIHtcblx0XHRcdFx0XHRzZWxmLl9hZGRQbHVnaW4ocGx1Z2luKVxuXHRcdFx0XHR9KVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblxuXHRcdFx0Ly8gS2VlcCB0cmFjayBvZiBhbGwgcGx1Z2lucyB3ZSd2ZSBzZWVuIHNvIGZhciwgc28gdGhhdCB3ZVxuXHRcdFx0Ly8gZG9uJ3QgYWRkIGFueSBvZiB0aGVtIHR3aWNlLlxuXHRcdFx0dmFyIHNlZW5QbHVnaW4gPSBwbHVjayh0aGlzLnBsdWdpbnMsIGZ1bmN0aW9uKHNlZW5QbHVnaW4pIHtcblx0XHRcdFx0cmV0dXJuIChwbHVnaW4gPT09IHNlZW5QbHVnaW4pXG5cdFx0XHR9KVxuXHRcdFx0aWYgKHNlZW5QbHVnaW4pIHtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHR0aGlzLnBsdWdpbnMucHVzaChwbHVnaW4pXG5cblx0XHRcdC8vIENoZWNrIHRoYXQgdGhlIHBsdWdpbiBpcyBwcm9wZXJseSBmb3JtZWRcblx0XHRcdGlmICghaXNGdW5jdGlvbihwbHVnaW4pKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignUGx1Z2lucyBtdXN0IGJlIGZ1bmN0aW9uIHZhbHVlcyB0aGF0IHJldHVybiBvYmplY3RzJylcblx0XHRcdH1cblxuXHRcdFx0dmFyIHBsdWdpblByb3BlcnRpZXMgPSBwbHVnaW4uY2FsbCh0aGlzKVxuXHRcdFx0aWYgKCFpc09iamVjdChwbHVnaW5Qcm9wZXJ0aWVzKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1BsdWdpbnMgbXVzdCByZXR1cm4gYW4gb2JqZWN0IG9mIGZ1bmN0aW9uIHByb3BlcnRpZXMnKVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgdGhlIHBsdWdpbiBmdW5jdGlvbiBwcm9wZXJ0aWVzIHRvIHRoaXMgc3RvcmUgaW5zdGFuY2UuXG5cdFx0XHRlYWNoKHBsdWdpblByb3BlcnRpZXMsIGZ1bmN0aW9uKHBsdWdpbkZuUHJvcCwgcHJvcE5hbWUpIHtcblx0XHRcdFx0aWYgKCFpc0Z1bmN0aW9uKHBsdWdpbkZuUHJvcCkpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwbHVnaW4gcHJvcGVydHk6ICcrcHJvcE5hbWUrJyBmcm9tIHBsdWdpbiAnK3BsdWdpbi5uYW1lKycuIFBsdWdpbnMgc2hvdWxkIG9ubHkgcmV0dXJuIGZ1bmN0aW9ucy4nKVxuXHRcdFx0XHR9XG5cdFx0XHRcdHNlbGYuX2Fzc2lnblBsdWdpbkZuUHJvcChwbHVnaW5GblByb3AsIHByb3BOYW1lKVxuXHRcdFx0fSlcblx0XHR9LFxuXHRcdFxuXHRcdC8vIFB1dCBkZXByZWNhdGVkIHByb3BlcnRpZXMgaW4gdGhlIHByaXZhdGUgQVBJLCBzbyBhcyB0byBub3QgZXhwb3NlIGl0IHRvIGFjY2lkZW50aWFsXG5cdFx0Ly8gZGlzY292ZXJ5IHRocm91Z2ggaW5zcGVjdGlvbiBvZiB0aGUgc3RvcmUgb2JqZWN0LlxuXHRcdFxuXHRcdC8vIERlcHJlY2F0ZWQ6IGFkZFN0b3JhZ2Vcblx0XHRhZGRTdG9yYWdlOiBmdW5jdGlvbihzdG9yYWdlKSB7XG5cdFx0XHRfd2Fybignc3RvcmUuYWRkU3RvcmFnZShzdG9yYWdlKSBpcyBkZXByZWNhdGVkLiBVc2UgY3JlYXRlU3RvcmUoW3N0b3JhZ2VzXSknKVxuXHRcdFx0dGhpcy5fYWRkU3RvcmFnZShzdG9yYWdlKVxuXHRcdH1cblx0fVxuXG5cdHZhciBzdG9yZSA9IGNyZWF0ZShfcHJpdmF0ZVN0b3JlUHJvcHMsIHN0b3JlQVBJLCB7XG5cdFx0cGx1Z2luczogW11cblx0fSlcblx0c3RvcmUucmF3ID0ge31cblx0ZWFjaChzdG9yZSwgZnVuY3Rpb24ocHJvcCwgcHJvcE5hbWUpIHtcblx0XHRpZiAoaXNGdW5jdGlvbihwcm9wKSkge1xuXHRcdFx0c3RvcmUucmF3W3Byb3BOYW1lXSA9IGJpbmQoc3RvcmUsIHByb3ApXHRcdFx0XG5cdFx0fVxuXHR9KVxuXHRlYWNoKHN0b3JhZ2VzLCBmdW5jdGlvbihzdG9yYWdlKSB7XG5cdFx0c3RvcmUuX2FkZFN0b3JhZ2Uoc3RvcmFnZSlcblx0fSlcblx0ZWFjaChwbHVnaW5zLCBmdW5jdGlvbihwbHVnaW4pIHtcblx0XHRzdG9yZS5fYWRkUGx1Z2luKHBsdWdpbilcblx0fSlcblx0cmV0dXJuIHN0b3JlXG59XG4iLCJ2YXIgYXNzaWduID0gbWFrZV9hc3NpZ24oKVxudmFyIGNyZWF0ZSA9IG1ha2VfY3JlYXRlKClcbnZhciB0cmltID0gbWFrZV90cmltKClcbnZhciBHbG9iYWwgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBnbG9iYWwpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRhc3NpZ246IGFzc2lnbixcblx0Y3JlYXRlOiBjcmVhdGUsXG5cdHRyaW06IHRyaW0sXG5cdGJpbmQ6IGJpbmQsXG5cdHNsaWNlOiBzbGljZSxcblx0ZWFjaDogZWFjaCxcblx0bWFwOiBtYXAsXG5cdHBsdWNrOiBwbHVjayxcblx0aXNMaXN0OiBpc0xpc3QsXG5cdGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG5cdGlzT2JqZWN0OiBpc09iamVjdCxcblx0R2xvYmFsOiBHbG9iYWxcbn1cblxuZnVuY3Rpb24gbWFrZV9hc3NpZ24oKSB7XG5cdGlmIChPYmplY3QuYXNzaWduKSB7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ25cblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gc2hpbUFzc2lnbihvYmosIHByb3BzMSwgcHJvcHMyLCBldGMpIHtcblx0XHRcdGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGVhY2goT2JqZWN0KGFyZ3VtZW50c1tpXSksIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG5cdFx0XHRcdFx0b2JqW2tleV0gPSB2YWxcblx0XHRcdFx0fSlcblx0XHRcdH1cdFx0XHRcblx0XHRcdHJldHVybiBvYmpcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbWFrZV9jcmVhdGUoKSB7XG5cdGlmIChPYmplY3QuY3JlYXRlKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZShvYmosIGFzc2lnblByb3BzMSwgYXNzaWduUHJvcHMyLCBldGMpIHtcblx0XHRcdHZhciBhc3NpZ25BcmdzTGlzdCA9IHNsaWNlKGFyZ3VtZW50cywgMSlcblx0XHRcdHJldHVybiBhc3NpZ24uYXBwbHkodGhpcywgW09iamVjdC5jcmVhdGUob2JqKV0uY29uY2F0KGFzc2lnbkFyZ3NMaXN0KSlcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0ZnVuY3Rpb24gRigpIHt9IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW5uZXItZGVjbGFyYXRpb25zXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZShvYmosIGFzc2lnblByb3BzMSwgYXNzaWduUHJvcHMyLCBldGMpIHtcblx0XHRcdHZhciBhc3NpZ25BcmdzTGlzdCA9IHNsaWNlKGFyZ3VtZW50cywgMSlcblx0XHRcdEYucHJvdG90eXBlID0gb2JqXG5cdFx0XHRyZXR1cm4gYXNzaWduLmFwcGx5KHRoaXMsIFtuZXcgRigpXS5jb25jYXQoYXNzaWduQXJnc0xpc3QpKVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBtYWtlX3RyaW0oKSB7XG5cdGlmIChTdHJpbmcucHJvdG90eXBlLnRyaW0pIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gdHJpbShzdHIpIHtcblx0XHRcdHJldHVybiBTdHJpbmcucHJvdG90eXBlLnRyaW0uY2FsbChzdHIpXG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBmdW5jdGlvbiB0cmltKHN0cikge1xuXHRcdFx0cmV0dXJuIHN0ci5yZXBsYWNlKC9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvZywgJycpXG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGJpbmQob2JqLCBmbikge1xuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZuLmFwcGx5KG9iaiwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSlcblx0fVxufVxuXG5mdW5jdGlvbiBzbGljZShhcnIsIGluZGV4KSB7XG5cdHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIsIGluZGV4IHx8IDApXG59XG5cbmZ1bmN0aW9uIGVhY2gob2JqLCBmbikge1xuXHRwbHVjayhvYmosIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG5cdFx0Zm4odmFsLCBrZXkpXG5cdFx0cmV0dXJuIGZhbHNlXG5cdH0pXG59XG5cbmZ1bmN0aW9uIG1hcChvYmosIGZuKSB7XG5cdHZhciByZXMgPSAoaXNMaXN0KG9iaikgPyBbXSA6IHt9KVxuXHRwbHVjayhvYmosIGZ1bmN0aW9uKHYsIGspIHtcblx0XHRyZXNba10gPSBmbih2LCBrKVxuXHRcdHJldHVybiBmYWxzZVxuXHR9KVxuXHRyZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIHBsdWNrKG9iaiwgZm4pIHtcblx0aWYgKGlzTGlzdChvYmopKSB7XG5cdFx0Zm9yICh2YXIgaT0wOyBpPG9iai5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGZuKG9ialtpXSwgaSkpIHtcblx0XHRcdFx0cmV0dXJuIG9ialtpXVxuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG5cdFx0XHRpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0aWYgKGZuKG9ialtrZXldLCBrZXkpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9ialtrZXldXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gaXNMaXN0KHZhbCkge1xuXHRyZXR1cm4gKHZhbCAhPSBudWxsICYmIHR5cGVvZiB2YWwgIT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsLmxlbmd0aCA9PSAnbnVtYmVyJylcbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWwpIHtcblx0cmV0dXJuIHZhbCAmJiB7fS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSdcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG5cdHJldHVybiB2YWwgJiYge30udG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBPYmplY3RdJ1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBbXG5cdC8vIExpc3RlZCBpbiBvcmRlciBvZiB1c2FnZSBwcmVmZXJlbmNlXG5cdHJlcXVpcmUoJy4vbG9jYWxTdG9yYWdlJyksXG5cdHJlcXVpcmUoJy4vb2xkRkYtZ2xvYmFsU3RvcmFnZScpLFxuXHRyZXF1aXJlKCcuL29sZElFLXVzZXJEYXRhU3RvcmFnZScpLFxuXHRyZXF1aXJlKCcuL2Nvb2tpZVN0b3JhZ2UnKSxcblx0cmVxdWlyZSgnLi9zZXNzaW9uU3RvcmFnZScpLFxuXHRyZXF1aXJlKCcuL21lbW9yeVN0b3JhZ2UnKVxuXVxuIiwiLy8gY29va2llU3RvcmFnZSBpcyB1c2VmdWwgU2FmYXJpIHByaXZhdGUgYnJvd3NlciBtb2RlLCB3aGVyZSBsb2NhbFN0b3JhZ2Vcbi8vIGRvZXNuJ3Qgd29yayBidXQgY29va2llcyBkby4gVGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBhZG9wdGVkIGZyb21cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9TdG9yYWdlL0xvY2FsU3RvcmFnZVxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3NyYy91dGlsJylcbnZhciBHbG9iYWwgPSB1dGlsLkdsb2JhbFxudmFyIHRyaW0gPSB1dGlsLnRyaW1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG5hbWU6ICdjb29raWVTdG9yYWdlJyxcblx0cmVhZDogcmVhZCxcblx0d3JpdGU6IHdyaXRlLFxuXHRlYWNoOiBlYWNoLFxuXHRyZW1vdmU6IHJlbW92ZSxcblx0Y2xlYXJBbGw6IGNsZWFyQWxsLFxufVxuXG52YXIgZG9jID0gR2xvYmFsLmRvY3VtZW50XG5cbmZ1bmN0aW9uIHJlYWQoa2V5KSB7XG5cdGlmICgha2V5IHx8ICFfaGFzKGtleSkpIHsgcmV0dXJuIG51bGwgfVxuXHR2YXIgcmVnZXhwU3RyID0gXCIoPzpefC4qO1xcXFxzKilcIiArXG5cdFx0ZXNjYXBlKGtleSkucmVwbGFjZSgvW1xcLVxcLlxcK1xcKl0vZywgXCJcXFxcJCZcIikgK1xuXHRcdFwiXFxcXHMqXFxcXD1cXFxccyooKD86W147XSg/ITspKSpbXjtdPykuKlwiXG5cdHJldHVybiB1bmVzY2FwZShkb2MuY29va2llLnJlcGxhY2UobmV3IFJlZ0V4cChyZWdleHBTdHIpLCBcIiQxXCIpKVxufVxuXG5mdW5jdGlvbiBlYWNoKGNhbGxiYWNrKSB7XG5cdHZhciBjb29raWVzID0gZG9jLmNvb2tpZS5zcGxpdCgvOyA/L2cpXG5cdGZvciAodmFyIGkgPSBjb29raWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0aWYgKCF0cmltKGNvb2tpZXNbaV0pKSB7XG5cdFx0XHRjb250aW51ZVxuXHRcdH1cblx0XHR2YXIga3ZwID0gY29va2llc1tpXS5zcGxpdCgnPScpXG5cdFx0dmFyIGtleSA9IHVuZXNjYXBlKGt2cFswXSlcblx0XHR2YXIgdmFsID0gdW5lc2NhcGUoa3ZwWzFdKVxuXHRcdGNhbGxiYWNrKHZhbCwga2V5KVxuXHR9XG59XG5cbmZ1bmN0aW9uIHdyaXRlKGtleSwgZGF0YSkge1xuXHRpZigha2V5KSB7IHJldHVybiB9XG5cdGRvYy5jb29raWUgPSBlc2NhcGUoa2V5KSArIFwiPVwiICsgZXNjYXBlKGRhdGEpICsgXCI7IGV4cGlyZXM9VHVlLCAxOSBKYW4gMjAzOCAwMzoxNDowNyBHTVQ7IHBhdGg9L1wiXG59XG5cbmZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcblx0aWYgKCFrZXkgfHwgIV9oYXMoa2V5KSkge1xuXHRcdHJldHVyblxuXHR9XG5cdGRvYy5jb29raWUgPSBlc2NhcGUoa2V5KSArIFwiPTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIEdNVDsgcGF0aD0vXCJcbn1cblxuZnVuY3Rpb24gY2xlYXJBbGwoKSB7XG5cdGVhY2goZnVuY3Rpb24oXywga2V5KSB7XG5cdFx0cmVtb3ZlKGtleSlcblx0fSlcbn1cblxuZnVuY3Rpb24gX2hhcyhrZXkpIHtcblx0cmV0dXJuIChuZXcgUmVnRXhwKFwiKD86Xnw7XFxcXHMqKVwiICsgZXNjYXBlKGtleSkucmVwbGFjZSgvW1xcLVxcLlxcK1xcKl0vZywgXCJcXFxcJCZcIikgKyBcIlxcXFxzKlxcXFw9XCIpKS50ZXN0KGRvYy5jb29raWUpXG59XG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3NyYy91dGlsJylcbnZhciBHbG9iYWwgPSB1dGlsLkdsb2JhbFxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0bmFtZTogJ2xvY2FsU3RvcmFnZScsXG5cdHJlYWQ6IHJlYWQsXG5cdHdyaXRlOiB3cml0ZSxcblx0ZWFjaDogZWFjaCxcblx0cmVtb3ZlOiByZW1vdmUsXG5cdGNsZWFyQWxsOiBjbGVhckFsbCxcbn1cblxuZnVuY3Rpb24gbG9jYWxTdG9yYWdlKCkge1xuXHRyZXR1cm4gR2xvYmFsLmxvY2FsU3RvcmFnZVxufVxuXG5mdW5jdGlvbiByZWFkKGtleSkge1xuXHRyZXR1cm4gbG9jYWxTdG9yYWdlKCkuZ2V0SXRlbShrZXkpXG59XG5cbmZ1bmN0aW9uIHdyaXRlKGtleSwgZGF0YSkge1xuXHRyZXR1cm4gbG9jYWxTdG9yYWdlKCkuc2V0SXRlbShrZXksIGRhdGEpXG59XG5cbmZ1bmN0aW9uIGVhY2goZm4pIHtcblx0Zm9yICh2YXIgaSA9IGxvY2FsU3RvcmFnZSgpLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0dmFyIGtleSA9IGxvY2FsU3RvcmFnZSgpLmtleShpKVxuXHRcdGZuKHJlYWQoa2V5KSwga2V5KVxuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcblx0cmV0dXJuIGxvY2FsU3RvcmFnZSgpLnJlbW92ZUl0ZW0oa2V5KVxufVxuXG5mdW5jdGlvbiBjbGVhckFsbCgpIHtcblx0cmV0dXJuIGxvY2FsU3RvcmFnZSgpLmNsZWFyKClcbn1cbiIsIi8vIG1lbW9yeVN0b3JhZ2UgaXMgYSB1c2VmdWwgbGFzdCBmYWxsYmFjayB0byBlbnN1cmUgdGhhdCB0aGUgc3RvcmVcbi8vIGlzIGZ1bmN0aW9ucyAobWVhbmluZyBzdG9yZS5nZXQoKSwgc3RvcmUuc2V0KCksIGV0YyB3aWxsIGFsbCBmdW5jdGlvbikuXG4vLyBIb3dldmVyLCBzdG9yZWQgdmFsdWVzIHdpbGwgbm90IHBlcnNpc3Qgd2hlbiB0aGUgYnJvd3NlciBuYXZpZ2F0ZXMgdG9cbi8vIGEgbmV3IHBhZ2Ugb3IgcmVsb2FkcyB0aGUgY3VycmVudCBwYWdlLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0bmFtZTogJ21lbW9yeVN0b3JhZ2UnLFxuXHRyZWFkOiByZWFkLFxuXHR3cml0ZTogd3JpdGUsXG5cdGVhY2g6IGVhY2gsXG5cdHJlbW92ZTogcmVtb3ZlLFxuXHRjbGVhckFsbDogY2xlYXJBbGwsXG59XG5cbnZhciBtZW1vcnlTdG9yYWdlID0ge31cblxuZnVuY3Rpb24gcmVhZChrZXkpIHtcblx0cmV0dXJuIG1lbW9yeVN0b3JhZ2Vba2V5XVxufVxuXG5mdW5jdGlvbiB3cml0ZShrZXksIGRhdGEpIHtcblx0bWVtb3J5U3RvcmFnZVtrZXldID0gZGF0YVxufVxuXG5mdW5jdGlvbiBlYWNoKGNhbGxiYWNrKSB7XG5cdGZvciAodmFyIGtleSBpbiBtZW1vcnlTdG9yYWdlKSB7XG5cdFx0aWYgKG1lbW9yeVN0b3JhZ2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0Y2FsbGJhY2sobWVtb3J5U3RvcmFnZVtrZXldLCBrZXkpXG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcblx0ZGVsZXRlIG1lbW9yeVN0b3JhZ2Vba2V5XVxufVxuXG5mdW5jdGlvbiBjbGVhckFsbChrZXkpIHtcblx0bWVtb3J5U3RvcmFnZSA9IHt9XG59XG4iLCIvLyBvbGRGRi1nbG9iYWxTdG9yYWdlIHByb3ZpZGVzIHN0b3JhZ2UgZm9yIEZpcmVmb3hcbi8vIHZlcnNpb25zIDYgYW5kIDcsIHdoZXJlIG5vIGxvY2FsU3RvcmFnZSwgZXRjXG4vLyBpcyBhdmFpbGFibGUuXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vc3JjL3V0aWwnKVxudmFyIEdsb2JhbCA9IHV0aWwuR2xvYmFsXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRuYW1lOiAnb2xkRkYtZ2xvYmFsU3RvcmFnZScsXG5cdHJlYWQ6IHJlYWQsXG5cdHdyaXRlOiB3cml0ZSxcblx0ZWFjaDogZWFjaCxcblx0cmVtb3ZlOiByZW1vdmUsXG5cdGNsZWFyQWxsOiBjbGVhckFsbCxcbn1cblxudmFyIGdsb2JhbFN0b3JhZ2UgPSBHbG9iYWwuZ2xvYmFsU3RvcmFnZVxuXG5mdW5jdGlvbiByZWFkKGtleSkge1xuXHRyZXR1cm4gZ2xvYmFsU3RvcmFnZVtrZXldXG59XG5cbmZ1bmN0aW9uIHdyaXRlKGtleSwgZGF0YSkge1xuXHRnbG9iYWxTdG9yYWdlW2tleV0gPSBkYXRhXG59XG5cbmZ1bmN0aW9uIGVhY2goZm4pIHtcblx0Zm9yICh2YXIgaSA9IGdsb2JhbFN0b3JhZ2UubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHR2YXIga2V5ID0gZ2xvYmFsU3RvcmFnZS5rZXkoaSlcblx0XHRmbihnbG9iYWxTdG9yYWdlW2tleV0sIGtleSlcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmUoa2V5KSB7XG5cdHJldHVybiBnbG9iYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KVxufVxuXG5mdW5jdGlvbiBjbGVhckFsbCgpIHtcblx0ZWFjaChmdW5jdGlvbihrZXksIF8pIHtcblx0XHRkZWxldGUgZ2xvYmFsU3RvcmFnZVtrZXldXG5cdH0pXG59XG4iLCIvLyBvbGRJRS11c2VyRGF0YVN0b3JhZ2UgcHJvdmlkZXMgc3RvcmFnZSBmb3IgSW50ZXJuZXQgRXhwbG9yZXJcbi8vIHZlcnNpb25zIDYgYW5kIDcsIHdoZXJlIG5vIGxvY2FsU3RvcmFnZSwgc2Vzc2lvblN0b3JhZ2UsIGV0Y1xuLy8gaXMgYXZhaWxhYmxlLlxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3NyYy91dGlsJylcbnZhciBHbG9iYWwgPSB1dGlsLkdsb2JhbFxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0bmFtZTogJ29sZElFLXVzZXJEYXRhU3RvcmFnZScsXG5cdHdyaXRlOiB3cml0ZSxcblx0cmVhZDogcmVhZCxcblx0ZWFjaDogZWFjaCxcblx0cmVtb3ZlOiByZW1vdmUsXG5cdGNsZWFyQWxsOiBjbGVhckFsbCxcbn1cblxudmFyIHN0b3JhZ2VOYW1lID0gJ3N0b3JlanMnXG52YXIgZG9jID0gR2xvYmFsLmRvY3VtZW50XG52YXIgX3dpdGhTdG9yYWdlRWwgPSBfbWFrZUlFU3RvcmFnZUVsRnVuY3Rpb24oKVxudmFyIGRpc2FibGUgPSAoR2xvYmFsLm5hdmlnYXRvciA/IEdsb2JhbC5uYXZpZ2F0b3IudXNlckFnZW50IDogJycpLm1hdGNoKC8gKE1TSUUgOHxNU0lFIDl8TVNJRSAxMClcXC4vKSAvLyBNU0lFIDkueCwgTVNJRSAxMC54XG5cbmZ1bmN0aW9uIHdyaXRlKHVuZml4ZWRLZXksIGRhdGEpIHtcblx0aWYgKGRpc2FibGUpIHsgcmV0dXJuIH1cblx0dmFyIGZpeGVkS2V5ID0gZml4S2V5KHVuZml4ZWRLZXkpXG5cdF93aXRoU3RvcmFnZUVsKGZ1bmN0aW9uKHN0b3JhZ2VFbCkge1xuXHRcdHN0b3JhZ2VFbC5zZXRBdHRyaWJ1dGUoZml4ZWRLZXksIGRhdGEpXG5cdFx0c3RvcmFnZUVsLnNhdmUoc3RvcmFnZU5hbWUpXG5cdH0pXG59XG5cbmZ1bmN0aW9uIHJlYWQodW5maXhlZEtleSkge1xuXHRpZiAoZGlzYWJsZSkgeyByZXR1cm4gfVxuXHR2YXIgZml4ZWRLZXkgPSBmaXhLZXkodW5maXhlZEtleSlcblx0dmFyIHJlcyA9IG51bGxcblx0X3dpdGhTdG9yYWdlRWwoZnVuY3Rpb24oc3RvcmFnZUVsKSB7XG5cdFx0cmVzID0gc3RvcmFnZUVsLmdldEF0dHJpYnV0ZShmaXhlZEtleSlcblx0fSlcblx0cmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBlYWNoKGNhbGxiYWNrKSB7XG5cdF93aXRoU3RvcmFnZUVsKGZ1bmN0aW9uKHN0b3JhZ2VFbCkge1xuXHRcdHZhciBhdHRyaWJ1dGVzID0gc3RvcmFnZUVsLlhNTERvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hdHRyaWJ1dGVzXG5cdFx0Zm9yICh2YXIgaT1hdHRyaWJ1dGVzLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcblx0XHRcdHZhciBhdHRyID0gYXR0cmlidXRlc1tpXVxuXHRcdFx0Y2FsbGJhY2soc3RvcmFnZUVsLmdldEF0dHJpYnV0ZShhdHRyLm5hbWUpLCBhdHRyLm5hbWUpXG5cdFx0fVxuXHR9KVxufVxuXG5mdW5jdGlvbiByZW1vdmUodW5maXhlZEtleSkge1xuXHR2YXIgZml4ZWRLZXkgPSBmaXhLZXkodW5maXhlZEtleSlcblx0X3dpdGhTdG9yYWdlRWwoZnVuY3Rpb24oc3RvcmFnZUVsKSB7XG5cdFx0c3RvcmFnZUVsLnJlbW92ZUF0dHJpYnV0ZShmaXhlZEtleSlcblx0XHRzdG9yYWdlRWwuc2F2ZShzdG9yYWdlTmFtZSlcblx0fSlcbn1cblxuZnVuY3Rpb24gY2xlYXJBbGwoKSB7XG5cdF93aXRoU3RvcmFnZUVsKGZ1bmN0aW9uKHN0b3JhZ2VFbCkge1xuXHRcdHZhciBhdHRyaWJ1dGVzID0gc3RvcmFnZUVsLlhNTERvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hdHRyaWJ1dGVzXG5cdFx0c3RvcmFnZUVsLmxvYWQoc3RvcmFnZU5hbWUpXG5cdFx0Zm9yICh2YXIgaT1hdHRyaWJ1dGVzLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcblx0XHRcdHN0b3JhZ2VFbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlc1tpXS5uYW1lKVxuXHRcdH1cblx0XHRzdG9yYWdlRWwuc2F2ZShzdG9yYWdlTmFtZSlcblx0fSlcbn1cblxuLy8gSGVscGVyc1xuLy8vLy8vLy8vL1xuXG4vLyBJbiBJRTcsIGtleXMgY2Fubm90IHN0YXJ0IHdpdGggYSBkaWdpdCBvciBjb250YWluIGNlcnRhaW4gY2hhcnMuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21hcmN1c3dlc3Rpbi9zdG9yZS5qcy9pc3N1ZXMvNDBcbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbWFyY3Vzd2VzdGluL3N0b3JlLmpzL2lzc3Vlcy84M1xudmFyIGZvcmJpZGRlbkNoYXJzUmVnZXggPSBuZXcgUmVnRXhwKFwiWyFcXFwiIyQlJicoKSorLC9cXFxcXFxcXDo7PD0+P0BbXFxcXF1eYHt8fX5dXCIsIFwiZ1wiKVxuZnVuY3Rpb24gZml4S2V5KGtleSkge1xuXHRyZXR1cm4ga2V5LnJlcGxhY2UoL15cXGQvLCAnX19fJCYnKS5yZXBsYWNlKGZvcmJpZGRlbkNoYXJzUmVnZXgsICdfX18nKVxufVxuXG5mdW5jdGlvbiBfbWFrZUlFU3RvcmFnZUVsRnVuY3Rpb24oKSB7XG5cdGlmICghZG9jIHx8ICFkb2MuZG9jdW1lbnRFbGVtZW50IHx8ICFkb2MuZG9jdW1lbnRFbGVtZW50LmFkZEJlaGF2aW9yKSB7XG5cdFx0cmV0dXJuIG51bGxcblx0fVxuXHR2YXIgc2NyaXB0VGFnID0gJ3NjcmlwdCcsXG5cdFx0c3RvcmFnZU93bmVyLFxuXHRcdHN0b3JhZ2VDb250YWluZXIsXG5cdFx0c3RvcmFnZUVsXG5cblx0Ly8gU2luY2UgI3VzZXJEYXRhIHN0b3JhZ2UgYXBwbGllcyBvbmx5IHRvIHNwZWNpZmljIHBhdGhzLCB3ZSBuZWVkIHRvXG5cdC8vIHNvbWVob3cgbGluayBvdXIgZGF0YSB0byBhIHNwZWNpZmljIHBhdGguICBXZSBjaG9vc2UgL2Zhdmljb24uaWNvXG5cdC8vIGFzIGEgcHJldHR5IHNhZmUgb3B0aW9uLCBzaW5jZSBhbGwgYnJvd3NlcnMgYWxyZWFkeSBtYWtlIGEgcmVxdWVzdCB0b1xuXHQvLyB0aGlzIFVSTCBhbnl3YXkgYW5kIGJlaW5nIGEgNDA0IHdpbGwgbm90IGh1cnQgdXMgaGVyZS4gIFdlIHdyYXAgYW5cblx0Ly8gaWZyYW1lIHBvaW50aW5nIHRvIHRoZSBmYXZpY29uIGluIGFuIEFjdGl2ZVhPYmplY3QoaHRtbGZpbGUpIG9iamVjdFxuXHQvLyAoc2VlOiBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvYWE3NTI1NzQodj1WUy44NSkuYXNweClcblx0Ly8gc2luY2UgdGhlIGlmcmFtZSBhY2Nlc3MgcnVsZXMgYXBwZWFyIHRvIGFsbG93IGRpcmVjdCBhY2Nlc3MgYW5kXG5cdC8vIG1hbmlwdWxhdGlvbiBvZiB0aGUgZG9jdW1lbnQgZWxlbWVudCwgZXZlbiBmb3IgYSA0MDQgcGFnZS4gIFRoaXNcblx0Ly8gZG9jdW1lbnQgY2FuIGJlIHVzZWQgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBkb2N1bWVudCAod2hpY2ggd291bGRcblx0Ly8gaGF2ZSBiZWVuIGxpbWl0ZWQgdG8gdGhlIGN1cnJlbnQgcGF0aCkgdG8gcGVyZm9ybSAjdXNlckRhdGEgc3RvcmFnZS5cblx0dHJ5IHtcblx0XHQvKiBnbG9iYWwgQWN0aXZlWE9iamVjdCAqL1xuXHRcdHN0b3JhZ2VDb250YWluZXIgPSBuZXcgQWN0aXZlWE9iamVjdCgnaHRtbGZpbGUnKVxuXHRcdHN0b3JhZ2VDb250YWluZXIub3BlbigpXG5cdFx0c3RvcmFnZUNvbnRhaW5lci53cml0ZSgnPCcrc2NyaXB0VGFnKyc+ZG9jdW1lbnQudz13aW5kb3c8Lycrc2NyaXB0VGFnKyc+PGlmcmFtZSBzcmM9XCIvZmF2aWNvbi5pY29cIj48L2lmcmFtZT4nKVxuXHRcdHN0b3JhZ2VDb250YWluZXIuY2xvc2UoKVxuXHRcdHN0b3JhZ2VPd25lciA9IHN0b3JhZ2VDb250YWluZXIudy5mcmFtZXNbMF0uZG9jdW1lbnRcblx0XHRzdG9yYWdlRWwgPSBzdG9yYWdlT3duZXIuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0fSBjYXRjaChlKSB7XG5cdFx0Ly8gc29tZWhvdyBBY3RpdmVYT2JqZWN0IGluc3RhbnRpYXRpb24gZmFpbGVkIChwZXJoYXBzIHNvbWUgc3BlY2lhbFxuXHRcdC8vIHNlY3VyaXR5IHNldHRpbmdzIG9yIG90aGVyd3NlKSwgZmFsbCBiYWNrIHRvIHBlci1wYXRoIHN0b3JhZ2Vcblx0XHRzdG9yYWdlRWwgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRzdG9yYWdlT3duZXIgPSBkb2MuYm9keVxuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uKHN0b3JlRnVuY3Rpb24pIHtcblx0XHR2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKVxuXHRcdGFyZ3MudW5zaGlmdChzdG9yYWdlRWwpXG5cdFx0Ly8gU2VlIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczUzMTA4MSh2PVZTLjg1KS5hc3B4XG5cdFx0Ly8gYW5kIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczUzMTQyNCh2PVZTLjg1KS5hc3B4XG5cdFx0c3RvcmFnZU93bmVyLmFwcGVuZENoaWxkKHN0b3JhZ2VFbClcblx0XHRzdG9yYWdlRWwuYWRkQmVoYXZpb3IoJyNkZWZhdWx0I3VzZXJEYXRhJylcblx0XHRzdG9yYWdlRWwubG9hZChzdG9yYWdlTmFtZSlcblx0XHRzdG9yZUZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpXG5cdFx0c3RvcmFnZU93bmVyLnJlbW92ZUNoaWxkKHN0b3JhZ2VFbClcblx0XHRyZXR1cm5cblx0fVxufVxuIiwidmFyIHV0aWwgPSByZXF1aXJlKCcuLi9zcmMvdXRpbCcpXG52YXIgR2xvYmFsID0gdXRpbC5HbG9iYWxcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG5hbWU6ICdzZXNzaW9uU3RvcmFnZScsXG5cdHJlYWQ6IHJlYWQsXG5cdHdyaXRlOiB3cml0ZSxcblx0ZWFjaDogZWFjaCxcblx0cmVtb3ZlOiByZW1vdmUsXG5cdGNsZWFyQWxsOiBjbGVhckFsbFxufVxuXG5mdW5jdGlvbiBzZXNzaW9uU3RvcmFnZSgpIHtcblx0cmV0dXJuIEdsb2JhbC5zZXNzaW9uU3RvcmFnZVxufVxuXG5mdW5jdGlvbiByZWFkKGtleSkge1xuXHRyZXR1cm4gc2Vzc2lvblN0b3JhZ2UoKS5nZXRJdGVtKGtleSlcbn1cblxuZnVuY3Rpb24gd3JpdGUoa2V5LCBkYXRhKSB7XG5cdHJldHVybiBzZXNzaW9uU3RvcmFnZSgpLnNldEl0ZW0oa2V5LCBkYXRhKVxufVxuXG5mdW5jdGlvbiBlYWNoKGZuKSB7XG5cdGZvciAodmFyIGkgPSBzZXNzaW9uU3RvcmFnZSgpLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0dmFyIGtleSA9IHNlc3Npb25TdG9yYWdlKCkua2V5KGkpXG5cdFx0Zm4ocmVhZChrZXkpLCBrZXkpXG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlKGtleSkge1xuXHRyZXR1cm4gc2Vzc2lvblN0b3JhZ2UoKS5yZW1vdmVJdGVtKGtleSlcbn1cblxuZnVuY3Rpb24gY2xlYXJBbGwoKSB7XG5cdHJldHVybiBzZXNzaW9uU3RvcmFnZSgpLmNsZWFyKClcbn1cbiIsInZhciBBZGFwdGVycywgU3RvcmFnZSwgdXRpbHMsXG4gIGJpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG51dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuU3RvcmFnZSA9IHJlcXVpcmUoJy4vc3RvcmFnZScpO1xuXG5BZGFwdGVycyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQWRhcHRlcnMoKSB7fVxuXG4gIEFkYXB0ZXJzLkdpbWVsQWRhcHRlciA9IChmdW5jdGlvbigpIHtcbiAgICBHaW1lbEFkYXB0ZXIucHJvdG90eXBlLnF1ZXVlX25hbWUgPSAnX2dpbWVsX3F1ZXVlJztcblxuICAgIGZ1bmN0aW9uIEdpbWVsQWRhcHRlcih1cmwsIG5hbWVzcGFjZSwgc3RvcmFnZSkge1xuICAgICAgaWYgKHN0b3JhZ2UgPT0gbnVsbCkge1xuICAgICAgICBzdG9yYWdlID0gQWRhcHRlcnMuTG9jYWxTdG9yYWdlQWRhcHRlcjtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ29hbF9jb21wbGV0ZSA9IGJpbmQodGhpcy5nb2FsX2NvbXBsZXRlLCB0aGlzKTtcbiAgICAgIHRoaXMuZXhwZXJpbWVudF9zdGFydCA9IGJpbmQodGhpcy5leHBlcmltZW50X3N0YXJ0LCB0aGlzKTtcbiAgICAgIHRoaXMuX3N0b3JhZ2UgPSBzdG9yYWdlO1xuICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICB0aGlzLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcbiAgICAgIHRoaXMuX3F1ZXVlID0gSlNPTi5wYXJzZSh0aGlzLl9zdG9yYWdlLmdldCh0aGlzLnF1ZXVlX25hbWUpIHx8ICdbXScpO1xuICAgICAgdGhpcy5fZmx1c2goKTtcbiAgICB9XG5cbiAgICBHaW1lbEFkYXB0ZXIucHJvdG90eXBlLl9yZW1vdmVfcXV1aWQgPSBmdW5jdGlvbihxdXVpZCkge1xuICAgICAgcmV0dXJuIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHV0aWxzLnJlbW92ZShfdGhpcy5fcXVldWUsIGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gZWwucHJvcGVydGllcy5fcXV1aWQgPT09IHF1dWlkO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBfdGhpcy5fc3RvcmFnZS5zZXQoX3RoaXMucXVldWVfbmFtZSwgSlNPTi5zdHJpbmdpZnkoX3RoaXMuX3F1ZXVlKSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKTtcbiAgICB9O1xuXG4gICAgR2ltZWxBZGFwdGVyLnByb3RvdHlwZS5fanF1ZXJ5X2dldCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgIHV0aWxzLmxvZygnc2VuZCByZXF1ZXN0IHVzaW5nIGpRdWVyeScpO1xuICAgICAgcmV0dXJuIHdpbmRvdy5qUXVlcnkuYWpheCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBzdWNjZXNzOiBjYWxsYmFja1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIEdpbWVsQWRhcHRlci5wcm90b3R5cGUuX3BsYWluX2pzX2dldCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBrLCBwYXJhbXMsIHYsIHhocjtcbiAgICAgIHV0aWxzLmxvZygnZmFsbGJhY2sgb24gcGxhaW4ganMgeGhyJyk7XG4gICAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHBhcmFtcyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlc3VsdHM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChrIGluIGRhdGEpIHtcbiAgICAgICAgICB2ID0gZGF0YVtrXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goKGVuY29kZVVSSUNvbXBvbmVudChrKSkgKyBcIj1cIiArIChlbmNvZGVVUklDb21wb25lbnQodikpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH0pKCk7XG4gICAgICBwYXJhbXMgPSBwYXJhbXMuam9pbignJicpLnJlcGxhY2UoLyUyMC9nLCAnKycpO1xuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCArIFwiP1wiICsgcGFyYW1zKTtcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHhoci5zZW5kKCk7XG4gICAgfTtcblxuICAgIEdpbWVsQWRhcHRlci5wcm90b3R5cGUuX2FqYXhfZ2V0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjYWxsYmFjaykge1xuICAgICAgdmFyIHJlZjtcbiAgICAgIGlmICgocmVmID0gd2luZG93LmpRdWVyeSkgIT0gbnVsbCA/IHJlZi5hamF4IDogdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9qcXVlcnlfZ2V0KHVybCwgZGF0YSwgY2FsbGJhY2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BsYWluX2pzX2dldCh1cmwsIGRhdGEsIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgR2ltZWxBZGFwdGVyLnByb3RvdHlwZS5fZmx1c2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjYWxsYmFjaywgaSwgaXRlbSwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgICByZWYgPSB0aGlzLl9xdWV1ZTtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpdGVtID0gcmVmW2ldO1xuICAgICAgICBjYWxsYmFjayA9IHRoaXMuX3JlbW92ZV9xdXVpZChpdGVtLnByb3BlcnRpZXMuX3F1dWlkKTtcbiAgICAgICAgdGhpcy5fYWpheF9nZXQodGhpcy51cmwsIHV0aWxzLm9taXQoaXRlbS5wcm9wZXJ0aWVzLCAnX3F1dWlkJyksIGNhbGxiYWNrKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKG51bGwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfTtcblxuICAgIEdpbWVsQWRhcHRlci5wcm90b3R5cGUuX3VzZXJfdXVpZCA9IGZ1bmN0aW9uKGV4cGVyaW1lbnQsIGdvYWwpIHtcbiAgICAgIGlmICghZXhwZXJpbWVudC51c2VyX2lkKSB7XG4gICAgICAgIHJldHVybiB1dGlscy51dWlkKCk7XG4gICAgICB9XG4gICAgICBpZiAoIWdvYWwudW5pcXVlKSB7XG4gICAgICAgIHJldHVybiB1dGlscy51dWlkKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdXRpbHMuc2hhMSh0aGlzLm5hbWVzcGFjZSArIFwiLlwiICsgZXhwZXJpbWVudC5uYW1lICsgXCIuXCIgKyBleHBlcmltZW50LnVzZXJfaWQpO1xuICAgIH07XG5cbiAgICBHaW1lbEFkYXB0ZXIucHJvdG90eXBlLl90cmFjayA9IGZ1bmN0aW9uKGV4cGVyaW1lbnQsIHZhcmlhbnQsIGdvYWwpIHtcbiAgICAgIHV0aWxzLmxvZyhcIlBlcnNpc3RlbnQgUXVldWUgR2ltZWwgdHJhY2s6IFwiICsgdGhpcy5uYW1lc3BhY2UgKyBcIiwgXCIgKyBleHBlcmltZW50Lm5hbWUgKyBcIiwgXCIgKyB2YXJpYW50ICsgXCIsIFwiICsgZ29hbC5uYW1lKTtcbiAgICAgIGlmICh0aGlzLl9xdWV1ZS5sZW5ndGggPiAxMDApIHtcbiAgICAgICAgdGhpcy5fcXVldWUuc2hpZnQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3F1ZXVlLnB1c2goe1xuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgZXhwZXJpbWVudDogZXhwZXJpbWVudC5uYW1lLFxuICAgICAgICAgIF9xdXVpZDogdXRpbHMudXVpZCgpLFxuICAgICAgICAgIHV1aWQ6IHRoaXMuX3VzZXJfdXVpZChleHBlcmltZW50LCBnb2FsKSxcbiAgICAgICAgICB2YXJpYW50OiB2YXJpYW50LFxuICAgICAgICAgIGV2ZW50OiBnb2FsLm5hbWUsXG4gICAgICAgICAgbmFtZXNwYWNlOiB0aGlzLm5hbWVzcGFjZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0KHRoaXMucXVldWVfbmFtZSwgSlNPTi5zdHJpbmdpZnkodGhpcy5fcXVldWUpKTtcbiAgICAgIHJldHVybiB0aGlzLl9mbHVzaCgpO1xuICAgIH07XG5cbiAgICBHaW1lbEFkYXB0ZXIucHJvdG90eXBlLmV4cGVyaW1lbnRfc3RhcnQgPSBmdW5jdGlvbihleHBlcmltZW50LCB2YXJpYW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5fdHJhY2soZXhwZXJpbWVudCwgdmFyaWFudCwge1xuICAgICAgICBuYW1lOiAncGFydGljaXBhdGUnLFxuICAgICAgICB1bmlxdWU6IHRydWVcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBHaW1lbEFkYXB0ZXIucHJvdG90eXBlLmdvYWxfY29tcGxldGUgPSBmdW5jdGlvbihleHBlcmltZW50LCB2YXJpYW50LCBnb2FsX25hbWUsIHByb3BzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdHJhY2soZXhwZXJpbWVudCwgdmFyaWFudCwgdXRpbHMuZGVmYXVsdHMoe1xuICAgICAgICBuYW1lOiBnb2FsX25hbWVcbiAgICAgIH0sIHByb3BzKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBHaW1lbEFkYXB0ZXI7XG5cbiAgfSkoKTtcblxuICBBZGFwdGVycy5QZXJzaXN0ZW50UXVldWVHb29nbGVBbmFseXRpY3NBZGFwdGVyID0gKGZ1bmN0aW9uKCkge1xuICAgIFBlcnNpc3RlbnRRdWV1ZUdvb2dsZUFuYWx5dGljc0FkYXB0ZXIucHJvdG90eXBlLm5hbWVzcGFjZSA9ICdhbGVwaGJldCc7XG5cbiAgICBQZXJzaXN0ZW50UXVldWVHb29nbGVBbmFseXRpY3NBZGFwdGVyLnByb3RvdHlwZS5xdWV1ZV9uYW1lID0gJ19nYV9xdWV1ZSc7XG5cbiAgICBmdW5jdGlvbiBQZXJzaXN0ZW50UXVldWVHb29nbGVBbmFseXRpY3NBZGFwdGVyKHN0b3JhZ2UpIHtcbiAgICAgIGlmIChzdG9yYWdlID09IG51bGwpIHtcbiAgICAgICAgc3RvcmFnZSA9IEFkYXB0ZXJzLkxvY2FsU3RvcmFnZUFkYXB0ZXI7XG4gICAgICB9XG4gICAgICB0aGlzLmdvYWxfY29tcGxldGUgPSBiaW5kKHRoaXMuZ29hbF9jb21wbGV0ZSwgdGhpcyk7XG4gICAgICB0aGlzLmV4cGVyaW1lbnRfc3RhcnQgPSBiaW5kKHRoaXMuZXhwZXJpbWVudF9zdGFydCwgdGhpcyk7XG4gICAgICB0aGlzLl9zdG9yYWdlID0gc3RvcmFnZTtcbiAgICAgIHRoaXMuX3F1ZXVlID0gSlNPTi5wYXJzZSh0aGlzLl9zdG9yYWdlLmdldCh0aGlzLnF1ZXVlX25hbWUpIHx8ICdbXScpO1xuICAgICAgdGhpcy5fZmx1c2goKTtcbiAgICB9XG5cbiAgICBQZXJzaXN0ZW50UXVldWVHb29nbGVBbmFseXRpY3NBZGFwdGVyLnByb3RvdHlwZS5fcmVtb3ZlX3V1aWQgPSBmdW5jdGlvbih1dWlkKSB7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB1dGlscy5yZW1vdmUoX3RoaXMuX3F1ZXVlLCBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsLnV1aWQgPT09IHV1aWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLl9zdG9yYWdlLnNldChfdGhpcy5xdWV1ZV9uYW1lLCBKU09OLnN0cmluZ2lmeShfdGhpcy5fcXVldWUpKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpO1xuICAgIH07XG5cbiAgICBQZXJzaXN0ZW50UXVldWVHb29nbGVBbmFseXRpY3NBZGFwdGVyLnByb3RvdHlwZS5fZmx1c2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjYWxsYmFjaywgaSwgaXRlbSwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgICBpZiAodHlwZW9mIGdhICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93ICdnYSBub3QgZGVmaW5lZC4gUGxlYXNlIG1ha2Ugc3VyZSB5b3VyIFVuaXZlcnNhbCBhbmFseXRpY3MgaXMgc2V0IHVwIGNvcnJlY3RseSc7XG4gICAgICB9XG4gICAgICByZWYgPSB0aGlzLl9xdWV1ZTtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpdGVtID0gcmVmW2ldO1xuICAgICAgICBjYWxsYmFjayA9IHRoaXMuX3JlbW92ZV91dWlkKGl0ZW0udXVpZCk7XG4gICAgICAgIHJlc3VsdHMucHVzaChnYSgnc2VuZCcsICdldmVudCcsIGl0ZW0uY2F0ZWdvcnksIGl0ZW0uYWN0aW9uLCBpdGVtLmxhYmVsLCB7XG4gICAgICAgICAgJ2hpdENhbGxiYWNrJzogY2FsbGJhY2ssXG4gICAgICAgICAgJ25vbkludGVyYWN0aW9uJzogMVxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9O1xuXG4gICAgUGVyc2lzdGVudFF1ZXVlR29vZ2xlQW5hbHl0aWNzQWRhcHRlci5wcm90b3R5cGUuX3RyYWNrID0gZnVuY3Rpb24oY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwpIHtcbiAgICAgIHV0aWxzLmxvZyhcIlBlcnNpc3RlbnQgUXVldWUgR29vZ2xlIFVuaXZlcnNhbCBBbmFseXRpY3MgdHJhY2s6IFwiICsgY2F0ZWdvcnkgKyBcIiwgXCIgKyBhY3Rpb24gKyBcIiwgXCIgKyBsYWJlbCk7XG4gICAgICBpZiAodGhpcy5fcXVldWUubGVuZ3RoID4gMTAwKSB7XG4gICAgICAgIHRoaXMuX3F1ZXVlLnNoaWZ0KCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9xdWV1ZS5wdXNoKHtcbiAgICAgICAgdXVpZDogdXRpbHMudXVpZCgpLFxuICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnksXG4gICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICBsYWJlbDogbGFiZWxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc3RvcmFnZS5zZXQodGhpcy5xdWV1ZV9uYW1lLCBKU09OLnN0cmluZ2lmeSh0aGlzLl9xdWV1ZSkpO1xuICAgICAgcmV0dXJuIHRoaXMuX2ZsdXNoKCk7XG4gICAgfTtcblxuICAgIFBlcnNpc3RlbnRRdWV1ZUdvb2dsZUFuYWx5dGljc0FkYXB0ZXIucHJvdG90eXBlLmV4cGVyaW1lbnRfc3RhcnQgPSBmdW5jdGlvbihleHBlcmltZW50LCB2YXJpYW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5fdHJhY2sodGhpcy5uYW1lc3BhY2UsIGV4cGVyaW1lbnQubmFtZSArIFwiIHwgXCIgKyB2YXJpYW50LCAnVmlzaXRvcnMnKTtcbiAgICB9O1xuXG4gICAgUGVyc2lzdGVudFF1ZXVlR29vZ2xlQW5hbHl0aWNzQWRhcHRlci5wcm90b3R5cGUuZ29hbF9jb21wbGV0ZSA9IGZ1bmN0aW9uKGV4cGVyaW1lbnQsIHZhcmlhbnQsIGdvYWxfbmFtZSwgX3Byb3BzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdHJhY2sodGhpcy5uYW1lc3BhY2UsIGV4cGVyaW1lbnQubmFtZSArIFwiIHwgXCIgKyB2YXJpYW50LCBnb2FsX25hbWUpO1xuICAgIH07XG5cbiAgICByZXR1cm4gUGVyc2lzdGVudFF1ZXVlR29vZ2xlQW5hbHl0aWNzQWRhcHRlcjtcblxuICB9KSgpO1xuXG4gIEFkYXB0ZXJzLlBlcnNpc3RlbnRRdWV1ZUtlZW5BZGFwdGVyID0gKGZ1bmN0aW9uKCkge1xuICAgIFBlcnNpc3RlbnRRdWV1ZUtlZW5BZGFwdGVyLnByb3RvdHlwZS5xdWV1ZV9uYW1lID0gJ19rZWVuX3F1ZXVlJztcblxuICAgIGZ1bmN0aW9uIFBlcnNpc3RlbnRRdWV1ZUtlZW5BZGFwdGVyKGtlZW5fY2xpZW50LCBzdG9yYWdlKSB7XG4gICAgICBpZiAoc3RvcmFnZSA9PSBudWxsKSB7XG4gICAgICAgIHN0b3JhZ2UgPSBBZGFwdGVycy5Mb2NhbFN0b3JhZ2VBZGFwdGVyO1xuICAgICAgfVxuICAgICAgdGhpcy5nb2FsX2NvbXBsZXRlID0gYmluZCh0aGlzLmdvYWxfY29tcGxldGUsIHRoaXMpO1xuICAgICAgdGhpcy5leHBlcmltZW50X3N0YXJ0ID0gYmluZCh0aGlzLmV4cGVyaW1lbnRfc3RhcnQsIHRoaXMpO1xuICAgICAgdGhpcy5jbGllbnQgPSBrZWVuX2NsaWVudDtcbiAgICAgIHRoaXMuX3N0b3JhZ2UgPSBzdG9yYWdlO1xuICAgICAgdGhpcy5fcXVldWUgPSBKU09OLnBhcnNlKHRoaXMuX3N0b3JhZ2UuZ2V0KHRoaXMucXVldWVfbmFtZSkgfHwgJ1tdJyk7XG4gICAgICB0aGlzLl9mbHVzaCgpO1xuICAgIH1cblxuICAgIFBlcnNpc3RlbnRRdWV1ZUtlZW5BZGFwdGVyLnByb3RvdHlwZS5fcmVtb3ZlX3F1dWlkID0gZnVuY3Rpb24ocXV1aWQpIHtcbiAgICAgIHJldHVybiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB1dGlscy5yZW1vdmUoX3RoaXMuX3F1ZXVlLCBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsLnByb3BlcnRpZXMuX3F1dWlkID09PSBxdXVpZDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuX3N0b3JhZ2Uuc2V0KF90aGlzLnF1ZXVlX25hbWUsIEpTT04uc3RyaW5naWZ5KF90aGlzLl9xdWV1ZSkpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcyk7XG4gICAgfTtcblxuICAgIFBlcnNpc3RlbnRRdWV1ZUtlZW5BZGFwdGVyLnByb3RvdHlwZS5fZmx1c2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjYWxsYmFjaywgaSwgaXRlbSwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgICByZWYgPSB0aGlzLl9xdWV1ZTtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpdGVtID0gcmVmW2ldO1xuICAgICAgICBjYWxsYmFjayA9IHRoaXMuX3JlbW92ZV9xdXVpZChpdGVtLnByb3BlcnRpZXMuX3F1dWlkKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuY2xpZW50LmFkZEV2ZW50KGl0ZW0uZXhwZXJpbWVudF9uYW1lLCB1dGlscy5vbWl0KGl0ZW0ucHJvcGVydGllcywgJ19xdXVpZCcpLCBjYWxsYmFjaykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfTtcblxuICAgIFBlcnNpc3RlbnRRdWV1ZUtlZW5BZGFwdGVyLnByb3RvdHlwZS5fdXNlcl91dWlkID0gZnVuY3Rpb24oZXhwZXJpbWVudCwgZ29hbCkge1xuICAgICAgaWYgKCFleHBlcmltZW50LnVzZXJfaWQpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxzLnV1aWQoKTtcbiAgICAgIH1cbiAgICAgIGlmICghZ29hbC51bmlxdWUpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxzLnV1aWQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1dGlscy5zaGExKHRoaXMubmFtZXNwYWNlICsgXCIuXCIgKyBleHBlcmltZW50Lm5hbWUgKyBcIi5cIiArIGV4cGVyaW1lbnQudXNlcl9pZCk7XG4gICAgfTtcblxuICAgIFBlcnNpc3RlbnRRdWV1ZUtlZW5BZGFwdGVyLnByb3RvdHlwZS5fdHJhY2sgPSBmdW5jdGlvbihleHBlcmltZW50LCB2YXJpYW50LCBnb2FsKSB7XG4gICAgICB1dGlscy5sb2coXCJQZXJzaXN0ZW50IFF1ZXVlIEtlZW4gdHJhY2s6IFwiICsgZXhwZXJpbWVudC5uYW1lICsgXCIsIFwiICsgdmFyaWFudCArIFwiLCBcIiArIGV2ZW50KTtcbiAgICAgIGlmICh0aGlzLl9xdWV1ZS5sZW5ndGggPiAxMDApIHtcbiAgICAgICAgdGhpcy5fcXVldWUuc2hpZnQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3F1ZXVlLnB1c2goe1xuICAgICAgICBleHBlcmltZW50X25hbWU6IGV4cGVyaW1lbnQubmFtZSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIF9xdXVpZDogdXRpbHMudXVpZCgpLFxuICAgICAgICAgIHV1aWQ6IHRoaXMuX3VzZXJfdXVpZChleHBlcmltZW50LCBnb2FsKSxcbiAgICAgICAgICB2YXJpYW50OiB2YXJpYW50LFxuICAgICAgICAgIGV2ZW50OiBnb2FsLm5hbWVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9zdG9yYWdlLnNldCh0aGlzLnF1ZXVlX25hbWUsIEpTT04uc3RyaW5naWZ5KHRoaXMuX3F1ZXVlKSk7XG4gICAgICByZXR1cm4gdGhpcy5fZmx1c2goKTtcbiAgICB9O1xuXG4gICAgUGVyc2lzdGVudFF1ZXVlS2VlbkFkYXB0ZXIucHJvdG90eXBlLmV4cGVyaW1lbnRfc3RhcnQgPSBmdW5jdGlvbihleHBlcmltZW50LCB2YXJpYW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5fdHJhY2soZXhwZXJpbWVudCwgdmFyaWFudCwge1xuICAgICAgICBuYW1lOiAncGFydGljaXBhdGUnLFxuICAgICAgICB1bmlxdWU6IHRydWVcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBQZXJzaXN0ZW50UXVldWVLZWVuQWRhcHRlci5wcm90b3R5cGUuZ29hbF9jb21wbGV0ZSA9IGZ1bmN0aW9uKGV4cGVyaW1lbnQsIHZhcmlhbnQsIGdvYWxfbmFtZSwgcHJvcHMpIHtcbiAgICAgIHJldHVybiB0aGlzLl90cmFjayhleHBlcmltZW50LCB2YXJpYW50LCB1dGlscy5kZWZhdWx0cyh7XG4gICAgICAgIG5hbWU6IGdvYWxfbmFtZVxuICAgICAgfSwgcHJvcHMpKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFBlcnNpc3RlbnRRdWV1ZUtlZW5BZGFwdGVyO1xuXG4gIH0pKCk7XG5cbiAgQWRhcHRlcnMuR29vZ2xlVW5pdmVyc2FsQW5hbHl0aWNzQWRhcHRlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBHb29nbGVVbml2ZXJzYWxBbmFseXRpY3NBZGFwdGVyKCkge31cblxuICAgIEdvb2dsZVVuaXZlcnNhbEFuYWx5dGljc0FkYXB0ZXIubmFtZXNwYWNlID0gJ2FsZXBoYmV0JztcblxuICAgIEdvb2dsZVVuaXZlcnNhbEFuYWx5dGljc0FkYXB0ZXIuX3RyYWNrID0gZnVuY3Rpb24oY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwpIHtcbiAgICAgIHV0aWxzLmxvZyhcIkdvb2dsZSBVbml2ZXJzYWwgQW5hbHl0aWNzIHRyYWNrOiBcIiArIGNhdGVnb3J5ICsgXCIsIFwiICsgYWN0aW9uICsgXCIsIFwiICsgbGFiZWwpO1xuICAgICAgaWYgKHR5cGVvZiBnYSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyAnZ2Egbm90IGRlZmluZWQuIFBsZWFzZSBtYWtlIHN1cmUgeW91ciBVbml2ZXJzYWwgYW5hbHl0aWNzIGlzIHNldCB1cCBjb3JyZWN0bHknO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGdhKCdzZW5kJywgJ2V2ZW50JywgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHtcbiAgICAgICAgJ25vbkludGVyYWN0aW9uJzogMVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIEdvb2dsZVVuaXZlcnNhbEFuYWx5dGljc0FkYXB0ZXIuZXhwZXJpbWVudF9zdGFydCA9IGZ1bmN0aW9uKGV4cGVyaW1lbnQsIHZhcmlhbnQpIHtcbiAgICAgIHJldHVybiBHb29nbGVVbml2ZXJzYWxBbmFseXRpY3NBZGFwdGVyLl90cmFjayhHb29nbGVVbml2ZXJzYWxBbmFseXRpY3NBZGFwdGVyLm5hbWVzcGFjZSwgZXhwZXJpbWVudC5uYW1lICsgXCIgfCBcIiArIHZhcmlhbnQsICdWaXNpdG9ycycpO1xuICAgIH07XG5cbiAgICBHb29nbGVVbml2ZXJzYWxBbmFseXRpY3NBZGFwdGVyLmdvYWxfY29tcGxldGUgPSBmdW5jdGlvbihleHBlcmltZW50LCB2YXJpYW50LCBnb2FsX25hbWUsIF9wcm9wcykge1xuICAgICAgcmV0dXJuIEdvb2dsZVVuaXZlcnNhbEFuYWx5dGljc0FkYXB0ZXIuX3RyYWNrKEdvb2dsZVVuaXZlcnNhbEFuYWx5dGljc0FkYXB0ZXIubmFtZXNwYWNlLCBleHBlcmltZW50Lm5hbWUgKyBcIiB8IFwiICsgdmFyaWFudCwgZ29hbF9uYW1lKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEdvb2dsZVVuaXZlcnNhbEFuYWx5dGljc0FkYXB0ZXI7XG5cbiAgfSkoKTtcblxuICBBZGFwdGVycy5Mb2NhbFN0b3JhZ2VBZGFwdGVyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIExvY2FsU3RvcmFnZUFkYXB0ZXIoKSB7fVxuXG4gICAgTG9jYWxTdG9yYWdlQWRhcHRlci5uYW1lc3BhY2UgPSAnYWxlcGhiZXQnO1xuXG4gICAgTG9jYWxTdG9yYWdlQWRhcHRlci5zZXQgPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICByZXR1cm4gbmV3IFN0b3JhZ2UodGhpcy5uYW1lc3BhY2UpLnNldChrZXksIHZhbHVlKTtcbiAgICB9O1xuXG4gICAgTG9jYWxTdG9yYWdlQWRhcHRlci5nZXQgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBuZXcgU3RvcmFnZSh0aGlzLm5hbWVzcGFjZSkuZ2V0KGtleSk7XG4gICAgfTtcblxuICAgIHJldHVybiBMb2NhbFN0b3JhZ2VBZGFwdGVyO1xuXG4gIH0pKCk7XG5cbiAgcmV0dXJuIEFkYXB0ZXJzO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFkYXB0ZXJzO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzSmlZV3hwWTJ0cEwyTnZaR1V2YW1WMGRIa3ZZV3hsY0doaVpYUXZjM0pqTDJGa1lYQjBaWEp6TG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTl5WW1Gc2FXTnJhUzlqYjJSbEwycGxkSFI1TDJGc1pYQm9ZbVYwTDNOeVl5OWhaR0Z3ZEdWeWN5NWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCUVN4M1FrRkJRVHRGUVVGQk96dEJRVUZCTEV0QlFVRXNSMEZCVVN4UFFVRkJMRU5CUVZFc1UwRkJVanM3UVVGRFVpeFBRVUZCTEVkQlFWVXNUMEZCUVN4RFFVRlJMRmRCUVZJN08wRkJSVW83T3p0RlFWRkZMRkZCUVVNc1EwRkJRVHN5UWtGRFRDeFZRVUZCTEVkQlFWazdPMGxCUlVNc2MwSkJRVU1zUjBGQlJDeEZRVUZOTEZOQlFVNHNSVUZCYVVJc1QwRkJha0k3TzFGQlFXbENMRlZCUVZVc1VVRkJVU3hEUVVGRE96czdPMDFCUXk5RExFbEJRVU1zUTBGQlFTeFJRVUZFTEVkQlFWazdUVUZEV2l4SlFVRkRMRU5CUVVFc1IwRkJSQ3hIUVVGUE8wMUJRMUFzU1VGQlF5eERRVUZCTEZOQlFVUXNSMEZCWVR0TlFVTmlMRWxCUVVNc1EwRkJRU3hOUVVGRUxFZEJRVlVzU1VGQlNTeERRVUZETEV0QlFVd3NRMEZCVnl4SlFVRkRMRU5CUVVFc1VVRkJVU3hEUVVGRExFZEJRVllzUTBGQll5eEpRVUZETEVOQlFVRXNWVUZCWml4RFFVRkJMRWxCUVRoQ0xFbEJRWHBETzAxQlExWXNTVUZCUXl4RFFVRkJMRTFCUVVRc1EwRkJRVHRKUVV4WE96c3lRa0ZQWWl4aFFVRkJMRWRCUVdVc1UwRkJReXhMUVVGRU8yRkJRMklzUTBGQlFTeFRRVUZCTEV0QlFVRTdaVUZCUVN4VFFVRkRMRWRCUVVRc1JVRkJUU3hIUVVGT08xVkJRMFVzU1VGQlZTeEhRVUZXTzBGQlFVRXNiVUpCUVVFN08xVkJRMEVzUzBGQlN5eERRVUZETEUxQlFVNHNRMEZCWVN4TFFVRkRMRU5CUVVFc1RVRkJaQ3hGUVVGelFpeFRRVUZETEVWQlFVUTdiVUpCUVZFc1JVRkJSU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZrTEV0QlFYZENPMVZCUVdoRExFTkJRWFJDTzJsQ1FVTkJMRXRCUVVNc1EwRkJRU3hSUVVGUkxFTkJRVU1zUjBGQlZpeERRVUZqTEV0QlFVTXNRMEZCUVN4VlFVRm1MRVZCUVRKQ0xFbEJRVWtzUTBGQlF5eFRRVUZNTEVOQlFXVXNTMEZCUXl4RFFVRkJMRTFCUVdoQ0xFTkJRVE5DTzFGQlNFWTdUVUZCUVN4RFFVRkJMRU5CUVVFc1EwRkJRU3hKUVVGQk8wbEJSR0U3T3pKQ1FVMW1MRmRCUVVFc1IwRkJZU3hUUVVGRExFZEJRVVFzUlVGQlRTeEpRVUZPTEVWQlFWa3NVVUZCV2p0TlFVTllMRXRCUVVzc1EwRkJReXhIUVVGT0xFTkJRVlVzTWtKQlFWWTdZVUZEUVN4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFbEJRV1FzUTBGRFJUdFJRVUZCTEUxQlFVRXNSVUZCVVN4TFFVRlNPMUZCUTBFc1IwRkJRU3hGUVVGTExFZEJSRXc3VVVGRlFTeEpRVUZCTEVWQlFVMHNTVUZHVGp0UlFVZEJMRTlCUVVFc1JVRkJVeXhSUVVoVU8wOUJSRVk3U1VGR1Z6czdNa0pCVVdJc1lVRkJRU3hIUVVGbExGTkJRVU1zUjBGQlJDeEZRVUZOTEVsQlFVNHNSVUZCV1N4UlFVRmFPMEZCUTJJc1ZVRkJRVHROUVVGQkxFdEJRVXNzUTBGQlF5eEhRVUZPTEVOQlFWVXNNRUpCUVZZN1RVRkRRU3hIUVVGQkxFZEJRVTBzU1VGQlNTeGpRVUZLTEVOQlFVRTdUVUZEVGl4TlFVRkJPenRCUVVGVk8yRkJRVUVzVTBGQlFUczdkVUpCUVVVc1EwRkJReXhyUWtGQlFTeERRVUZ0UWl4RFFVRnVRaXhEUVVGRUxFTkJRVUVzUjBGQmRVSXNSMEZCZGtJc1IwRkJlVUlzUTBGQlF5eHJRa0ZCUVN4RFFVRnRRaXhEUVVGdVFpeERRVUZFTzBGQlFUTkNPenM3VFVGRFZpeE5RVUZCTEVkQlFWTXNUVUZCVFN4RFFVRkRMRWxCUVZBc1EwRkJXU3hIUVVGYUxFTkJRV2RDTEVOQlFVTXNUMEZCYWtJc1EwRkJlVUlzVFVGQmVrSXNSVUZCYVVNc1IwRkJha003VFVGRFZDeEhRVUZITEVOQlFVTXNTVUZCU2l4RFFVRlRMRXRCUVZRc1JVRkJiVUlzUjBGQlJDeEhRVUZMTEVkQlFVd3NSMEZCVVN4TlFVRXhRanROUVVOQkxFZEJRVWNzUTBGQlF5eE5RVUZLTEVkQlFXRXNVMEZCUVR0UlFVTllMRWxCUVVjc1IwRkJSeXhEUVVGRExFMUJRVW9zUzBGQll5eEhRVUZxUWp0cFFrRkRSU3hSUVVGQkxFTkJRVUVzUlVGRVJqczdUVUZFVnp0aFFVZGlMRWRCUVVjc1EwRkJReXhKUVVGS0xFTkJRVUU3U1VGVVlUczdNa0pCVjJZc1UwRkJRU3hIUVVGWExGTkJRVU1zUjBGQlJDeEZRVUZOTEVsQlFVNHNSVUZCV1N4UlFVRmFPMEZCUTFRc1ZVRkJRVHROUVVGQkxIVkRRVUZuUWl4RFFVRkZMR0ZCUVd4Q08yVkJRMFVzU1VGQlF5eERRVUZCTEZkQlFVUXNRMEZCWVN4SFFVRmlMRVZCUVd0Q0xFbEJRV3hDTEVWQlFYZENMRkZCUVhoQ0xFVkJSRVk3VDBGQlFTeE5RVUZCTzJWQlIwVXNTVUZCUXl4RFFVRkJMR0ZCUVVRc1EwRkJaU3hIUVVGbUxFVkJRVzlDTEVsQlFYQkNMRVZCUVRCQ0xGRkJRVEZDTEVWQlNFWTdPMGxCUkZNN096SkNRVTFZTEUxQlFVRXNSMEZCVVN4VFFVRkJPMEZCUTA0c1ZVRkJRVHRCUVVGQk8wRkJRVUU3VjBGQlFTeHhRMEZCUVRzN1VVRkRSU3hSUVVGQkxFZEJRVmNzU1VGQlF5eERRVUZCTEdGQlFVUXNRMEZCWlN4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFMUJRUzlDTzFGQlExZ3NTVUZCUXl4RFFVRkJMRk5CUVVRc1EwRkJWeXhKUVVGRExFTkJRVUVzUjBGQldpeEZRVUZwUWl4TFFVRkxMRU5CUVVNc1NVRkJUaXhEUVVGWExFbEJRVWtzUTBGQlF5eFZRVUZvUWl4RlFVRTBRaXhSUVVFMVFpeERRVUZxUWl4RlFVRjNSQ3hSUVVGNFJEdHhRa0ZEUVR0QlFVaEdPenRKUVVSTk96c3lRa0ZOVWl4VlFVRkJMRWRCUVZrc1UwRkJReXhWUVVGRUxFVkJRV0VzU1VGQllqdE5RVU5XTEVsQlFVRXNRMEZCTWtJc1ZVRkJWU3hEUVVGRExFOUJRWFJETzBGQlFVRXNaVUZCVHl4TFFVRkxMRU5CUVVNc1NVRkJUaXhEUVVGQkxFVkJRVkE3TzAxQlJVRXNTVUZCUVN4RFFVRXlRaXhKUVVGSkxFTkJRVU1zVFVGQmFFTTdRVUZCUVN4bFFVRlBMRXRCUVVzc1EwRkJReXhKUVVGT0xFTkJRVUVzUlVGQlVEczdZVUZIUVN4TFFVRkxMRU5CUVVNc1NVRkJUaXhEUVVGakxFbEJRVU1zUTBGQlFTeFRRVUZHTEVkQlFWa3NSMEZCV2l4SFFVRmxMRlZCUVZVc1EwRkJReXhKUVVFeFFpeEhRVUVyUWl4SFFVRXZRaXhIUVVGclF5eFZRVUZWTEVOQlFVTXNUMEZCTVVRN1NVRk9WVHM3TWtKQlVWb3NUVUZCUVN4SFFVRlJMRk5CUVVNc1ZVRkJSQ3hGUVVGaExFOUJRV0lzUlVGQmMwSXNTVUZCZEVJN1RVRkRUaXhMUVVGTExFTkJRVU1zUjBGQlRpeERRVUZWTEdkRFFVRkJMRWRCUVdsRExFbEJRVU1zUTBGQlFTeFRRVUZzUXl4SFFVRTBReXhKUVVFMVF5eEhRVUZuUkN4VlFVRlZMRU5CUVVNc1NVRkJNMFFzUjBGQlowVXNTVUZCYUVVc1IwRkJiMFVzVDBGQmNFVXNSMEZCTkVVc1NVRkJOVVVzUjBGQlowWXNTVUZCU1N4RFFVRkRMRWxCUVM5R08wMUJRMEVzU1VGQmJVSXNTVUZCUXl4RFFVRkJMRTFCUVUwc1EwRkJReXhOUVVGU0xFZEJRV2xDTEVkQlFYQkRPMUZCUVVFc1NVRkJReXhEUVVGQkxFMUJRVTBzUTBGQlF5eExRVUZTTEVOQlFVRXNSVUZCUVRzN1RVRkRRU3hKUVVGRExFTkJRVUVzVFVGQlRTeERRVUZETEVsQlFWSXNRMEZEUlR0UlFVRkJMRlZCUVVFc1JVRkRSVHRWUVVGQkxGVkJRVUVzUlVGQldTeFZRVUZWTEVOQlFVTXNTVUZCZGtJN1ZVRkRRU3hOUVVGQkxFVkJRVkVzUzBGQlN5eERRVUZETEVsQlFVNHNRMEZCUVN4RFFVUlNPMVZCUlVFc1NVRkJRU3hGUVVGTkxFbEJRVU1zUTBGQlFTeFZRVUZFTEVOQlFWa3NWVUZCV2l4RlFVRjNRaXhKUVVGNFFpeERRVVpPTzFWQlIwRXNUMEZCUVN4RlFVRlRMRTlCU0ZRN1ZVRkpRU3hMUVVGQkxFVkJRVThzU1VGQlNTeERRVUZETEVsQlNsbzdWVUZMUVN4VFFVRkJMRVZCUVZjc1NVRkJReXhEUVVGQkxGTkJURm83VTBGRVJqdFBRVVJHTzAxQlVVRXNTVUZCUXl4RFFVRkJMRkZCUVZFc1EwRkJReXhIUVVGV0xFTkJRV01zU1VGQlF5eERRVUZCTEZWQlFXWXNSVUZCTWtJc1NVRkJTU3hEUVVGRExGTkJRVXdzUTBGQlpTeEpRVUZETEVOQlFVRXNUVUZCYUVJc1EwRkJNMEk3WVVGRFFTeEpRVUZETEVOQlFVRXNUVUZCUkN4RFFVRkJPMGxCV2swN096SkNRV05TTEdkQ1FVRkJMRWRCUVd0Q0xGTkJRVU1zVlVGQlJDeEZRVUZoTEU5QlFXSTdZVUZEYUVJc1NVRkJReXhEUVVGQkxFMUJRVVFzUTBGQlVTeFZRVUZTTEVWQlFXOUNMRTlCUVhCQ0xFVkJRVFpDTzFGQlFVTXNTVUZCUVN4RlFVRk5MR0ZCUVZBN1VVRkJjMElzVFVGQlFTeEZRVUZSTEVsQlFUbENPMDlCUVRkQ08wbEJSR2RDT3pzeVFrRkhiRUlzWVVGQlFTeEhRVUZsTEZOQlFVTXNWVUZCUkN4RlFVRmhMRTlCUVdJc1JVRkJjMElzVTBGQmRFSXNSVUZCYVVNc1MwRkJha003WVVGRFlpeEpRVUZETEVOQlFVRXNUVUZCUkN4RFFVRlJMRlZCUVZJc1JVRkJiMElzVDBGQmNFSXNSVUZCTmtJc1MwRkJTeXhEUVVGRExGRkJRVTRzUTBGQlpUdFJRVUZETEVsQlFVRXNSVUZCVFN4VFFVRlFPMDlCUVdZc1JVRkJhME1zUzBGQmJFTXNRMEZCTjBJN1NVRkVZVHM3T3pzN08wVkJTVmdzVVVGQlF5eERRVUZCTzI5RVFVTk1MRk5CUVVFc1IwRkJWenM3YjBSQlExZ3NWVUZCUVN4SFFVRlpPenRKUVVWRExDdERRVUZETEU5QlFVUTdPMUZCUVVNc1ZVRkJWU3hSUVVGUkxFTkJRVU03T3pzN1RVRkRMMElzU1VGQlF5eERRVUZCTEZGQlFVUXNSMEZCV1R0TlFVTmFMRWxCUVVNc1EwRkJRU3hOUVVGRUxFZEJRVlVzU1VGQlNTeERRVUZETEV0QlFVd3NRMEZCVnl4SlFVRkRMRU5CUVVFc1VVRkJVU3hEUVVGRExFZEJRVllzUTBGQll5eEpRVUZETEVOQlFVRXNWVUZCWml4RFFVRkJMRWxCUVRoQ0xFbEJRWHBETzAxQlExWXNTVUZCUXl4RFFVRkJMRTFCUVVRc1EwRkJRVHRKUVVoWE96dHZSRUZMWWl4WlFVRkJMRWRCUVdNc1UwRkJReXhKUVVGRU8yRkJRMW9zUTBGQlFTeFRRVUZCTEV0QlFVRTdaVUZCUVN4VFFVRkJPMVZCUTBVc1MwRkJTeXhEUVVGRExFMUJRVTRzUTBGQllTeExRVUZETEVOQlFVRXNUVUZCWkN4RlFVRnpRaXhUUVVGRExFVkJRVVE3YlVKQlFWRXNSVUZCUlN4RFFVRkRMRWxCUVVnc1MwRkJWenRWUVVGdVFpeERRVUYwUWp0cFFrRkRRU3hMUVVGRExFTkJRVUVzVVVGQlVTeERRVUZETEVkQlFWWXNRMEZCWXl4TFFVRkRMRU5CUVVFc1ZVRkJaaXhGUVVFeVFpeEpRVUZKTEVOQlFVTXNVMEZCVEN4RFFVRmxMRXRCUVVNc1EwRkJRU3hOUVVGb1FpeERRVUV6UWp0UlFVWkdPMDFCUVVFc1EwRkJRU3hEUVVGQkxFTkJRVUVzU1VGQlFUdEpRVVJaT3p0dlJFRkxaQ3hOUVVGQkxFZEJRVkVzVTBGQlFUdEJRVU5PTEZWQlFVRTdUVUZCUVN4SlFVRjVSaXhQUVVGUExFVkJRVkFzUzBGQlpTeFZRVUY0Unp0QlFVRkJMR05CUVUwc1owWkJRVTQ3TzBGQlEwRTdRVUZCUVR0WFFVRkJMSEZEUVVGQk96dFJRVU5GTEZGQlFVRXNSMEZCVnl4SlFVRkRMRU5CUVVFc1dVRkJSQ3hEUVVGakxFbEJRVWtzUTBGQlF5eEpRVUZ1UWp0eFFrRkRXQ3hGUVVGQkxFTkJRVWNzVFVGQlNDeEZRVUZYTEU5QlFWZ3NSVUZCYjBJc1NVRkJTU3hEUVVGRExGRkJRWHBDTEVWQlFXMURMRWxCUVVrc1EwRkJReXhOUVVGNFF5eEZRVUZuUkN4SlFVRkpMRU5CUVVNc1MwRkJja1FzUlVGQk5FUTdWVUZCUXl4aFFVRkJMRVZCUVdVc1VVRkJhRUk3VlVGQk1FSXNaMEpCUVVFc1JVRkJhMElzUTBGQk5VTTdVMEZCTlVRN1FVRkdSanM3U1VGR1RUczdiMFJCVFZJc1RVRkJRU3hIUVVGUkxGTkJRVU1zVVVGQlJDeEZRVUZYTEUxQlFWZ3NSVUZCYlVJc1MwRkJia0k3VFVGRFRpeExRVUZMTEVOQlFVTXNSMEZCVGl4RFFVRlZMSEZFUVVGQkxFZEJRWE5FTEZGQlFYUkVMRWRCUVN0RUxFbEJRUzlFTEVkQlFXMUZMRTFCUVc1RkxFZEJRVEJGTEVsQlFURkZMRWRCUVRoRkxFdEJRWGhHTzAxQlEwRXNTVUZCYlVJc1NVRkJReXhEUVVGQkxFMUJRVTBzUTBGQlF5eE5RVUZTTEVkQlFXbENMRWRCUVhCRE8xRkJRVUVzU1VGQlF5eERRVUZCTEUxQlFVMHNRMEZCUXl4TFFVRlNMRU5CUVVFc1JVRkJRVHM3VFVGRFFTeEpRVUZETEVOQlFVRXNUVUZCVFN4RFFVRkRMRWxCUVZJc1EwRkJZVHRSUVVGRExFbEJRVUVzUlVGQlRTeExRVUZMTEVOQlFVTXNTVUZCVGl4RFFVRkJMRU5CUVZBN1VVRkJjVUlzVVVGQlFTeEZRVUZWTEZGQlFTOUNPMUZCUVhsRExFMUJRVUVzUlVGQlVTeE5RVUZxUkR0UlFVRjVSQ3hMUVVGQkxFVkJRVThzUzBGQmFFVTdUMEZCWWp0TlFVTkJMRWxCUVVNc1EwRkJRU3hSUVVGUkxFTkJRVU1zUjBGQlZpeERRVUZqTEVsQlFVTXNRMEZCUVN4VlFVRm1MRVZCUVRKQ0xFbEJRVWtzUTBGQlF5eFRRVUZNTEVOQlFXVXNTVUZCUXl4RFFVRkJMRTFCUVdoQ0xFTkJRVE5DTzJGQlEwRXNTVUZCUXl4RFFVRkJMRTFCUVVRc1EwRkJRVHRKUVV4Tk96dHZSRUZQVWl4blFrRkJRU3hIUVVGclFpeFRRVUZETEZWQlFVUXNSVUZCWVN4UFFVRmlPMkZCUTJoQ0xFbEJRVU1zUTBGQlFTeE5RVUZFTEVOQlFWRXNTVUZCUXl4RFFVRkJMRk5CUVZRc1JVRkJkVUlzVlVGQlZTeERRVUZETEVsQlFWb3NSMEZCYVVJc1MwRkJha0lzUjBGQmMwSXNUMEZCTlVNc1JVRkJkVVFzVlVGQmRrUTdTVUZFWjBJN08yOUVRVWRzUWl4aFFVRkJMRWRCUVdVc1UwRkJReXhWUVVGRUxFVkJRV0VzVDBGQllpeEZRVUZ6UWl4VFFVRjBRaXhGUVVGcFF5eE5RVUZxUXp0aFFVTmlMRWxCUVVNc1EwRkJRU3hOUVVGRUxFTkJRVkVzU1VGQlF5eERRVUZCTEZOQlFWUXNSVUZCZFVJc1ZVRkJWU3hEUVVGRExFbEJRVm9zUjBGQmFVSXNTMEZCYWtJc1IwRkJjMElzVDBGQk5VTXNSVUZCZFVRc1UwRkJka1E3U1VGRVlUczdPenM3TzBWQlNWZ3NVVUZCUXl4RFFVRkJPM2xEUVVOTUxGVkJRVUVzUjBGQldUczdTVUZGUXl4dlEwRkJReXhYUVVGRUxFVkJRV01zVDBGQlpEczdVVUZCWXl4VlFVRlZMRkZCUVZFc1EwRkJRenM3T3p0TlFVTTFReXhKUVVGRExFTkJRVUVzVFVGQlJDeEhRVUZWTzAxQlExWXNTVUZCUXl4RFFVRkJMRkZCUVVRc1IwRkJXVHROUVVOYUxFbEJRVU1zUTBGQlFTeE5RVUZFTEVkQlFWVXNTVUZCU1N4RFFVRkRMRXRCUVV3c1EwRkJWeXhKUVVGRExFTkJRVUVzVVVGQlVTeERRVUZETEVkQlFWWXNRMEZCWXl4SlFVRkRMRU5CUVVFc1ZVRkJaaXhEUVVGQkxFbEJRVGhDTEVsQlFYcERPMDFCUTFZc1NVRkJReXhEUVVGQkxFMUJRVVFzUTBGQlFUdEpRVXBYT3p0NVEwRk5ZaXhoUVVGQkxFZEJRV1VzVTBGQlF5eExRVUZFTzJGQlEySXNRMEZCUVN4VFFVRkJMRXRCUVVFN1pVRkJRU3hUUVVGRExFZEJRVVFzUlVGQlRTeEhRVUZPTzFWQlEwVXNTVUZCVlN4SFFVRldPMEZCUVVFc2JVSkJRVUU3TzFWQlEwRXNTMEZCU3l4RFFVRkRMRTFCUVU0c1EwRkJZU3hMUVVGRExFTkJRVUVzVFVGQlpDeEZRVUZ6UWl4VFFVRkRMRVZCUVVRN2JVSkJRVkVzUlVGQlJTeERRVUZETEZWQlFWVXNRMEZCUXl4TlFVRmtMRXRCUVhkQ08xVkJRV2hETEVOQlFYUkNPMmxDUVVOQkxFdEJRVU1zUTBGQlFTeFJRVUZSTEVOQlFVTXNSMEZCVml4RFFVRmpMRXRCUVVNc1EwRkJRU3hWUVVGbUxFVkJRVEpDTEVsQlFVa3NRMEZCUXl4VFFVRk1MRU5CUVdVc1MwRkJReXhEUVVGQkxFMUJRV2hDTEVOQlFUTkNPMUZCU0VZN1RVRkJRU3hEUVVGQkxFTkJRVUVzUTBGQlFTeEpRVUZCTzBsQlJHRTdPM2xEUVUxbUxFMUJRVUVzUjBGQlVTeFRRVUZCTzBGQlEwNHNWVUZCUVR0QlFVRkJPMEZCUVVFN1YwRkJRU3h4UTBGQlFUczdVVUZEUlN4UlFVRkJMRWRCUVZjc1NVRkJReXhEUVVGQkxHRkJRVVFzUTBGQlpTeEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTFCUVM5Q08zRkNRVU5ZTEVsQlFVTXNRMEZCUVN4TlFVRk5MRU5CUVVNc1VVRkJVaXhEUVVGcFFpeEpRVUZKTEVOQlFVTXNaVUZCZEVJc1JVRkJkVU1zUzBGQlN5eERRVUZETEVsQlFVNHNRMEZCVnl4SlFVRkpMRU5CUVVNc1ZVRkJhRUlzUlVGQk5FSXNVVUZCTlVJc1EwRkJka01zUlVGQk9FVXNVVUZCT1VVN1FVRkdSanM3U1VGRVRUczdlVU5CUzFJc1ZVRkJRU3hIUVVGWkxGTkJRVU1zVlVGQlJDeEZRVUZoTEVsQlFXSTdUVUZEVml4SlFVRkJMRU5CUVRKQ0xGVkJRVlVzUTBGQlF5eFBRVUYwUXp0QlFVRkJMR1ZCUVU4c1MwRkJTeXhEUVVGRExFbEJRVTRzUTBGQlFTeEZRVUZRT3p0TlFVVkJMRWxCUVVFc1EwRkJNa0lzU1VGQlNTeERRVUZETEUxQlFXaERPMEZCUVVFc1pVRkJUeXhMUVVGTExFTkJRVU1zU1VGQlRpeERRVUZCTEVWQlFWQTdPMkZCUjBFc1MwRkJTeXhEUVVGRExFbEJRVTRzUTBGQll5eEpRVUZETEVOQlFVRXNVMEZCUml4SFFVRlpMRWRCUVZvc1IwRkJaU3hWUVVGVkxFTkJRVU1zU1VGQk1VSXNSMEZCSzBJc1IwRkJMMElzUjBGQmEwTXNWVUZCVlN4RFFVRkRMRTlCUVRGRU8wbEJUbFU3TzNsRFFWRmFMRTFCUVVFc1IwRkJVU3hUUVVGRExGVkJRVVFzUlVGQllTeFBRVUZpTEVWQlFYTkNMRWxCUVhSQ08wMUJRMDRzUzBGQlN5eERRVUZETEVkQlFVNHNRMEZCVlN3clFrRkJRU3hIUVVGblF5eFZRVUZWTEVOQlFVTXNTVUZCTTBNc1IwRkJaMFFzU1VGQmFFUXNSMEZCYjBRc1QwRkJjRVFzUjBGQk5FUXNTVUZCTlVRc1IwRkJaMFVzUzBGQk1VVTdUVUZEUVN4SlFVRnRRaXhKUVVGRExFTkJRVUVzVFVGQlRTeERRVUZETEUxQlFWSXNSMEZCYVVJc1IwRkJjRU03VVVGQlFTeEpRVUZETEVOQlFVRXNUVUZCVFN4RFFVRkRMRXRCUVZJc1EwRkJRU3hGUVVGQk96dE5RVU5CTEVsQlFVTXNRMEZCUVN4TlFVRk5MRU5CUVVNc1NVRkJVaXhEUVVORk8xRkJRVUVzWlVGQlFTeEZRVUZwUWl4VlFVRlZMRU5CUVVNc1NVRkJOVUk3VVVGRFFTeFZRVUZCTEVWQlEwVTdWVUZCUVN4TlFVRkJMRVZCUVZFc1MwRkJTeXhEUVVGRExFbEJRVTRzUTBGQlFTeERRVUZTTzFWQlEwRXNTVUZCUVN4RlFVRk5MRWxCUVVNc1EwRkJRU3hWUVVGRUxFTkJRVmtzVlVGQldpeEZRVUYzUWl4SlFVRjRRaXhEUVVST08xVkJSVUVzVDBGQlFTeEZRVUZUTEU5QlJsUTdWVUZIUVN4TFFVRkJMRVZCUVU4c1NVRkJTU3hEUVVGRExFbEJTRm83VTBGR1JqdFBRVVJHTzAxQlQwRXNTVUZCUXl4RFFVRkJMRkZCUVZFc1EwRkJReXhIUVVGV0xFTkJRV01zU1VGQlF5eERRVUZCTEZWQlFXWXNSVUZCTWtJc1NVRkJTU3hEUVVGRExGTkJRVXdzUTBGQlpTeEpRVUZETEVOQlFVRXNUVUZCYUVJc1EwRkJNMEk3WVVGRFFTeEpRVUZETEVOQlFVRXNUVUZCUkN4RFFVRkJPMGxCV0UwN08zbERRV0ZTTEdkQ1FVRkJMRWRCUVd0Q0xGTkJRVU1zVlVGQlJDeEZRVUZoTEU5QlFXSTdZVUZEYUVJc1NVRkJReXhEUVVGQkxFMUJRVVFzUTBGQlVTeFZRVUZTTEVWQlFXOUNMRTlCUVhCQ0xFVkJRVFpDTzFGQlFVTXNTVUZCUVN4RlFVRk5MR0ZCUVZBN1VVRkJjMElzVFVGQlFTeEZRVUZSTEVsQlFUbENPMDlCUVRkQ08wbEJSR2RDT3p0NVEwRkhiRUlzWVVGQlFTeEhRVUZsTEZOQlFVTXNWVUZCUkN4RlFVRmhMRTlCUVdJc1JVRkJjMElzVTBGQmRFSXNSVUZCYVVNc1MwRkJha003WVVGRFlpeEpRVUZETEVOQlFVRXNUVUZCUkN4RFFVRlJMRlZCUVZJc1JVRkJiMElzVDBGQmNFSXNSVUZCTmtJc1MwRkJTeXhEUVVGRExGRkJRVTRzUTBGQlpUdFJRVUZETEVsQlFVRXNSVUZCVFN4VFFVRlFPMDlCUVdZc1JVRkJhME1zUzBGQmJFTXNRMEZCTjBJN1NVRkVZVHM3T3pzN08wVkJTVmdzVVVGQlF5eERRVUZCT3pzN1NVRkRUQ3dyUWtGQlF5eERRVUZCTEZOQlFVUXNSMEZCV1RzN1NVRkZXaXdyUWtGQlF5eERRVUZCTEUxQlFVUXNSMEZCVXl4VFFVRkRMRkZCUVVRc1JVRkJWeXhOUVVGWUxFVkJRVzFDTEV0QlFXNUNPMDFCUTFBc1MwRkJTeXhEUVVGRExFZEJRVTRzUTBGQlZTeHZRMEZCUVN4SFFVRnhReXhSUVVGeVF5eEhRVUU0UXl4SlFVRTVReXhIUVVGclJDeE5RVUZzUkN4SFFVRjVSQ3hKUVVGNlJDeEhRVUUyUkN4TFFVRjJSVHROUVVOQkxFbEJRWGxHTEU5QlFVOHNSVUZCVUN4TFFVRmxMRlZCUVhoSE8wRkJRVUVzWTBGQlRTeG5Sa0ZCVGpzN1lVRkRRU3hGUVVGQkxFTkJRVWNzVFVGQlNDeEZRVUZYTEU5QlFWZ3NSVUZCYjBJc1VVRkJjRUlzUlVGQk9FSXNUVUZCT1VJc1JVRkJjME1zUzBGQmRFTXNSVUZCTmtNN1VVRkJReXhuUWtGQlFTeEZRVUZyUWl4RFFVRnVRanRQUVVFM1F6dEpRVWhQT3p0SlFVdFVMQ3RDUVVGRExFTkJRVUVzWjBKQlFVUXNSMEZCYlVJc1UwRkJReXhWUVVGRUxFVkJRV0VzVDBGQllqdGhRVU5xUWl3clFrRkJReXhEUVVGQkxFMUJRVVFzUTBGQlVTd3JRa0ZCUXl4RFFVRkJMRk5CUVZRc1JVRkJkVUlzVlVGQlZTeERRVUZETEVsQlFWb3NSMEZCYVVJc1MwRkJha0lzUjBGQmMwSXNUMEZCTlVNc1JVRkJkVVFzVlVGQmRrUTdTVUZFYVVJN08wbEJSMjVDTEN0Q1FVRkRMRU5CUVVFc1lVRkJSQ3hIUVVGblFpeFRRVUZETEZWQlFVUXNSVUZCWVN4UFFVRmlMRVZCUVhOQ0xGTkJRWFJDTEVWQlFXbERMRTFCUVdwRE8yRkJRMlFzSzBKQlFVTXNRMEZCUVN4TlFVRkVMRU5CUVZFc0swSkJRVU1zUTBGQlFTeFRRVUZVTEVWQlFYVkNMRlZCUVZVc1EwRkJReXhKUVVGYUxFZEJRV2xDTEV0QlFXcENMRWRCUVhOQ0xFOUJRVFZETEVWQlFYVkVMRk5CUVhaRU8wbEJSR003T3pzN096dEZRVWxhTEZGQlFVTXNRMEZCUVRzN08wbEJRMHdzYlVKQlFVTXNRMEZCUVN4VFFVRkVMRWRCUVZrN08wbEJRMW9zYlVKQlFVTXNRMEZCUVN4SFFVRkVMRWRCUVUwc1UwRkJReXhIUVVGRUxFVkJRVTBzUzBGQlRqdGhRVU5LTEVsQlFVa3NUMEZCU2l4RFFVRlpMRWxCUVVNc1EwRkJRU3hUUVVGaUxFTkJRWFZDTEVOQlFVTXNSMEZCZUVJc1EwRkJORUlzUjBGQk5VSXNSVUZCYVVNc1MwRkJha003U1VGRVNUczdTVUZGVGl4dFFrRkJReXhEUVVGQkxFZEJRVVFzUjBGQlRTeFRRVUZETEVkQlFVUTdZVUZEU2l4SlFVRkpMRTlCUVVvc1EwRkJXU3hKUVVGRExFTkJRVUVzVTBGQllpeERRVUYxUWl4RFFVRkRMRWRCUVhoQ0xFTkJRVFJDTEVkQlFUVkNPMGxCUkVrN096czdPenM3T3pzN1FVRkpWaXhOUVVGTkxFTkJRVU1zVDBGQlVDeEhRVUZwUWlKOVxuIiwidmFyIEFsZXBoQmV0LCBhZGFwdGVycywgb3B0aW9ucywgdXRpbHMsXG4gIGJpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG51dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuYWRhcHRlcnMgPSByZXF1aXJlKCcuL2FkYXB0ZXJzJyk7XG5cbm9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbnMnKTtcblxuQWxlcGhCZXQgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEFsZXBoQmV0KCkge31cblxuICBBbGVwaEJldC5vcHRpb25zID0gb3B0aW9ucztcblxuICBBbGVwaEJldC51dGlscyA9IHV0aWxzO1xuXG4gIEFsZXBoQmV0LkdpbWVsQWRhcHRlciA9IGFkYXB0ZXJzLkdpbWVsQWRhcHRlcjtcblxuICBBbGVwaEJldC5QZXJzaXN0ZW50UXVldWVHb29nbGVBbmFseXRpY3NBZGFwdGVyID0gYWRhcHRlcnMuUGVyc2lzdGVudFF1ZXVlR29vZ2xlQW5hbHl0aWNzQWRhcHRlcjtcblxuICBBbGVwaEJldC5QZXJzaXN0ZW50UXVldWVLZWVuQWRhcHRlciA9IGFkYXB0ZXJzLlBlcnNpc3RlbnRRdWV1ZUtlZW5BZGFwdGVyO1xuXG4gIEFsZXBoQmV0LkV4cGVyaW1lbnQgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9ydW4sIF92YWxpZGF0ZTtcblxuICAgIEV4cGVyaW1lbnQuX29wdGlvbnMgPSB7XG4gICAgICBuYW1lOiBudWxsLFxuICAgICAgdmFyaWFudHM6IG51bGwsXG4gICAgICB1c2VyX2lkOiBudWxsLFxuICAgICAgc2FtcGxlOiAxLjAsXG4gICAgICB0cmlnZ2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgdHJhY2tpbmdfYWRhcHRlcjogYWRhcHRlcnMuR29vZ2xlVW5pdmVyc2FsQW5hbHl0aWNzQWRhcHRlcixcbiAgICAgIHN0b3JhZ2VfYWRhcHRlcjogYWRhcHRlcnMuTG9jYWxTdG9yYWdlQWRhcHRlclxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBFeHBlcmltZW50KG9wdGlvbnMxKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zMSAhPSBudWxsID8gb3B0aW9uczEgOiB7fTtcbiAgICAgIHRoaXMuYWRkX2dvYWxzID0gYmluZCh0aGlzLmFkZF9nb2FscywgdGhpcyk7XG4gICAgICB0aGlzLmFkZF9nb2FsID0gYmluZCh0aGlzLmFkZF9nb2FsLCB0aGlzKTtcbiAgICAgIHV0aWxzLmRlZmF1bHRzKHRoaXMub3B0aW9ucywgRXhwZXJpbWVudC5fb3B0aW9ucyk7XG4gICAgICBfdmFsaWRhdGUuY2FsbCh0aGlzKTtcbiAgICAgIHRoaXMubmFtZSA9IHRoaXMub3B0aW9ucy5uYW1lO1xuICAgICAgdGhpcy52YXJpYW50cyA9IHRoaXMub3B0aW9ucy52YXJpYW50cztcbiAgICAgIHRoaXMudXNlcl9pZCA9IHRoaXMub3B0aW9ucy51c2VyX2lkO1xuICAgICAgdGhpcy52YXJpYW50X25hbWVzID0gdXRpbHMua2V5cyh0aGlzLnZhcmlhbnRzKTtcbiAgICAgIF9ydW4uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBFeHBlcmltZW50LnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2YXJpYW50O1xuICAgICAgdXRpbHMubG9nKFwicnVubmluZyB3aXRoIG9wdGlvbnM6IFwiICsgKEpTT04uc3RyaW5naWZ5KHRoaXMub3B0aW9ucykpKTtcbiAgICAgIGlmICh2YXJpYW50ID0gdGhpcy5nZXRfc3RvcmVkX3ZhcmlhbnQoKSkge1xuICAgICAgICB1dGlscy5sb2codmFyaWFudCArIFwiIGFjdGl2ZVwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZhdGVfdmFyaWFudCh2YXJpYW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbmFsbHlfYWN0aXZhdGVfdmFyaWFudCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfcnVuID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW4oKTtcbiAgICB9O1xuXG4gICAgRXhwZXJpbWVudC5wcm90b3R5cGUuYWN0aXZhdGVfdmFyaWFudCA9IGZ1bmN0aW9uKHZhcmlhbnQpIHtcbiAgICAgIHZhciByZWY7XG4gICAgICBpZiAoKHJlZiA9IHRoaXMudmFyaWFudHNbdmFyaWFudF0pICE9IG51bGwpIHtcbiAgICAgICAgcmVmLmFjdGl2YXRlKHRoaXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZSgpLnNldCh0aGlzLm9wdGlvbnMubmFtZSArIFwiOnZhcmlhbnRcIiwgdmFyaWFudCk7XG4gICAgfTtcblxuICAgIEV4cGVyaW1lbnQucHJvdG90eXBlLmNvbmRpdGlvbmFsbHlfYWN0aXZhdGVfdmFyaWFudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZhcmlhbnQ7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy50cmlnZ2VyKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdXRpbHMubG9nKCd0cmlnZ2VyIHNldCcpO1xuICAgICAgaWYgKCF0aGlzLmluX3NhbXBsZSgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHV0aWxzLmxvZygnaW4gc2FtcGxlJyk7XG4gICAgICB2YXJpYW50ID0gdGhpcy5waWNrX3ZhcmlhbnQoKTtcbiAgICAgIHRoaXMudHJhY2tpbmcoKS5leHBlcmltZW50X3N0YXJ0KHRoaXMsIHZhcmlhbnQpO1xuICAgICAgcmV0dXJuIHRoaXMuYWN0aXZhdGVfdmFyaWFudCh2YXJpYW50KTtcbiAgICB9O1xuXG4gICAgRXhwZXJpbWVudC5wcm90b3R5cGUuZ29hbF9jb21wbGV0ZSA9IGZ1bmN0aW9uKGdvYWxfbmFtZSwgcHJvcHMpIHtcbiAgICAgIHZhciB2YXJpYW50O1xuICAgICAgaWYgKHByb3BzID09IG51bGwpIHtcbiAgICAgICAgcHJvcHMgPSB7fTtcbiAgICAgIH1cbiAgICAgIHV0aWxzLmRlZmF1bHRzKHByb3BzLCB7XG4gICAgICAgIHVuaXF1ZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICBpZiAocHJvcHMudW5pcXVlICYmIHRoaXMuc3RvcmFnZSgpLmdldCh0aGlzLm9wdGlvbnMubmFtZSArIFwiOlwiICsgZ29hbF9uYW1lKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXJpYW50ID0gdGhpcy5nZXRfc3RvcmVkX3ZhcmlhbnQoKTtcbiAgICAgIGlmICghdmFyaWFudCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocHJvcHMudW5pcXVlKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZSgpLnNldCh0aGlzLm9wdGlvbnMubmFtZSArIFwiOlwiICsgZ29hbF9uYW1lLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIHV0aWxzLmxvZyhcImV4cGVyaW1lbnQ6IFwiICsgdGhpcy5vcHRpb25zLm5hbWUgKyBcIiB2YXJpYW50OlwiICsgdmFyaWFudCArIFwiIGdvYWw6XCIgKyBnb2FsX25hbWUgKyBcIiBjb21wbGV0ZVwiKTtcbiAgICAgIHJldHVybiB0aGlzLnRyYWNraW5nKCkuZ29hbF9jb21wbGV0ZSh0aGlzLCB2YXJpYW50LCBnb2FsX25hbWUsIHByb3BzKTtcbiAgICB9O1xuXG4gICAgRXhwZXJpbWVudC5wcm90b3R5cGUuZ2V0X3N0b3JlZF92YXJpYW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yYWdlKCkuZ2V0KHRoaXMub3B0aW9ucy5uYW1lICsgXCI6dmFyaWFudFwiKTtcbiAgICB9O1xuXG4gICAgRXhwZXJpbWVudC5wcm90b3R5cGUucGlja192YXJpYW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY2hvc2VuX3BhcnRpdGlvbiwgcGFydGl0aW9ucywgdmFyaWFudDtcbiAgICAgIHBhcnRpdGlvbnMgPSAxLjAgLyB0aGlzLnZhcmlhbnRfbmFtZXMubGVuZ3RoO1xuICAgICAgY2hvc2VuX3BhcnRpdGlvbiA9IE1hdGguZmxvb3IodGhpcy5fcmFuZG9tKCd2YXJpYW50JykgLyBwYXJ0aXRpb25zKTtcbiAgICAgIHZhcmlhbnQgPSB0aGlzLnZhcmlhbnRfbmFtZXNbY2hvc2VuX3BhcnRpdGlvbl07XG4gICAgICB1dGlscy5sb2codmFyaWFudCArIFwiIHBpY2tlZFwiKTtcbiAgICAgIHJldHVybiB2YXJpYW50O1xuICAgIH07XG5cbiAgICBFeHBlcmltZW50LnByb3RvdHlwZS5pbl9zYW1wbGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhY3RpdmU7XG4gICAgICBhY3RpdmUgPSB0aGlzLnN0b3JhZ2UoKS5nZXQodGhpcy5vcHRpb25zLm5hbWUgKyBcIjppbl9zYW1wbGVcIik7XG4gICAgICBpZiAodHlwZW9mIGFjdGl2ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIGFjdGl2ZTtcbiAgICAgIH1cbiAgICAgIGFjdGl2ZSA9IHRoaXMuX3JhbmRvbSgnc2FtcGxlJykgPD0gdGhpcy5vcHRpb25zLnNhbXBsZTtcbiAgICAgIHRoaXMuc3RvcmFnZSgpLnNldCh0aGlzLm9wdGlvbnMubmFtZSArIFwiOmluX3NhbXBsZVwiLCBhY3RpdmUpO1xuICAgICAgcmV0dXJuIGFjdGl2ZTtcbiAgICB9O1xuXG4gICAgRXhwZXJpbWVudC5wcm90b3R5cGUuX3JhbmRvbSA9IGZ1bmN0aW9uKHNhbHQpIHtcbiAgICAgIHZhciBzZWVkO1xuICAgICAgaWYgKCF0aGlzLnVzZXJfaWQpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxzLnJhbmRvbSgpO1xuICAgICAgfVxuICAgICAgc2VlZCA9IHRoaXMubmFtZSArIFwiLlwiICsgc2FsdCArIFwiLlwiICsgdGhpcy51c2VyX2lkO1xuICAgICAgcmV0dXJuIHV0aWxzLnJhbmRvbShzZWVkKTtcbiAgICB9O1xuXG4gICAgRXhwZXJpbWVudC5wcm90b3R5cGUuYWRkX2dvYWwgPSBmdW5jdGlvbihnb2FsKSB7XG4gICAgICByZXR1cm4gZ29hbC5hZGRfZXhwZXJpbWVudCh0aGlzKTtcbiAgICB9O1xuXG4gICAgRXhwZXJpbWVudC5wcm90b3R5cGUuYWRkX2dvYWxzID0gZnVuY3Rpb24oZ29hbHMpIHtcbiAgICAgIHZhciBnb2FsLCBpLCBsZW4sIHJlc3VsdHM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBnb2Fscy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBnb2FsID0gZ29hbHNbaV07XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLmFkZF9nb2FsKGdvYWwpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH07XG5cbiAgICBFeHBlcmltZW50LnByb3RvdHlwZS5zdG9yYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnN0b3JhZ2VfYWRhcHRlcjtcbiAgICB9O1xuXG4gICAgRXhwZXJpbWVudC5wcm90b3R5cGUudHJhY2tpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMudHJhY2tpbmdfYWRhcHRlcjtcbiAgICB9O1xuXG4gICAgX3ZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLm5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgJ2FuIGV4cGVyaW1lbnQgbmFtZSBtdXN0IGJlIHNwZWNpZmllZCc7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnZhcmlhbnRzID09PSBudWxsKSB7XG4gICAgICAgIHRocm93ICd2YXJpYW50cyBtdXN0IGJlIHByb3ZpZGVkJztcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnRyaWdnZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgJ3RyaWdnZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIEV4cGVyaW1lbnQ7XG5cbiAgfSkoKTtcblxuICBBbGVwaEJldC5Hb2FsID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEdvYWwobmFtZSwgcHJvcHMxKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgdGhpcy5wcm9wcyA9IHByb3BzMSAhPSBudWxsID8gcHJvcHMxIDoge307XG4gICAgICB1dGlscy5kZWZhdWx0cyh0aGlzLnByb3BzLCB7XG4gICAgICAgIHVuaXF1ZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLmV4cGVyaW1lbnRzID0gW107XG4gICAgfVxuXG4gICAgR29hbC5wcm90b3R5cGUuYWRkX2V4cGVyaW1lbnQgPSBmdW5jdGlvbihleHBlcmltZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5leHBlcmltZW50cy5wdXNoKGV4cGVyaW1lbnQpO1xuICAgIH07XG5cbiAgICBHb2FsLnByb3RvdHlwZS5hZGRfZXhwZXJpbWVudHMgPSBmdW5jdGlvbihleHBlcmltZW50cykge1xuICAgICAgdmFyIGV4cGVyaW1lbnQsIGksIGxlbiwgcmVzdWx0cztcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGV4cGVyaW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGV4cGVyaW1lbnQgPSBleHBlcmltZW50c1tpXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuYWRkX2V4cGVyaW1lbnQoZXhwZXJpbWVudCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfTtcblxuICAgIEdvYWwucHJvdG90eXBlLmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZXhwZXJpbWVudCwgaSwgbGVuLCByZWYsIHJlc3VsdHM7XG4gICAgICByZWYgPSB0aGlzLmV4cGVyaW1lbnRzO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGV4cGVyaW1lbnQgPSByZWZbaV07XG4gICAgICAgIHJlc3VsdHMucHVzaChleHBlcmltZW50LmdvYWxfY29tcGxldGUodGhpcy5uYW1lLCB0aGlzLnByb3BzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9O1xuXG4gICAgcmV0dXJuIEdvYWw7XG5cbiAgfSkoKTtcblxuICByZXR1cm4gQWxlcGhCZXQ7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gQWxlcGhCZXQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNKaVlXeHBZMnRwTDJOdlpHVXZhbVYwZEhrdllXeGxjR2hpWlhRdmMzSmpMMkZzWlhCb1ltVjBMbU52Wm1abFpTSXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OXlZbUZzYVdOcmFTOWpiMlJsTDJwbGRIUjVMMkZzWlhCb1ltVjBMM055WXk5aGJHVndhR0psZEM1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1NVRkJRU3hyUTBGQlFUdEZRVUZCT3p0QlFVRkJMRXRCUVVFc1IwRkJVU3hQUVVGQkxFTkJRVkVzVTBGQlVqczdRVUZEVWl4UlFVRkJMRWRCUVZjc1QwRkJRU3hEUVVGUkxGbEJRVkk3TzBGQlExZ3NUMEZCUVN4SFFVRlZMRTlCUVVFc1EwRkJVU3hYUVVGU096dEJRVVZLT3pzN1JVRkRTaXhSUVVGRExFTkJRVUVzVDBGQlJDeEhRVUZYT3p0RlFVTllMRkZCUVVNc1EwRkJRU3hMUVVGRUxFZEJRVk03TzBWQlJWUXNVVUZCUXl4RFFVRkJMRmxCUVVRc1IwRkJaMElzVVVGQlVTeERRVUZET3p0RlFVTjZRaXhSUVVGRExFTkJRVUVzY1VOQlFVUXNSMEZCZVVNc1VVRkJVU3hEUVVGRE96dEZRVU5zUkN4UlFVRkRMRU5CUVVFc01FSkJRVVFzUjBGQk9FSXNVVUZCVVN4RFFVRkRPenRGUVVWcVF5eFJRVUZETEVOQlFVRTdRVUZEVEN4UlFVRkJPenRKUVVGQkxGVkJRVU1zUTBGQlFTeFJRVUZFTEVkQlEwVTdUVUZCUVN4SlFVRkJMRVZCUVUwc1NVRkJUanROUVVOQkxGRkJRVUVzUlVGQlZTeEpRVVJXTzAxQlJVRXNUMEZCUVN4RlFVRlRMRWxCUmxRN1RVRkhRU3hOUVVGQkxFVkJRVkVzUjBGSVVqdE5RVWxCTEU5QlFVRXNSVUZCVXl4VFFVRkJPMlZCUVVjN1RVRkJTQ3hEUVVwVU8wMUJTMEVzWjBKQlFVRXNSVUZCYTBJc1VVRkJVU3hEUVVGRExDdENRVXd6UWp0TlFVMUJMR1ZCUVVFc1JVRkJhVUlzVVVGQlVTeERRVUZETEcxQ1FVNHhRanM3TzBsQlVWY3NiMEpCUVVNc1VVRkJSRHROUVVGRExFbEJRVU1zUTBGQlFTdzJRa0ZCUkN4WFFVRlRPenM3VFVGRGNrSXNTMEZCU3l4RFFVRkRMRkZCUVU0c1EwRkJaU3hKUVVGRExFTkJRVUVzVDBGQmFFSXNSVUZCZVVJc1ZVRkJWU3hEUVVGRExGRkJRWEJETzAxQlEwRXNVMEZCVXl4RFFVRkRMRWxCUVZZc1EwRkJaU3hKUVVGbU8wMUJRMEVzU1VGQlF5eERRVUZCTEVsQlFVUXNSMEZCVVN4SlFVRkRMRU5CUVVFc1QwRkJUeXhEUVVGRE8wMUJRMnBDTEVsQlFVTXNRMEZCUVN4UlFVRkVMRWRCUVZrc1NVRkJReXhEUVVGQkxFOUJRVThzUTBGQlF6dE5RVU55UWl4SlFVRkRMRU5CUVVFc1QwRkJSQ3hIUVVGWExFbEJRVU1zUTBGQlFTeFBRVUZQTEVOQlFVTTdUVUZEY0VJc1NVRkJReXhEUVVGQkxHRkJRVVFzUjBGQmFVSXNTMEZCU3l4RFFVRkRMRWxCUVU0c1EwRkJWeXhKUVVGRExFTkJRVUVzVVVGQldqdE5RVU5xUWl4SlFVRkpMRU5CUVVNc1NVRkJUQ3hEUVVGVkxFbEJRVlk3U1VGUVZ6czdlVUpCVTJJc1IwRkJRU3hIUVVGTExGTkJRVUU3UVVGRFNDeFZRVUZCTzAxQlFVRXNTMEZCU3l4RFFVRkRMRWRCUVU0c1EwRkJWU3gzUWtGQlFTeEhRVUYzUWl4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGTUxFTkJRV1VzU1VGQlF5eERRVUZCTEU5QlFXaENMRU5CUVVRc1EwRkJiRU03VFVGRFFTeEpRVUZITEU5QlFVRXNSMEZCVlN4SlFVRkRMRU5CUVVFc2EwSkJRVVFzUTBGQlFTeERRVUZpTzFGQlJVVXNTMEZCU3l4RFFVRkRMRWRCUVU0c1EwRkJZU3hQUVVGRUxFZEJRVk1zVTBGQmNrSTdaVUZEUVN4SlFVRkRMRU5CUVVFc1owSkJRVVFzUTBGQmEwSXNUMEZCYkVJc1JVRklSanRQUVVGQkxFMUJRVUU3WlVGTFJTeEpRVUZETEVOQlFVRXNPRUpCUVVRc1EwRkJRU3hGUVV4R096dEpRVVpIT3p0SlFWTk1MRWxCUVVFc1IwRkJUeXhUUVVGQk8yRkJRVWNzU1VGQlF5eERRVUZCTEVkQlFVUXNRMEZCUVR0SlFVRklPenQ1UWtGRlVDeG5Ra0ZCUVN4SFFVRnJRaXhUUVVGRExFOUJRVVE3UVVGRGFFSXNWVUZCUVRzN1YwRkJhMElzUTBGQlJTeFJRVUZ3UWl4RFFVRTJRaXhKUVVFM1FqczdZVUZEUVN4SlFVRkRMRU5CUVVFc1QwRkJSQ3hEUVVGQkxFTkJRVlVzUTBGQlF5eEhRVUZZTEVOQlFXdENMRWxCUVVNc1EwRkJRU3hQUVVGUExFTkJRVU1zU1VGQlZpeEhRVUZsTEZWQlFXaERMRVZCUVRKRExFOUJRVE5ETzBsQlJtZENPenQ1UWtGTGJFSXNPRUpCUVVFc1IwRkJaME1zVTBGQlFUdEJRVU01UWl4VlFVRkJPMDFCUVVFc1NVRkJRU3hEUVVGakxFbEJRVU1zUTBGQlFTeFBRVUZQTEVOQlFVTXNUMEZCVkN4RFFVRkJMRU5CUVdRN1FVRkJRU3hsUVVGQk96dE5RVU5CTEV0QlFVc3NRMEZCUXl4SFFVRk9MRU5CUVZVc1lVRkJWanROUVVOQkxFbEJRVUVzUTBGQll5eEpRVUZETEVOQlFVRXNVMEZCUkN4RFFVRkJMRU5CUVdRN1FVRkJRU3hsUVVGQk96dE5RVU5CTEV0QlFVc3NRMEZCUXl4SFFVRk9MRU5CUVZVc1YwRkJWanROUVVOQkxFOUJRVUVzUjBGQlZTeEpRVUZETEVOQlFVRXNXVUZCUkN4RFFVRkJPMDFCUTFZc1NVRkJReXhEUVVGQkxGRkJRVVFzUTBGQlFTeERRVUZYTEVOQlFVTXNaMEpCUVZvc1EwRkJOa0lzU1VGQk4wSXNSVUZCYlVNc1QwRkJia003WVVGRFFTeEpRVUZETEVOQlFVRXNaMEpCUVVRc1EwRkJhMElzVDBGQmJFSTdTVUZRT0VJN08zbENRVk5vUXl4aFFVRkJMRWRCUVdVc1UwRkJReXhUUVVGRUxFVkJRVmtzUzBGQldqdEJRVU5pTEZWQlFVRTdPMUZCUkhsQ0xGRkJRVTA3TzAxQlF5OUNMRXRCUVVzc1EwRkJReXhSUVVGT0xFTkJRV1VzUzBGQlppeEZRVUZ6UWp0UlFVRkRMRTFCUVVFc1JVRkJVU3hKUVVGVU8wOUJRWFJDTzAxQlEwRXNTVUZCVlN4TFFVRkxMRU5CUVVNc1RVRkJUaXhKUVVGblFpeEpRVUZETEVOQlFVRXNUMEZCUkN4RFFVRkJMRU5CUVZVc1EwRkJReXhIUVVGWUxFTkJRV3RDTEVsQlFVTXNRMEZCUVN4UFFVRlBMRU5CUVVNc1NVRkJWaXhIUVVGbExFZEJRV1lzUjBGQmEwSXNVMEZCYmtNc1EwRkJNVUk3UVVGQlFTeGxRVUZCT3p0TlFVTkJMRTlCUVVFc1IwRkJWU3hKUVVGRExFTkJRVUVzYTBKQlFVUXNRMEZCUVR0TlFVTldMRWxCUVVFc1EwRkJZeXhQUVVGa08wRkJRVUVzWlVGQlFUczdUVUZEUVN4SlFVRjVSQ3hMUVVGTExFTkJRVU1zVFVGQkwwUTdVVUZCUVN4SlFVRkRMRU5CUVVFc1QwRkJSQ3hEUVVGQkxFTkJRVlVzUTBGQlF5eEhRVUZZTEVOQlFXdENMRWxCUVVNc1EwRkJRU3hQUVVGUExFTkJRVU1zU1VGQlZpeEhRVUZsTEVkQlFXWXNSMEZCYTBJc1UwRkJia01zUlVGQlowUXNTVUZCYUVRc1JVRkJRVHM3VFVGRFFTeExRVUZMTEVOQlFVTXNSMEZCVGl4RFFVRlZMR05CUVVFc1IwRkJaU3hKUVVGRExFTkJRVUVzVDBGQlR5eERRVUZETEVsQlFYaENMRWRCUVRaQ0xGZEJRVGRDTEVkQlFYZERMRTlCUVhoRExFZEJRV2RFTEZGQlFXaEVMRWRCUVhkRUxGTkJRWGhFTEVkQlFXdEZMRmRCUVRWRk8yRkJRMEVzU1VGQlF5eERRVUZCTEZGQlFVUXNRMEZCUVN4RFFVRlhMRU5CUVVNc1lVRkJXaXhEUVVFd1FpeEpRVUV4UWl4RlFVRm5ReXhQUVVGb1F5eEZRVUY1UXl4VFFVRjZReXhGUVVGdlJDeExRVUZ3UkR0SlFWQmhPenQ1UWtGVFppeHJRa0ZCUVN4SFFVRnZRaXhUUVVGQk8yRkJRMnhDTEVsQlFVTXNRMEZCUVN4UFFVRkVMRU5CUVVFc1EwRkJWU3hEUVVGRExFZEJRVmdzUTBGQmEwSXNTVUZCUXl4RFFVRkJMRTlCUVU4c1EwRkJReXhKUVVGV0xFZEJRV1VzVlVGQmFFTTdTVUZFYTBJN08zbENRVWR3UWl4WlFVRkJMRWRCUVdNc1UwRkJRVHRCUVVOYUxGVkJRVUU3VFVGQlFTeFZRVUZCTEVkQlFXRXNSMEZCUVN4SFFVRk5MRWxCUVVNc1EwRkJRU3hoUVVGaExFTkJRVU03VFVGRGJFTXNaMEpCUVVFc1IwRkJiVUlzU1VGQlNTeERRVUZETEV0QlFVd3NRMEZCVnl4SlFVRkRMRU5CUVVFc1QwRkJSQ3hEUVVGVExGTkJRVlFzUTBGQlFTeEhRVUZ6UWl4VlFVRnFRenROUVVOdVFpeFBRVUZCTEVkQlFWVXNTVUZCUXl4RFFVRkJMR0ZCUVdNc1EwRkJRU3huUWtGQlFUdE5RVU42UWl4TFFVRkxMRU5CUVVNc1IwRkJUaXhEUVVGaExFOUJRVVFzUjBGQlV5eFRRVUZ5UWp0aFFVTkJPMGxCVEZrN08zbENRVTlrTEZOQlFVRXNSMEZCVnl4VFFVRkJPMEZCUTFRc1ZVRkJRVHROUVVGQkxFMUJRVUVzUjBGQlV5eEpRVUZETEVOQlFVRXNUMEZCUkN4RFFVRkJMRU5CUVZVc1EwRkJReXhIUVVGWUxFTkJRV3RDTEVsQlFVTXNRMEZCUVN4UFFVRlBMRU5CUVVNc1NVRkJWaXhIUVVGbExGbEJRV2hETzAxQlExUXNTVUZCY1VJc1QwRkJUeXhOUVVGUUxFdEJRV2xDTEZkQlFYUkRPMEZCUVVFc1pVRkJUeXhQUVVGUU96dE5RVU5CTEUxQlFVRXNSMEZCVXl4SlFVRkRMRU5CUVVFc1QwRkJSQ3hEUVVGVExGRkJRVlFzUTBGQlFTeEpRVUZ6UWl4SlFVRkRMRU5CUVVFc1QwRkJUeXhEUVVGRE8wMUJRM2hETEVsQlFVTXNRMEZCUVN4UFFVRkVMRU5CUVVFc1EwRkJWU3hEUVVGRExFZEJRVmdzUTBGQmEwSXNTVUZCUXl4RFFVRkJMRTlCUVU4c1EwRkJReXhKUVVGV0xFZEJRV1VzV1VGQmFFTXNSVUZCTmtNc1RVRkJOME03WVVGRFFUdEpRVXhUT3p0NVFrRlBXQ3hQUVVGQkxFZEJRVk1zVTBGQlF5eEpRVUZFTzBGQlExQXNWVUZCUVR0TlFVRkJMRWxCUVVFc1EwRkJOa0lzU1VGQlF5eERRVUZCTEU5QlFUbENPMEZCUVVFc1pVRkJUeXhMUVVGTExFTkJRVU1zVFVGQlRpeERRVUZCTEVWQlFWQTdPMDFCUTBFc1NVRkJRU3hIUVVGVkxFbEJRVU1zUTBGQlFTeEpRVUZHTEVkQlFVOHNSMEZCVUN4SFFVRlZMRWxCUVZZc1IwRkJaU3hIUVVGbUxFZEJRV3RDTEVsQlFVTXNRMEZCUVR0aFFVTTFRaXhMUVVGTExFTkJRVU1zVFVGQlRpeERRVUZoTEVsQlFXSTdTVUZJVHpzN2VVSkJTMVFzVVVGQlFTeEhRVUZWTEZOQlFVTXNTVUZCUkR0aFFVTlNMRWxCUVVrc1EwRkJReXhqUVVGTUxFTkJRVzlDTEVsQlFYQkNPMGxCUkZFN08zbENRVWRXTEZOQlFVRXNSMEZCVnl4VFFVRkRMRXRCUVVRN1FVRkRWQ3hWUVVGQk8wRkJRVUU3VjBGQlFTeDFRMEZCUVRzN2NVSkJRVUVzU1VGQlF5eERRVUZCTEZGQlFVUXNRMEZCVlN4SlFVRldPMEZCUVVFN08wbEJSRk03TzNsQ1FVZFlMRTlCUVVFc1IwRkJVeXhUUVVGQk8yRkJRVWNzU1VGQlF5eERRVUZCTEU5QlFVOHNRMEZCUXp0SlFVRmFPenQ1UWtGRlZDeFJRVUZCTEVkQlFWVXNVMEZCUVR0aFFVRkhMRWxCUVVNc1EwRkJRU3hQUVVGUExFTkJRVU03U1VGQldqczdTVUZGVml4VFFVRkJMRWRCUVZrc1UwRkJRVHROUVVOV0xFbEJRV2RFTEVsQlFVTXNRMEZCUVN4UFFVRlBMRU5CUVVNc1NVRkJWQ3hMUVVGcFFpeEpRVUZxUlR0QlFVRkJMR05CUVUwc2RVTkJRVTQ3TzAxQlEwRXNTVUZCY1VNc1NVRkJReXhEUVVGQkxFOUJRVThzUTBGQlF5eFJRVUZVTEV0QlFYRkNMRWxCUVRGRU8wRkJRVUVzWTBGQlRTdzBRa0ZCVGpzN1RVRkRRU3hKUVVGelF5eFBRVUZQTEVsQlFVTXNRMEZCUVN4UFFVRlBMRU5CUVVNc1QwRkJhRUlzUzBGQk5rSXNWVUZCYmtVN1FVRkJRU3hqUVVGTkxEWkNRVUZPT3p0SlFVaFZPenM3T3pzN1JVRk5VaXhSUVVGRExFTkJRVUU3U1VGRFVTeGpRVUZETEVsQlFVUXNSVUZCVVN4TlFVRlNPMDFCUVVNc1NVRkJReXhEUVVGQkxFOUJRVVE3VFVGQlR5eEpRVUZETEVOQlFVRXNlVUpCUVVRc1UwRkJUenROUVVNeFFpeExRVUZMTEVOQlFVTXNVVUZCVGl4RFFVRmxMRWxCUVVNc1EwRkJRU3hMUVVGb1FpeEZRVUYxUWp0UlFVRkRMRTFCUVVFc1JVRkJVU3hKUVVGVU8wOUJRWFpDTzAxQlEwRXNTVUZCUXl4RFFVRkJMRmRCUVVRc1IwRkJaVHRKUVVaS096dHRRa0ZKWWl4alFVRkJMRWRCUVdkQ0xGTkJRVU1zVlVGQlJEdGhRVU5rTEVsQlFVTXNRMEZCUVN4WFFVRlhMRU5CUVVNc1NVRkJZaXhEUVVGclFpeFZRVUZzUWp0SlFVUmpPenR0UWtGSGFFSXNaVUZCUVN4SFFVRnBRaXhUUVVGRExGZEJRVVE3UVVGRFppeFZRVUZCTzBGQlFVRTdWMEZCUVN3MlEwRkJRVHM3Y1VKQlFVRXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJaMElzVlVGQmFFSTdRVUZCUVRzN1NVRkVaVHM3YlVKQlIycENMRkZCUVVFc1IwRkJWU3hUUVVGQk8wRkJRMUlzVlVGQlFUdEJRVUZCTzBGQlFVRTdWMEZCUVN4eFEwRkJRVHM3Y1VKQlEwVXNWVUZCVlN4RFFVRkRMR0ZCUVZnc1EwRkJlVUlzU1VGQlF5eERRVUZCTEVsQlFURkNMRVZCUVdkRExFbEJRVU1zUTBGQlFTeExRVUZxUXp0QlFVUkdPenRKUVVSUk96czdPenM3T3pzN08wRkJTMlFzVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJaWZRPT1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBkZWJ1ZzogZmFsc2Vcbn07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNKaVlXeHBZMnRwTDJOdlpHVXZhbVYwZEhrdllXeGxjR2hpWlhRdmMzSmpMMjl3ZEdsdmJuTXVZMjltWm1WbElpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMMVZ6WlhKekwzSmlZV3hwWTJ0cEwyTnZaR1V2YW1WMGRIa3ZZV3hsY0doaVpYUXZjM0pqTDI5d2RHbHZibk11WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUTBVN1JVRkJRU3hMUVVGQkxFVkJRVThzUzBGQlVDSjlcbiIsInZhciBTdG9yYWdlLCBzdG9yZTtcblxuc3RvcmUgPSByZXF1aXJlKCdzdG9yZScpO1xuXG5TdG9yYWdlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBTdG9yYWdlKG5hbWVzcGFjZSkge1xuICAgIHRoaXMubmFtZXNwYWNlID0gbmFtZXNwYWNlICE9IG51bGwgPyBuYW1lc3BhY2UgOiAnYWxlcGhiZXQnO1xuICAgIGlmICghc3RvcmUuZW5hYmxlZCkge1xuICAgICAgdGhyb3cgJ2xvY2FsIHN0b3JhZ2Ugbm90IHN1cHBvcnRlZCc7XG4gICAgfVxuICAgIHRoaXMuc3RvcmFnZSA9IHN0b3JlLmdldCh0aGlzLm5hbWVzcGFjZSkgfHwge307XG4gIH1cblxuICBTdG9yYWdlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgdGhpcy5zdG9yYWdlW2tleV0gPSB2YWx1ZTtcbiAgICBzdG9yZS5zZXQodGhpcy5uYW1lc3BhY2UsIHRoaXMuc3RvcmFnZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIFN0b3JhZ2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiB0aGlzLnN0b3JhZ2Vba2V5XTtcbiAgfTtcblxuICByZXR1cm4gU3RvcmFnZTtcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdG9yYWdlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzSmlZV3hwWTJ0cEwyTnZaR1V2YW1WMGRIa3ZZV3hsY0doaVpYUXZjM0pqTDNOMGIzSmhaMlV1WTI5bVptVmxJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMM0ppWVd4cFkydHBMMk52WkdVdmFtVjBkSGt2WVd4bGNHaGlaWFF2YzNKakwzTjBiM0poWjJVdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFbEJRVUU3TzBGQlFVRXNTMEZCUVN4SFFVRlJMRTlCUVVFc1EwRkJVU3hQUVVGU096dEJRVWRHTzBWQlExTXNhVUpCUVVNc1UwRkJSRHRKUVVGRExFbEJRVU1zUTBGQlFTeG5RMEZCUkN4WlFVRlhPMGxCUTNaQ0xFbEJRVUVzUTBGQk1rTXNTMEZCU3l4RFFVRkRMRTlCUVdwRU8wRkJRVUVzV1VGQlRTdzRRa0ZCVGpzN1NVRkRRU3hKUVVGRExFTkJRVUVzVDBGQlJDeEhRVUZYTEV0QlFVc3NRMEZCUXl4SFFVRk9MRU5CUVZVc1NVRkJReXhEUVVGQkxGTkJRVmdzUTBGQlFTeEpRVUY1UWp0RlFVWjZRanM3YjBKQlIySXNSMEZCUVN4SFFVRkxMRk5CUVVNc1IwRkJSQ3hGUVVGTkxFdEJRVTQ3U1VGRFNDeEpRVUZETEVOQlFVRXNUMEZCVVN4RFFVRkJMRWRCUVVFc1EwRkJWQ3hIUVVGblFqdEpRVU5vUWl4TFFVRkxMRU5CUVVNc1IwRkJUaXhEUVVGVkxFbEJRVU1zUTBGQlFTeFRRVUZZTEVWQlFYTkNMRWxCUVVNc1EwRkJRU3hQUVVGMlFqdEJRVU5CTEZkQlFVODdSVUZJU2pzN2IwSkJTVXdzUjBGQlFTeEhRVUZMTEZOQlFVTXNSMEZCUkR0WFFVTklMRWxCUVVNc1EwRkJRU3hQUVVGUkxFTkJRVUVzUjBGQlFUdEZRVVJPT3pzN096czdRVUZKVUN4TlFVRk5MRU5CUVVNc1QwRkJVQ3hIUVVGcFFpSjlcbiIsInZhciBVdGlscywgXywgb3B0aW9ucywgc2hhMSwgdXVpZDtcblxuXyA9IHJlcXVpcmUoJy4uL3ZlbmRvci9sb2Rhc2guY3VzdG9tLm1pbicpO1xuXG51dWlkID0gcmVxdWlyZSgnbm9kZS11dWlkJyk7XG5cbnNoYTEgPSByZXF1aXJlKCdjcnlwdG8tanMvc2hhMScpO1xuXG5vcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb25zJyk7XG5cblV0aWxzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBVdGlscygpIHt9XG5cbiAgVXRpbHMuZGVmYXVsdHMgPSBfLmRlZmF1bHRzO1xuXG4gIFV0aWxzLmtleXMgPSBfLmtleXM7XG5cbiAgVXRpbHMucmVtb3ZlID0gXy5yZW1vdmU7XG5cbiAgVXRpbHMub21pdCA9IF8ub21pdDtcblxuICBVdGlscy5sb2cgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgaWYgKG9wdGlvbnMuZGVidWcpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICB9XG4gIH07XG5cbiAgVXRpbHMudXVpZCA9IHV1aWQudjQ7XG5cbiAgVXRpbHMuc2hhMSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gc2hhMSh0ZXh0KS50b1N0cmluZygpO1xuICB9O1xuXG4gIFV0aWxzLnJhbmRvbSA9IGZ1bmN0aW9uKHNlZWQpIHtcbiAgICBpZiAoIXNlZWQpIHtcbiAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5zaGExKHNlZWQpLnN1YnN0cigwLCAxMyksIDE2KSAvIDB4RkZGRkZGRkZGRkZGRjtcbiAgfTtcblxuICByZXR1cm4gVXRpbHM7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gVXRpbHM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNKaVlXeHBZMnRwTDJOdlpHVXZhbVYwZEhrdllXeGxjR2hpWlhRdmMzSmpMM1YwYVd4ekxtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5eVltRnNhV05yYVM5amIyUmxMMnBsZEhSNUwyRnNaWEJvWW1WMEwzTnlZeTkxZEdsc2N5NWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlEwRXNTVUZCUVRzN1FVRkJRU3hEUVVGQkxFZEJRVWtzVDBGQlFTeERRVUZSTERaQ1FVRlNPenRCUVVOS0xFbEJRVUVzUjBGQlR5eFBRVUZCTEVOQlFWRXNWMEZCVWpzN1FVRkRVQ3hKUVVGQkxFZEJRVThzVDBGQlFTeERRVUZSTEdkQ1FVRlNPenRCUVVOUUxFOUJRVUVzUjBGQlZTeFBRVUZCTEVOQlFWRXNWMEZCVWpzN1FVRkZTanM3TzBWQlEwb3NTMEZCUXl4RFFVRkJMRkZCUVVRc1IwRkJWeXhEUVVGRExFTkJRVU03TzBWQlEySXNTMEZCUXl4RFFVRkJMRWxCUVVRc1IwRkJUeXhEUVVGRExFTkJRVU03TzBWQlExUXNTMEZCUXl4RFFVRkJMRTFCUVVRc1IwRkJVeXhEUVVGRExFTkJRVU03TzBWQlExZ3NTMEZCUXl4RFFVRkJMRWxCUVVRc1IwRkJUeXhEUVVGRExFTkJRVU03TzBWQlExUXNTMEZCUXl4RFFVRkJMRWRCUVVRc1IwRkJUU3hUUVVGRExFOUJRVVE3U1VGRFNpeEpRVUYzUWl4UFFVRlBMRU5CUVVNc1MwRkJhRU03WVVGQlFTeFBRVUZQTEVOQlFVTXNSMEZCVWl4RFFVRlpMRTlCUVZvc1JVRkJRVHM3UlVGRVNUczdSVUZGVGl4TFFVRkRMRU5CUVVFc1NVRkJSQ3hIUVVGUExFbEJRVWtzUTBGQlF6czdSVUZEV2l4TFFVRkRMRU5CUVVFc1NVRkJSQ3hIUVVGUExGTkJRVU1zU1VGQlJEdFhRVU5NTEVsQlFVRXNRMEZCU3l4SlFVRk1MRU5CUVZVc1EwRkJReXhSUVVGWUxFTkJRVUU3UlVGRVN6czdSVUZGVUN4TFFVRkRMRU5CUVVFc1RVRkJSQ3hIUVVGVExGTkJRVU1zU1VGQlJEdEpRVU5RTEVsQlFVRXNRMEZCTkVJc1NVRkJOVUk3UVVGQlFTeGhRVUZQTEVsQlFVa3NRMEZCUXl4TlFVRk1MRU5CUVVFc1JVRkJVRHM3VjBGRlFTeFJRVUZCTEVOQlFWTXNTVUZCUXl4RFFVRkJMRWxCUVVRc1EwRkJUU3hKUVVGT0xFTkJRVmNzUTBGQlF5eE5RVUZhTEVOQlFXMUNMRU5CUVc1Q0xFVkJRWE5DTEVWQlFYUkNMRU5CUVZRc1JVRkJiME1zUlVGQmNFTXNRMEZCUVN4SFFVRXdRenRGUVVodVF6czdPenM3TzBGQlNWZ3NUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpZlE9PVxuIiwiLyoqXG4gKiBAbGljZW5zZVxuICogbG9kYXNoIDMuMTAuMSAoQ3VzdG9tIEJ1aWxkKSBsb2Rhc2guY29tL2xpY2Vuc2UgfCBVbmRlcnNjb3JlLmpzIDEuOC4zIHVuZGVyc2NvcmVqcy5vcmcvTElDRU5TRVxuICogQnVpbGQ6IGBsb2Rhc2ggLXAgaW5jbHVkZT1cImtleXMsZGVmYXVsdHMscmVtb3ZlLG9taXRcIiBleHBvcnRzPVwibm9kZVwiIC1vIC4vdmVuZG9yL2xvZGFzaC5jdXN0b20ubWluLmpzYFxuICovXG47KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihyLG4sZSl7aWYobiE9PW4pcmV0dXJuIHQocixlKTtmb3IodmFyIHU9ZS0xLG89ci5sZW5ndGg7Kyt1PG87KWlmKHJbdV09PT1uKXJldHVybiB1O3JldHVybi0xfWZ1bmN0aW9uIG4ocil7cmV0dXJuIG51bGw9PXI/XCJcIjpyK1wiXCJ9ZnVuY3Rpb24gdChyLG4sdCl7Zm9yKHZhciBlPXIubGVuZ3RoLHU9bisodD8wOi0xKTt0P3UtLTorK3U8ZTspe3ZhciBvPXJbdV07aWYobyE9PW8pcmV0dXJuIHV9cmV0dXJuLTF9ZnVuY3Rpb24gZShyKXtyZXR1cm4hIXImJnR5cGVvZiByPT1cIm9iamVjdFwifWZ1bmN0aW9uIHUoKXt9ZnVuY3Rpb24gbyhyKXt2YXIgbj1yP3IubGVuZ3RoOjA7Zm9yKHRoaXMuZGF0YT17aGFzaDpfbihudWxsKSxzZXQ6bmV3IElufTtuLS07KXRoaXMucHVzaChyW25dKX1mdW5jdGlvbiBhKHIsbil7dmFyIHQ9ci5kYXRhLGU9dHlwZW9mIG49PVwic3RyaW5nXCJ8fGhyKG4pP3Quc2V0LmhhcyhuKTp0Lmhhc2hbbl07cmV0dXJuIGU/MDotMX1cbmZ1bmN0aW9uIGMocil7dmFyIG49dGhpcy5kYXRhO3R5cGVvZiByPT1cInN0cmluZ1wifHxocihyKT9uLnNldC5hZGQocik6bi5oYXNoW3JdPXRydWV9ZnVuY3Rpb24gaShyLG4pe3ZhciB0PS0xLGU9ci5sZW5ndGg7Zm9yKG58fChuPUFycmF5KGUpKTsrK3Q8ZTspblt0XT1yW3RdO3JldHVybiBufWZ1bmN0aW9uIGYocixuKXtmb3IodmFyIHQ9LTEsZT1yLmxlbmd0aDsrK3Q8ZSYmbihyW3RdLHQscikhPT1mYWxzZTspO3JldHVybiByfWZ1bmN0aW9uIGwocixuKXtmb3IodmFyIHQ9LTEsZT1yLmxlbmd0aCx1PUFycmF5KGUpOysrdDxlOyl1W3RdPW4oclt0XSx0LHIpO3JldHVybiB1fWZ1bmN0aW9uIHMocixuKXtmb3IodmFyIHQ9LTEsZT1uLmxlbmd0aCx1PXIubGVuZ3RoOysrdDxlOylyW3UrdF09blt0XTtyZXR1cm4gcn1mdW5jdGlvbiBwKHIsbil7Zm9yKHZhciB0PS0xLGU9ci5sZW5ndGg7Kyt0PGU7KWlmKG4oclt0XSx0LHIpKXJldHVybiB0cnVlO3JldHVybiBmYWxzZX1mdW5jdGlvbiB2KHIsbil7cmV0dXJuIHI9PT14cj9uOnI7XG59ZnVuY3Rpb24gaChyLG4sdCl7Zm9yKHZhciBlPS0xLHU9Sm4obiksbz11Lmxlbmd0aDsrK2U8bzspe3ZhciBhPXVbZV0sYz1yW2FdLGk9dChjLG5bYV0sYSxyLG4pOyhpPT09aT9pPT09YzpjIT09YykmJihjIT09eHJ8fGEgaW4gcil8fChyW2FdPWkpfXJldHVybiByfWZ1bmN0aW9uIHkocixuKXtyZXR1cm4gbnVsbD09bj9yOmcobixKbihuKSxyKX1mdW5jdGlvbiBnKHIsbix0KXt0fHwodD17fSk7Zm9yKHZhciBlPS0xLHU9bi5sZW5ndGg7KytlPHU7KXt2YXIgbz1uW2VdO3Rbb109cltvXX1yZXR1cm4gdH1mdW5jdGlvbiBiKHIsbix0KXt2YXIgZT10eXBlb2YgcjtyZXR1cm5cImZ1bmN0aW9uXCI9PWU/bj09PXhyP3I6TShyLG4sdCk6bnVsbD09cj93cjpcIm9iamVjdFwiPT1lP0kocik6bj09PXhyP09yKHIpOlAocixuKX1mdW5jdGlvbiBqKHIsbix0LGUsdSxvLGEpe3ZhciBjO2lmKHQmJihjPXU/dChyLGUsdSk6dChyKSksYyE9PXhyKXJldHVybiBjO2lmKCFocihyKSlyZXR1cm4gcjt2YXIgbD16bihyKTtcbmlmKGwpe2lmKGM9SihyKSwhbilyZXR1cm4gaShyLGMpfWVsc2V7dmFyIHM9T24uY2FsbChyKSxwPXM9PUZyO2lmKHMhPVRyJiZzIT1QciYmKCFwfHx1KSlyZXR1cm4gYW5bc10/UShyLHMsbik6dT9yOnt9O2lmKGduKHIpKXJldHVybiB1P3I6e307aWYoYz1LKHA/e306ciksIW4pcmV0dXJuIHkoYyxyKX1vfHwobz1bXSksYXx8KGE9W10pO2Zvcih2YXIgdj1vLmxlbmd0aDt2LS07KWlmKG9bdl09PXIpcmV0dXJuIGFbdl07cmV0dXJuIG8ucHVzaChyKSxhLnB1c2goYyksKGw/ZjpBKShyLGZ1bmN0aW9uKGUsdSl7Y1t1XT1qKGUsbix0LHUscixvLGEpfSksY31mdW5jdGlvbiBkKG4sdCl7dmFyIGU9bj9uLmxlbmd0aDowLHU9W107aWYoIWUpcmV0dXJuIHU7dmFyIG89LTEsYz16KCksaT1jPT09cixmPWkmJnQubGVuZ3RoPj1Fcj9OKHQpOm51bGwsbD10Lmxlbmd0aDtmJiYoYz1hLGk9ZmFsc2UsdD1mKTtyOmZvcig7KytvPGU7KXt2YXIgcz1uW29dO2lmKGkmJnM9PT1zKXtmb3IodmFyIHA9bDtwLS07KWlmKHRbcF09PT1zKWNvbnRpbnVlIHI7XG51LnB1c2gocyl9ZWxzZSBjKHQscywwKTwwJiZ1LnB1c2gocyl9cmV0dXJuIHV9ZnVuY3Rpb24gbShyLG4sdCx1KXt1fHwodT1bXSk7Zm9yKHZhciBvPS0xLGE9ci5sZW5ndGg7KytvPGE7KXt2YXIgYz1yW29dO2UoYykmJlgoYykmJih0fHx6bihjKXx8cHIoYykpP24/bShjLG4sdCx1KTpzKHUsYyk6dHx8KHVbdS5sZW5ndGhdPWMpfXJldHVybiB1fWZ1bmN0aW9uIHcocixuKXtyZXR1cm4gV24ocixuLGpyKX1mdW5jdGlvbiBBKHIsbil7cmV0dXJuIFduKHIsbixKbil9ZnVuY3Rpb24gTyhyLG4sdCl7aWYobnVsbCE9cil7cj1hcihyKSx0IT09eHImJnQgaW4gciYmKG49W3RdKTtmb3IodmFyIGU9MCx1PW4ubGVuZ3RoO251bGwhPXImJmU8dTspcj1hcihyKVtuW2UrK11dO3JldHVybiBlJiZlPT11P3I6eHJ9fWZ1bmN0aW9uIHgocixuLHQsdSxvLGEpe3JldHVybiByPT09bj90cnVlOm51bGw9PXJ8fG51bGw9PW58fCFocihyKSYmIWUobik/ciE9PXImJm4hPT1uOlMocixuLHgsdCx1LG8sYSk7XG59ZnVuY3Rpb24gUyhyLG4sdCxlLHUsbyxhKXt2YXIgYz16bihyKSxpPXpuKG4pLGY9JHIsbD0kcjtjfHwoZj1Pbi5jYWxsKHIpLGY9PVByP2Y9VHI6ZiE9VHImJihjPWJyKHIpKSksaXx8KGw9T24uY2FsbChuKSxsPT1Qcj9sPVRyOmwhPVRyJiYoaT1icihuKSkpO3ZhciBzPWY9PVRyJiYhZ24ocikscD1sPT1UciYmIWduKG4pLHY9Zj09bDtpZih2JiYhYyYmIXMpcmV0dXJuIFYocixuLGYpO2lmKCF1KXt2YXIgaD1zJiZBbi5jYWxsKHIsXCJfX3dyYXBwZWRfX1wiKSx5PXAmJkFuLmNhbGwobixcIl9fd3JhcHBlZF9fXCIpO2lmKGh8fHkpcmV0dXJuIHQoaD9yLnZhbHVlKCk6cix5P24udmFsdWUoKTpuLGUsdSxvLGEpfWlmKCF2KXJldHVybiBmYWxzZTtvfHwobz1bXSksYXx8KGE9W10pO2Zvcih2YXIgZz1vLmxlbmd0aDtnLS07KWlmKG9bZ109PXIpcmV0dXJuIGFbZ109PW47by5wdXNoKHIpLGEucHVzaChuKTt2YXIgYj0oYz9EOlcpKHIsbix0LGUsdSxvLGEpO3JldHVybiBvLnBvcCgpLGEucG9wKCksXG5ifWZ1bmN0aW9uIEUocixuLHQpe3ZhciBlPW4ubGVuZ3RoLHU9ZSxvPSF0O2lmKG51bGw9PXIpcmV0dXJuIXU7Zm9yKHI9YXIocik7ZS0tOyl7dmFyIGE9bltlXTtpZihvJiZhWzJdP2FbMV0hPT1yW2FbMF1dOiEoYVswXWluIHIpKXJldHVybiBmYWxzZX1mb3IoOysrZTx1Oyl7YT1uW2VdO3ZhciBjPWFbMF0saT1yW2NdLGY9YVsxXTtpZihvJiZhWzJdKXtpZihpPT09eHImJiEoYyBpbiByKSlyZXR1cm4gZmFsc2V9ZWxzZXt2YXIgbD10P3QoaSxmLGMpOnhyO2lmKCEobD09PXhyP3goZixpLHQsdHJ1ZSk6bCkpcmV0dXJuIGZhbHNlfX1yZXR1cm4gdHJ1ZX1mdW5jdGlvbiBJKHIpe3ZhciBuPUcocik7aWYoMT09bi5sZW5ndGgmJm5bMF1bMl0pe3ZhciB0PW5bMF1bMF0sZT1uWzBdWzFdO3JldHVybiBmdW5jdGlvbihyKXtyZXR1cm4gbnVsbD09cj9mYWxzZToocj1hcihyKSxyW3RdPT09ZSYmKGUhPT14cnx8dCBpbiByKSl9fXJldHVybiBmdW5jdGlvbihyKXtyZXR1cm4gRShyLG4pfX1mdW5jdGlvbiBQKHIsbil7dmFyIHQ9em4ociksZT1ycihyKSYmdHIobiksdT1yK1wiXCI7XG5yZXR1cm4gcj1jcihyKSxmdW5jdGlvbihvKXtpZihudWxsPT1vKXJldHVybiBmYWxzZTt2YXIgYT11O2lmKG89YXIobyksKHR8fCFlKSYmIShhIGluIG8pKXtpZihvPTE9PXIubGVuZ3RoP286TyhvLGsociwwLC0xKSksbnVsbD09bylyZXR1cm4gZmFsc2U7YT1mcihyKSxvPWFyKG8pfXJldHVybiBvW2FdPT09bj9uIT09eHJ8fGEgaW4gbzp4KG4sb1thXSx4cix0cnVlKX19ZnVuY3Rpb24gJChyKXtyZXR1cm4gZnVuY3Rpb24obil7cmV0dXJuIG51bGw9PW4/eHI6YXIobilbcl19fWZ1bmN0aW9uIF8ocil7dmFyIG49citcIlwiO3JldHVybiByPWNyKHIpLGZ1bmN0aW9uKHQpe3JldHVybiBPKHQscixuKX19ZnVuY3Rpb24gVShyLG4pe2Zvcih2YXIgdD1yP24ubGVuZ3RoOjA7dC0tOyl7dmFyIGU9blt0XTtpZihlIT11JiZZKGUpKXt2YXIgdT1lO1BuLmNhbGwocixlLDEpfX1yZXR1cm4gcn1mdW5jdGlvbiBrKHIsbix0KXt2YXIgZT0tMSx1PXIubGVuZ3RoO249bnVsbD09bj8wOitufHwwLG48MCYmKG49LW4+dT8wOnUrbiksXG50PXQ9PT14cnx8dD51P3U6K3R8fDAsdDwwJiYodCs9dSksdT1uPnQ/MDp0LW4+Pj4wLG4+Pj49MDtmb3IodmFyIG89QXJyYXkodSk7KytlPHU7KW9bZV09cltlK25dO3JldHVybiBvfWZ1bmN0aW9uIEYocixuLHQpe3ZhciBlPTAsdT1yP3IubGVuZ3RoOmU7aWYodHlwZW9mIG49PVwibnVtYmVyXCImJm49PT1uJiZ1PD1Mbil7Zm9yKDtlPHU7KXt2YXIgbz1lK3U+Pj4xLGE9cltvXTsodD9hPD1uOmE8bikmJm51bGwhPT1hP2U9bysxOnU9b31yZXR1cm4gdX1yZXR1cm4gQyhyLG4sd3IsdCl9ZnVuY3Rpb24gQyhyLG4sdCxlKXtuPXQobik7Zm9yKHZhciB1PTAsbz1yP3IubGVuZ3RoOjAsYT1uIT09bixjPW51bGw9PT1uLGk9bj09PXhyO3U8bzspe3ZhciBmPVVuKCh1K28pLzIpLGw9dChyW2ZdKSxzPWwhPT14cixwPWw9PT1sO2lmKGEpdmFyIHY9cHx8ZTtlbHNlIHY9Yz9wJiZzJiYoZXx8bnVsbCE9bCk6aT9wJiYoZXx8cyk6bnVsbD09bD9mYWxzZTplP2w8PW46bDxuO3Y/dT1mKzE6bz1mfXJldHVybiBNbihvLEJuKTtcbn1mdW5jdGlvbiBNKHIsbix0KXtpZih0eXBlb2YgciE9XCJmdW5jdGlvblwiKXJldHVybiB3cjtpZihuPT09eHIpcmV0dXJuIHI7c3dpdGNoKHQpe2Nhc2UgMTpyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIHIuY2FsbChuLHQpfTtjYXNlIDM6cmV0dXJuIGZ1bmN0aW9uKHQsZSx1KXtyZXR1cm4gci5jYWxsKG4sdCxlLHUpfTtjYXNlIDQ6cmV0dXJuIGZ1bmN0aW9uKHQsZSx1LG8pe3JldHVybiByLmNhbGwobix0LGUsdSxvKX07Y2FzZSA1OnJldHVybiBmdW5jdGlvbih0LGUsdSxvLGEpe3JldHVybiByLmNhbGwobix0LGUsdSxvLGEpfX1yZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gci5hcHBseShuLGFyZ3VtZW50cyl9fWZ1bmN0aW9uIFQocil7dmFyIG49bmV3IFNuKHIuYnl0ZUxlbmd0aCksdD1uZXcgJG4obik7cmV0dXJuIHQuc2V0KG5ldyAkbihyKSksbn1mdW5jdGlvbiBCKHIpe3JldHVybiBzcihmdW5jdGlvbihuLHQpe3ZhciBlPS0xLHU9bnVsbD09bj8wOnQubGVuZ3RoLG89dT4yP3RbdS0yXTp4cixhPXU+Mj90WzJdOnhyLGM9dT4xP3RbdS0xXTp4cjtcbmZvcih0eXBlb2Ygbz09XCJmdW5jdGlvblwiPyhvPU0obyxjLDUpLHUtPTIpOihvPXR5cGVvZiBjPT1cImZ1bmN0aW9uXCI/Yzp4cix1LT1vPzE6MCksYSYmWih0WzBdLHRbMV0sYSkmJihvPXU8Mz94cjpvLHU9MSk7KytlPHU7KXt2YXIgaT10W2VdO2kmJnIobixpLG8pfXJldHVybiBufSl9ZnVuY3Rpb24gTChyKXtyZXR1cm4gZnVuY3Rpb24obix0LGUpe2Zvcih2YXIgdT1hcihuKSxvPWUobiksYT1vLmxlbmd0aCxjPXI/YTotMTtyP2MtLTorK2M8YTspe3ZhciBpPW9bY107aWYodCh1W2ldLGksdSk9PT1mYWxzZSlicmVha31yZXR1cm4gbn19ZnVuY3Rpb24gTihyKXtyZXR1cm4gX24mJkluP25ldyBvKHIpOm51bGx9ZnVuY3Rpb24gUihyLG4pe3JldHVybiBzcihmdW5jdGlvbih0KXt2YXIgZT10WzBdO3JldHVybiBudWxsPT1lP2U6KHQucHVzaChuKSxyLmFwcGx5KHhyLHQpKX0pfWZ1bmN0aW9uIEQocixuLHQsZSx1LG8sYSl7dmFyIGM9LTEsaT1yLmxlbmd0aCxmPW4ubGVuZ3RoO2lmKGkhPWYmJighdXx8Zjw9aSkpcmV0dXJuIGZhbHNlO1xuZm9yKDsrK2M8aTspe3ZhciBsPXJbY10scz1uW2NdLHY9ZT9lKHU/czpsLHU/bDpzLGMpOnhyO2lmKHYhPT14cil7aWYodiljb250aW51ZTtyZXR1cm4gZmFsc2V9aWYodSl7aWYoIXAobixmdW5jdGlvbihyKXtyZXR1cm4gbD09PXJ8fHQobCxyLGUsdSxvLGEpfSkpcmV0dXJuIGZhbHNlfWVsc2UgaWYobCE9PXMmJiF0KGwscyxlLHUsbyxhKSlyZXR1cm4gZmFsc2V9cmV0dXJuIHRydWV9ZnVuY3Rpb24gVihyLG4sdCl7c3dpdGNoKHQpe2Nhc2UgX3I6Y2FzZSBVcjpyZXR1cm4rcj09K247Y2FzZSBrcjpyZXR1cm4gci5uYW1lPT1uLm5hbWUmJnIubWVzc2FnZT09bi5tZXNzYWdlO2Nhc2UgTXI6cmV0dXJuIHIhPStyP24hPStuOnI9PStuO2Nhc2UgQnI6Y2FzZSBOcjpyZXR1cm4gcj09bitcIlwifXJldHVybiBmYWxzZX1mdW5jdGlvbiBXKHIsbix0LGUsdSxvLGEpe3ZhciBjPUpuKHIpLGk9Yy5sZW5ndGgsZj1KbihuKSxsPWYubGVuZ3RoO2lmKGkhPWwmJiF1KXJldHVybiBmYWxzZTtmb3IodmFyIHM9aTtzLS07KXt2YXIgcD1jW3NdO1xuaWYoISh1P3AgaW4gbjpBbi5jYWxsKG4scCkpKXJldHVybiBmYWxzZX1mb3IodmFyIHY9dTsrK3M8aTspe3A9Y1tzXTt2YXIgaD1yW3BdLHk9bltwXSxnPWU/ZSh1P3k6aCx1P2g6eSxwKTp4cjtpZighKGc9PT14cj90KGgseSxlLHUsbyxhKTpnKSlyZXR1cm4gZmFsc2U7dnx8KHY9XCJjb25zdHJ1Y3RvclwiPT1wKX1pZighdil7dmFyIGI9ci5jb25zdHJ1Y3RvcixqPW4uY29uc3RydWN0b3I7aWYoYiE9aiYmXCJjb25zdHJ1Y3RvclwiaW4gciYmXCJjb25zdHJ1Y3RvclwiaW4gbiYmISh0eXBlb2YgYj09XCJmdW5jdGlvblwiJiZiIGluc3RhbmNlb2YgYiYmdHlwZW9mIGo9PVwiZnVuY3Rpb25cIiYmaiBpbnN0YW5jZW9mIGopKXJldHVybiBmYWxzZX1yZXR1cm4gdHJ1ZX1mdW5jdGlvbiBxKHIsbix0KXt2YXIgZT11LmNhbGxiYWNrfHxtcjtyZXR1cm4gZT1lPT09bXI/YjplLHQ/ZShyLG4sdCk6ZX1mdW5jdGlvbiB6KG4sdCxlKXt2YXIgbz11LmluZGV4T2Z8fGlyO3JldHVybiBvPW89PT1pcj9yOm8sbj9vKG4sdCxlKTpvfWZ1bmN0aW9uIEcocil7XG5mb3IodmFyIG49ZHIociksdD1uLmxlbmd0aDt0LS07KW5bdF1bMl09dHIoblt0XVsxXSk7cmV0dXJuIG59ZnVuY3Rpb24gSChyLG4pe3ZhciB0PW51bGw9PXI/eHI6cltuXTtyZXR1cm4geXIodCk/dDp4cn1mdW5jdGlvbiBKKHIpe3ZhciBuPXIubGVuZ3RoLHQ9bmV3IHIuY29uc3RydWN0b3Iobik7cmV0dXJuIG4mJlwic3RyaW5nXCI9PXR5cGVvZiByWzBdJiZBbi5jYWxsKHIsXCJpbmRleFwiKSYmKHQuaW5kZXg9ci5pbmRleCx0LmlucHV0PXIuaW5wdXQpLHR9ZnVuY3Rpb24gSyhyKXt2YXIgbj1yLmNvbnN0cnVjdG9yO3JldHVybiB0eXBlb2Ygbj09XCJmdW5jdGlvblwiJiZuIGluc3RhbmNlb2Ygbnx8KG49T2JqZWN0KSxuZXcgbn1mdW5jdGlvbiBRKHIsbix0KXt2YXIgZT1yLmNvbnN0cnVjdG9yO3N3aXRjaChuKXtjYXNlIERyOnJldHVybiBUKHIpO2Nhc2UgX3I6Y2FzZSBVcjpyZXR1cm4gbmV3IGUoK3IpO2Nhc2UgVnI6Y2FzZSBXcjpjYXNlIHFyOmNhc2UgenI6Y2FzZSBHcjpjYXNlIEhyOlxuY2FzZSBKcjpjYXNlIEtyOmNhc2UgUXI6ZSBpbnN0YW5jZW9mIGUmJihlPVJuW25dKTt2YXIgdT1yLmJ1ZmZlcjtyZXR1cm4gbmV3IGUodD9UKHUpOnUsci5ieXRlT2Zmc2V0LHIubGVuZ3RoKTtjYXNlIE1yOmNhc2UgTnI6cmV0dXJuIG5ldyBlKHIpO2Nhc2UgQnI6dmFyIG89bmV3IGUoci5zb3VyY2Usbm4uZXhlYyhyKSk7by5sYXN0SW5kZXg9ci5sYXN0SW5kZXh9cmV0dXJuIG99ZnVuY3Rpb24gWChyKXtyZXR1cm4gbnVsbCE9ciYmbnIocW4ocikpfWZ1bmN0aW9uIFkocixuKXtyZXR1cm4gcj10eXBlb2Ygcj09XCJudW1iZXJcInx8ZW4udGVzdChyKT8rcjotMSxuPW51bGw9PW4/Tm46bixyPi0xJiZyJTE9PTAmJnI8bn1mdW5jdGlvbiBaKHIsbix0KXtpZighaHIodCkpcmV0dXJuIGZhbHNlO3ZhciBlPXR5cGVvZiBuO2lmKFwibnVtYmVyXCI9PWU/WCh0KSYmWShuLHQubGVuZ3RoKTpcInN0cmluZ1wiPT1lJiZuIGluIHQpe3ZhciB1PXRbbl07cmV0dXJuIHI9PT1yP3I9PT11OnUhPT11fXJldHVybiBmYWxzZTtcbn1mdW5jdGlvbiBycihyLG4pe3ZhciB0PXR5cGVvZiByO2lmKFwic3RyaW5nXCI9PXQmJllyLnRlc3Qocil8fFwibnVtYmVyXCI9PXQpcmV0dXJuIHRydWU7aWYoem4ocikpcmV0dXJuIGZhbHNlO3ZhciBlPSFYci50ZXN0KHIpO3JldHVybiBlfHxudWxsIT1uJiZyIGluIGFyKG4pfWZ1bmN0aW9uIG5yKHIpe3JldHVybiB0eXBlb2Ygcj09XCJudW1iZXJcIiYmcj4tMSYmciUxPT0wJiZyPD1Obn1mdW5jdGlvbiB0cihyKXtyZXR1cm4gcj09PXImJiFocihyKX1mdW5jdGlvbiBlcihyLG4pe3I9YXIocik7Zm9yKHZhciB0PS0xLGU9bi5sZW5ndGgsdT17fTsrK3Q8ZTspe3ZhciBvPW5bdF07byBpbiByJiYodVtvXT1yW29dKX1yZXR1cm4gdX1mdW5jdGlvbiB1cihyLG4pe3ZhciB0PXt9O3JldHVybiB3KHIsZnVuY3Rpb24ocixlLHUpe24ocixlLHUpJiYodFtlXT1yKX0pLHR9ZnVuY3Rpb24gb3Iocil7Zm9yKHZhciBuPWpyKHIpLHQ9bi5sZW5ndGgsZT10JiZyLmxlbmd0aCx1PSEhZSYmbnIoZSkmJih6bihyKXx8cHIocil8fGdyKHIpKSxvPS0xLGE9W107KytvPHQ7KXtcbnZhciBjPW5bb107KHUmJlkoYyxlKXx8QW4uY2FsbChyLGMpKSYmYS5wdXNoKGMpfXJldHVybiBhfWZ1bmN0aW9uIGFyKHIpe2lmKHUuc3VwcG9ydC51bmluZGV4ZWRDaGFycyYmZ3Iocikpe2Zvcih2YXIgbj0tMSx0PXIubGVuZ3RoLGU9T2JqZWN0KHIpOysrbjx0OyllW25dPXIuY2hhckF0KG4pO3JldHVybiBlfXJldHVybiBocihyKT9yOk9iamVjdChyKX1mdW5jdGlvbiBjcihyKXtpZih6bihyKSlyZXR1cm4gcjt2YXIgdD1bXTtyZXR1cm4gbihyKS5yZXBsYWNlKFpyLGZ1bmN0aW9uKHIsbixlLHUpe3QucHVzaChlP3UucmVwbGFjZShybixcIiQxXCIpOm58fHIpfSksdH1mdW5jdGlvbiBpcihuLHQsZSl7dmFyIHU9bj9uLmxlbmd0aDowO2lmKCF1KXJldHVybi0xO2lmKHR5cGVvZiBlPT1cIm51bWJlclwiKWU9ZTwwP0NuKHUrZSwwKTplO2Vsc2UgaWYoZSl7dmFyIG89RihuLHQpO3JldHVybiBvPHUmJih0PT09dD90PT09bltvXTpuW29dIT09bltvXSk/bzotMX1yZXR1cm4gcihuLHQsZXx8MCk7XG59ZnVuY3Rpb24gZnIocil7dmFyIG49cj9yLmxlbmd0aDowO3JldHVybiBuP3Jbbi0xXTp4cn1mdW5jdGlvbiBscihyLG4sdCl7dmFyIGU9W107aWYoIXJ8fCFyLmxlbmd0aClyZXR1cm4gZTt2YXIgdT0tMSxvPVtdLGE9ci5sZW5ndGg7Zm9yKG49cShuLHQsMyk7Kyt1PGE7KXt2YXIgYz1yW3VdO24oYyx1LHIpJiYoZS5wdXNoKGMpLG8ucHVzaCh1KSl9cmV0dXJuIFUocixvKSxlfWZ1bmN0aW9uIHNyKHIsbil7aWYodHlwZW9mIHIhPVwiZnVuY3Rpb25cIil0aHJvdyBuZXcgVHlwZUVycm9yKElyKTtyZXR1cm4gbj1DbihuPT09eHI/ci5sZW5ndGgtMTorbnx8MCwwKSxmdW5jdGlvbigpe2Zvcih2YXIgdD1hcmd1bWVudHMsZT0tMSx1PUNuKHQubGVuZ3RoLW4sMCksbz1BcnJheSh1KTsrK2U8dTspb1tlXT10W24rZV07c3dpdGNoKG4pe2Nhc2UgMDpyZXR1cm4gci5jYWxsKHRoaXMsbyk7Y2FzZSAxOnJldHVybiByLmNhbGwodGhpcyx0WzBdLG8pO2Nhc2UgMjpyZXR1cm4gci5jYWxsKHRoaXMsdFswXSx0WzFdLG8pO1xufXZhciBhPUFycmF5KG4rMSk7Zm9yKGU9LTE7KytlPG47KWFbZV09dFtlXTtyZXR1cm4gYVtuXT1vLHIuYXBwbHkodGhpcyxhKX19ZnVuY3Rpb24gcHIocil7cmV0dXJuIGUocikmJlgocikmJkFuLmNhbGwocixcImNhbGxlZVwiKSYmIUVuLmNhbGwocixcImNhbGxlZVwiKX1mdW5jdGlvbiB2cihyKXtyZXR1cm4gaHIocikmJk9uLmNhbGwocik9PUZyfWZ1bmN0aW9uIGhyKHIpe3ZhciBuPXR5cGVvZiByO3JldHVybiEhciYmKFwib2JqZWN0XCI9PW58fFwiZnVuY3Rpb25cIj09bil9ZnVuY3Rpb24geXIocil7cmV0dXJuIG51bGw9PXI/ZmFsc2U6dnIocik/eG4udGVzdCh3bi5jYWxsKHIpKTplKHIpJiYoZ24ocik/eG46dG4pLnRlc3Qocil9ZnVuY3Rpb24gZ3Iocil7cmV0dXJuIHR5cGVvZiByPT1cInN0cmluZ1wifHxlKHIpJiZPbi5jYWxsKHIpPT1Ocn1mdW5jdGlvbiBicihyKXtyZXR1cm4gZShyKSYmbnIoci5sZW5ndGgpJiYhIW9uW09uLmNhbGwocildfWZ1bmN0aW9uIGpyKHIpe2lmKG51bGw9PXIpcmV0dXJuW107XG5ocihyKXx8KHI9T2JqZWN0KHIpKTt2YXIgbj1yLmxlbmd0aCx0PXUuc3VwcG9ydDtuPW4mJm5yKG4pJiYoem4ocil8fHByKHIpfHxncihyKSkmJm58fDA7Zm9yKHZhciBlPXIuY29uc3RydWN0b3Isbz0tMSxhPXZyKGUpJiZlLnByb3RvdHlwZXx8ZG4sYz1hPT09cixpPUFycmF5KG4pLGY9bj4wLGw9dC5lbnVtRXJyb3JQcm9wcyYmKHI9PT1qbnx8ciBpbnN0YW5jZW9mIEVycm9yKSxzPXQuZW51bVByb3RvdHlwZXMmJnZyKHIpOysrbzxuOylpW29dPW8rXCJcIjtmb3IodmFyIHAgaW4gcilzJiZcInByb3RvdHlwZVwiPT1wfHxsJiYoXCJtZXNzYWdlXCI9PXB8fFwibmFtZVwiPT1wKXx8ZiYmWShwLG4pfHxcImNvbnN0cnVjdG9yXCI9PXAmJihjfHwhQW4uY2FsbChyLHApKXx8aS5wdXNoKHApO2lmKHQubm9uRW51bVNoYWRvd3MmJnIhPT1kbil7dmFyIHY9cj09PW1uP05yOnI9PT1qbj9rcjpPbi5jYWxsKHIpLGg9RG5bdl18fERuW1RyXTtmb3Iodj09VHImJihhPWRuKSxuPXVuLmxlbmd0aDtuLS07KXtwPXVuW25dO1xudmFyIHk9aFtwXTtjJiZ5fHwoeT8hQW4uY2FsbChyLHApOnJbcF09PT1hW3BdKXx8aS5wdXNoKHApfX1yZXR1cm4gaX1mdW5jdGlvbiBkcihyKXtyPWFyKHIpO2Zvcih2YXIgbj0tMSx0PUpuKHIpLGU9dC5sZW5ndGgsdT1BcnJheShlKTsrK248ZTspe3ZhciBvPXRbbl07dVtuXT1bbyxyW29dXX1yZXR1cm4gdX1mdW5jdGlvbiBtcihyLG4sdCl7cmV0dXJuIHQmJloocixuLHQpJiYobj14ciksZShyKT9BcihyKTpiKHIsbil9ZnVuY3Rpb24gd3Iocil7cmV0dXJuIHJ9ZnVuY3Rpb24gQXIocil7cmV0dXJuIEkoaihyLHRydWUpKX1mdW5jdGlvbiBPcihyKXtyZXR1cm4gcnIocik/JChyKTpfKHIpfXZhciB4cixTcj1cIjMuMTAuMVwiLEVyPTIwMCxJcj1cIkV4cGVjdGVkIGEgZnVuY3Rpb25cIixQcj1cIltvYmplY3QgQXJndW1lbnRzXVwiLCRyPVwiW29iamVjdCBBcnJheV1cIixfcj1cIltvYmplY3QgQm9vbGVhbl1cIixVcj1cIltvYmplY3QgRGF0ZV1cIixrcj1cIltvYmplY3QgRXJyb3JdXCIsRnI9XCJbb2JqZWN0IEZ1bmN0aW9uXVwiLENyPVwiW29iamVjdCBNYXBdXCIsTXI9XCJbb2JqZWN0IE51bWJlcl1cIixUcj1cIltvYmplY3QgT2JqZWN0XVwiLEJyPVwiW29iamVjdCBSZWdFeHBdXCIsTHI9XCJbb2JqZWN0IFNldF1cIixOcj1cIltvYmplY3QgU3RyaW5nXVwiLFJyPVwiW29iamVjdCBXZWFrTWFwXVwiLERyPVwiW29iamVjdCBBcnJheUJ1ZmZlcl1cIixWcj1cIltvYmplY3QgRmxvYXQzMkFycmF5XVwiLFdyPVwiW29iamVjdCBGbG9hdDY0QXJyYXldXCIscXI9XCJbb2JqZWN0IEludDhBcnJheV1cIix6cj1cIltvYmplY3QgSW50MTZBcnJheV1cIixHcj1cIltvYmplY3QgSW50MzJBcnJheV1cIixIcj1cIltvYmplY3QgVWludDhBcnJheV1cIixKcj1cIltvYmplY3QgVWludDhDbGFtcGVkQXJyYXldXCIsS3I9XCJbb2JqZWN0IFVpbnQxNkFycmF5XVwiLFFyPVwiW29iamVjdCBVaW50MzJBcnJheV1cIixYcj0vXFwufFxcWyg/OlteW1xcXV0qfChbXCInXSkoPzooPyFcXDEpW15cXG5cXFxcXXxcXFxcLikqP1xcMSlcXF0vLFlyPS9eXFx3KiQvLFpyPS9bXi5bXFxdXSt8XFxbKD86KC0/XFxkKyg/OlxcLlxcZCspPyl8KFtcIiddKSgoPzooPyFcXDIpW15cXG5cXFxcXXxcXFxcLikqPylcXDIpXFxdL2cscm49L1xcXFwoXFxcXCk/L2csbm49L1xcdyokLyx0bj0vXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvLGVuPS9eXFxkKyQvLHVuPVtcImNvbnN0cnVjdG9yXCIsXCJoYXNPd25Qcm9wZXJ0eVwiLFwiaXNQcm90b3R5cGVPZlwiLFwicHJvcGVydHlJc0VudW1lcmFibGVcIixcInRvTG9jYWxlU3RyaW5nXCIsXCJ0b1N0cmluZ1wiLFwidmFsdWVPZlwiXSxvbj17fTtcbm9uW1ZyXT1vbltXcl09b25bcXJdPW9uW3pyXT1vbltHcl09b25bSHJdPW9uW0pyXT1vbltLcl09b25bUXJdPXRydWUsb25bUHJdPW9uWyRyXT1vbltEcl09b25bX3JdPW9uW1VyXT1vbltrcl09b25bRnJdPW9uW0NyXT1vbltNcl09b25bVHJdPW9uW0JyXT1vbltMcl09b25bTnJdPW9uW1JyXT1mYWxzZTt2YXIgYW49e307YW5bUHJdPWFuWyRyXT1hbltEcl09YW5bX3JdPWFuW1VyXT1hbltWcl09YW5bV3JdPWFuW3FyXT1hblt6cl09YW5bR3JdPWFuW01yXT1hbltUcl09YW5bQnJdPWFuW05yXT1hbltIcl09YW5bSnJdPWFuW0tyXT1hbltRcl09dHJ1ZSxhbltrcl09YW5bRnJdPWFuW0NyXT1hbltMcl09YW5bUnJdPWZhbHNlO3ZhciBjbj17XCJmdW5jdGlvblwiOnRydWUsb2JqZWN0OnRydWV9LGZuPWNuW3R5cGVvZiBleHBvcnRzXSYmZXhwb3J0cyYmIWV4cG9ydHMubm9kZVR5cGUmJmV4cG9ydHMsbG49Y25bdHlwZW9mIG1vZHVsZV0mJm1vZHVsZSYmIW1vZHVsZS5ub2RlVHlwZSYmbW9kdWxlLHNuPWZuJiZsbiYmdHlwZW9mIGdsb2JhbD09XCJvYmplY3RcIiYmZ2xvYmFsJiZnbG9iYWwuT2JqZWN0JiZnbG9iYWwscG49Y25bdHlwZW9mIHNlbGZdJiZzZWxmJiZzZWxmLk9iamVjdCYmc2VsZix2bj1jblt0eXBlb2Ygd2luZG93XSYmd2luZG93JiZ3aW5kb3cuT2JqZWN0JiZ3aW5kb3csaG49bG4mJmxuLmV4cG9ydHM9PT1mbiYmZm4seW49c258fHZuIT09KHRoaXMmJnRoaXMud2luZG93KSYmdm58fHBufHx0aGlzLGduPWZ1bmN0aW9uKCl7XG50cnl7T2JqZWN0KHt0b1N0cmluZzowfStcIlwiKX1jYXRjaChyKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gZmFsc2V9fXJldHVybiBmdW5jdGlvbihyKXtyZXR1cm4gdHlwZW9mIHIudG9TdHJpbmchPVwiZnVuY3Rpb25cIiYmdHlwZW9mKHIrXCJcIik9PVwic3RyaW5nXCJ9fSgpLGJuPUFycmF5LnByb3RvdHlwZSxqbj1FcnJvci5wcm90b3R5cGUsZG49T2JqZWN0LnByb3RvdHlwZSxtbj1TdHJpbmcucHJvdG90eXBlLHduPUZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZyxBbj1kbi5oYXNPd25Qcm9wZXJ0eSxPbj1kbi50b1N0cmluZyx4bj1SZWdFeHAoXCJeXCIrd24uY2FsbChBbikucmVwbGFjZSgvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2csXCJcXFxcJCZcIikucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZyxcIiQxLio/XCIpK1wiJFwiKSxTbj15bi5BcnJheUJ1ZmZlcixFbj1kbi5wcm9wZXJ0eUlzRW51bWVyYWJsZSxJbj1IKHluLFwiU2V0XCIpLFBuPWJuLnNwbGljZSwkbj15bi5VaW50OEFycmF5LF9uPUgoT2JqZWN0LFwiY3JlYXRlXCIpLFVuPU1hdGguZmxvb3Isa249SChBcnJheSxcImlzQXJyYXlcIiksRm49SChPYmplY3QsXCJrZXlzXCIpLENuPU1hdGgubWF4LE1uPU1hdGgubWluLFRuPTQyOTQ5NjcyOTUsQm49VG4tMSxMbj1Ubj4+PjEsTm49OTAwNzE5OTI1NDc0MDk5MSxSbj17fTtcblJuW1ZyXT15bi5GbG9hdDMyQXJyYXksUm5bV3JdPXluLkZsb2F0NjRBcnJheSxSbltxcl09eW4uSW50OEFycmF5LFJuW3pyXT15bi5JbnQxNkFycmF5LFJuW0dyXT15bi5JbnQzMkFycmF5LFJuW0hyXT0kbixSbltKcl09eW4uVWludDhDbGFtcGVkQXJyYXksUm5bS3JdPXluLlVpbnQxNkFycmF5LFJuW1FyXT15bi5VaW50MzJBcnJheTt2YXIgRG49e307RG5bJHJdPURuW1VyXT1EbltNcl09e2NvbnN0cnVjdG9yOnRydWUsdG9Mb2NhbGVTdHJpbmc6dHJ1ZSx0b1N0cmluZzp0cnVlLHZhbHVlT2Y6dHJ1ZX0sRG5bX3JdPURuW05yXT17Y29uc3RydWN0b3I6dHJ1ZSx0b1N0cmluZzp0cnVlLHZhbHVlT2Y6dHJ1ZX0sRG5ba3JdPURuW0ZyXT1EbltCcl09e2NvbnN0cnVjdG9yOnRydWUsdG9TdHJpbmc6dHJ1ZX0sRG5bVHJdPXtjb25zdHJ1Y3Rvcjp0cnVlfSxmKHVuLGZ1bmN0aW9uKHIpe2Zvcih2YXIgbiBpbiBEbilpZihBbi5jYWxsKERuLG4pKXt2YXIgdD1EbltuXTt0W3JdPUFuLmNhbGwodCxyKX19KTt2YXIgVm49dS5zdXBwb3J0PXt9O1xuIWZ1bmN0aW9uKHIpe3ZhciBuPWZ1bmN0aW9uKCl7dGhpcy54PXJ9LHQ9ezA6cixsZW5ndGg6cn0sZT1bXTtuLnByb3RvdHlwZT17dmFsdWVPZjpyLHk6cn07Zm9yKHZhciB1IGluIG5ldyBuKWUucHVzaCh1KTtWbi5lbnVtRXJyb3JQcm9wcz1Fbi5jYWxsKGpuLFwibWVzc2FnZVwiKXx8RW4uY2FsbChqbixcIm5hbWVcIiksVm4uZW51bVByb3RvdHlwZXM9RW4uY2FsbChuLFwicHJvdG90eXBlXCIpLFZuLm5vbkVudW1TaGFkb3dzPSEvdmFsdWVPZi8udGVzdChlKSxWbi5zcGxpY2VPYmplY3RzPShQbi5jYWxsKHQsMCwxKSwhdFswXSksVm4udW5pbmRleGVkQ2hhcnM9XCJ4XCJbMF0rT2JqZWN0KFwieFwiKVswXSE9XCJ4eFwifSgxLDApO3ZhciBXbj1MKCkscW49JChcImxlbmd0aFwiKSx6bj1rbnx8ZnVuY3Rpb24ocil7cmV0dXJuIGUocikmJm5yKHIubGVuZ3RoKSYmT24uY2FsbChyKT09JHJ9LEduPUIoZnVuY3Rpb24ocixuLHQpe3JldHVybiB0P2gocixuLHQpOnkocixuKX0pLEhuPVIoR24sdiksSm49Rm4/ZnVuY3Rpb24ocil7XG52YXIgbj1udWxsPT1yP3hyOnIuY29uc3RydWN0b3I7cmV0dXJuIHR5cGVvZiBuPT1cImZ1bmN0aW9uXCImJm4ucHJvdG90eXBlPT09cnx8KHR5cGVvZiByPT1cImZ1bmN0aW9uXCI/dS5zdXBwb3J0LmVudW1Qcm90b3R5cGVzOlgocikpP29yKHIpOmhyKHIpP0ZuKHIpOltdfTpvcixLbj1zcihmdW5jdGlvbihyLG4pe2lmKG51bGw9PXIpcmV0dXJue307aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgblswXSl7dmFyIG49bChtKG4pLFN0cmluZyk7cmV0dXJuIGVyKHIsZChqcihyKSxuKSl9dmFyIHQ9TShuWzBdLG5bMV0sMyk7cmV0dXJuIHVyKHIsZnVuY3Rpb24ocixuLGUpe3JldHVybiF0KHIsbixlKX0pfSk7by5wcm90b3R5cGUucHVzaD1jLHUuYXNzaWduPUduLHUuY2FsbGJhY2s9bXIsdS5kZWZhdWx0cz1Ibix1LmtleXM9Sm4sdS5rZXlzSW49anIsdS5tYXRjaGVzPUFyLHUub21pdD1Lbix1LnBhaXJzPWRyLHUucHJvcGVydHk9T3IsdS5yZW1vdmU9bHIsdS5yZXN0UGFyYW09c3IsdS5leHRlbmQ9R24sXG51Lml0ZXJhdGVlPW1yLHUuaWRlbnRpdHk9d3IsdS5pbmRleE9mPWlyLHUuaXNBcmd1bWVudHM9cHIsdS5pc0FycmF5PXpuLHUuaXNGdW5jdGlvbj12cix1LmlzTmF0aXZlPXlyLHUuaXNPYmplY3Q9aHIsdS5pc1N0cmluZz1ncix1LmlzVHlwZWRBcnJheT1icix1Lmxhc3Q9ZnIsdS5WRVJTSU9OPVNyLGZuJiZsbiYmaG4mJigobG4uZXhwb3J0cz11KS5fPXUpfSkuY2FsbCh0aGlzKTsiXX0=
