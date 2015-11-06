/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL3
 * or later license. See the LICENSE file for a copy of the license and the
 * AUTHORS file for copyright and authorship information.
 */

import $ from 'jquery';


const google_translate = {

  buttonClassName: "google-translate",
  hint: "Google Translate",

  /* using Google Translate API v2 */
  url: "https://www.googleapis.com/language/translate/v2",

  /* For a list of currently supported languages:
   * https://developers.google.com/translate/v2/using_rest#language-params
   *
   * Google supports translations between any of the supported languages
   * (any combination is acceptable)
   *
   * FIXME Note that an API does exist to query if Google supports
   * a given language */

  supportedLanguages: [
    'af','sq','ar','az','eu','bn','be','bg','ca','zh-CN','zh-TW','hr',
    'cs','da','nl','en','eo','et','tl','fi','fr','gl','ka','de','el',
    'gu','ht','iw','hi','hu','is','id','ga','it','ja','kn','ko','la',
    'lv','lt','mk','ms','mt','no','fa','pl','pt','ro','ru','sr','sk',
    'sl','es','sw','sv','ta','te','th','tr','uk','ur','vi','cy','yi'
  ],

  init: function (apiKey) {
    /* Init variables */
    this.pairs = [];
    for (var i=0; i<this.supportedLanguages.length; i++) {
      this.pairs.push({
        'source': this.supportedLanguages[i],
        'target': this.supportedLanguages[i]
      });
    };

    /* Set API key */
    this.apiKey = apiKey;
    /* Bind event handler */
    $(document).on("click", ".google-translate", this.translate);
  },

  ready: function () {
    PTL.editor.addMTButtons(this);
  },

  translate: function () {
    PTL.editor.translate(this, function(sourceText, langFrom, langTo, resultCallback) {
      var transData = {key: google_translate.apiKey,
                       q: sourceText,
                       source: langFrom,
                       target: langTo};
      $.ajax({
        url: google_translate.url,
        crossDomain: true,
        data: transData,
        success: function (r) {
          if (r.data && r.data.translations) {
            resultCallback({
              translation: r.data.translations[0].translatedText,
              storeResult: true
            });
          } else {
            if (r.error && r.error.message) {
              resultCallback({
                msg: "Google Translate Error: " + r.error.message
              });
            } else {
              resultCallback({
                msg: "Malformed response from Google Translate API"
              });
            }
          }
        }
      });
    });
  }

};


export default google_translate;