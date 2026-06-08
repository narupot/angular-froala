/*!
 * froala_editor v2.5.1 (https://www.froala.com/wysiwyg-editor)
 * License https://froala.com/wysiwyg-editor/terms/
 * Copyright 2014-2017 Froala Labs
 */

!function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = function(b, c) {
        return void 0 === c && (c = "undefined" != typeof window ? require("jquery") : require("jquery")(b)),
        a(c)
    }
    : a(window.jQuery)
}(function(a) {
    if (a.extend(a.FE.DEFAULTS, {
        imageManagerLoadURL: "https://i.froala.com/load-files",
        imageManagerLoadMethod: "get",
        imageManagerLoadParams: {},
        imageManagerPreloader: "../../froala_editor1/img/loader.gif",
        imageManagerDeleteURL: "",
        imageManagerDeleteMethod: "post",
        imageManagerDeleteParams: {},
        imageManagerPageSize:10,
		imageManagerPageSortBy:'name-asc',
        imageManagerScrollOffset: 0,
        imageManagerToggleTags: !0,
		//folder variables
		userFolderDefaultPath: '',
		imageManagerFolders: [],
		imageManagerDefaultURL: "",
		imageManagerNewFolderURL: "",
		imageManagerNewFolderDefaultURL: "",
		imageManagerNewFolderMethod: "post",
		imageManagerNewFolderParams:{},
		//Facebook
		imageManagerFacebookLoadURL:'',
		imageManagerFacebookLoadMethod:'get',
		imageManagerFacebookLoadParams:{}
    }),
    a.FE.PLUGINS.imageManager = function(b) {
		
        function c() {
            if (!y) {
				
                var fb_icon = '<i data-tab="fb" id="fr-modal-fb-images-btn" title="Login with Facebook & Import Images" class="fa fa-facebook-official fr-tb-item" data-text="true"></i>',
				insta_icon = '<i data-tab="ig" id="fr-modal-insta-images-btn" title="Login with Instagram & Import Images" class="fa fa-instagram fr-tb-item" data-text="true"></i>',
				drp_list = '<select id="fr-fb-accounts-list" class="dropDown drp-fb "></select>',
				drp_pg_size = '<div id="fr-h-r-2"><select title="Sort By" id="fr-pg-sort" class="dropDown drp-pg"><option value="name-asc">Name ASC</option><option value="name-desc">Name DESC</option><option value="date-asc">Date ASC</option><option value="date-desc">Date DESC</option></select> <select title="show Images/Page" id="fr-pg-size" class="dropDown drp-pg"><option value="10">10/Page</option><option value="20">20/Page</option><option value="50">50/Page</option></select></div>',
				a = '<div class="fr-modal-head-line"><i class="fa fa-bars fr-modal-more fr-not-available" id="fr-modal-more-' + b.sid + '" title="' + b.language.translate("Tags") + '"></i>'+drp_list+fb_icon+insta_icon+'<i id="fr-modal-local-images-btn" data-tab="local" title="Show Local Images" class="fa fa-picture-o active fr-tb-item" data-text="true"></i><i id="fr-modal-new-folder-btn" title="Create New Folder" class="fa fa-plus" data-text="true"></i><i id="fr-modal-upload-img-btn" title="Upload Image" class="fa fa-upload" data-text="true"></i><i id="fr-modal-back-btn" class="fa fa-arrow-left" style="color:#c7c3c3;" data-text="true"></i></i><i id="fr-modal-forward-btn" class="fa fa-arrow-right" data-text="true"></i><h4 data-text="true">' + b.language.translate("Manage Images") + "</h4>"+drp_pg_size+"</div>";
                a += '<div class="fr-modal-tags" id="fr-modal-tags"></div>';
                var c = '<img class="fr-preloader" id="fr-preloader" alt="' + b.language.translate("Loading") + '.." src="' + b.opts.imageManagerPreloader + '" style="display: none;">';
				c += '<div class="fr-image-list" id="fr-image-list"></div>';
                var d = b.modals.create(J, a, c);
                y = d.$modal,
                z = d.$head,
                A = d.$body
            }
            y.data("current-image", b.image.get()),
            b.modals.show(J),
            B || w(),
            g()
			window.B = B,window.C=C,window.ActiveTab='local';
			$(document).on('ImageManager.OpenFacebookImages',function(){
				$(document).trigger('ImageManager.activateTab',['local']);
				$('i.fr-tb-item').removeClass('active'),$('#fr-modal-local-images-btn').addClass('active');
				//g();
			});
			
			$(document).on('change','#fr-pg-size',function(){
				b.opts.imageManagerPageSize=$(this).val();
				switch(window.ActiveTab){
					case 'local':
						g();
						break;
					default:
						gN(window.atlist);
				}
			});
			
			$(document).on('change','#fr-pg-sort',function(){
				b.opts.imageManagerPageSortBy=$(this).val();
				switch(window.ActiveTab){
					case 'local':
						g();
						break;
					default:
						gN(window.atlist);
				}
			});
			
			$(document).on('ImageManager.LoadFacebookImages',function(event,r){
				if(typeof _FB != 'undefined'){
					window.atlist=r;gN(r);
				}else{
					console.log('_FB Not Defined.');
				}
			});
			
			$(document).on('ImageManager.LoadInstaImages',function(event,r){
				//console.log('--------------------');
				//console.log(r);
				if(typeof _IG != 'undefined'){
					//console.log('IG: Load Event triggered successfully');
					window.atlist=r;gN(r);
				}else{
					console.log('_IG Not Defined.');
				}
			});
			
			$(document).on('ImageManager.activateTab',function(event,tab){
				window.ActiveTab=tab;$('.fr-modal-wrapper i.fr-tb-item').removeClass('active'),$('.fr-modal-wrapper i.fr-tb-item[data-tab='+tab+']').addClass('active');
				switch(tab){
					case 'fb':
						$('#fr-check-all-btn').show();
						$('#fr-modal-new-folder-btn,#fr-modal-upload-img-btn').css('color','#c7c3c3');FBinit();
						break;
					case 'ig':
						$('#fr-check-all-btn').show();
						$('#fr-modal-new-folder-btn,#fr-modal-upload-img-btn').css('color','#c7c3c3');IGinit();
						break;
					default:
						$('#fr-check-all-btn').hide();
						$('#fr-modal-new-folder-btn,#fr-modal-upload-img-btn').css('color','#222222'); g();
						$('#fr-fb-accounts-list').html('').hide();
				}
			});
        }
        function d() {
            b.modals.hide(J)
        }
        function e() {
            var b = a(window).outerWidth();
            return b < 768 ? 2 : b < 1200 ? 3 : 4
        }
        function f() {
            C.empty();
            for (var a = 0; a < I; a++)
                C.append('<div class="fr-list-column"></div>')
        }
		function srt(s){
			function cmpr(ss,tt){ss = ss.toUpperCase();tt = tt.toUpperCase();if (ss < tt) {return -1;}if (ss > tt) {return 1;}return 0;}
			s.sort(function(aa, bb) {
				switch(b.opts.imageManagerPageSortBy){
					case 'name-desc':
						return cmpr(bb.name,aa.name);
						break;
					case 'date-asc':
						return aa.datetime-bb.datetime;
						break;
					case 'date-desc':
						return bb.datetime-aa.datetime;
						break;
					default:
						return  cmpr(aa.name,bb.name);
				}
				
			});
			return s;
		}
		function sortArr(s){
			var sFolders=[],sFiles=[],nFiles=[],nFolders=[];for(i=0;i<s.length;i++){(s[i].type == 'folder')? sFolders.push(s[i]):sFiles.push(s[i]);}nFolders=srt(sFolders);nFiles=srt(sFiles);return nFolders.concat(nFiles);
		}
        function g() {
            B.show(),
            C.find(".fr-list-column").empty(),
            b.opts.imageManagerLoadURL ? a.ajax({
                url: b.opts.imageManagerLoadURL,
                method: b.opts.imageManagerLoadMethod,
                data: b.opts.imageManagerLoadParams,
                dataType: "json",
                crossDomain: b.opts.requestWithCORS,
                xhrFields: {
                    withCredentials: b.opts.requestWithCredentials
                },
                headers: b.opts.requestHeaders
            }).done(function(a, c, d) {
                b.events.trigger("imageManager.imagesLoaded", [a]),
                B.hide();				
				processPagination(sortArr(a),d.response);
            }).fail(function() {
                var a = this.xhr();
                r(L, a.response || a.responseText)
            }) : r(M);
        }
		
		//for facebook Request
		function gN(resp) {
            C.find(".fr-list-column").empty(),
			
			//console.log('resp: ');
			//console.log(resp);
			//alert('res.len: '+resp.length);
			B.hide();
			processPagination(srt(resp),d.response);
        }
		
		//pagination functions
		function processPagination(a,d){
			//console.log(a.length);
			window.pg_d=d,window.pg_a=a,window.pg_t = a.length;window.pg_tp=Math.ceil(window.pg_t/b.opts.imageManagerPageSize);
			showPagination(window.pg_tp);
		}
		
		function showPagination(pg_tp){
			sdssa=(window.ActiveTab=='fb' || window.ActiveTab=='ig')?'inline-block':'none';
			var pg_act,pg_html='<button class="btn btn-primary" id="fb-import-btn">Import</button><span class="fr-fb-selected-icon"><i id="fr-check-all-btn" class="fa fa-circle" style="display:'+sdssa+'"></i></span><ul>'; for(i=1;i<=pg_tp;i++){ if(i==1){pg_act='active';}else{pg_act='';} pg_html+='<li class="'+pg_act+'" data-value="'+i+'">'+i+'</li>';} pg_html+='</ul>';
			if($('.fr-modal-wrapper .fr-pagi-main').length>0){
				$('.fr-pagi-main').html(pg_html);
			}else{
				$('.fr-modal-wrapper').append('<div class="fr-pagi-main">'+pg_html+'</div>');
			}
			openPage(1);
		}
		
		function openPage(pg_n){
			if(typeof pg_n == 'object'){
				//console.log(pg_n.currentTarget);
				if($(pg_n.currentTarget).hasClass('active')){return false;}
				pg_s = a(pg_n.currentTarget).attr('data-value');
				pg_n=null;
				pg_n=pg_s;
			}
			$('.fr-pagi-main ul > li').removeClass('active');
			$('.fr-pagi-main ul > li[data-value='+pg_n+']').addClass('active');
			var maxN = (pg_n*b.opts.imageManagerPageSize)-1;
			var nArr=[],pg_t_mx=(maxN-(b.opts.imageManagerPageSize-1));
			//if(pg_n==1){pg_t_mx=0};
			//alert('page('+pg_n+') => '+pg_t_mx+' - '+maxN);
			//alert(typeof window.pg_a); return 0;
			for(i=pg_t_mx;i<=maxN;i++){
				if(window.pg_a.indexOf(window.pg_a[i])!=-1) nArr.push(window.pg_a[i]);
			}
			//alert('nArr: '+nArr.length);
			h(nArr, window.pg_d);
		}
		
		function gNewFolder() {
            //B.show(),
            //C.find(".fr-list-column").empty(),
            b.opts.imageManagerNewFolderURL ? a.ajax({
                url: b.opts.imageManagerNewFolderURL,
                method: b.opts.imageManagerNewFolderMethod,
                data: b.opts.imageManagerNewFolderParams,
                dataType: "json",
                crossDomain: b.opts.requestWithCORS,
                xhrFields: {
                    withCredentials: b.opts.requestWithCredentials
                },
                headers: b.opts.requestHeaders
            }).done(function(a, c, d) {
				//alert('New: '+c);
				if(c=='success'){aF(a,d);}
            }).fail(function() {
                var a = this.xhr();
                r(L, a.response || a.responseText)
            }) : r(M)
			
        }
		
		function renameFolder(tg_el) {
            //B.show(),
            //C.find(".fr-list-column").empty(),
            b.opts.imageManagerNewFolderURL ? a.ajax({
                url: b.opts.imageManagerNewFolderURL,
                method: b.opts.imageManagerNewFolderMethod,
                data: b.opts.imageManagerNewFolderParams,
                dataType: "json",
                crossDomain: b.opts.requestWithCORS,
                xhrFields: {
                    withCredentials: b.opts.requestWithCredentials
                },
                headers: b.opts.requestHeaders
            }).done(function(a, c, d) {
				//console.log(a);
				if(c == 'success' && a.status == 'success'){updateName(tg_el,a);}
				b.opts.imageManagerNewFolderParams={};
            }).fail(function() {
                var a = this.xhr();
                r(L, a.response || a.responseText)
				b.opts.imageManagerNewFolderParams={};
            }) : r(M)
        }
		
		function updateName(tg_el,a){
			//console.log($(tg_el).find('span.fr-file-name').length);
			$(tg_el).find('span.fr-file-name').text(a.newName).attr('data-name',a.newName);
			$(tg_el).find('i.fr-open-folder').attr('data-url',a.newName);var imG=$(tg_el).find('img[data-type=folder]');
			imG.attr('data-name',a.newName).attr('alt',a.newName);
			var nan = imG.attr('data-url');nbn = nan.split('/'),nbn.pop(),nbn.push(a.newName),ncn=nbn.join('/'),imG.attr('data-url',ncn);
		}
		
		function aF(x,d){
			//show new folder/append
			$('#fr-image-list .fr-list-column:first').prepend('<div class="fr-image-container fr-image-'+($('.fr-list-column:first .fr-image-container').length+1)+'" data-loading="Loading.." data-deleting="Deleting.." style="height: auto;"><img src="../../froala_editor1/img/folder-icon.png" data-url="'+x.url+'" alt="'+x.name+'" data-type="'+x.type+'" data-name="'+x.name+'"><i class="fa fa-trash fr-delete-img" aria-hidden="true" title="Delete"></i><i class="fa fa-folder-open fr-open-folder" aria-hidden="true" data-url="'+x.name+'" data-name="'+x.name+'" title="Open"></i><span class="fr-file-name" data-name="'+x.name+'">'+x.name+'</span></div>');
		}
		
        function h(a, b) {
            try {
                C.find(".fr-list-column").empty(),
                F = 0,
                G = 0,
                H = 0,
                E = a
				iI()
            } catch (c) {
				//alert('going to error');
				//console.log(c);
                r(N, b)
            }
        }
        function i() {
            if (G < E.length && (C.outerHeight() <= A.outerHeight() + b.opts.imageManagerScrollOffset || A.scrollTop() + b.opts.imageManagerScrollOffset > C.outerHeight() - A.outerHeight())) {
                F++;
                for (var a = b.opts.imageManagerPageSize * (F - 1); a < Math.min(E.length, b.opts.imageManagerPageSize * F); a++)
                    j(E[a])
            }
        }
		
		function iI() {
            if (G < E.length && (C.outerHeight() <= A.outerHeight() + b.opts.imageManagerScrollOffset || A.scrollTop() + b.opts.imageManagerScrollOffset > C.outerHeight() - A.outerHeight())) {
                F++;
                for (var a = b.opts.imageManagerPageSize * (F - 1); a < Math.min(E.length, b.opts.imageManagerPageSize * F); a++)
                    j(E[a])
            }
        }
		
        function j(c) {
			//console.log('H in j: '+H);
            var d = new Image
              , e = a('<div class="fr-image-container fr-empty fr-image-' + H++ + '" data-loading="' + b.language.translate("Loading") + '.." data-deleting="' + b.language.translate("Deleting") + '.." data-type="'+c.type+'">');
            n(!1),
            d.onload = function() {
				if(c.type=='folder'){
					e.height(50);
				}else{
                	e.height(Math.floor(e.width() / d.width * d.height));
				}
				var f = a("<img/>");
                if (c.thumb)
                    f.attr("src", c.thumb);
                else {
                    if (r(O, c),
                    !c.url)
                        return r(P, c),
                        !1;
                    f.attr("src", c.url)
                }
                if (c.url && f.attr("data-url", c.url),
                c.tag)
                    if (z.find(".fr-modal-more.fr-not-available").removeClass("fr-not-available"),
                    z.find(".fr-modal-tags").show(),
                    c.tag.indexOf(",") >= 0) {
                        for (var g = c.tag.split(","), h = 0; h < g.length; h++)
                            g[h] = g[h].trim(),
                            0 === D.find('a[title="' + g[h] + '"]').length && D.append('<a role="button" title="' + g[h] + '">' + g[h] + "</a>");
                        f.attr("data-tag", g.join())
                    } else
                        0 === D.find('a[title="' + c.tag.trim() + '"]').length && D.append('<a role="button" title="' + c.tag.trim() + '">' + c.tag.trim() + "</a>"),
                        f.attr("data-tag", c.tag.trim());
                c.name && f.attr("alt", c.name);
				
                for (var j in c)
                    c.hasOwnProperty(j) && "thumb" != j && "url" != j && "tag" != j && f.attr("data-" + j, c[j]);
					e.append(f).append(a(b.icon.create("imageManagerDelete")).addClass("fr-delete-img").attr("title", b.language.translate("Delete")));
					if(c.type=='folder'){
						c.subtype='folder';
						if(typeof c.subType != 'undefined' && c.subType == 'fb-folder'){
							c.subtype=c.subType;
						}
						e.append(a(b.icon.create("imageManagerFolderOpen")).addClass('fr-open-folder').attr('data-url',c.url).attr('data-name',c.name).attr("title", b.language.translate("Open")).attr('data-subtype',c.subtype));
						
						e.append('<span class="fr-file-name" data-name="'+c['name']+'">'+c['name']+'</span>');
					}else{
						c.class="fr-insert-img",c.subtype='image';
						if(typeof c.subType != 'undefined' && c.subType == 'fb-image'){
							c.class="fr-open-folder",c.subtype=c.subType;
						}
						e.append(a(b.icon.create("imageManagerInsert")).addClass(c.class).attr("title", b.language.translate("Select Image")).attr('data-subtype',c.subtype));
					}
					e.append('<span class="fr-fb-selected-icon"><i class="fa fa-check-square"></i></span>');
                
                D.find(".fr-selected-tag").each(function(a, b) {
                    v(f, b.text) || e.hide()
                }),
                f.on("load", function() {
                    e.removeClass("fr-empty"),
                    e.height("auto"),
                    G++;
                    var a = l(parseInt(f.parent().attr("class").match(/fr-image-(\d+)/)[1], 10) + 1);
                    m(a),
                    n(!1),
                    G % b.opts.imageManagerPageSize === 0 && iI()
                }),
                b.events.trigger("imageManager.imageLoaded", [f])
            }
            ,
            d.onerror = function() {
                G++,
                e.remove();
                var a = l(parseInt(e.attr("class").match(/fr-image-(\d+)/)[1], 10) + 1);
                m(a),
                r(K, c),
                G % b.opts.imageManagerPageSize === 0 && iI()
            }
            ,
            d.src = c.thumb || c.url,
            k().append(e)
        }
        function k() {
            var b, c;
            return C.find(".fr-list-column").each(function(d, e) {
                var f = a(e);
                0 === d ? (c = f.outerHeight(),
                b = f) : f.outerHeight() < c && (c = f.outerHeight(),
                b = f)
            }),
            b
        }
        function l(b) {
            void 0 === b && (b = 0);
            for (var c = [], d = H - 1; d >= b; d--) {
                var e = C.find(".fr-image-" + d);
                e.length && (c.push(e),
                a('<div id="fr-image-hidden-container">').append(e),
                C.find(".fr-image-" + d).remove())
            }
            return c
        }
        function m(a) {
            for (var b = a.length - 1; b >= 0; b--)
                k().append(a[b])
        }
        function n(a) {
            if (void 0 === a && (a = !0),
            !y.is(":visible"))
                return !0;
            var c = e();
            if (c != I) {
                I = c;
                var d = l();
                f(),
                m(d)
            }
            b.modals.resize(J),
            a && iI()
        }
        function o(a) {
            var b = {}
              , c = a.data();
            for (var d in c)
                c.hasOwnProperty(d) && "url" != d && "tag" != d && (b[d] = c[d]);
            return b
        }
        function p(c) {
            var d = a(c.currentTarget).siblings("img")
              , e = y.data("instance") || b
              , f = y.data("current-image");
            if (b.modals.hide(J),
            e.image.showProgressBar(),
            f)
                f.data("fr-old-src", f.attr("src")),
                f.trigger("click");
            else {
                e.events.focus(!0),
                e.selection.restore();
                var g = e.position.getBoundingRect()
                  , h = g.left + g.width / 2 + a(b.doc).scrollLeft()
                  , i = g.top + g.height + a(b.doc).scrollTop();
                e.popups.setContainer("image.insert", b.$sc),
                e.popups.show("image.insert", h, i)
            }
            e.image.insert(d.data("url"), !1, o(d), f)
        }
        function q(c) {
			//updating url
			if(b.opts.imageManagerFolders.length>0){
			b.opts.imageManagerDeleteURL = b.opts.imageManagerDefaultDeleteURL+b.opts.imageManagerFolders.join('/')+'/';
			}
            var d = a(c.currentTarget).siblings("img")
              , e = b.language.translate("Are you sure? Image will be deleted.");
            confirm(e) && (b.opts.imageManagerDeleteURL ? b.events.trigger("imageManager.beforeDeleteImage", [d]) !== !1 && (d.parent().addClass("fr-image-deleting"),
            a.ajax({
                method: b.opts.imageManagerDeleteMethod,
                url: b.opts.imageManagerDeleteURL,
                data: a.extend(a.extend({
                    src: d.attr("src")
                }, o(d)), b.opts.imageManagerDeleteParams),
                crossDomain: b.opts.requestWithCORS,
                xhrFields: {
                    withCredentials: b.opts.requestWithCredentials
                },
                headers: b.opts.requestHeaders
            }).done(function(a) {
                b.events.trigger("imageManager.imageDeleted", [a]);
                var c = l(parseInt(d.parent().attr("class").match(/fr-image-(\d+)/)[1], 10) + 1);
                d.parent().remove(),
                m(c),
                n(!0)
            }).fail(function() {
                var a = this.xhr();
                r(Q, a.response || a.responseText)
            })) : r(R))
        }
        function r(c, d) {
            10 <= c && c < 20 ? B.hide() : 20 <= c && c < 30 && a(".fr-image-deleting").removeClass("fr-image-deleting"),
            b.events.trigger("imageManager.error", [{
                code: c,
                message: S[c]
            }, d])
        }
        function s() {
            var a = z.find(".fr-modal-head-line").outerHeight()
              , b = D.outerHeight();
            z.toggleClass(".fr-show-tags"),
            z.hasClass(".fr-show-tags") ? (z.css("height", a + b),
            D.find("a").css("opacity", 1)) : (z.css("height", a),
            D.find("a").css("opacity", 0))
        }
        function t() {
            var b = D.find(".fr-selected-tag");
            b.length > 0 ? (C.find("img").parent().show(),
            b.each(function(b, c) {
                C.find("img").each(function(b, d) {
                    var e = a(d);
                    v(e, c.text) || e.parent().hide()
                })
            })) : C.find("img").parent().show();
            var c = l();
            m(c),
            i()
        }
        function u(c) {
            c.preventDefault();
            var d = a(c.currentTarget);
            d.toggleClass("fr-selected-tag"),
            b.opts.imageManagerToggleTags && d.siblings("a").removeClass("fr-selected-tag"),
            t()
        }
        function v(a, b) {
            for (var c = a.attr("data-tag").split(","), d = 0; d < c.length; d++)
                if (c[d] == b)
                    return !0;
            return !1
        }
        function w() {
            B = y.find("#fr-preloader"),
            C = y.find("#fr-image-list"),
            D = y.find("#fr-modal-tags"),
            I = e(),
            f(),
            z.css("height", z.find(".fr-modal-head-line").outerHeight()),
            b.events.$on(a(b.o_win), "resize", function() {
                n(E ? !0 : !1)
            }),
            b.helpers.isMobile() && (b.events.bindClick(C, "div.fr-image-container", function(b) {
                y.find(".fr-mobile-selected").removeClass("fr-mobile-selected"),
                a(b.currentTarget).addClass("fr-mobile-selected")
            }),
            y.on(b._mousedown, function() {
                y.find(".fr-mobile-selected").removeClass("fr-mobile-selected")
            })),
            b.events.bindClick(C, ".fr-insert-img", p),
            b.events.bindClick(C, ".fr-delete-img", q),
            y.on(b._mousedown + " " + b._mouseup, function(a) {
                a.stopPropagation()
            }),
            y.on(b._mousedown, "*", function() {
                b.events.disableBlur()
            }),
            A.on("scroll", i),
            b.events.bindClick(y, "i#fr-modal-more-" + b.sid, s),
            b.events.bindClick(D, "a", u),
			//open folder event
			b.events.bindClick(y, "i#fr-modal-back-btn", backFolder),
			//open local folder
			b.events.bindClick(y, ".fr-modal-body .fr-list-column i.fr-open-folder", openFolder),
			//upload file
			b.events.bindClick(y, "i#fr-modal-upload-img-btn", uploadImage),
			//new folder
			b.events.bindClick(y, "i#fr-modal-new-folder-btn", newFolder),
			//open pagination page
			b.events.bindClick(y, ".fr-modal-wrapper .fr-pagi-main ul li", openPage),
			//rename Folder
			b.events.bindClick(y, ".fr-modal-body .fr-list-column span.fr-file-name", processRenameFolder),
			//Activate Tabs
			b.events.bindClick(y, ".fr-modal-wrapper .fr-tb-item", tabClick)
			
        }
		
		function tabClick(c){
			a(document).trigger('ImageManager.activateTab',a(c.currentTarget).attr('data-tab'));
		}
		//process Rename Folder
		function processRenameFolder(c){
			if(window.ActiveTab!='local'){return false;}
			var tg_el=a(c.currentTarget),tg_name=tg_el.attr('data-name'),newName=0,allNames=[];
			$('.fr-image-container span.fr-file-name').each(function(index, element) {
               if(tg_name!=$(element).attr('data-name')){allNames.push($(element).attr('data-name'));}
            });
			do{newName=promptRename(tg_name);}while(allNames.indexOf(newName)!==-1);
			
			if(newName.length > 0 && newName !== null){
				//alert('Name:'+newName);
				b.opts.imageManagerNewFolderParams = {renameFolder:true,oldName:tg_name,newName:newName};
				if(b.opts.imageManagerFolders.length>0){b.opts.imageManagerNewFolderURL = b.opts.imageManagerNewFolderDefaultURL+b.opts.imageManagerFolders.join('/')+'/';}renameFolder($(tg_el).closest('.fr-image-container'));
			}
		}
		function promptRename(name){
			return prompt('Rename Folder:',name);
		}
		
		//open folder functions
		function openFolder(c){
			$('i#fr-modal-back-btn').css('color','#222222');
			if(a(c.currentTarget).attr('data-subtype')=='fb-folder'){
				window.stst=1;
				openFacebookAlbum(a(c.currentTarget).attr('data-url'));
			}else if(a(c.currentTarget).attr('data-subtype')=='fb-image'){
				fbClickHandle(a(c.currentTarget).closest('.fr-image-container'));
			}else{
				b.opts.imageManagerFolders.push(a(c.currentTarget).attr('data-name'));b.opts.imageManagerLoadURL=b.opts.imageManagerDefaultURL+b.opts.imageManagerFolders.join('/')+'/';
				g();
			}
		}
		
		//show fb files
		function openFacebookAlbum(aid){
			aid=aid.replace('fb','');
			if(typeof _FB.ai[aid] != 'undefined' && _FB.ai[aid].length > 0){
				//console.log('loading: '+aid);
				gN(_FB.ai[aid]);
			}
		}
		
		//handle click on fb images
		function fbClickHandle(el){
			var vS='fr-fb-selected';
			if(el.hasClass(vS)){
				el.removeClass(vS);
				$('.'+vS+' .fr-fb-selected-icon').show();
			}else{
				el.addClass(vS);
				$('.'+vS+' .fr-fb-selected-icon').show();
			}
			//alert($('.'+vS).length);
			if($('.'+vS).length>0){$('#fb-import-btn').show();}else{$('#fb-import-btn').hide();}
		}
		
		//upload image via editor into a specific folder
		function uploadImage(){
			if(window.ActiveTab!='local'){return false;}
			window.currentLocation = b.opts.imageManagerFolders;
			$('.fr-form input[type=file]').click();
			$('#edit').on('froalaEditor.image.inserted', function (e, editor, $img, response) {
				$('.fr-modal, .fr-overlay').hide();
			});
		}
		
		//create new folder via editor into a specific folder
		function newFolder(){
			if(window.ActiveTab!='local'){return false;}
			b.opts.imageManagerNewFolderParams.name=getName();
			if(b.opts.imageManagerFolders.length>0){
			b.opts.imageManagerNewFolderURL = b.opts.imageManagerNewFolderDefaultURL+b.opts.imageManagerFolders.join('/')+'/';} gNewFolder();
		}
		
		function getName(){
			var n = [],xy=1; $('.fr-image-container span.fr-file-name').each(function(index, element) { n.push($(element).text()); });for(i=1;i<n.length;i++){if(n.indexOf('New-Folder-'+i) == -1){xy=i; break;}}if(xy==1){xy=n.length+1;} return 'New-Folder-'+xy;
		}
		
		function backFolder(c){
			//alert(window.ActiveTab);
			if(b.opts.imageManagerFolders.length>0 || window.stst==1){
				a(c.currentTarget).css('color','#222222');
				if(window.ActiveTab=='fb'){
					//b.opts.imageManagerFolders.pop();
					gN(_FB.al);
					a(c.currentTarget).css('color','#c7c3c3');
				}else{
					b.opts.imageManagerFolders.pop();
					b.opts.imageManagerLoadURL = b.opts.imageManagerDefaultURL+b.opts.imageManagerFolders.join('/')+'/';
					g();
				}
			}
			if(b.opts.imageManagerFolders.length==0){
				a(c.currentTarget).css('color','#c7c3c3');
			}
		}
		
        function x() {
            if (!b.$wp && "IMG" != b.el.tagName)
                return !1
        }
        var y, z, A, B, C, D, E, F, G, H, I, J = "image_manager", K = 10, L = 11, M = 12, N = 13, O = 14, P = 15, Q = 21, R = 22, S = {};
        return S[K] = "Image cannot be loaded from the passed link.",
        S[L] = "Error during load images request.",
        S[M] = "Missing imageManagerLoadURL option.",
        S[N] = "Parsing load response failed.",
        S[O] = "Missing image thumb.",
        S[P] = "Missing image URL.",
        S[Q] = "Error during delete image request.",
        S[R] = "Missing imageManagerDeleteURL option.",
        {
            require: ["image"],
            _init: x,
            show: c,
            hide: d
        }
    }
    ,
    !a.FE.PLUGINS.image)
        throw new Error("Image manager plugin requires image plugin.");
    a.FE.DEFAULTS.imageInsertButtons.push("imageManager"),
    a.FE.RegisterCommand("imageManager", {
        title: "Browse",
        undo: !1,
        focus: !1,
        modal: !0,
        callback: function() {
            this.imageManager.show()
        },
        plugin: "imageManager"
    }),
    a.FE.DefineIcon("imageManager", {
        NAME: "folder"
    }),
    a.FE.DefineIcon("imageManagerInsert", {
        NAME: "plus"
    }),
    a.FE.DefineIcon("imageManagerDelete", {
        NAME: "trash"
    }),
	a.FE.DefineIcon("imageManagerFolderOpen", {
        NAME: "folder-open"
    })
});


