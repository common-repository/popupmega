//Return value boolean and take the rules option value

function wprp_check_rules( rules, popup_id ) {

	if ( rules.use_cookies ) {

		var cookie_name = 'wprp_popup_' + popup_id + '_closed';

		var subscriber_cookie_name = 'wprp_popup_' + popup_id + '_subscribed';
		
		if ( wprp_getCookie( cookie_name ) == 'yes' )
			return false;

		if (  wprp_getCookie( subscriber_cookie_name ) == 'yes' )
			return false;

	}

	if ( rules.hide_on_mobile_devices && ( DetectMobileLong() ||DetectTierTablet() ) )
		return false;

	return true;
}

function wprp_do_exit_popup( wprp_popup_function ) {

	jQuery('a').each(function(index,elem) {
	    
	    if ( jQuery(this).hasClass('wprp_external_link') ) {

	    } else {
	   
	    	jQuery(this).addClass('wprp_internal_link');
	   
	    }

	});

	jQuery("a.wprp_internal_link").click(function(){ window.onbeforeunload = null; }) ;

	jQuery("form").submit(function(){ window.onbeforeunload = null;  });

	window.onbeforeunload = function(e) {

		var e = e || window.event;

		if (e) {
			e.returnValue = wprp.exit_alert_text;
		}
		  
		setTimeout( function(){

			wprp_popup_function();

		}, 500 );


		window.onbeforeunload = null;

		return wprp.exit_alert_text;

	}


}

function wprp_do_exit_intent_popup( wprp_popup_function ) {

	jQuery(document).mouseleave(function(e){
		if ( window.doing_wprp_exit_intent_popup )return false;
		if (e.pageY - jQuery(window).scrollTop() <= 1) {
			window.doing_wprp_exit_intent_popup = true;
			setTimeout( function(){
				wprp_popup_function();
			},  50 );
		}

	});
}

function wprp_do_comment_autofill( popup_uniq_id, cookie_hash ) {

	var popup = jQuery( '.' + popup_uniq_id );

	var name = popup.find('input[name=name]')

	var email = popup.find('input[name=email]')

	var comment_author = wprp_getCookie( 'comment_author_' + cookie_hash );

	var comment_email = wprp_getCookie( 'comment_author_email_' + cookie_hash );

	name.val( comment_author );

	email.val( comment_email );

}

function wprp_do_when_post_rule( wprp_popup_function, when ) {

	if ( window.wprp_when_rule_done )
		return false;

	var when = typeof when !== 'undefined' ? when : 'end';

	var element_pos = jQuery('#wprp_popup_post_end_element').offset();

	var element_pos = element_pos.top;

	var cur_pos = jQuery(document).scrollTop() + 900;

	if ( cur_pos >= element_pos  ) {

		wprp_popup_function();

		window.wprp_when_rule_done = true;

		return true;

	}

}

function wprp_check_when_post_rule( wprp_popup_function, when ) {

	window.wprp_when_rule_done = false;

	jQuery(document).scroll(function() {

		wprp_do_when_post_rule( wprp_popup_function, when );

	});

}

function wprp_place_popup_close_cookie( popup_id, expiration, which_cookie ) {

	var id = popup_id;

	var which_cookie = typeof which_cookie !== 'undefined' ? which_cookie : 'close';

	if ( expiration <= 0 || expiration === undefined )
		expiration = 1;

	wprp_setCookie( 'wprp_popup_' + id + '_closed', 'yes', expiration, '/' );

	if ( which_cookie === 'subscribed' )
		wprp_setCookie( 'wprp_popup_' + id + '_subscribed', 'yes', 350, '/' );

}

function wprp_handle_form_submit( popup_id, popup_uniq_id, submit_url, expiration ) {

	//Prevent Double clicking error
	if ( window.__wprp_doing )
		return false;

	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	var form = jQuery('.' + popup_uniq_id +' form');

	var email = form.find('input[name=email]').val();

	if ( ! re.test( email ) )
		return alert('Please enter a valid email address');

	window.__wprp_doing = true;

	form.find('input[type=submit]').attr('disabled', true);

	jQuery.post( 
		submit_url, 
		form.serialize(),
		function( data ){

			form.find('input[type=submit]').attr('disabled', false);

			window.__wprp_doing = false;
			
			if ( data.status === 'error' ) {

				alert(data.message);

			}

			if ( data.status === 'success' ) {

				wprp_place_popup_close_cookie( popup_id, expiration, 'subscribed' );

				data.message = "<div id='wprp_success_message' style='color: black'>" +  data.message + "</div>"+'<button title="Close (Esc)" type="button" class="mfp-close">×</button>';
				
				if ( data.redirect_to == '' )
					jQuery( '.' + popup_uniq_id ).html( data.message );
				else
					window.location.href = data.redirect_to;

			}
			
		}, "json");

}

function wprp_getCookie( name ) {	

	var start = document.cookie.indexOf( name + "=" );

	var len = start + name.length + 1;

	if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) {

		return null;

	}

	if ( start == -1 ) return null;

	var end = document.cookie.indexOf( ';', len );

	if ( end == -1 ) end = document.cookie.length;

	return unescape( document.cookie.substring( len, end ) );

}



