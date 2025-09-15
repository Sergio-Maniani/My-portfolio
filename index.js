document.addEventListener("DOMContentLoaded", function () {
    const contents = {
        en: document.querySelector('.lang-en'),
        ru: document.querySelector('.lang-ru'),
        ua: document.querySelector('.lang-ua')
    };

    // Переключение языка
    function switchLang(lang) {
        Object.keys(contents).forEach(key => {
            contents[key].classList.toggle('active', key === lang);
        });

        localStorage.setItem('lang', lang);

        initScripts(); // Инициализируем обработчики заново
    }

    // Обработка одного .dropdown внутри активной секции
    function setupDropdowns() {
    const active = document.querySelector('.lang.active');
    if (!active) return;

    const dropdowns = active.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown-button');
        const menu = dropdown.querySelector('.dropdown-menu');

        if (!button || !menu) return;

        // Удаляем старые обработчики перед назначением новых
        const newButton = button.cloneNode(true);
        const newMenu = menu.cloneNode(true);

        button.replaceWith(newButton);
        menu.replaceWith(newMenu);

        // Назначаем обработчик кнопке
        newButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Не даст сработать document click
            newMenu.classList.toggle('hidden');
        });

        // Обработчики ссылок
        newMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = link.getAttribute('data-lang');
                switchLang(lang);
                newMenu.classList.add('hidden');
            });
        });

        // Закрытие меню при клике вне dropdown
        document.addEventListener('click', function handler(e) {
            if (!dropdown.contains(e.target)) {
                newMenu.classList.add('hidden');
                document.removeEventListener('click', handler); // удаляем после срабатывания
            }
        });
    });
}


    // Главная функция инициализации всех скриптов
    function initScripts() {
        const activeSection = document.querySelector('.lang.active');
        if (!activeSection) return;
        const $section = $(activeSection);

        // Слайдер
        if ($section.find('.slider').length) {
            $section.find('.slider').not('.slick-initialized').slick({
                dots: false,
                arrows: true,
                slidesToShow: 3,
                slidesToScroll: 2,
                prevArrow: '<div class="arrow-prev"><i class="fa fa-arrow-left"></i></div>',
                nextArrow: '<div class="arrow-next"><i class="fa fa-arrow-right"></i></div>',
                infinite: true
            });
        }

        // Меню (show/hide)
        $(".show-menu").off().on("click", function () {
            $(".hidden-menu").animate({ right: 0 }, 500);
        });

        $(".hidden-menu .close").off().on("click", function () {
            $(".hidden-menu").animate({ right: -300 }, 500);
        });

        // Список дел
        if (!window.caseCounters) window.caseCounters = { en: 0, ru: 0, ua: 0 };

        // Определяем текущий язык из active секции
        const currentLang = Object.keys(contents).find(key => contents[key].classList.contains('active'));

        // Находим элементы только внутри активной секции
        const $form = $section.find(".cases-form");
        const $addBtn = $section.find(".add-btn");
        const $showBtn = $section.find(".show-btn");
        const $cases = $section.find(".cases");
        const $casesInfo = $section.find(".cases-info");

        $addBtn.off().on("click", function () {
            const form = $form[0];
            if (!form || form.case.value.trim().length === 0) return false;

            window.caseCounters[currentLang]++;

            $casesInfo.fadeIn(200).delay(2000).fadeOut(200);

            const newCase = "<div class='newCase'>" +
                "<span class='task-number'>" + 
                "<i class='fa-regular fa-pen-to-square'>" + "</i> #" +
                 window.caseCounters[currentLang] + ": </span>" +
                "<span class='name'>" + form.case.value + "</span>" +
                "</div>";

            $cases.append(newCase);
            form.case.value = "";
        });

        $showBtn.off().on("click", function () {
            $section.find(".newCase").slideDown();
        });

        // Прокрутка якорей
        $('.scroll-link').off().on('click', function (e) {
            e.preventDefault();
            const targetSelector = $(this).data('target');
            const $target = $(targetSelector).first();
            if ($target.length) {
                $('html, body').animate({
                    scrollTop: $target.offset().top - 90
                }, 800);
            }
        });

        // Кнопка "вверх"
        $('.up-btn').off().on("click", function () {
            $("html, body").animate({ scrollTop: 0 }, "slow");
        });

        // Скролл для header
        $(document).off("scroll").on("scroll", function () {
            if ($(document).width() < 1024) return false;
            if ($(document).scrollTop() > $('.full-page').height() / 2)
                $("header").addClass("fixed");
            else
                $("header").removeClass("fixed");
        });

        // Обработчики dropdown
        setupDropdowns();
    }

    // Загружаем язык
    const savedLang = localStorage.getItem('lang');
    if (savedLang && contents[savedLang]) {
        switchLang(savedLang);
    } else {
        switchLang('en');
    }
});