/****************************************Facebook SDK***********************************/

//Facebook SDK (Image Import)
var self,FbObj = function (FB){
	this.FB = FB,this.aurl='/import-from-facebook.php?folder='+window.userFolderDefaultPath,this.FB_uid='', this.FB_accessToken='',self=this,this.selectedImages=[],this.ai=[],this.al=[],this.currentFB,this.toSubmit={};
}

FbObj.prototype.authRequest = function (){
	//self.currentFB='me';self.getAlbumsData(); return;
	this.FB.getLoginStatus(function(response) {
	  if (response.status === 'connected') {
		console.log('Logged in.');
		self.FB_uid = response.authResponse.userID;
		self.FB_accessToken = response.authResponse.accessToken;
		//self.getPhoto();
		//self.getPhotos();
		self.currentFB='me';
		self.getAlbumsData();
		self.getPages();
	  }else if (response.status === 'not_authorized') {
		console.log('not_authorized, please login');
		self._login();
	  }else{
		console.log('not logged in, please login');
		self._login();
	  }
	});
}

//prompt for login current user
FbObj.prototype._login = function (){
	this.FB.login(function(response) {
    if (response.authResponse) {
     console.log('Welcome!  Fetching your information.... ');
	 self.authRequest();
    } else {
     console.log('User cancelled login or did not fully authorize.');
    }
},{scope: 'email,user_photos,public_profile'});
}

