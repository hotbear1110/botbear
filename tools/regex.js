/* eslint-disable no-misleading-character-class */
/* eslint-disable no-useless-escape */
// eslint-disable-next-line no-misleading-character-class
exports.racism = new RegExp(/(?:(?:\b(?<![-=\.])|monka)(?:[Nnñ]|[Ii7]V)|[\/|]\\[\/|])[\s\.]*?[liI1y!j\/|]+[\s\.]*?(?:[GgbB6934Q🅱qğĜƃ၅5\*][\s\.]*?){2,}(?!arcS|l|Ktlw|ylul|ie217|64|\d? ?times)/);
exports.invisChar = new RegExp(/[\u034f\u2800\u{E0000}\u180e\ufeff\u2000-\u200d\u206D]/gu);
exports.URL = /(https?\:\/\/)?(\w+\.?\w+)(\.\w+)(\.\w+)?(\/\S+)?/gim;
exports.HIDDEN_CHARACTERS = new RegExp(/[\uDB40-\uDC00\u034f\u2800\u{E0000}\u180e\ufeff\u2000-\u200d\u206D]/g);