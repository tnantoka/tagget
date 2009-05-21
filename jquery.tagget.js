/**
 * LighediTor: Not WYSIWYG Editor (jQuery Plugin)
 * Simple interface and good suggestions.
 *
 * http://ligheditor.sourceforge.jp/
 *
 * Licensed under the MIT license.
 * Copyright (c) 2009 tnantoka
 *
 * version 
 */
 
(function($) {

	// $('textarea.ligh_editor').ligheditor()とかで呼び出し
	$.fn.ligheditor = function(conf) {

		// 入力補完候補
		var keywords = {
		
			// htmlのキーワード	
			html: (function() {
		
				var tags = [
					'<a>#{cursor}</a>',
					'<address>#{cursor}</address>',
					'<![CDATA[ #{cursor} ]]>', 
					'<img src="#{cursor}" />',
					'<br />',
					'<div>#{cursor}</div>\n',
					'<span>#{cursor}</span>',

					'<h1>#{cursor}</h1>\n',
					'<h2>#{cursor}</h2>\n',
					'<h3>#{cursor}</h3>\n',
					'<h4>#{cursor}</h4>\n',
					'<h5>#{cursor}</h5>\n',
					'<h6>#{cursor}</h6>\n',

					'<ul>\n<li>#{cursor}</li>\n</ul>\n',
					'<ol>\n<li>#{cursor}</li>\n</ol>\n',
					'<li>#{cursor}</li>\n',
					'<dl>\n<dt>#{cursor}</dt>\n<dd></dd>\n</dl>\n',
					'<dt>#{cursor}</dt>\n',
					'<dt>#{cursor}</dd>\n',

					'<strong>#{cursor}</strong>',
					'<em>#{cursor}</em>',

					'<form>\n#{cursor}\n</form>',
					'<input type="#{cursor}" />',

					'<!--',
					'-->',
					'<!-- #{cursor} -->'
				];

				var header = [
					'<?xml version="1.0" encoding="#{cursor}"?>\n', 
					'<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n',
					'<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n',
					'<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">\n',
					'<!DOCTYPE html>', 
					'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">\n',
					'<link rel="stylesheet" type="text/css" href="#{cursor}" />\n',
					'<script type="text/javascript" src="#{cursor}"></script>\n',
					'<script type="text/javascript">\n#{cursor}\n</script>\n',
					'<style type="text/css">\n#{cursor}\n</style>\n',

					'<meta http-equiv="Content-Type" content="text/html; charset=#{cursor}" />\n',
					'<meta http-equiv="Content-Style-Type" content="text/css" />\n',
					'<meta http-equiv="Content-Script-Type" content="text/javascript" />\n',
					'<meta name="ROBOTS" content="#{cursor}" />\n',
					'<meta name="description" content="#{cursor}" />\n',
					'<meta name="keywords" content="#{cursor}" />\n',

					'<head>#{cursor}</head>\n',
					'<title>#{cursor}</title>\n',
					'<body>#{cursor}</body>\n',

					'<link rel="alternate" type="application/atom+xml" title="#{cursor}" href="" />\n',
					'<link rel="alternate" type="application/rss+xml" title="#{cursor}" href="" />\n',
					'<link rel="EditURI" type="application/rsd+xml" title="#{cursor}" href="" />\n'
				];

				var attributes = [
					'href="#{cursor}"',
					'id="#{cursor}"',
					'class="#{cursor}"',
					'style="#{cursor}"',

					'onclick="#{cursor}"',
					'type="#{cursor}"',
					'value="#{cursor}"',
					'name="#{cursor}"',
					'action="#{cursor}"',

					'xml:lang="#{cursor}"',
					'lang="#{cursor}',
					'xmlns="#{cursor}"'
				];
				
				var values = [
					'UTF-8',
					'EUC-JP',
					'Shift-JIS',
					'ja',
					'http://www.w3.org/1999/xhtml'
				];

//				return tags.concat(header, attributes, values).sort();
				return tags.concat(header, attributes, values);

			})(),
			
			// JavaScript
			js: (function() {
			
				var objs = [
					'function() { #{cursor} }',
					'if (#{cursor}) { }'
				];
				
				var libs = [
					'click(#{cursor});',
					'html(#{cursor});'
				];
				
				return objs.concat(libs);		
			
			})(),
			
			// CSS
			css: (function() {
			
				var props = [
					'margin: ',
					'margin-right: ',
					'margin-left: ',
					'margin-top: ',
					'margin-bottom: ',
					'padding: ',
					'float: ',
					'clear: '
				];
							
				var values = [
					'auto',
					'center',
					'right',
					'left',
					'both'
				];

				return props.concat(values);		
			
			})()
		
		};		

		// 設定オブジェクト
		conf = $.extend({
			tags: true, // タグボタン表示
			edit: true, // 編集機能表示
			jqui: true, // jQuery UI CSS Framework仕様
			vars: true // 入力内容を利用した補完
		}, conf);

		// 追加の入力候補
		conf.keys = $.extend(conf.keys, keywords);

		// thisには$('textarea.ligh_editor')が入ってくる

		this.each(function() {

//				var tmp = this.value;
				// 初期化中メッセージ
//				this.value = 'Initializing LighediTor...';
			
				init(this, conf);
				
				// 初期化完了
//				this.value = tmp;
			});
			
		// This is jQuery!!
		return this;
		
	}; // $.fn.ligheditor

	// contextに依存しない関数
	
	// &, <, >(, ")を変換
	var escapeHtml = function(s, quot) {
		s = s.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
		
		return !quot ? s : s.replace(/"/g, '&quot;');
	};
	
	// &amp;, &lt;, &gt;(, &quot;)を戻す
	var unescapeHtml = function(s, quot) {
					
		s = s.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>');
		
		return !quot ? s : s.replace(/&quot;/g, '"');
	};

	// offsetを簡易算出
	var getOffset = function(elm) {

		var left, top;

		if (elm.getBoundingClientRect) {

			var rect = elm.getBoundingClientRect();
			left = Math.round(scrollX + rect.left);
			top = Math.round(scrollY + rect.top);
			
		} else {

			left = elm.offsetLeft;
			top  = elm.offsetTop;
			var offsetParent = elm.offsetParent;
			
			while (offsetParent) {
				left += offsetParent.offsetLeft;
				top  += offsetParent.offsetTop;             
				offsetParent = offsetParent.offsetParent;
			}
			
		}

		return {
			left: left,
			top: top
		};
		
	};


	// ligheditor初期化
	var init = function(textarea, conf) {
	
		var t = $(textarea);

		// textarea or dummyを使う関数群
		
		// textareaのカーソル位置に文字列挿入
		var insert = function(s) {

			// カーソル移動位置（#{cursor}）を取得後、削除
			var cursor = s.indexOf('#{cursor}');
			s = s.replace('#{cursor}', '');

			// focusしないとIEでbodyに挿入されたりする
			// Firefoxでもボタンで挿入後にfocusが戻らない
			textarea.focus(); 

			// for IE
			if (document.selection) {
				
				// 選択範囲を取得
				var range = document.selection.createRange();

				// 選択中のテキスト引数sで置き換え（現在のカーソル位置にsを挿入）
				range.text = s;

				// カーソルがrange.textの最後になるので戻す
				// #{cursor}指定がなければ最後のまま
				var back = s.length - (cursor != -1 ? cursor : s.length);
				range.move('character', -back);

				// 現在のカーソル位置を反映する（これやらないと水の泡）
				range.select();
			}

			// Firefox
			// inかundefinedあたりで判定しないとselectionStartが0の時ミスる
		    else if ('selectionStart' in textarea) { 

				// スクロールバーの位置を保存
				var top = textarea.scrollTop;

				// 選択範囲の開始・終了位置を取得
		        var start = textarea.selectionStart;
		        var end = textarea.selectionEnd;

				// 開始位置と終了位置の間（現在のカーソル位置）にsを挿入
		        textarea.value = textarea.value.slice(0, start) + s + textarea.value.slice(end);

				// カーソル移動位置に移動させる
				var index = start + (cursor != -1 ? cursor : s.length);
		        textarea.setSelectionRange(index, index);

				// 改行がたくさんある場合スクロールバーを下にずらす
				if (/\n/g.test(s) && s.match(/\n/g).length > 2) {
					top += parseInt(getComputedStyle(textarea, '').getPropertyValue('line-height'), 10);
				}
				
				// スクロールバーを戻す
			    textarea.scrollTop = top;
		    }

			return this;
			
		};

		// 補完候補があるか？
		var check = function() {
		
			var matches = {
				view: [],
				insert: []
			};
		
			var text = getText()[0];

			if (text) { 

				var words = [];
				
				if (conf.vars) {
					var a = textarea.value.match(/[^<>\s　'"#\=:;{}\(\)!?,*]+/g) || [];

					// 重複削除
					var temp = [];				
					for (var i = 0; i < a.length; i++) {
					
						var v = a[i];
					
						if (!(v in temp)) {
							words.push(v);
							temp[v] = true;
						}
					
					}

					
				}

				for(var key in conf.keys) {
					if (t.hasClass('ligh_' + key) || t.hasClass(key)) {
						words = words.concat(conf.keys[key]);
					}
				}

// sortは重い原因になるので止め
//				words = words.sort();
			
				for(var i = 0; i < words.length; i++) {
				
					if (words[i] != text && words[i].indexOf(text) == 0) {
						matches.view.push(words[i].replace(/#\{cursor\}/g, ''));
						matches.insert.push(escapeHtml(words[i].slice(text.length)));
					}
				}
				
			}
		
			return (matches.view.length != 0) ? matches : false;

		
		};

		// カーソル位置の文字を取得
		var getText = function(r, after) {

//			if (!r) r = /[^<>\s　'"#\.=;]+?$|<[^<>\n=]*?$/;
			if (!r) r = /[^<>\s　'"#\.=;]+?$|<[^<>\s　'"#\.=;]*?$/;

			var start, end;

			// IE
			if (document.selection) {

//				textarea.focus(); // focusなしでもいける

				// 選択範囲を取得
				var range = document.selection.createRange();

				// 選択範囲の複製を作成
				var clone = range.duplicate();

				// textarea内のテキスト全体を選択
				// [clone start] text1 [range start] text2 [range end] text3 [clone end]
				clone.moveToElementText(textarea);

				// cloneの選択範囲終点を、rangeの終点にあわせる
				// [clone start] text1 [range start] text2 [range/clone end] text3
				clone.setEndPoint('EndToEnd', range);

				// 選択範囲始点を求める
				// [clone start] text1 [range start] text2 [range/clone end] text3
				// --------------------------------------------------------- clone.text.length == end
				//                     ------------------------------------- range.text.length
				// -------------------- clone.text.length - range.text.length = start
				start = clone.text.length - range.text.length;
				end = clone.text.length;

			}

			// Firefox
		    else if ('selectionStart' in textarea) {

		        start = textarea.selectionStart;
		        end = textarea.selectionEnd;

		    }

			var text;
			
			if (!after) {
				text = textarea.value.slice(0, start).match(r);
			} else {
				text = textarea.value.slice(end).match(r);
			}
			
			return text || [];
			
		};

		// カーソルの座標を取得
		var getPos = function() {

			var x, y;

			if (document.selection) {

				var range = document.selection.createRange();
				x = range.offsetLeft + 
					(document.body.scrollLeft || document.documentElement.scrollLeft) - 
						document.documentElement.clientLeft;
				y = range.offsetTop + 
					(document.body.scrollTop || document.documentElement.scrollTop) - 
						document.documentElement.clientTop;
			
			} else if (window.getComputedStyle) {

				var span = dummy.children('span');
				
				if(!span.is('span')) {
					span = $('<span></span>');
					span.html('|');
				}
			
				dummy.html('');
				dummy.text(textarea.value.slice(0, textarea.selectionEnd));
				dummy.append(span);

				var offset = getOffset(span.get(0));

				x = offset.left - textarea.scrollLeft;
				y = offset.top - textarea.scrollTop;
		    }

			return {
				x: x,
				y: y
			};
		};

		// wrap処理
		// textarea周囲にHTMLを追加する
		
		// 全体の枠を作ってその参照を取得
		// wrapの場合、普通にやると参照を取得できないのでparentsで取得
		var wrapper = t.wrap('<div class="ligh_wrapper"><p class="ligh_main"></p></div>')
			.parents('div.ligh_wrapper');

		// 必要に応じてツールバーを追加
		var menu = (conf.tags || conf.edit) ?
			wrapper.prepend(('<div class="ligh_menu"></div>')).children('div.ligh_menu') : null;
	
		// タグ挿入ボタン
		if (conf.tags) {
			var tags = $('<ul class="ligh_tags"></ul>')
				.append('<li><a href="#">a</a></li>')
				.append('<li><a href="#">p</a></li>')
				.append('<li><a href="#">ul</a></li>')
				.append('<li><a href="#">li</a></li>')
				.append('<li><a href="#">div</a></li>')
				.append('<li><a href="#">span</a></li>')
				.append('<li><a href="#">pre</a></li>')
				.append('<li><a href="#">code</a></li>')
				.append('<li><a href="#">blockquote</a></li>')
				.append('<li><a href="#">dl</a></li>')
				.append('<li><a href="#">dt</a></li>')
				.append('<li><a href="#">dd</a></li>')
				.append('<li><a href="#">link</a></li>')
				.append('<li><a href="#">script</a></li>')
				.append('<li><a href="#">frameset</a></li>')
				.append('<li><a href="#">frame</a></li>');
			menu.append(tags);
		}	

		// 編集機能
		if (conf.edit) {
			var edit = $('<div class="ligh_edit"></div>');
			
			// 選択範囲変換
			edit.append(
				$('<p class="ligh_encode"></p>').append(
					$('<select></selected>')
						.append('<option selected="selected" value="">選択範囲を変換</option>')
						.append('<option value="entity">&amp &lt; &gt; → &amp;amp; &amp;lt; &amp;gt;</option>')
						.append('<option value="raw">&amp;amp; &amp;lt; &amp;gt; → &amp &lt; &gt;</option>')
						.append('<option value="enc">encodeURI()</option>')
						.append('<option value="encc">encodeURIComponent()</option>')
						.append('<option value="dec">decodeURI()</option>')
						.append('<option value="decc">decodeURIComponent()</option>')
				)
			);

			// 置換
			edit.append(
				$('<p class="ligh_replace"></p>')
					.append('<input type="text" value="置換前" />')
					.append(' → ')
					.append('<input type="text" value="置換後" />')
					.append('<input type="button" value="置換" />')
			);

			menu.append(edit);
		}

		// jQuery UI CSS Frameworkのclass名を設定	
		if (conf.jqui) {
			menu.addClass('ui-helper-clearfix');
			wrapper.addClass('ui-widget-header ui-corner-all')
				.children('div, p').addClass('ui-widget-header')
					.find('li').addClass('ui-state-default ui-corner-all').hover(function(){ 
						$(this).addClass('ui-state-hover'); 
					}, function(){ 
						$(this).removeClass('ui-state-hover'); 
					});	
		}	

		var body = $(document.body);

		// suggestion用の要素作成
		var suggest = $('<ul class="ligh_suggest"></ul>');
		body.append(suggest);

		// Firefox用dummy生成
		// カーソル座標取得に使用
		if (window.getComputedStyle) {
			
			var dummy = $('<pre class="ligh_dummy"></pre>');

			// textareaのstyleをdummyにコピー
			var onResize = function() {
				
				var org = getComputedStyle(textarea,'');

				var props = [
					'width', 'height',
					'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 
					'border-left-style', 'border-right-style','border-top-style','border-bottom-style', 
					'border-left-width', 'border-right-width','border-top-width','border-bottom-width', 
					'font-family', 'font-size', 'line-height', 'letter-spacing', 'word-spacing'
				];
			
			    for(var i = 0; i < props.length; i++){
			    
			    	var capitalized = props[i].replace(/-(.)/g, function(m, m1){
						return m1.toUpperCase();
					});
			    
			        dummy.css(capitalized, org.getPropertyValue(props[i]));

				}

				var offset = getOffset(textarea);

			    dummy.css({
			    	left: offset.left,
			    	top: offset.top
			    });
			    
			    dummy.width(t.width())
			    	.height(t.height())
					.scrollLeft(t.scrollLeft())
			    	.scrollTop(t.scrollTop());

			};
			
			// resize時にはtextareaのサイズも変わるので
			$(window).resize(function() {
				onResize();
			}).resize();

			body.append(dummy);

		}
		
		
		// イベント設定

		// タグ挿入ボタン
		if (conf.tags) {

			// clickイベント設定
			var onClick = function(elm, s) {

				$(elm).click(function() {
					insert(s);
					return false;
				});
				
			};

			// タグボタンクリックで挿入
			tags.find('a').each(function() {

				// htmlで判別してイベント設定
				// title属性に設定するほうがいいか？
				switch (this.innerHTML) {
				
					case 'a':
						onClick(this, '<a href="#{cursor}"></a>');
						break;
				
					case 'p':
						onClick(this, '<p>#{cursor}</p>\n');
						break;
				
					case 'ul':
						onClick(this, '<ul>\n<li>#{cursor}</li>\n</ul>\n');
						break;
				
					case 'li':
						onClick(this, '<li>#{cursor}</li>\n');
						break;

					case 'dl':
						onClick(this, '<dl>\n<dt>#{cursor}</dt>\n<dd></dd>\n</dl>\n');
						break;

					case 'dt':
						onClick(this, '<dt>#{cursor}</dt>\n');
						break;

					case 'dd':
						onClick(this, '<dd>#{cursor}</dd>\n');
						break;

					case 'pre':
						onClick(this, '<pre>#{cursor}</pre>\n');
						break;

					case 'code':
						onClick(this, '<code>#{cursor}</code>');
						break;

					case 'blockquote':
						onClick(this, '<blockquote>#{cursor}</blockquote>\n');
						break;

					case 'div':
						onClick(this, '<div>#{cursor}</div>\n');
						break;

					case 'span':
						onClick(this, '<span>#{cursor}</span>\n');
						break;

					case 'link':
						onClick(this, '<link rel="stylesheet" type="text/css" href="#{cursor}" />\n');
						break;

					case 'script':
						onClick(this, '<script type="text/javascript" src="#{cursor}"></script>\n');
						break;
						
					case 'frameset':
						onClick(this, '<frameset>\n<frame src="#{cursor}" />\n</frameset>\n');
						break;
						
					case 'frame':
						onClick(this, '<frame src="#{cursor}" />\n');
						break;
						
				}
			
			});

		}

		// 編集機能設定	
		if (conf.edit) {
		
			// 選択範囲変換
			
			// 渡された関数で選択範囲を変換
			var onChange = function(func) {

				textarea.focus(); 

				if (document.selection) {
				
					var range = document.selection.createRange();
					range.text = func(range.text);
					range.select();
					
				} else if ('selectionStart' in textarea) { 

					var top = textarea.scrollTop;

			        var start = textarea.selectionStart;
			        var end = textarea.selectionEnd;

					textarea.value = textarea.value.slice(0, start) + 
						func(textarea.value.slice(start, end)) + 
							textarea.value.slice(end);

			        textarea.setSelectionRange(end, end);

				    textarea.scrollTop = top;
			    }
			};
		
			// onchangeイベント設定
			edit.find('.ligh_encode select').change(function() {
			
				switch (this.value) {
				
					case 'entity':
						onChange(escapeHtml);
						break;
				
					case 'raw':
						onChange(unescapeHtml);
						break;				
				
					case 'enc':
						onChange(encodeURI);
						break;				
				
					case 'encc':
						onChange(encodeURIComponent);
						break;	
									
					case 'dec':
						onChange(decodeURI);
						break;				
									
					case 'decc':
						onChange(decodeURIComponent);
						break;				
				}
				
				this.value = '';
			
			});
			
			
			// 置換ボタンクリックで置換
			// 正規表現使用可
			var inputs = edit.find('.ligh_replace input');
			inputs.filter('[type=button]').click(function() {

				var val = textarea.value;
				
				var before = inputs.eq(0).val();
				var after = inputs.eq(1).val();
				var flag = '';

				if (before.match(/^\/.+\/([^\/]+)$/)) {
					
					flag = RegExp.$1;
					before = before.replace(/^\/|\/[^\/]+?$/g, '');
				}
								
				if (before) {
					textarea.value = val.replace(new RegExp(before, flag), after);
				}
				
			});	
				
		}

		// メイン機能
		// キー入力時のsuggestion設定
		
		// keyup（発生タイミングが一番少ない）で候補表示
		t.keyup(function(e) {
		
			var suggests = check();
			
			if (suggests) {
			
				if (suggest.text() != suggests.view.join('')) {
			
					suggest.html('');
			
					for(var i = 0; i < suggests.view.length; i++) {
						var li = $('<li></li>').attr('title', suggests.insert[i])
							.append('<a href="#"></a>').text(suggests.view[i])
							.hover(function() {
								suggest.children('li').removeClass('ligh_current');
								$(this).addClass('ligh_current');
							})
							.click(function() {
								insert(unescapeHtml(suggest.children('li.ligh_current').attr('title')));
								suggest.hide();
							});
						if (i == 0) li.addClass('ligh_current');
						suggest.append(li);
					}	

				} else {

					suggest.children('li').each(function(i) {
						$(this).attr('title', suggests.insert[i]);
					});			
				}
				
				var pos = getPos();
				
				suggest.css({
					left: pos.x,
					top: pos.y
				});

				suggest.show();
				
			} else {
				suggest.hide();
			}	

			if (conf.bind) $(conf.bind).html(textarea.value);
		})
		
		// click時にも候補表示
		.click(function() {
			$(this).keyup();
		})
		
		.keydown(function(e) {
		
			// タブキャンセル
			// keydown以外だとうまくいかない
			if (e.which == 9) {
				insert('\t');
				return false;
			}

			// Shift+Enterで改行 or br入力
			// 補完却下も可能
			if (e.shiftKey && e.which == 13) {

				var n = '\n'
				
				if ((t.hasClass('html') || t.hasClass('ligh_html')) && suggest.css('display') == 'none') {
					n = '<br />\n';
				}
				
				insert(n);
				
				return false;
			}

			// Ctrl+Enterで閉じタグ補完
			if (e.ctrlKey && e.which == 13) {

				//                  <<-tag name-><----------attr-------------><->->
				var sTag = getText(/<\s*[^\/!?=]+?(?:\s*[^=>\s]+?\s*=\s*["']?.*?["']?\s*)*\s*>/g);
				var sTag2 = getText(/<\s*[^\/!?=]+?(?:\s*[^=>\s]+?\s*=\s*["']?.*?["']?\s*)*\s*>/g, true);
				var eTag = getText(/<\s*\/\s*.+?\s*>/g);
				var eTag2 = getText(/<\s*\/\s*.+?\s*>/g, true);
/*
				console.log('s:'+sTag);
				console.log('s2:'+sTag2);
				console.log('e:'+eTag);
				console.log('e2:'+eTag2);
*/
				// 整形式じゃなさそうなのはとりあえず無視
				if (sTag.length + sTag2.length > eTag.length + eTag2.length) {
				
					for (var i = sTag.length - 1; i >= 0; i--) {
					
						var s = sTag[i].replace(/^.*<|[\s>].*/g, '');
						if (!eTag || eTag.length == 0 || s != eTag.shift().replace(/^.*\/|>.*/g, '')) {
							insert('</' + s + '>');
							break;
						}
					}

				}

				
				// insert(n);
				
				return false;
			}

			// 十字キーで候補選択
			// upだとおしっぱにできない、pressだとおかしくなる
			if (suggest.css('display') != 'none') {


				switch (e.which) {
				
					// up
					case 38:
						var lis = suggest.children('li');
						
						for(var i = 0; i < lis.length; i++) {
						
							var li = lis.eq(i);
							
							if(li.hasClass('ligh_current')) {
								li.removeClass('ligh_current');
								i = (i == 0) ? lis.length - 1 : i - 1;
								lis.eq(i).addClass('ligh_current');
								break;
							}
						
						}
						return false;

					// down
					case 40:
						var lis = suggest.children('li');
						
						for(var i = 0; i < lis.length; i++) {
						
							var li = lis.eq(i);
							
							if(li.hasClass('ligh_current')) {
								li.removeClass('ligh_current');
								i = (i == lis.length - 1 ) ? 0 : i + 1;
								lis.eq(i).addClass('ligh_current');
								break;
							}
						
						}			
						return false;

					// Enterで補完
					case 13:
						insert(unescapeHtml(suggest.children('li.ligh_current').attr('title')));
						suggest.hide();

						return false;
				}

			} else {
			
				if (e.which == 13) {
			
					var indent = getText(/^[\t ]*/mg);
					insert('\n' + (indent ? indent[indent.length - 1] : ''));

					if (window.getComputedStyle) {
						t.scrollTop(t.scrollTop() + parseInt(getComputedStyle(textarea, '').getPropertyValue('line-height'), 10));
					}
					
					return false;
			
				}			
			
			}

		});
	
	}; // init

})(jQuery);