//preparing response for print
FbObj.prototype.preResponse = function (r){
	var s;
	for(i=0;i<r.length;i++){
		this.al[i] = {type: "folder",subType: "fb-folder", url: r[i].id,thumb: "froala_editor1/img/fb-album-icon.png",name: r[i].name+'('+r[i].photo_count+')', datetime: r[i].created_time};
		this.ai[r[i].id]=[];
		if(r[i].photo_count>0){
			s=r[i].photos.data;
			for(j=0;j<s.length;j++){
				this.ai[r[i].id][j] = {type: "image",subType: "fb-image",url: s[j].images[0].source,thumb: s[j].images[(s[j].images.length-1)].source,name: s[j].id, datetime: s[j].created_time};
			}
		}
	}
	return this.al;
}

//get photos of user 000 not used
FbObj.prototype.getPhotos = function (){
	window.B.show();
	window.C.find(".fr-list-column").empty();
	this.FB.api(
	  '/me',
	  'GET',
	  {"fields":"name,photos.limit(300){images,album,name}",access_token:this.FB_accessToken},
	  function(response) {
		  console.log('user images received');
		  console.log(JSON.stringify(response));
		  //self.savePics(response);
	  }
	);
}

//get user own albums with photos
FbObj.prototype.getAlbumsData = function(i){
	window.B.show();
	window.C.find(".fr-list-column").empty();
	this.al=[];this.ai=[];
	this.FB.api(
	  '/'+this.currentFB+'/albums',
	  'GET',
	  {"fields":"photo_count,name,created_time,photos.limit(300){created_time,name,images}"},
	  function(response) {
		  //console.log(response);
		  $(document).trigger('ImageManager.LoadFacebookImages',[self.preResponse(response.data)]);
	  }
	);
}

