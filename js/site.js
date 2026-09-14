(function () {
    'use strict';

    const en = document.documentElement.lang === 'en';
    const text = (mk, english) => en ? english : mk;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopQuery = window.matchMedia('(min-width: 1101px)');

    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback, { once: true });
        } else {
            callback();
        }
    }

    const loaderStartedAt = performance.now();
    let loaderHideRequested = false;

    function hideLoader() {
        const loader = document.querySelector('.loader2');
        if (!loader || loader.classList.contains('is-hidden') || loaderHideRequested) return;
        loaderHideRequested = true;

        // Give the compact brand mark enough time to read without holding up the page.
        const minimumVisibleTime = reducedMotion.matches ? 0 : 560;
        const remaining = Math.max(0, minimumVisibleTime - (performance.now() - loaderStartedAt));

        window.setTimeout(function () {
            loader.classList.add('is-hidden');
            window.setTimeout(function () { loader.remove(); }, reducedMotion.matches ? 0 : 760);
        }, remaining);
    }

    // Never let a slow image, font or third-party iframe hold the page hostage.
    window.setTimeout(hideLoader, 1600);

    function initBackgrounds() {
        document.querySelectorAll('[data-bg]').forEach(function (element) {
            const source = element.getAttribute('data-bg');
            if (source) element.style.backgroundImage = 'url("' + source.replace(/"/g, '\\"') + '")';
        });
    }

    function getFocusable(container) {
        if (!container) return [];
        return Array.from(container.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(function (element) {
            return !element.hidden && !element.closest('[inert]') && element.getClientRects().length > 0 && element.getAttribute('aria-hidden') !== 'true';
        });
    }

    function initMobileMenu() {
        const openButton = document.querySelector('.nav-button');
        const closeButton = document.querySelector('.ei-mn-close-x');
        const panel = document.querySelector('.nav-holder');
        const overlay = document.querySelector('.nav-overlay');
        if (!openButton || !panel || !overlay) return;

        function setOpen(open) {
            if (open && desktopQuery.matches) return;

            panel.classList.toggle('is-open', open);
            overlay.classList.toggle('is-open', open);
            openButton.classList.toggle('cmenu', open);
            openButton.setAttribute('aria-expanded', String(open));
            openButton.setAttribute('aria-label', open ? text('Затвори мени', 'Close menu') : text('Отвори мени', 'Open menu'));
            panel.setAttribute('aria-hidden', String(!open));

            // Important: do not modify body/html overflow, padding, margins,
            // width or scroll position. The original menu never shifted the page.
            if (open) { panel.removeAttribute('inert'); (closeButton || getFocusable(panel)[0])?.focus(); }
            else { if (panel.contains(document.activeElement)) openButton.focus(); panel.setAttribute('inert', ''); }
        }

        openButton.addEventListener('click', function () {
            setOpen(openButton.getAttribute('aria-expanded') !== 'true');
        });

        if (closeButton) {
            closeButton.addEventListener('click', function () { setOpen(false); });
        }

        overlay.addEventListener('click', function () { setOpen(false); });

        panel.querySelectorAll('a[href]:not(.ei-mn-sub-toggle)').forEach(function (link) {
            link.addEventListener('click', function () { setOpen(false); });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Tab' && panel.getAttribute('aria-hidden') === 'false') {
                const items = getFocusable(panel); const first = items[0], last = items[items.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
            }
            if (event.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') {
                setOpen(false);
            }
        });

        desktopQuery.addEventListener('change', function (event) {
            if (event.matches) setOpen(false);
        });

        setOpen(false);
    }

    function initNavigationDropdowns() {
        document.querySelectorAll('.ei-nav-has-dropdown').forEach(function (item) {
            const toggle = item.querySelector('.ei-nav-dropdown-toggle');
            const dropdown = item.querySelector('.ei-nav-dropdown');
            if (!toggle || !dropdown) return;

            function setExpanded(expanded) {
                if (expanded) {
                    document.querySelectorAll('.ei-nav-has-dropdown.is-open').forEach(function (other) {
                        if (other === item) return;
                        other.classList.remove('is-open');
                        other.querySelector('.ei-nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
                        other.querySelector('.ei-nav-dropdown').setAttribute('inert', '');
                    });
                }
                toggle.setAttribute('aria-expanded', String(expanded));
                item.classList.toggle('is-open', expanded);
                if (expanded) dropdown.removeAttribute('inert');
                else dropdown.setAttribute('inert', '');
            }

            let closeTimer = 0;
            toggle.addEventListener('click', function () {
                setExpanded(toggle.getAttribute('aria-expanded') !== 'true');
            });
            // Touch must use the button's click; synthesized mouse events can
            // otherwise open and immediately close the same disclosure.
            item.addEventListener('pointerenter', function (event) {
                window.clearTimeout(closeTimer);
                if (event.pointerType === 'mouse' && desktopQuery.matches) setExpanded(true);
            });
            item.addEventListener('pointerleave', function (event) {
                if (event.pointerType === 'mouse' && desktopQuery.matches) closeTimer = window.setTimeout(function () {
                    if (!item.matches(':hover') && !item.contains(document.activeElement)) setExpanded(false);
                }, 180);
            });
            item.addEventListener('focusout', function (event) {
                if (event.relatedTarget && !item.contains(event.relatedTarget) && !item.matches(':hover')) setExpanded(false);
            });
            toggle.addEventListener('keydown', function (event) {
                if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
                event.preventDefault();
                setExpanded(true);
                const links = getFocusable(dropdown);
                const target = event.key === 'ArrowUp' ? links[links.length - 1] : links[0];
                if (target) target.focus();
            });
            document.addEventListener('click', function (event) {
                if (!item.contains(event.target)) setExpanded(false);
            });
            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
                    event.preventDefault();
                    setExpanded(false);
                    toggle.focus();
                }
            });
            desktopQuery.addEventListener('change', function () { setExpanded(false); });
            setExpanded(false);
        });

        document.querySelectorAll('.ei-mn-has-sub').forEach(function (item) {
            const toggle = item.querySelector('.ei-mn-sub-toggle');
            const submenu = item.querySelector('.ei-mn-sub');
            if (!toggle || !submenu) return;
            toggle.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                const expanded = toggle.getAttribute('aria-expanded') !== 'true';
                toggle.setAttribute('aria-expanded', String(expanded));
                submenu.setAttribute('aria-hidden', String(!expanded));
                if (expanded) submenu.removeAttribute('inert');
                else submenu.setAttribute('inert', '');
                item.classList.toggle('open', expanded);
            });
        });
    }

    function initSmoothAnchors() {
        document.addEventListener('click', function (event) {
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;
            const hash = link.getAttribute('href');
            if (!hash || hash === '#') return;
            let target;
            try { target = document.querySelector(hash); } catch (_) { return; }
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
            if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
            history.replaceState(null, '', hash);
        });
    }

    function initHeaderState() {
        const header = document.querySelector('header.main-header');
        if (!header) return;
        const candidates = Array.from(document.querySelectorAll('.content, .ei-home, .es-page, .ec-page'));
        const scroller = candidates.find(function (element) {
            const style = window.getComputedStyle(element);
            return /(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 10;
        });
        const source = scroller || window;
        let scheduled = false;

        function update() {
            scheduled = false;
            const y = source === window ? window.scrollY : source.scrollTop;
            header.classList.toggle('ei-header-scrolled', y > 40);
        }
        function onScroll() {
            if (scheduled) return;
            scheduled = true;
            window.requestAnimationFrame(update);
        }
        source.addEventListener('scroll', onScroll, { passive: true });
        update();
    }

    function initHeroSlideshows() {
        document.querySelectorAll('.ei-hero').forEach(function (hero) {
            const slides = Array.from(hero.querySelectorAll('.ei-hero-slide'));
            const thumbs = Array.from(hero.querySelectorAll('.ei-hero-thumb'));
            const thumbNavigation = hero.querySelector('.ei-hero-thumbs');
            const thumbNavigationVisible = Boolean(thumbNavigation && window.getComputedStyle(thumbNavigation).display !== 'none');
            if (slides.length < 2 || !thumbs.length) return;

            if (!thumbNavigationVisible && thumbNavigation) {
                thumbNavigation.setAttribute('aria-hidden', 'true');
                thumbNavigation.removeAttribute('role');
                thumbNavigation.removeAttribute('aria-label');
                thumbs.forEach(function (thumb) {
                    thumb.removeAttribute('role');
                    thumb.removeAttribute('tabindex');
                    thumb.removeAttribute('aria-label');
                    thumb.removeAttribute('aria-selected');
                });
            }

            const counter = hero.querySelector('#eiSlideNum, [data-slide-number]');
            const duration = 6000;
            let current = Math.max(0, slides.findIndex(function (slide) { return slide.classList.contains('active'); }));
            let timer = 0;
            let progressTimer = 0;
            let paused = false;
            function pad(number) { return String(number).padStart(2, '0'); }

            function clearTimers() {
                window.clearTimeout(timer);
                window.clearInterval(progressTimer);
            }

            function activate(index, focusThumb) {
                clearTimers();
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, position) {
                    slide.classList.toggle('active', position === current);
                    slide.setAttribute('aria-hidden', String(position !== current));
                });
                thumbs.forEach(function (thumb, position) {
                    const active = position === current;
                    thumb.classList.toggle('active', active);
                    if (thumbNavigationVisible) {
                        thumb.setAttribute('aria-selected', String(active));
                        thumb.setAttribute('tabindex', active ? '0' : '-1');
                    }
                    const progress = thumb.querySelector('.ei-hero-thumb-progress');
                    if (progress) progress.style.width = active ? '0%' : '';
                });
                if (counter) counter.textContent = pad(current + 1);
                if (focusThumb && thumbNavigationVisible && thumbs[current]) thumbs[current].focus();
                schedule();
            }

            function schedule() {
                if (paused || reducedMotion.matches || document.hidden) return;
                const progress = thumbs[current] && thumbs[current].querySelector('.ei-hero-thumb-progress');
                const started = performance.now();
                progressTimer = window.setInterval(function () {
                    if (!progress) return;
                    progress.style.width = Math.min(100, ((performance.now() - started) / duration) * 100) + '%';
                }, 100);
                timer = window.setTimeout(function () { activate(current + 1, false); }, duration);
            }

            function setPaused(value) {
                paused = value;
                clearTimers();
                if (!paused) schedule();
            }

            if (thumbNavigationVisible) thumbs.forEach(function (thumb, index) {
                thumb.setAttribute('role', 'tab');
                thumb.addEventListener('click', function () { activate(index, false); });
                thumb.addEventListener('keydown', function (event) {
                    let next = null;
                    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index + 1;
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index - 1;
                    if (event.key === 'Home') next = 0;
                    if (event.key === 'End') next = thumbs.length - 1;
                    if (event.key === 'Enter' || event.key === ' ') next = index;
                    if (next === null) return;
                    event.preventDefault();
                    activate(next, true);
                });
            });

            document.addEventListener('visibilitychange', function () { setPaused(document.hidden); });
            reducedMotion.addEventListener('change', function () { activate(current, false); });
            activate(current, false);
        });
    }

    function initStats() {
        const section = document.querySelector('.ei-stats');
        if (!section) return;
        const items = Array.from(section.querySelectorAll('.ei-stat-item strong'));
        const values = items.map(function (element) {
            return {
                element: element,
                target: Number.parseInt(element.textContent, 10) || 0,
                suffix: element.querySelector('sup') ? element.querySelector('sup').textContent : ''
            };
        });
        let done = false;

        function reveal() {
            if (done) return;
            done = true;
            values.forEach(function (item) {
                if (reducedMotion.matches) return;
                const start = performance.now();
                const duration = 900;
                function frame(now) {
                    const progress = Math.min(1, (now - start) / duration);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    item.element.innerHTML = Math.round(item.target * eased) + (item.suffix ? '<sup>' + item.suffix + '</sup>' : '');
                    if (progress < 1) window.requestAnimationFrame(frame);
                }
                item.element.innerHTML = '0' + (item.suffix ? '<sup>' + item.suffix + '</sup>' : '');
                window.requestAnimationFrame(frame);
            });
        }

        if (!('IntersectionObserver' in window)) { reveal(); return; }
        const observer = new IntersectionObserver(function (entries) {
            if (entries.some(function (entry) { return entry.isIntersecting; })) {
                reveal();
                observer.disconnect();
            }
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
        observer.observe(section);
    }

    function initLazyMaps() {
        document.querySelectorAll('iframe[data-src]').forEach(function (iframe) {
            function load() {
                if (!iframe.dataset.src) return;
                iframe.src = iframe.dataset.src;
                iframe.removeAttribute('data-src');
                iframe.setAttribute('aria-busy', 'false');
            }
            if (!('IntersectionObserver' in window)) { load(); return; }
            const observer = new IntersectionObserver(function (entries) {
                if (entries.some(function (entry) { return entry.isIntersecting; })) {
                    load();
                    observer.disconnect();
                }
            }, { rootMargin: '500px 0px' });
            observer.observe(iframe);
        });
    }

    function initLanguageMenu() {
        document.querySelectorAll('.ei-language-menu').forEach(function (menu) {
            document.addEventListener('click', function (event) {
                if (!menu.contains(event.target)) menu.open = false;
            });
            menu.addEventListener('keydown', function (event) {
                if (event.key === 'Escape' && menu.open) {
                    event.preventDefault(); menu.open = false; menu.querySelector('summary').focus();
                }
            });
        });
    }

    function initScrollTop() {
        const button = document.querySelector('.ei-scroll-top');
        if (!button) return;
        let scroller = window;
        let scheduled = false;
        function update(event) {
            if (event && event.target !== document && event.target instanceof Element && event.target.scrollHeight > event.target.clientHeight && getComputedStyle(event.target).overflowY.match(/auto|scroll/)) scroller = event.target;
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(function () {
                scheduled = false;
                button.hidden = (scroller === window ? window.scrollY : scroller.scrollTop) < 200;
            });
        }
        document.addEventListener('scroll', update, {capture: true, passive: true});
        window.addEventListener('scroll', update, {passive: true});
        button.addEventListener('click', function () {
            scroller.scrollTo({top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth'});
            const target = document.querySelector('.header-logo') || document.querySelector('h1');
            if (target) { if (!target.matches('a,button')) target.tabIndex = -1; target.focus({preventScroll:true}); }
        });
        update();
    }

    ready(function () {
        initScrollTop();
        initLanguageMenu();
        initBackgrounds();
        hideLoader();
        initMobileMenu();
        initNavigationDropdowns();
        initSmoothAnchors();
        initHeaderState();
        initHeroSlideshows();

        initLazyMaps();
    });
}());