function wprp_setCookie( name, value, expires, path, domain, secure ) {

	var today = new Date();

	today.setTime( today.getTime() );

	if ( expires ) {

		expires = expires * 1000 * 60 * 60 * 24;

	}

	var expires_date = new Date( today.getTime() + (expires) );

	document.cookie = name+'='+escape( value ) +

		( ( expires ) ? ';expires='+expires_date.toGMTString() : '' ) + //expires.toGMTString()

		( ( path ) ? ';path=' + path : '' ) + 

		( ( domain ) ? ';domain=' + domain : '' ) +

		( ( secure ) ? ';secure' : '' );

}



function wprp_deleteCookie( name, path, domain ) {

	if ( getCookie( name ) ) document.cookie = name + '=' +

			( ( path ) ? ';path=' + path : '') +

			( ( domain ) ? ';domain=' + domain : '' ) +

			';expires=Thu, 01-Jan-1970 00:00:01 GMT';

}

/*! Magnific Popup - v0.8.9 - 2013-06-04
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2013 Dmitry Semenov; */
(function(e){var t,i,n,a,r,o,s,l="Close",c="AfterClose",d="BeforeAppend",p="MarkupParse",u="Open",f="Change",m="mfp",g="."+m,v="mfp-ready",h="mfp-removing",C="mfp-prevent-close",y=function(){},w=!!window.jQuery,b=e(window),I=function(e,i){t.ev.on(m+e+g,i)},x=function(t,i,n,a){var r=document.createElement("div");return r.className="mfp-"+t,n&&(r.innerHTML=n),a?i&&i.appendChild(r):(r=e(r),i&&r.appendTo(i)),r},k=function(i,n){t.ev.triggerHandler(m+i,n),t.st.callbacks&&(i=i.charAt(0).toLowerCase()+i.slice(1),t.st.callbacks[i]&&t.st.callbacks[i].apply(t,e.isArray(n)?n:[n]))},S=function(){(t.st.focus?t.content.find(t.st.focus).eq(0):t.wrap).focus()},P=function(i){return i===s&&t.currTemplate.closeBtn||(t.currTemplate.closeBtn=e(t.st.closeMarkup.replace("%title%",t.st.tClose)),s=i),t.currTemplate.closeBtn},E=function(){e.magnificPopup.instance||(t=new y,t.init(),e.magnificPopup.instance=t)},T=function(i){if(!e(i).hasClass(C)){var n=t.st.closeOnContentClick,a=t.st.closeOnBgClick;if(n&&a)return!0;if(!t.content||e(i).hasClass("mfp-close")||t.preloader&&i===t.preloader[0])return!0;if(i===t.content[0]||e.contains(t.content[0],i)){if(n)return!0}else if(a)return!0;return!1}};y.prototype={constructor:y,init:function(){var i=navigator.appVersion;t.isIE7=-1!==i.indexOf("MSIE 7."),t.isIE8=-1!==i.indexOf("MSIE 8."),t.isLowIE=t.isIE7||t.isIE8,t.isAndroid=/android/gi.test(i),t.isIOS=/iphone|ipad|ipod/gi.test(i),t.probablyMobile=t.isAndroid||t.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),n=e(document.body),a=e(document),t.popupsCache={}},open:function(i){var r;if(i.isObj===!1){t.items=i.items.toArray(),t.index=0;var s,l=i.items;for(r=0;l.length>r;r++)if(s=l[r],s.parsed&&(s=s.el[0]),s===i.el[0]){t.index=r;break}}else t.items=e.isArray(i.items)?i.items:[i.items],t.index=i.index||0;if(t.isOpen)return t.updateItemHTML(),void 0;t.types=[],o="",t.ev=i.mainEl||a,i.key?(t.popupsCache[i.key]||(t.popupsCache[i.key]={}),t.currTemplate=t.popupsCache[i.key]):t.currTemplate={},t.st=e.extend(!0,{},e.magnificPopup.defaults,i),t.fixedContentPos="auto"===t.st.fixedContentPos?!t.probablyMobile:t.st.fixedContentPos,t.bgOverlay||(t.bgOverlay=x("bg").on("click"+g,function(){t.close()}),t.wrap=x("wrap").attr("tabindex",-1).on("click"+g,function(e){T(e.target)&&t.close()}),t.container=x("container",t.wrap)),t.contentContainer=x("content"),t.st.preloader&&(t.preloader=x("preloader",t.container,t.st.tLoading));var c=e.magnificPopup.modules;for(r=0;c.length>r;r++){var d=c[r];d=d.charAt(0).toUpperCase()+d.slice(1),t["init"+d].call(t)}k("BeforeOpen"),t.st.closeBtnInside?(I(p,function(e,t,i,n){i.close_replaceWith=P(n.type)}),o+=" mfp-close-btn-in"):t.wrap.append(P()),t.st.alignTop&&(o+=" mfp-align-top"),t.fixedContentPos?t.wrap.css({overflow:t.st.overflowY,overflowX:"hidden",overflowY:t.st.overflowY}):t.wrap.css({top:b.scrollTop(),position:"absolute"}),(t.st.fixedBgPos===!1||"auto"===t.st.fixedBgPos&&!t.fixedContentPos)&&t.bgOverlay.css({height:a.height(),position:"absolute"}),a.on("keyup"+g,function(e){27===e.keyCode&&t.close()}),b.on("resize"+g,function(){t.updateSize()}),t.st.closeOnContentClick||(o+=" mfp-auto-cursor"),o&&t.wrap.addClass(o);var f=t.wH=b.height(),m={};if(t.fixedContentPos&&t._hasScrollBar(f)){var h=t._getScrollbarSize();h&&(m.paddingRight=h)}t.fixedContentPos&&(t.isIE7?e("body, html").css("overflow","hidden"):m.overflow="hidden");var C=t.st.mainClass;t.isIE7&&(C+=" mfp-ie7"),C&&t._addClassToMFP(C),t.updateItemHTML(),k("BuildControls"),n.css(m),t.bgOverlay.add(t.wrap).prependTo(document.body),t._lastFocusedEl=document.activeElement,setTimeout(function(){t.content?(t._addClassToMFP(v),S()):t.bgOverlay.addClass(v),a.on("focusin"+g,function(i){return i.target===t.wrap[0]||e.contains(t.wrap[0],i.target)?void 0:(S(),!1)})},16),t.isOpen=!0,t.updateSize(f),k(u)},close:function(){t.isOpen&&(t.isOpen=!1,t.st.removalDelay&&!t.isLowIE?(t._addClassToMFP(h),setTimeout(function(){t._close()},t.st.removalDelay)):t._close())},_close:function(){k(l);var i=h+" "+v+" ";if(t.bgOverlay.detach(),t.wrap.detach(),t.container.empty(),t.st.mainClass&&(i+=t.st.mainClass+" "),t._removeClassFromMFP(i),t.fixedContentPos){var r={paddingRight:""};t.isIE7?e("body, html").css("overflow",""):r.overflow="",n.css(r)}a.off("keyup"+g+" focusin"+g),t.ev.off(g),t.wrap.attr("class","mfp-wrap").removeAttr("style"),t.bgOverlay.attr("class","mfp-bg"),t.container.attr("class","mfp-container"),t.st.closeBtnInside&&t.currTemplate[t.currItem.type]!==!0||t.currTemplate.closeBtn&&t.currTemplate.closeBtn.detach(),t._lastFocusedEl&&e(t._lastFocusedEl).focus(),t.currItem=null,t.content=null,t.currTemplate=null,t.prevHeight=0,k(c)},updateSize:function(e){if(t.isIOS){var i=document.documentElement.clientWidth/window.innerWidth,n=window.innerHeight*i;t.wrap.css("height",n),t.wH=n}else t.wH=e||b.height();t.fixedContentPos||t.wrap.css("height",t.wH),k("Resize")},updateItemHTML:function(){var i=t.items[t.index];t.contentContainer.detach(),t.content&&t.content.detach(),i.parsed||(i=t.parseEl(t.index));var n=i.type;if(k("BeforeChange",[t.currItem?t.currItem.type:"",n]),t.currItem=i,!t.currTemplate[n]){var a=t.st[n]?t.st[n].markup:!1;k("FirstMarkupParse",a),t.currTemplate[n]=a?e(a):!0}r&&r!==i.type&&t.container.removeClass("mfp-"+r+"-holder");var o=t["get"+n.charAt(0).toUpperCase()+n.slice(1)](i,t.currTemplate[n]);t.appendContent(o,n),i.preloaded=!0,k(f,i),r=i.type,t.container.prepend(t.contentContainer),k("AfterChange")},appendContent:function(e,i){t.content=e,e?t.st.closeBtnInside&&t.currTemplate[i]===!0?t.content.find(".mfp-close").length||t.content.append(P()):t.content=e:t.content="",k(d),t.container.addClass("mfp-"+i+"-holder"),t.contentContainer.append(t.content)},parseEl:function(i){var n=t.items[i],a=n.type;if(n=n.tagName?{el:e(n)}:{data:n,src:n.src},n.el){for(var r=t.types,o=0;r.length>o;o++)if(n.el.hasClass("mfp-"+r[o])){a=r[o];break}n.src=n.el.attr("data-mfp-src"),n.src||(n.src=n.el.attr("href"))}return n.type=a||t.st.type||"inline",n.index=i,n.parsed=!0,t.items[i]=n,k("ElementParse",n),t.items[i]},addGroup:function(e,i){var n=function(n){n.mfpEl=this,t._openClick(n,e,i)};i||(i={});var a="click.magnificPopup";i.mainEl=e,i.items?(i.isObj=!0,e.off(a).on(a,n)):(i.isObj=!1,i.delegate?e.off(a).on(a,i.delegate,n):(i.items=e,e.off(a).on(a,n)))},_openClick:function(i,n,a){var r=void 0!==a.midClick?a.midClick:e.magnificPopup.defaults.midClick;if(r||2!==i.which){var o=void 0!==a.disableOn?a.disableOn:e.magnificPopup.defaults.disableOn;if(o)if(e.isFunction(o)){if(!o.call(t))return!0}else if(o>b.width())return!0;i.type&&(i.preventDefault(),t.isOpen&&i.stopPropagation()),a.el=e(i.mfpEl),a.delegate&&(a.items=n.find(a.delegate)),t.open(a)}},updateStatus:function(e,n){if(t.preloader){i!==e&&t.container.removeClass("mfp-s-"+i),n||"loading"!==e||(n=t.st.tLoading);var a={status:e,text:n};k("UpdateStatus",a),e=a.status,n=a.text,t.preloader.html(n),t.preloader.find("a").click(function(e){e.stopImmediatePropagation()}),t.container.addClass("mfp-s-"+e),i=e}},_addClassToMFP:function(e){t.bgOverlay.addClass(e),t.wrap.addClass(e)},_removeClassFromMFP:function(e){this.bgOverlay.removeClass(e),t.wrap.removeClass(e)},_hasScrollBar:function(e){return(t.isIE7?a.height():document.body.scrollHeight)>(e||b.height())},_parseMarkup:function(t,i,n){var a;n.data&&(i=e.extend(n.data,i)),k(p,[t,i,n]),e.each(i,function(e,i){if(void 0===i||i===!1)return!0;if(a=e.split("_"),a.length>1){var n=t.find(g+"-"+a[0]);if(n.length>0){var r=a[1];"replaceWith"===r?n[0]!==i[0]&&n.replaceWith(i):"img"===r?n.is("img")?n.attr("src",i):n.replaceWith('<img src="'+i+'" class="'+n.attr("class")+'" />'):n.attr(a[1],i)}}else t.find(g+"-"+e).html(i)})},_getScrollbarSize:function(){if(void 0===t.scrollbarSize){var e=document.createElement("div");e.id="mfp-sbm",e.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(e),t.scrollbarSize=e.offsetWidth-e.clientWidth,document.body.removeChild(e)}return t.scrollbarSize}},e.magnificPopup={instance:null,proto:y.prototype,modules:[],open:function(e,t){return E(),e||(e={}),e.isObj=!0,e.index=t||0,this.instance.open(e)},close:function(){return e.magnificPopup.instance.close()},registerModule:function(t,i){i.options&&(e.magnificPopup.defaults[t]=i.options),e.extend(this.proto,i.proto),this.modules.push(t)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,alignTop:!1,removalDelay:0,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&times;</button>',tClose:"Close (Esc)",tLoading:"Loading..."}},e.fn.magnificPopup=function(i){E();var n=e(this);if("string"==typeof i)if("open"===i){var a,r=w?n.data("magnificPopup"):n[0].magnificPopup,o=parseInt(arguments[1],10)||0;r.items?a=r.items[o]:(a=n,r.delegate&&(a=a.find(r.delegate)),a=a.eq(o)),t._openClick({mfpEl:a},n,r)}else t.isOpen&&t[i].apply(t,Array.prototype.slice.call(arguments,1));else w?n.data("magnificPopup",i):n[0].magnificPopup=i,t.addGroup(n,i);return n};var M,O,_,z="inline",B=function(){_&&(O.after(_.addClass(M)).detach(),_=null)};e.magnificPopup.registerModule(z,{options:{hiddenClass:"hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){t.types.push(z),I(l+"."+z,function(){B()})},getInline:function(i,n){if(B(),i.src){var a=t.st.inline,r=e(i.src);if(r.length){var o=r[0].parentNode;o&&o.tagName&&(O||(M=a.hiddenClass,O=x(M),M="mfp-"+M),_=r.after(O).detach().removeClass(M)),t.updateStatus("ready")}else t.updateStatus("error",a.tNotFound),r=e("<div>");return i.inlineElement=r,r}return t.updateStatus("ready"),t._parseMarkup(n,{},i),n}}});var H,F="ajax",L=function(){H&&n.removeClass(H)};e.magnificPopup.registerModule(F,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){t.types.push(F),H=t.st.ajax.cursor,I(l+"."+F,function(){L(),t.req&&t.req.abort()})},getAjax:function(i){H&&n.addClass(H),t.updateStatus("loading");var a=e.extend({url:i.src,success:function(n,a,r){var o={data:n,xhr:r};k("ParseAjax",o),t.appendContent(e(o.data),F),i.finished=!0,L(),S(),setTimeout(function(){t.wrap.addClass(v)},16),t.updateStatus("ready"),k("AjaxContentAdded")},error:function(){L(),i.finished=i.loadError=!0,t.updateStatus("error",t.st.ajax.tError.replace("%url%",i.src))}},t.st.ajax.settings);return t.req=e.ajax(a),""}}});var A,j=function(i){if(i.data&&void 0!==i.data.title)return i.data.title;var n=t.st.image.titleSrc;if(n){if(e.isFunction(n))return n.call(t,i);if(i.el)return i.el.attr(n)||""}return""};e.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><div class="mfp-img"></div><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var e=t.st.image,i=".image";t.types.push("image"),I(u+i,function(){"image"===t.currItem.type&&e.cursor&&n.addClass(e.cursor)}),I(l+i,function(){e.cursor&&n.removeClass(e.cursor),b.off("resize"+g)}),I("Resize"+i,t.resizeImage),t.isLowIE&&I("AfterChange",t.resizeImage)},resizeImage:function(){var e=t.currItem;if(e.img&&t.st.image.verticalFit){var i=0;t.isLowIE&&(i=parseInt(e.img.css("padding-top"),10)+parseInt(e.img.css("padding-bottom"),10)),e.img.css("max-height",t.wH-i)}},_onImageHasSize:function(e){e.img&&(e.hasSize=!0,A&&clearInterval(A),e.isCheckingImgSize=!1,k("ImageHasSize",e),e.imgHidden&&(t.content&&t.content.removeClass("mfp-loading"),e.imgHidden=!1))},findImageSize:function(e){var i=0,n=e.img[0],a=function(r){A&&clearInterval(A),A=setInterval(function(){return n.naturalWidth>0?(t._onImageHasSize(e),void 0):(i>200&&clearInterval(A),i++,3===i?a(10):40===i?a(50):100===i&&a(500),void 0)},r)};a(1)},getImage:function(i,n){var a=0,r=function(){i&&(i.img[0].complete?(i.img.off(".mfploader"),i===t.currItem&&(t._onImageHasSize(i),t.updateStatus("ready")),i.hasSize=!0,i.loaded=!0):(a++,200>a?setTimeout(r,100):o()))},o=function(){i&&(i.img.off(".mfploader"),i===t.currItem&&(t._onImageHasSize(i),t.updateStatus("error",s.tError.replace("%url%",i.src))),i.hasSize=!0,i.loaded=!0,i.loadError=!0)},s=t.st.image,l=n.find(".mfp-img");if(l.length){var c=new Image;c.className="mfp-img",i.img=e(c).on("load.mfploader",r).on("error.mfploader",o),c.src=i.src,l.is("img")&&(i.img=i.img.clone())}return t._parseMarkup(n,{title:j(i),img_replaceWith:i.img},i),t.resizeImage(),i.hasSize?(A&&clearInterval(A),i.loadError?(n.addClass("mfp-loading"),t.updateStatus("error",s.tError.replace("%url%",i.src))):(n.removeClass("mfp-loading"),t.updateStatus("ready")),n):(t.updateStatus("loading"),i.loading=!0,i.hasSize||(i.imgHidden=!0,n.addClass("mfp-loading"),t.findImageSize(i)),n)}}});var N="iframe",W="//about:blank",R=function(e){if(t.currTemplate[N]){var i=t.currTemplate[N].find("iframe");i.length&&(e||(i[0].src=W),t.isIE8&&i.css("display",e?"block":"none"))}};e.magnificPopup.registerModule(N,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){t.types.push(N),I("BeforeChange",function(e,t,i){t!==i&&(t===N?R():i===N&&R(!0))}),I(l+"."+N,function(){R()})},getIframe:function(i,n){var a=i.src,r=t.st.iframe;e.each(r.patterns,function(){return a.indexOf(this.index)>-1?(this.id&&(a="string"==typeof this.id?a.substr(a.lastIndexOf(this.id)+this.id.length,a.length):this.id.call(this,a)),a=this.src.replace("%id%",a),!1):void 0});var o={};return r.srcAction&&(o[r.srcAction]=a),t._parseMarkup(n,o,i),t.updateStatus("ready"),n}}});var Y=function(e){var i=t.items.length;return e>i-1?e-i:0>e?i+e:e},q=function(e,t,i){return e.replace("%curr%",t+1).replace("%total%",i)};e.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var i=t.st.gallery,n=".mfp-gallery",r=Boolean(e.fn.mfpFastClick);return t.direction=!0,i&&i.enabled?(o+=" mfp-gallery",I(u+n,function(){i.navigateByImgClick&&t.wrap.on("click"+n,".mfp-img",function(){return t.items.length>1?(t.next(),!1):void 0}),a.on("keydown"+n,function(e){37===e.keyCode?t.prev():39===e.keyCode&&t.next()})}),I("UpdateStatus"+n,function(e,i){i.text&&(i.text=q(i.text,t.currItem.index,t.items.length))}),I(p+n,function(e,n,a,r){var o=t.items.length;a.counter=o>1?q(i.tCounter,r.index,o):""}),I("BuildControls"+n,function(){if(t.items.length>1&&i.arrows&&!t.arrowLeft){var n=i.arrowMarkup,a=t.arrowLeft=e(n.replace("%title%",i.tPrev).replace("%dir%","left")).addClass(C),o=t.arrowRight=e(n.replace("%title%",i.tNext).replace("%dir%","right")).addClass(C),s=r?"mfpFastClick":"click";a[s](function(){t.prev()}),o[s](function(){t.next()}),t.isIE7&&(x("b",a[0],!1,!0),x("a",a[0],!1,!0),x("b",o[0],!1,!0),x("a",o[0],!1,!0)),t.container.append(a.add(o))}}),I(f+n,function(){t._preloadTimeout&&clearTimeout(t._preloadTimeout),t._preloadTimeout=setTimeout(function(){t.preloadNearbyImages(),t._preloadTimeout=null},16)}),I(l+n,function(){a.off(n),t.wrap.off("click"+n),t.arrowLeft&&r&&t.arrowLeft.add(t.arrowRight).destroyMfpFastClick(),t.arrowRight=t.arrowLeft=null}),void 0):!1},next:function(){t.direction=!0,t.index=Y(t.index+1),t.updateItemHTML()},prev:function(){t.direction=!1,t.index=Y(t.index-1),t.updateItemHTML()},goTo:function(e){t.direction=e>=t.index,t.index=e,t.updateItemHTML()},preloadNearbyImages:function(){var e,i=t.st.gallery.preload,n=Math.min(i[0],t.items.length),a=Math.min(i[1],t.items.length);for(e=1;(t.direction?a:n)>=e;e++)t._preloadItem(t.index+e);for(e=1;(t.direction?n:a)>=e;e++)t._preloadItem(t.index-e)},_preloadItem:function(i){if(i=Y(i),!t.items[i].preloaded){var n=t.items[i];n.parsed||(n=t.parseEl(i)),k("LazyLoad",n),"image"===n.type&&(n.img=e('<img class="mfp-img" />').on("load.mfploader",function(){n.hasSize=!0}).on("error.mfploader",function(){n.hasSize=!0,n.loadError=!0}).attr("src",n.src)),n.preloaded=!0}}}});var D="retina";e.magnificPopup.registerModule(D,{options:{replaceSrc:function(e){return e.src.replace(/\.\w+$/,function(e){return"@2x"+e})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var e=t.st.retina,i=e.ratio;i=isNaN(i)?i():i,i>1&&(I("ImageHasSize."+D,function(e,t){t.img.css({"max-width":t.img[0].naturalWidth/i,width:"100%"})}),I("ElementParse."+D,function(t,n){n.src=e.replaceSrc(n,i)}))}}}}),function(){var t=1e3,i="ontouchstart"in window,n=function(){b.off("touchmove"+r+" touchend"+r)},a="mfpFastClick",r="."+a;e.fn.mfpFastClick=function(a){return e(this).each(function(){var o,s=e(this);if(i){var l,c,d,p,u,f;s.on("touchstart"+r,function(e){p=!1,f=1,u=e.originalEvent?e.originalEvent.touches[0]:e.touches[0],c=u.clientX,d=u.clientY,b.on("touchmove"+r,function(e){u=e.originalEvent?e.originalEvent.touches:e.touches,f=u.length,u=u[0],(Math.abs(u.clientX-c)>10||Math.abs(u.clientY-d)>10)&&(p=!0,n())}).on("touchend"+r,function(e){n(),p||f>1||(o=!0,e.preventDefault(),clearTimeout(l),l=setTimeout(function(){o=!1},t),a())})})}s.on("click"+r,function(){o||a()})})},e.fn.destroyMfpFastClick=function(){e(this).off("touchstart"+r+" click"+r),i&&b.off("touchmove"+r+" touchend"+r)}}()})(window.jQuery||window.Zepto);

/*Mobile Detection Library
Copyright 2010-2012, Anthony Hand
*/
function DetectIphone(){if(uagent.search(deviceIphone)>-1){if(DetectIpad()||DetectIpod())return false;else return true}else return false}function DetectIpod(){if(uagent.search(deviceIpod)>-1)return true;else return false}function DetectIpad(){if(uagent.search(deviceIpad)>-1&&DetectWebkit())return true;else return false}function DetectIphoneOrIpod(){if(uagent.search(deviceIphone)>-1||uagent.search(deviceIpod)>-1)return true;else return false}function DetectIos(){if(DetectIphoneOrIpod()||DetectIpad())return true;else return false}function DetectAndroid(){if(uagent.search(deviceAndroid)>-1||DetectGoogleTV())return true;if(uagent.search(deviceHtcFlyer)>-1)return true;else return false}function DetectAndroidPhone(){if(DetectAndroid()&&uagent.search(mobile)>-1)return true;if(DetectOperaAndroidPhone())return true;if(uagent.search(deviceHtcFlyer)>-1)return true;else return false}function DetectAndroidTablet(){if(!DetectAndroid())return false;if(DetectOperaMobile())return false;if(uagent.search(deviceHtcFlyer)>-1)return false;if(uagent.search(mobile)>-1)return false;else return true}function DetectAndroidWebKit(){if(DetectAndroid()&&DetectWebkit())return true;else return false}function DetectGoogleTV(){if(uagent.search(deviceGoogleTV)>-1)return true;else return false}function DetectWebkit(){if(uagent.search(engineWebKit)>-1)return true;else return false}function DetectS60OssBrowser(){if(DetectWebkit()){if(uagent.search(deviceS60)>-1||uagent.search(deviceSymbian)>-1)return true;else return false}else return false}function DetectSymbianOS(){if(uagent.search(deviceSymbian)>-1||uagent.search(deviceS60)>-1||uagent.search(deviceS70)>-1||uagent.search(deviceS80)>-1||uagent.search(deviceS90)>-1)return true;else return false}function DetectWindowsPhone7(){if(uagent.search(deviceWinPhone7)>-1)return true;else return false}function DetectWindowsMobile(){if(DetectWindowsPhone7())return false;if(uagent.search(deviceWinMob)>-1||uagent.search(deviceIeMob)>-1||uagent.search(enginePie)>-1)return true;if(uagent.search(devicePpc)>-1&&!(uagent.search(deviceMacPpc)>-1))return true;if(uagent.search(manuHtc)>-1&&uagent.search(deviceWindows)>-1)return true;else return false}function DetectBlackBerry(){if(uagent.search(deviceBB)>-1)return true;if(uagent.search(vndRIM)>-1)return true;else return false}function DetectBlackBerryTablet(){if(uagent.search(deviceBBPlaybook)>-1)return true;else return false}function DetectBlackBerryWebKit(){if(DetectBlackBerry()&&uagent.search(engineWebKit)>-1)return true;else return false}function DetectBlackBerryTouch(){if(DetectBlackBerry()&&(uagent.search(deviceBBStorm)>-1||uagent.search(deviceBBTorch)>-1||uagent.search(deviceBBBoldTouch)>-1||uagent.search(deviceBBCurveTouch)>-1))return true;else return false}function DetectBlackBerryHigh(){if(DetectBlackBerryWebKit())return false;if(DetectBlackBerry()){if(DetectBlackBerryTouch()||uagent.search(deviceBBBold)>-1||uagent.search(deviceBBTour)>-1||uagent.search(deviceBBCurve)>-1)return true;else return false}else return false}function DetectBlackBerryLow(){if(DetectBlackBerry()){if(DetectBlackBerryHigh()||DetectBlackBerryWebKit())return false;else return true}else return false}function DetectPalmOS(){if(uagent.search(devicePalm)>-1||uagent.search(engineBlazer)>-1||uagent.search(engineXiino)>-1){if(DetectPalmWebOS())return false;else return true}else return false}function DetectPalmWebOS(){if(uagent.search(deviceWebOS)>-1)return true;else return false}function DetectWebOSTablet(){if(uagent.search(deviceWebOShp)>-1&&uagent.search(deviceTablet)>-1)return true;else return false}function DetectGarminNuvifone(){if(uagent.search(deviceNuvifone)>-1)return true;else return false}function DetectSmartphone(){if(DetectIphoneOrIpod()||DetectAndroidPhone()||DetectS60OssBrowser()||DetectSymbianOS()||DetectWindowsMobile()||DetectWindowsPhone7()||DetectBlackBerry()||DetectPalmWebOS()||DetectPalmOS()||DetectGarminNuvifone())return true;return false}function DetectArchos(){if(uagent.search(deviceArchos)>-1)return true;else return false}function DetectBrewDevice(){if(uagent.search(deviceBrew)>-1)return true;else return false}function DetectDangerHiptop(){if(uagent.search(deviceDanger)>-1||uagent.search(deviceHiptop)>-1)return true;else return false}function DetectMaemoTablet(){if(uagent.search(maemo)>-1)return true;if(uagent.search(linux)>-1&&uagent.search(deviceTablet)>-1&&!DetectWebOSTablet()&&!DetectAndroid())return true;else return false}function DetectSonyMylo(){if(uagent.search(manuSony)>-1){if(uagent.search(qtembedded)>-1||uagent.search(mylocom2)>-1)return true;else return false}else return false}function DetectOperaMobile(){if(uagent.search(engineOpera)>-1){if(uagent.search(mini)>-1||uagent.search(mobi)>-1)return true;else return false}else return false}function DetectOperaAndroidPhone(){if(uagent.search(engineOpera)>-1&&uagent.search(deviceAndroid)>-1&&uagent.search(mobi)>-1)return true;else return false}function DetectOperaAndroidTablet(){if(uagent.search(engineOpera)>-1&&uagent.search(deviceAndroid)>-1&&uagent.search(deviceTablet)>-1)return true;else return false}function DetectSonyPlaystation(){if(uagent.search(devicePlaystation)>-1)return true;else return false}function DetectNintendo(){if(uagent.search(deviceNintendo)>-1||uagent.search(deviceWii)>-1||uagent.search(deviceNintendoDs)>-1)return true;else return false}function DetectXbox(){if(uagent.search(deviceXbox)>-1)return true;else return false}function DetectGameConsole(){if(DetectSonyPlaystation())return true;if(DetectNintendo())return true;if(DetectXbox())return true;else return false}function DetectKindle(){if(uagent.search(deviceKindle)>-1&&!DetectAndroid())return true;else return false}function DetectAmazonSilk(){if(uagent.search(engineSilk)>-1)return true;else return false}function DetectMobileQuick(){if(DetectTierTablet())return false;if(DetectSmartphone())return true;if(uagent.search(deviceMidp)>-1||DetectBrewDevice())return true;if(DetectOperaMobile())return true;if(uagent.search(engineNetfront)>-1)return true;if(uagent.search(engineUpBrowser)>-1)return true;if(uagent.search(engineOpenWeb)>-1)return true;if(DetectDangerHiptop())return true;if(DetectMaemoTablet())return true;if(DetectArchos())return true;if(uagent.search(devicePda)>-1&&!(uagent.search(disUpdate)>-1))return true;if(uagent.search(mobile)>-1)return true;if(DetectKindle()||DetectAmazonSilk())return true;return false}function DetectMobileLong(){if(DetectMobileQuick())return true;if(DetectGameConsole())return true;if(DetectSonyMylo())return true;if(uagent.search(manuSamsung1)>-1||uagent.search(manuSonyEricsson)>-1||uagent.search(manuericsson)>-1)return true;if(uagent.search(svcDocomo)>-1)return true;if(uagent.search(svcKddi)>-1)return true;if(uagent.search(svcVodafone)>-1)return true;return false}function DetectTierTablet(){if(DetectIpad()||DetectAndroidTablet()||DetectBlackBerryTablet()||DetectWebOSTablet())return true;else return false}function DetectTierIphone(){if(DetectIphoneOrIpod())return true;if(DetectAndroidPhone())return true;if(DetectBlackBerryWebKit()&&DetectBlackBerryTouch())return true;if(DetectWindowsPhone7())return true;if(DetectPalmWebOS())return true;if(DetectGarminNuvifone())return true;else return false}function DetectTierRichCss(){if(DetectMobileQuick()){if(DetectTierIphone()||DetectKindle())return false;if(DetectWebkit())return true;if(DetectS60OssBrowser())return true;if(DetectBlackBerryHigh())return true;if(DetectWindowsMobile())return true;if(uagent.search(engineTelecaQ)>-1)return true;else return false}else return false}function DetectTierOtherPhones(){if(DetectMobileLong()){if(DetectTierIphone()||DetectTierRichCss())return false;else return true}else return false}function InitDeviceScan(){isIphone=DetectIphoneOrIpod();isAndroidPhone=DetectAndroidPhone();isTierIphone=DetectTierIphone();isTierTablet=DetectTierTablet();isTierRichCss=DetectTierRichCss();isTierGenericMobile=DetectTierOtherPhones()}var isIphone=false;var isAndroidPhone=false;var isTierTablet=false;var isTierIphone=false;var isTierRichCss=false;var isTierGenericMobile=false;var engineWebKit="webkit";var deviceIphone="iphone";var deviceIpod="ipod";var deviceIpad="ipad";var deviceMacPpc="macintosh";var deviceAndroid="android";var deviceGoogleTV="googletv";var deviceXoom="xoom";var deviceHtcFlyer="htc_flyer";var deviceNuvifone="nuvifone";var deviceSymbian="symbian";var deviceS60="series60";var deviceS70="series70";var deviceS80="series80";var deviceS90="series90";var deviceWinPhone7="windows phone os 7";var deviceWinMob="windows ce";var deviceWindows="windows";var deviceIeMob="iemobile";var devicePpc="ppc";var enginePie="wm5 pie";var deviceBB="blackberry";var vndRIM="vnd.rim";var deviceBBStorm="blackberry95";var deviceBBBold="blackberry97";var deviceBBBoldTouch="blackberry 99";var deviceBBTour="blackberry96";var deviceBBCurve="blackberry89";var deviceBBCurveTouch="blackberry 938";var deviceBBTorch="blackberry 98";var deviceBBPlaybook="playbook";var devicePalm="palm";var deviceWebOS="webos";var deviceWebOShp="hpwos";var engineBlazer="blazer";var engineXiino="xiino";var deviceKindle="kindle";var engineSilk="silk";var vndwap="vnd.wap";var wml="wml";var deviceTablet="tablet";var deviceBrew="brew";var deviceDanger="danger";var deviceHiptop="hiptop";var devicePlaystation="playstation";var deviceNintendoDs="nitro";var deviceNintendo="nintendo";var deviceWii="wii";var deviceXbox="xbox";var deviceArchos="archos";var engineOpera="opera";var engineNetfront="netfront";var engineUpBrowser="up.browser";var engineOpenWeb="openweb";var deviceMidp="midp";var uplink="up.link";var engineTelecaQ="teleca q";var devicePda="pda";var mini="mini";var mobile="mobile";var mobi="mobi";var maemo="maemo";var linux="linux";var qtembedded="qt embedded";var mylocom2="com2";var manuSonyEricsson="sonyericsson";var manuericsson="ericsson";var manuSamsung1="sec-sgh";var manuSony="sony";var manuHtc="htc";var svcDocomo="docomo";var svcKddi="kddi";var svcVodafone="vodafone";var disUpdate="update";var uagent="";if(navigator&&navigator.userAgent)uagent=navigator.userAgent.toLowerCase();InitDeviceScan()