//get user pages
FbObj.prototype.getPages = function(){
	this.FB.api(
	  '/me/accounts',
	  'GET',
	  {"fields":"name,app_id"},
	  function(response) {
		  //Insert your code here
		  //console.log('All Pages');
		  //console.log(response);
		  self.showPages(JSON.parse(JSON.stringify(response)));
		  //self.getFromPage(data.data[1].id);
	  }
	);
}

//show user pages in list
FbObj.prototype.showPages = function(r){
	var items = '<option value="me">My Account</option>';
	for(i=0;i<r.data.length;i++){
		items += '<option value="'+r.data[i].id+'">'+r.data[i].name+'</option>';
	}
	$('#fr-fb-accounts-list').html(items).css('display','inline-block');
}

//get albums from pages & their images 000 not used
FbObj.prototype.getFromPage = function(pid){
	this.FB.api(
	  '/'+pid+'/albums',
	  'GET',
	  {"fields":"cover_photo,photo_count,photos.limit(300){images,id}"},
	  function(response) {
		 console.log('Page Photos');
		 console.log(JSON.stringify(response));
		 
	  }
	);
}

//save pics to local storage 
FbObj.prototype.savePics = function (){
	console.log(JSON.stringify(this.toSubmit));
	$.ajax({
		url: this.aurl,
		type:"POST",
		data:this.toSubmit,
		dataType:"json",
		beforeSend: function(){
			//console.log(self.toSubmit);
			$('#fb-import-btn').text('Saving...');
		},
		success: function(da){
			//console.log(da);
			$(document).trigger('ImageManager.OpenFacebookImages');
			$('#fb-import-btn').text('Images Imported Successfully').delay(200).text('Import');
		},
		error:function(){
			//console.log('ajax error');
			$('#fb-import-btn').text('Problem in Saving Images').delay(200).text('Import');
		}
	});
}

