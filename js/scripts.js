//   all ------------------
function initTheside() {
    "use strict";
    $(window).on("load", function () {
        firstLoad();
    });
    function firstLoad() {
        TweenMax.to($(".loader2"), 0.9, {
            force3D: true,
            bottom: "100%",
            ease: Expo.easeInOut,
            onComplete: function () {
                initpageloadAnimation();
            }
        });
        var chdpt = $(".content-holder").data("pagetitle");
    }
    //   Background image ------------------
    var a = $(".bg");
    a.each(function (a) {
        if ($(this).attr("data-bg")) $(this).css("background-image", "url(" + $(this).data("bg") + ")");
    });
    //   clone ------------------
    $.fn.duplicate = function (a, b) {
        var c = [];
        for (var d = 0; d < a; d++) $.merge(c, this.clone(b).get());
        return this.pushStack(c);
    };

    //   appear------------------
    $(".stats").appear(function () { $(".num").countTo(); });

    // Share ------------------
    $(".share-container").share({ networks: ['facebook', 'pinterest', 'googleplus', 'twitter', 'linkedin'] });
    var shrcn = $(".share-container"),
        swra = $(".share-wrapper"),
        clsh = $(".close-share-btn"),
        shic = $(".share-icon"),
        ssbtn = $(".showshare");

    function showShare() {
        shrcn.removeClass("isShare");
        TweenMax.to(swra, 0.6, {
            force3D: false, width: "350px", ease: Expo.easeInOut,
            onComplete: function () {
                TweenMax.to(clsh, 0.4, { force3D: true, top: "0", opacity: "1" });
                shic.each(function (a) {
                    var boi = $(this);
                    setTimeout(function () { TweenMax.to(boi, 1.0, { force3D: false, opacity: "1" }); }, 130 * a);
                });
            }
        });
    }
    function hideShare() {
        shrcn.addClass("isShare");
        TweenMax.to($(".share-icon"), 1.0, { force3D: false, opacity: "0" });
        TweenMax.to(clsh, 0.4, {
            force3D: true, top: "-60px", opacity: "0",
            onComplete: function () {
                TweenMax.to(swra, 0.6, { force3D: false, delay: 0.2, width: "0", ease: Expo.easeInOut });
            }
        });
    }

    clsh.on("click", function () { hideShare(); });
    ssbtn.on("click", function () {
        if ($(".share-container").hasClass("isShare")) showShare();
        else hideShare();
    });

    //   Contact form------------------
    $("#contactform").submit(function () {
        var a = $(this).attr("action");
        $("#message").slideUp(750, function () {
            $("#message").hide();
            $("#submit").attr("disabled", "disabled");
            $.post(a, {
                name: $("#name").val(), email: $("#email").val(),
                phone: $("#phone").val(), subject: $('#subject').val(),
                comments: $("#comments").val(), verify: $('#verify').val()
            }, function (a) {
                document.getElementById("message").innerHTML = a;
                $("#message").slideDown("slow");
                $("#submit").removeAttr("disabled");
                if (null != a.match("success")) $("#contactform").slideDown("slow");
            });
        });
        return false;
    });
    $("#contactform input, #contactform textarea").keyup(function () { $("#message").slideUp(1500); });
    $('.chosen-select').selectbox();

    //   scroll to------------------
    $(".custom-scroll-link").on("click", function () {
        var a = $(".main-header").height();
        if (location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") || location.hostname === this.hostname) {
            var b = $(this.hash);
            b = b.length ? b : $("[name=" + this.hash.slice(1) + "]");
            if (b.length) {
                $("html,body").animate({ scrollTop: b.offset().top - a }, { queue: false, duration: 1200, easing: "easeInOutExpo" });
                return false;
            }
        }
    });
    $(".to-top").on("click", function (a) {
        a.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, 800);
        return false;
    });
    
    var $window = $(window);
    $window.on("scroll", function (a) {
        var a = $(document).height(), b = $(window).height(), c = $(window).scrollTop();
        $(".progress-bar").css({ width: c / (a - b) * 100 + "%" });

        if (c > 20) {
            $(".main-header").addClass("ei-header-scrolled");
        } else {
            $(".main-header").removeClass("ei-header-scrolled");
        }
    });

    // cursor ball ------------------
    var mouse = { x: 0, y: 0 }, pos = { x: 0, y: 0 }, ratio = 0.15, active = false;
    var ball = document.querySelector('.element');
    if (ball) {
        TweenLite.set(ball, { xPercent: -50, yPercent: -50 });
        document.addEventListener("mousemove", function (e) {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            mouse.x = e.pageX;
            mouse.y = e.pageY - scrollTop;
        });
        TweenMax.ticker.addEventListener("tick", function () {
            if (!active) {
                pos.x += (mouse.x - pos.x) * ratio;
                pos.y += (mouse.y - pos.y) * ratio;
                TweenMax.set(ball, { x: pos.x, y: pos.y });
            }
        });
    }

    //  menu ------------------
    $(".sliding-menu li a.nav").parent("li").addClass("submen-dec");
    $(".nav-scroll-bar-wrap").niceScroll({
        cursorwidth: "0px", cursorborder: "none", cursorborderradius: "0px"
    });

    var nbw = $(".nav-button"),
        nhw = $(".nav-holder"),
        nho = $(".nav-overlay");

    function showMenu() {
        nho.fadeIn(500);
        TweenMax.to(nhw, 0.6, { force3D: false, right: "0", ease: Expo.easeInOut });
        nhw.removeClass("but-hol");
        nbw.addClass("cmenu");
    }
    function hideMenu() {
        TweenMax.to(nhw, 0.6, { force3D: false, right: "-150%", ease: Expo.easeInOut });
        nhw.addClass("but-hol");
        nbw.removeClass("cmenu");
        nho.fadeOut(500);
    }

    nbw.on("click", function () {
        if (nhw.hasClass("but-hol")) showMenu();
        else hideMenu();
    });
    nho.on("click", function () { hideMenu(); });

    // ── EUROING: Проекти accordion ──────────────────────────────
    // Binds directly on the <li> at capture phase, before jQuery's
    // delegated AJAX handler on $(document) can intercept it.
    var subParent = document.querySelector('.ei-mn-has-sub');
    if (subParent) {
        var subToggle = subParent.querySelector('.ei-mn-sub-toggle');
        if (subToggle) {
            subToggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                subParent.classList.toggle('open');
            }, true); // <-- capture phase: fires before any bubbling handler
        }
    }

    // ── EUROING: ✕ close button inside panel ───────────────────
    var closeX = document.querySelector('.ei-mn-close-x');
    if (closeX) {
        closeX.addEventListener('click', function () {
            hideMenu();
        });
    }
}