//FB API
var _FB;
function FBinit(){
	FB.init({appId:'853378044801613',xfbml:true,version:'v2.8'});
	_FB = new FbObj(FB);
	_FB.authRequest();
}




/****************************************IG SDK***********************************/
/****************************************IG SDK***********************************/
/****************************************IG SDK***********************************/
//Instagram SDK (Image Import)
var IGself,IGObj = function (){
	this.at,this.aju='http://'+location.hostname+'/froala_php_sdk/insta-sdk.php',IGself=this,this.ig_images,this.toSubmit={},this.aurl='/import-from-facebook.php?type=ig&folder='+window.userFolderDefaultPath;
}

IGObj.prototype.authRequest = function (){
	//this._login();
	this.getUserMedia();
}

//prompt for login current user
IGObj.prototype._login = function (){
	$.get(this.aju,'clogin',function(response){
		r = JSON.parse(response);
		if(r.status=='success'){
			IGself.getAccessToken();
		}else{
			window.open(r.link,'_self');
		}
	});
}

IGObj.prototype.getAccessToken = function (){
	$.get(this.aju,'access_token',function(response){
		//alert('access token response');
		//console.log(response);
		r = JSON.parse(response);
		if(r.status=='success'){
			IGself.getUserMedia();
		}else{
			
		}
	});
}
IGObj.prototype.getUserMedia = function (){
	window.B.show();
	window.C.find(".fr-list-column").empty();
	$.get(this.aju,'user_media=true&u'+encodeURIComponent(location.href),function(response){
		//alert('user media response');
		//console.log(response);
		r = JSON.parse(response);
		if(r.status=='error'){
			switch(r.code){
				case 100:
					console.log('Warning: not logged in redirecting...');
					window.open(r.link,'_self');
					break;
				default:
					console.log('Error: '+r.message);
					break;
			}
		}else if(r.status=='success'){
			$(document).trigger('ImageManager.LoadInstaImages',[r.data]);
		}else{
			console.log('Error: Unknown error occured while fetching data from insta');
			$(document).trigger('ImageManager.OpenFacebookImages',[r.data]);
		}
	});
}