function initpageloadAnimation() {
    setTimeout(function () {
        $(".bot-element").each(function (a) {
            var b = $(this);
            setTimeout(function () {
                TweenMax.to(b, 1.2, { force3D: true, bottom: "0", ease: Expo.easeInOut });
            }, 230 * a);
        });
        $(".hlaf-slider-pag .swiper-pagination-bullet").each(function (ac) {
            var bp = $(this);
            setTimeout(function () {
                TweenMax.to(bp, 0.8, { force3D: true, opacity: "1", top: "0", ease: Expo.easeInOut });
            }, 130 * ac);
        });
    }, 400);
}

//   load animation------------------
function contentAnimShow() {
    $(".lg-backdrop , .lg-outer").remove();
    $(".nav-button").removeClass("cmenu");
    $(".page-load").fadeIn(1);
    TweenMax.to($(".page-load_bg2"), 0.8, { force3D: true, right: "0", ease: Expo.easeInOut });
    TweenMax.to($(".page-load_bg"), 0.9, { force3D: true, right: "0", delay: 0.1, ease: Expo.easeInOut });
    setTimeout(function () {
        $("html, body").animate({ scrollTop: 0 }, { queue: true, duration: 10 });
    }, 1000);
}

function contentAnimHide() {
    var chdpt = $(".content-holder").data("pagetitle");
    setTimeout(function () { initpageloadAnimation(); }, 1000);
    TweenMax.to($(".page-load_bg"), 0.8, { force3D: true, left: "100%", ease: Expo.easeInOut });
    TweenMax.to($(".page-load_bg2"), 0.9, {
        force3D: true, left: "100%", delay: 0.1, ease: Expo.easeInOut,
        onComplete: function () {
            setTimeout(function () {
                $(".page-load").fadeOut(1);
                TweenMax.to($(".page-load_bg2 , .page-load_bg"), 0.0, { force3D: true, left: "0", right: "100%" });
            }, 10);
        }
    });
}

$("<div class='page-load'><div class='page-load_bg'><div class='loader loader_each'><span></span></div></div><div class='page-load_bg2'></div></div>").appendTo("#main");

//   Init Ajax------------------
$(function () {
    $.coretemp({ reloadbox: "#wrapper", outDuration: 700, inDuration: 200 });
    readyFunctions();
    $(document).on({ ksctbCallback: function () { readyFunctions(); } });
});

//   Init All Functions------------------
function readyFunctions() {
    initTheside();
}