//save pics to local storage 
IGObj.prototype.savePics = function (){
	//console.log(JSON.stringify(this.toSubmit));
	$.ajax({
		url: this.aurl,
		type:"POST",
		data:this.toSubmit,
		dataType:"json",
		beforeSend: function(){
			//console.log(self.toSubmit);
			$('#fb-import-btn').text('Saving...');
		},
		success: function(da){
			//console.log(da);
			$(document).trigger('ImageManager.OpenFacebookImages');
			$('#fb-import-btn').text('Images Imported Successfully').delay(200).text('Import');
		},
		error:function(){
			//console.log('ajax error');
			$('#fb-import-btn').text('Problem in Saving Images').delay(200).text('Import');
		}
	});
}



//IG API
var _IG;
function IGinit(){
	_IG = new IGObj();
	_IG.getUserMedia();
}

$(document).ready(function(e) {
    
	$(document).on('change','#fr-fb-accounts-list',function(){
		if(typeof _FB != 'undefined'){
			_FB.currentFB=$(this).val();
			_FB.getAlbumsData();
		}else{
			FBinit();
		}
	});
	
	$(document).on('click','#fb-import-btn',function(){
		if($('.fr-fb-selected').length>0){
			var Obj2 = new Array();
			var sd = new Array();
			$('.fr-fb-selected').each(function(index, element) {
				if(window.ActiveTab=='fb'){
					_FB.toSubmit[index] = {url: btoa($(element).find('img[data-url]').attr('data-url')),name: btoa($(element).find('img[data-url]').attr('data-name')+'.jpg')};
				}else{
					_IG.toSubmit[index] = {url: btoa($(element).find('img[data-url]').attr('data-url')),name: btoa($(element).find('img[data-url]').attr('data-name')+'.jpg')};
				}
			});
			if(window.ActiveTab=='fb'){_FB.savePics();}else{_IG.savePics();}
				
		}else{
			console.log('no images to import');
		}
	});
	
	//Images Check all images fb
	$(document).on('click',"#fr-check-all-btn",function(){
		if(window.ActiveTab=='local') return false;
		if($(this).hasClass('fa-circle')){
			
			$('.fr-image-list .fr-image-container[data-type=image]').addClass('fr-fb-selected');
			if($('.fr-image-list .fr-image-container.fr-fb-selected').length>0){$('#fb-import-btn').show();$(this).addClass('fa-check-circle').removeClass('fa-circle');}
			
		}else{
			$('#fb-import-btn').hide();
			$('.fr-image-list .fr-image-container[data-type=image]').removeClass('fr-fb-selected');
			$(this).removeClass('fa-check-circle').addClass('fa-circle');
		}
		/*$('.fr-image-list .fr-image-container[data-type=image]').each(function(index, element) {
                $(element).find('.fr-open-folder').trigger('click');
         });*/
	});

});

