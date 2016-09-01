$(document).ready(function() {
    $('.phone-mask').mask("+7 (999) 999-99-99");
    $('.focus').focus(function() {
        var val = $(this).val();
        var hidden = $(this).parent('.field').find('.hidden').val();
        if (val == hidden) {
            $(this).val('');
        }
    }).focusout(function() {
        var val = $(this).val();
        var hidden = $(this).parent('.field').find('.hidden').val();
        if (val.length == 0) {
            $(this).val(hidden);
        }
    });

    // Объект для которого будет применён эффект
    $(".pulse").click(function(e) {
        var ripple = $(this);
        // визуальный элемент эффекта
        if(ripple.find(".effekt").length == 0) {
            ripple.append("<span class='effekt'></span>");
        }
        var efekt = ripple.find(".effekt");
        efekt.removeClass("replay");
        if(!efekt.height() && !efekt.width())
        {
            var d = Math.max(ripple.outerWidth(), ripple.outerHeight());
            efekt.css({height: d/5, width: d/5});// Определяем размеры элемента эффекта
        }
        var x = e.pageX - ripple.offset().left - efekt.width()/2;
        var y = e.pageY - ripple.offset().top - efekt.height()/2;
        efekt.css({
            top: y+'px',
            left: x+'px'
        }).addClass("replay");
    });

    //Дисконтная карта
    $('.card button').click(function() {
        var cardMail = $(this).parents('.field').find('input[name=email]').val();
        var hiddenMail = $(this).parents('.field').find('input[type=hidden]').val();

        if (cardMail == hiddenMail) {
            $(this).parents('.field').find('input[name=email]').addClass('error');
            return false;
        }
        $.ajax({
            url: 'site/index',
            type: 'get',
            dataType: 'json',
            data: {cardMail: cardMail},
            success: function (response) {
                if (response.status == true) {
                    $('.card .form *:not(.close)').css('visibility', 'hidden');
                    $('.card .form .success, .card .form .close').css('display', 'block');
                    $('.card .form .success span').css('visibility', 'visible')
                }
            },
            error: function () {
            }
        });
    });

    //Вызов мастера
    $('.master button').click(function() {
        var errors = false;
        var masterName = $(this).parents('.form').find('input[name=name]').val();
        var masterPhone = $(this).parents('.form').find('input[name=phone]').val();
        var hiddenName = $(this).parents('.form').find('input[type=hidden]').val();


        if (masterName == hiddenName) {
            $(this).parents('.form').find('input[name=name]').addClass('error');
            errors = true;
        }
        if (masterPhone.length == 0) {
            $(this).parents('.form').find('input[name=phone]').addClass('error');
            errors = true;
        }

        if (errors) {
            return false;
        }
        $('.call-master .form *:not(.close):not(.loading):not(.loading img)').css('visibility', 'hidden');
        $('.call-master .call .form .loading').css('display', 'block');

        $.ajax({
            url: 'site/index',
            type: 'get',
            dataType: 'json',
            data: {masterName: masterName, masterPhone: masterPhone},
            success: function (response) {
                if (response.status == true) {
                    $('.call-master .form .success, .call-master .form .close').css('display', 'block');
                    $('.call-master .call .form .loading').css('display', 'none');
                    $('.call-master .form .success span').css('visibility', 'visible');
                }
            },
            error: function () {
            }
        });
    });

    //Консультация
    $('.callback button').click(function() {
        var errors = false;
        var $this = $(this);
        var callbackName = $(this).parents('.form').find('input[name=name]').val();
        var callbackPhone = $(this).parents('.form').find('input[name=phone]').val();
        var callbackMessage = $(this).parents('.form').find('textarea[name=message]').val();
        var hiddenName = $(this).parents('.form').find('input[type=hidden]').val();

        if ((callbackName == hiddenName) || (callbackName == 0)) {
            $(this).parents('.form').find('input[name=name]').addClass('error');
            errors = true;
        }
        if (callbackPhone.length == 0) {
            $(this).parents('.form').find('input[name=phone]').addClass('error');
            errors = true;
        }

        if (errors) {
            return false;
        }
        $('.callback .form *:not(.close):not(.loading):not(.loading img)').css('visibility', 'hidden');
        $('.callback .form .loading').css('display', 'block');

        $.ajax({
            url: 'site/index',
            type: 'get',
            dataType: 'json',
            data: {callbackName: callbackName, callbackPhone: callbackPhone, callbackMessage: callbackMessage},
            success: function (response) {
                if (response.status == true) {
                    $('.callback .form .success, .callback .form .close').css('display', 'block');
                    $('.callback .form .success span').css('visibility', 'visible');
                    $('.callback .form .loading').css('display', 'none');
                }
            },
            error: function () {
            }
        });
    });

    //Обратный звонок
    $('.call-block .form button').click(function() {
        var callPhone = $(this).parents('.form').find('input[name=phone]').val();

        if (callPhone.length == 0) {
            $(this).parents('.form').find('input[name=phone]').addClass('error');
            return false;
        }
        $('.call-block .form *:not(.close):not(.loading):not(.loading img)').css('visibility', 'hidden');
        $('.call-block .loading').css('display', 'block');

        $.ajax({
            url: 'site/index',
            type: 'get',
            dataType: 'json',
            data: {callPhone: callPhone},
            success: function (response) {
                if (response.status == true) {
                    $('.call-block .form .success').css('display', 'block');
                    $('.call-block .form .success span').css('visibility', 'visible');
                    $('.call-block .loading').css('display', 'none');
                }
            },
            error: function () {
            }
        });
    });

    $('input').focus(function() {
        if ($(this).hasClass('error')) {
            $(this).removeClass('error');
        }
    });

    //Форма обратного звонка
    $('.call-block').click(function(e) {
        var classHover = $(e.target).attr('class');
        if (classHover == 'block' || classHover == 'close') {
            $('.call-block').removeClass('visible');
            $('.call-block .form *:not(.close)').css('visibility', 'visible');
            $('.call-block .form .success').css('display', 'none');
            $('.call-block .form .success span').css('visibility', 'hidden');
            $('.call-block .form input').val('');
            $('.call-block .form button').html('перезвоните мне');
        }
    });

    $('#callback').click(function() {
        $('.call-block').addClass('visible');
    });

    //Закрыть "спасибо за заказ" (дисконтная карта)
    $('.card .form .close').click(function() {
        $('.card .form input[type=email]').val($('.card .form input[type=hidden]').val());
        $('.card .form *:not(.close)').css('visibility', 'visible');
        $('.card .form .success, .card .form .close').css('display', 'none');
        $('.card .form .success span').css('visibility', 'hidden')
    });

    //Закрыть "спасибо за заказ" (вызов мастера)
    $('.call-master .form .close').click(function() {
        $('.call-master .form input[name="name"]').val($('.call-master .form input[name="hide-name"]').val());
        $('.call-master .form input[name="phone"]').val('');
        $('.call-master .form *:not(.close):not(.loading):not(.loading img)').css('visibility', 'visible');
        $('.call-master .form .success, .call-master .form .close').css('display', 'none');
        $('.call-master .form .success span').css('visibility', 'hidden')
    });

    //Закрыть "спасибо заказ" (консультация)
    $('.callback .form .close').click(function() {
        $('.callback .form input[name="name"]').val($('.callback .form input[name="hide-name"]').val());
        $('.callback .form input[name="phone"]').val('');
        $('.callback .form textarea[name="message"]').val('');
        $('.callback .form *:not(.close):not(.loading):not(.loading img)').css('visibility', 'visible');
        $('.callback .form .success, .callback .form .close').css('display', 'none');
        $('.callback .form .success span').css('visibility', 'hidden');
    });
});

function initMap() {

    // Specify features and elements to define styles.
    var styleArray = [
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#3e606f"
                },
                {
                    "weight": 2
                },
                {
                    "gamma": 0.84
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
                {
                    "weight": 0.6
                },
                {
                    "color": "#1a3541"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#405b79"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#2c5a71"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#405b79"
                }
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#1c2936"
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#405b79"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#406d80"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#405b79"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#405b79"
                }
            ]
        },
        {
            "featureType": "poi.medical",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#405b79"
                }
            ]
        },
        {
            "featureType": "poi.medical",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#2c5a71"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#405b79"
                }
            ]
        },
        {
            "featureType": "poi.school",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#405b79"
                }
            ]
        },
        {
            "featureType": "poi.sports_complex",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#405b79"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": -37
                },
                {
                    "color": "#34495e"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#34495e"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text",
            "stylers": [
                {
                    "color": "#aeb6bf"
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#aeb6bf"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#34495e"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#34495e"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#34495e"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#34495e"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#406d80"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#34495e"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#486583"
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#193341"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#1a314a"
                }
            ]
        }
    ];

    var krasnodar = [
        {lng: 39.1073413, lat: 45.1772551},
        {lng: 39.1076374, lat: 45.1774388},
        {lng: 39.1078188, lat: 45.177061},
        {lng: 39.1095257, lat: 45.17350590000001},
        {lng: 39.1096115, lat: 45.1686651},
        {lng: 39.1171646, lat: 45.167818},
        {lng: 39.1198674, lat: 45.1721629},
        {lng: 39.1257477, lat: 45.1816133},
        {lng: 39.1202545, lat: 45.1853037},
        {lng: 39.1313267, lat: 45.1911714},
        {lng: 39.1315842, lat: 45.1943167},
        {lng: 39.1279793, lat: 45.1966151},
        {lng: 39.1281509, lat: 45.1993367},
        {lng: 39.1243744, lat: 45.2003044},
        {lng: 39.1219711, lat: 45.1987924},
        {lng: 39.1171646, lat: 45.2006673},
        {lng: 39.1143322, lat: 45.1964941},
        {lng: 39.1193962, lat: 45.19383280000001},
        {lng: 39.1156197, lat: 45.190264},
        {lng: 39.1124439, lat: 45.1874814},
        {lng: 39.1114998, lat: 45.1853641},
        {lng: 39.1076374, lat: 45.1859691},
        {lng: 39.1028309, lat: 45.1875419},
        {lng: 39.1017151, lat: 45.1859086},
        {lng: 39.0986252, lat: 45.1871185},
        {lng: 39.0854931, lat: 45.1861506},
        {lng: 39.0851379, lat: 45.1862758},
        {lng: 39.0798283, lat: 45.1881468},
        {lng: 39.078455, lat: 45.1868765},
        {lng: 39.0727899, lat: 45.19128940000001},
        {lng: 39.0719318, lat: 45.1919577},
        {lng: 39.0752792, lat: 45.1942562},
        {lng: 39.0737343, lat: 45.1962522},
        {lng: 39.0695286, lat: 45.1956473},
        {lng: 39.0670824, lat: 45.193606},
        {lng: 39.066267, lat: 45.19292549999999},
        {lng: 39.0769958, lat: 45.1821578},
        {lng: 39.0822315, lat: 45.1817948},
        {lng: 39.084034, lat: 45.1788303},
        {lng: 39.077425, lat: 45.1769548},
        {lng: 39.0787983, lat: 45.17513959999999},
        {lng: 39.0884113, lat: 45.1685441},
        {lng: 39.0578556, lat: 45.16878620000001},
        {lng: 39.0574265, lat: 45.15910339999999},
        {lng: 39.0464401, lat: 45.15934540000001},
        {lng: 39.0283298, lat: 45.15995070000001},
        {lng: 39.02318, lat: 45.15934540000001},
        {lng: 39.0248966, lat: 45.1669102},
        {lng: 38.9987826, lat: 45.16688},
        {lng: 38.9931822, lat: 45.1668346},
        {lng: 38.9809513, lat: 45.16697079999999},
        {lng: 38.9705229, lat: 45.167122},
        {lng: 38.9700508, lat: 45.16748510000001},
        {lng: 38.967948, lat: 45.1675456},
        {lng: 38.9585066, lat: 45.1677272},
        {lng: 38.9582491, lat: 45.1616452},
        {lng: 38.967154, lat: 45.16147879999999},
        {lng: 38.9745998, lat: 45.16131240000001},
        {lng: 38.9845562, lat: 45.1611157},
        {lng: 38.9846635, lat: 45.1582863},
        {lng: 38.9889979, lat: 45.15833170000001},
        {lng: 38.9884186, lat: 45.1548061},
        {lng: 38.9887619, lat: 45.15268760000001},
        {lng: 38.9926672, lat: 45.15271790000001},
        {lng: 38.9926672, lat: 45.15078089999999},
        {lng: 38.9862299, lat: 45.1504782},
        {lng: 38.9842987, lat: 45.1493281},
        {lng: 38.9840412, lat: 45.1482082},
        {lng: 38.9870024, lat: 45.1474515},
        {lng: 38.9865732, lat: 45.1463619},
        {lng: 38.9877319, lat: 45.1459381},
        {lng: 38.9923239, lat: 45.1456355},
        {lng: 38.9920235, lat: 45.1419123},
        {lng: 38.98417, lat: 45.141882},
        {lng: 38.9840412, lat: 45.13770460000001},
        {lng: 38.979063, lat: 45.13761370000001},
        {lng: 38.9787626, lat: 45.1302267},
        {lng: 38.9717245, lat: 45.1309231},
        {lng: 38.9720678, lat: 45.13498},
        {lng: 38.9681196, lat: 45.13522209999999},
        {lng: 38.9678621, lat: 45.1345561},
        {lng: 38.9648581, lat: 45.1347378},
        {lng: 38.9627552, lat: 45.1345561},
        {lng: 38.9627337, lat: 45.1318692},
        {lng: 38.9570045, lat: 45.13251260000001},
        {lng: 38.9564681, lat: 45.1310745},
        {lng: 38.945868, lat: 45.1321644},
        {lng: 38.9458036, lat: 45.1326185},
        {lng: 38.9356327, lat: 45.13407169999999},
        {lng: 38.927865, lat: 45.1264117},
        {lng: 38.9184666, lat: 45.1161766},
        {lng: 38.915205, lat: 45.1185993},
        {lng: 38.9119434, lat: 45.1149955},
        {lng: 38.9109564, lat: 45.11484409999999},
        {lng: 38.9069223, lat: 45.1105435},
        {lng: 38.9016438, lat: 45.11302700000001},
        {lng: 38.8995838, lat: 45.1107858},
        {lng: 38.9160633, lat: 45.1029106},
        {lng: 38.9057636, lat: 45.09152},
        {lng: 38.8956785, lat: 45.0806423},
        {lng: 38.8928032, lat: 45.0786422},
        {lng: 38.892374, lat: 45.0737934},
        {lng: 38.8905716, lat: 45.0676711},
        {lng: 38.8892412, lat: 45.05678879999999},
        {lng: 38.8682127, lat: 45.0571223},
        {lng: 38.8593721, lat: 45.0553943},
        {lng: 38.8460255, lat: 45.05287799999999},
        {lng: 38.8516474, lat: 45.0502403},
        {lng: 38.8540077, lat: 45.04820890000001},
        {lng: 38.8609171, lat: 45.04681409999999},
        {lng: 38.86096, lat: 45.04842109999999},
        {lng: 38.8666248, lat: 45.04869400000001},
        {lng: 38.8672256, lat: 45.05533370000001},
        {lng: 38.8828468, lat: 45.0558187},
        {lng: 38.8847351, lat: 45.0481785},
        {lng: 38.8960648, lat: 45.05339339999999},
        {lng: 38.9013863, lat: 45.0537572},
        {lng: 38.9051628, lat: 45.053454},
        {lng: 38.909111, lat: 45.05145300000001},
        {lng: 38.9108276, lat: 45.0474508},
        {lng: 38.9107418, lat: 45.0438729},
        {lng: 38.9021587, lat: 45.0346541},
        {lng: 38.8994122, lat: 45.02761769999999},
        {lng: 38.9004421, lat: 45.0222186},
        {lng: 38.9013004, lat: 45.0203378},
        {lng: 38.9027596, lat: 45.018275},
        {lng: 38.9109135, lat: 45.0175469},
        {lng: 38.9297962, lat: 45.0034691},
        {lng: 38.9238739, lat: 44.9875667},
        {lng: 38.9183807, lat: 44.9808281},
        {lng: 38.9288521, lat: 44.9797353},
        {lng: 38.9313412, lat: 44.9756066},
        {lng: 38.9311695, lat: 44.9673485},
        {lng: 38.9345169, lat: 44.9647979},
        {lng: 38.937006, lat: 44.9646157},
        {lng: 38.947649, lat: 44.9776103},
        {lng: 38.9505672, lat: 44.9766995},
        {lng: 38.9519405, lat: 44.9783996},
        {lng: 38.9583778, lat: 44.9769424},
        {lng: 38.9619827, lat: 44.9810102},
        {lng: 38.9641714, lat: 44.9793103},
        {lng: 38.967433, lat: 44.9853813},
        {lng: 38.9637852, lat: 44.986474},
        {lng: 38.9644718, lat: 44.9891753},
        {lng: 38.9659309, lat: 44.9902983},
        {lng: 38.9683342, lat: 44.9930905},
        {lng: 38.969965, lat: 44.9943045},
        {lng: 38.9697933, lat: 44.9976428},
        {lng: 38.9703083, lat: 45.0012843},
        {lng: 38.9721107, lat: 45.0082632},
        {lng: 38.9761448, lat: 45.01044780000001},
        {lng: 38.9806938, lat: 45.0108118},
        {lng: 38.984127, lat: 45.01099390000001},
        {lng: 38.986702, lat: 45.0101444},
        {lng: 38.9928818, lat: 45.00565380000001},
        {lng: 39.0002632, lat: 45.00437939999999},
        {lng: 39.0077305, lat: 45.0049863},
        {lng: 39.0121937, lat: 45.00292290000001},
        {lng: 39.0153694, lat: 44.9994029},
        {lng: 39.0183735, lat: 44.9917552},
        {lng: 39.0335655, lat: 44.9949115},
        {lng: 39.0342522, lat: 44.9975821},
        {lng: 39.0371704, lat: 45.00025260000001},
        {lng: 39.038372, lat: 45.00280149999999},
        {lng: 39.0400887, lat: 45.0053504},
        {lng: 39.0428352, lat: 45.00789910000001},
        {lng: 39.0479851, lat: 45.01044780000001},
        {lng: 39.0541649, lat: 45.0120254},
        {lng: 39.0579414, lat: 45.0121468},
        {lng: 39.0610313, lat: 45.0111759},
        {lng: 39.0618896, lat: 45.0071709},
        {lng: 39.0618896, lat: 45.0046222},
        {lng: 39.0596581, lat: 45.0011022},
        {lng: 39.0557098, lat: 44.9973393},
        {lng: 39.0539932, lat: 44.991998},
        {lng: 39.0521049, lat: 44.9873846},
        {lng: 39.0486717, lat: 44.9853206},
        {lng: 39.05159, lat: 44.9826494},
        {lng: 39.0529633, lat: 44.9816173},
        {lng: 39.0539503, lat: 44.9806459},
        {lng: 39.0547657, lat: 44.9794317},
        {lng: 39.0556669, lat: 44.9783692},
        {lng: 39.0566969, lat: 44.9769728},
        {lng: 39.0579844, lat: 44.9759102},
        {lng: 39.0605593, lat: 44.9750905},
        {lng: 39.0630913, lat: 44.9746351},
        {lng: 39.064765, lat: 44.9746959},
        {lng: 39.0653229, lat: 44.975303},
        {lng: 39.0653229, lat: 44.9767602},
        {lng: 39.0651083, lat: 44.9790067},
        {lng: 39.0655375, lat: 44.9807067},
        {lng: 39.0667391, lat: 44.9821941},
        {lng: 39.0690994, lat: 44.9836511},
        {lng: 39.0697861, lat: 44.9851688},
        {lng: 39.0709448, lat: 44.9866561},
        {lng: 39.0761805, lat: 44.9890843},
        {lng: 39.07897, lat: 44.9898734},
        {lng: 39.0807724, lat: 44.9928174},
        {lng: 39.0810299, lat: 44.9941224},
        {lng: 39.0817165, lat: 44.9953667},
        {lng: 39.0812874, lat: 44.996611},
        {lng: 39.081459, lat: 44.9987959},
        {lng: 39.0828753, lat: 45.00292290000001},
        {lng: 39.0830469, lat: 45.0064427},
        {lng: 39.0836906, lat: 45.0085363},
        {lng: 39.0851498, lat: 45.0096893},
        {lng: 39.0872526, lat: 45.01044780000001},
        {lng: 39.0925741, lat: 45.0107815},
        {lng: 39.0957928, lat: 45.00993199999999},
        {lng: 39.0986252, lat: 45.0084149},
        {lng: 39.1020584, lat: 45.00686749999999},
        {lng: 39.1063929, lat: 45.0022857},
        {lng: 39.1055346, lat: 44.9988263},
        {lng: 39.1063499, lat: 44.9957612},
        {lng: 39.1125298, lat: 44.997491},
        {lng: 39.1155767, lat: 45.0003436},
        {lng: 39.1209412, lat: 45.0007381},
        {lng: 39.1234303, lat: 44.9998277},
        {lng: 39.1279364, lat: 44.9975517},
        {lng: 39.1307259, lat: 44.9984318},
        {lng: 39.1343307, lat: 44.9994332},
        {lng: 39.1272926, lat: 45.01044780000001},
        {lng: 39.1256618, lat: 45.0148469},
        {lng: 39.1226149, lat: 45.0142098},
        {lng: 39.1219282, lat: 45.0158784},
        {lng: 39.1293097, lat: 45.0261618},
        {lng: 39.1336441, lat: 45.0281334},
        {lng: 39.1360903, lat: 45.03043850000001},
        {lng: 39.1348886, lat: 45.03253119999999},
        {lng: 39.1379786, lat: 45.0331681},
        {lng: 39.1376352, lat: 45.03695900000001},
        {lng: 39.1377211, lat: 45.0388695},
        {lng: 39.1394377, lat: 45.04068899999999},
        {lng: 39.141326, lat: 45.0409012},
        {lng: 39.1480637, lat: 45.0436303},
        {lng: 39.1493511, lat: 45.04569219999999},
        {lng: 39.1697788, lat: 45.04927009999999},
        {lng: 39.1940689, lat: 45.0536965},
        {lng: 39.2232513, lat: 45.0631548},
        {lng: 39.2307186, lat: 45.05272640000001},
        {lng: 39.2365551, lat: 45.0537572},
        {lng: 39.2388725, lat: 45.0563038},
        {lng: 39.2313194, lat: 45.0658222},
        {lng: 39.2461681, lat: 45.07079289999999},
        {lng: 39.2429924, lat: 45.0766724},
        {lng: 39.2317486, lat: 45.0733388},
        {lng: 39.2320919, lat: 45.0776422},
        {lng: 39.2275429, lat: 45.0764906},
        {lng: 39.2202473, lat: 45.0780058},
        {lng: 39.2204189, lat: 45.07170219999999},
        {lng: 39.2126942, lat: 45.0705505},
        {lng: 39.2123508, lat: 45.0691563},
        {lng: 39.2075443, lat: 45.06782270000001},
        {lng: 39.2041969, lat: 45.0712779},
        {lng: 39.2044544, lat: 45.0760663},
        {lng: 39.1952705, lat: 45.0770361},
        {lng: 39.1897774, lat: 45.0761875},
        {lng: 39.1841125, lat: 45.0657615},
        {lng: 39.1741562, lat: 45.0650341},
        {lng: 39.1722679, lat: 45.0613966},
        {lng: 39.1436005, lat: 45.0617604},
        {lng: 39.1417122, lat: 45.06721649999999},
        {lng: 39.1245461, lat: 45.06709519999999},
        {lng: 39.1236877, lat: 45.0617604},
        {lng: 39.0886688, lat: 45.058244},
        {lng: 39.0709877, lat: 45.0506041},
        {lng: 39.0618896, lat: 45.04660190000001},
        {lng: 39.0596581, lat: 45.0521807},
        {lng: 39.0651512, lat: 45.0560612},
        {lng: 39.0656662, lat: 45.059214},
        {lng: 39.0591431, lat: 45.0600628},
        {lng: 39.0581131, lat: 45.07279320000001},
        {lng: 39.0481567, lat: 45.0729145},
        {lng: 39.0478134, lat: 45.08891439999999},
        {lng: 39.0220642, lat: 45.0893991},
        {lng: 39.0205193, lat: 45.1060002},
        {lng: 39.0272141, lat: 45.1056368},
        {lng: 39.0275574, lat: 45.1113309},
        {lng: 39.0454102, lat: 45.112179},
        {lng: 39.0443802, lat: 45.1182359},
        {lng: 39.0411186, lat: 45.1184782},
        {lng: 39.0421486, lat: 45.13131670000001},
        {lng: 39.0592289, lat: 45.1319827},
        {lng: 39.0594864, lat: 45.1497216},
        {lng: 39.0633488, lat: 45.15208229999999},
        {lng: 39.0785408, lat: 45.15934540000001},
        {lng: 39.0882397, lat: 45.1653974},
        {lng: 39.1073413, lat: 45.1772551},
    ];
    var novo = [
        {lng: 38.9987183,  lat: 45.22231450000001},
        {lng: 38.99949070000001,  lat: 45.22310039999999},
        {lng: 39.0113354,  lat: 45.22310039999999},
        {lng: 39.0104771,  lat: 45.22938729999999},
        {lng: 39.0149403,  lat: 45.2289642},
        {lng: 39.0147686,  lat: 45.23216790000001},
        {lng: 39.00979039999999,  lat: 45.2339812},
        {lng: 39.0093613,  lat: 45.2359153},
        {lng: 39.0124512,  lat: 45.2361571},
        {lng: 39.0118504,  lat: 45.2378494},
        {lng: 39.0111637,  lat: 45.2428052},
        {lng: 39.0138245,  lat: 45.24498079999999},
        {lng: 39.02498250000001,  lat: 45.2455851},
        {lng: 39.0248108,  lat: 45.2496338},
        {lng: 39.01416780000001,  lat: 45.2492108},
        {lng: 39.01725770000001,  lat: 45.26340940000001},
        {lng: 39.0122795,  lat: 45.2629261},
        {lng: 39.0035248,  lat: 45.2603887},
        {lng: 38.9994049,  lat: 45.26135530000001},
        {lng: 38.9942551,  lat: 45.25144659999999},
        {lng: 38.9612961,  lat: 45.24576640000001},
        {lng: 38.9370918,  lat: 45.244316},
        {lng: 38.9315987,  lat: 45.2360967},
        {lng: 38.93760680000001,  lat: 45.2347669},
        {lng: 38.9563179,  lat: 45.2253372},
        {lng: 38.97279740000001,  lat: 45.2235236},
        {lng: 38.9774323,  lat: 45.21977530000001},
        {lng: 38.9987183,  lat: 45.22231450000001},
    ];
    var vodniki = [
        {lng: 38.9255047,  lat: 45.15910339999999},
        {lng: 38.9261913,  lat: 45.1529297},
        {lng: 38.9303112,  lat: 45.1531718},
        {lng: 38.9303112,  lat: 45.1483898},
        {lng: 38.9449883,  lat: 45.14857140000001},
        {lng: 38.9455891,  lat: 45.1534745},
        {lng: 38.9448166,  lat: 45.1551087},
        {lng: 38.9400101,  lat: 45.15522980000001},
        {lng: 38.9376068,  lat: 45.1577113},
        {lng: 38.93142699999999,  lat: 45.1578929},
        {lng: 38.93159870000001,  lat: 45.15910340000001},
        {lng: 38.9255047,  lat: 45.15910339999999},
    ];
    var progress = [
        {lng: 38.9576054,  lat: 45.15704550000001},
        {lng: 38.95769120000001,  lat: 45.14826880000001},
        {lng: 38.9668751,  lat: 45.14845040000001},
        {lng: 38.96721839999999,  lat: 45.156864},
        {lng: 38.9576054,  lat: 45.15704550000001},
    ];
    var kolos = [
        {lng: 38.8985968,  lat: 45.1346167},
        {lng: 38.8920307,  lat: 45.1378862},
        {lng: 38.8884258,  lat: 45.13410199999999},
        {lng: 38.8995409,  lat: 45.1307111},
        {lng: 38.90203,  lat: 45.12841010000001},
        {lng: 38.9028025,  lat: 45.1270476},
        {lng: 38.9067078,  lat: 45.1241711},
        {lng: 38.9089394,  lat: 45.12680530000001},
        {lng: 38.90597819999999,  lat: 45.13013590000001},
        {lng: 38.9131451,  lat: 45.137311},
        {lng: 38.9091539,  lat: 45.1392485},
        {lng: 38.90494820000001,  lat: 45.14124640000001},
        {lng: 38.8985968,  lat: 45.1346167},
    ];
    var elis = [
        {lng: 38.7673187,  lat: 45.06036600000001},
        {lng: 38.7657738,  lat: 45.05885020000001},
        {lng: 38.77152439999999,  lat: 45.05509109999999},
        {lng: 38.77229689999999,  lat: 45.05212000000001},
        {lng: 38.7719536,  lat: 45.0495126},
        {lng: 38.770752,  lat: 45.0435697},
        {lng: 38.7713528,  lat: 45.0424781},
        {lng: 38.77418519999999,  lat: 45.04181089999999},
        {lng: 38.7764168,  lat: 45.0395669},
        {lng: 38.7760735,  lat: 45.0376868},
        {lng: 38.7649155,  lat: 45.0410832},
        {lng: 38.7618256,  lat: 45.0403554},
        {lng: 38.7588215,  lat: 45.03380499999999},
        {lng: 38.7645721,  lat: 45.0320459},
        {lng: 38.7728977,  lat: 45.0287097},
        {lng: 38.77804760000001,  lat: 45.0259798},
        {lng: 38.7822533,  lat: 45.02161190000001},
        {lng: 38.78233909999999,  lat: 45.0190031},
        {lng: 38.7822533,  lat: 45.0139671},
        {lng: 38.78259659999999,  lat: 45.0089914},
        {lng: 38.7866306,  lat: 45.0046828},
        {lng: 38.7929821,  lat: 45.0017698},
        {lng: 38.79796030000001,  lat: 44.99940290000001},
        {lng: 38.80379680000001,  lat: 44.9973393},
        {lng: 38.8093758,  lat: 44.9981283},
        {lng: 38.8113499,  lat: 45.0012236},
        {lng: 38.8121223,  lat: 45.0069282},
        {lng: 38.8126373,  lat: 45.01075119999999},
        {lng: 38.8172722,  lat: 45.0137851},
        {lng: 38.8212204,  lat: 45.0135424},
        {lng: 38.82113459999999,  lat: 45.0217939},
        {lng: 38.80508420000001,  lat: 45.0218545},
        {lng: 38.8019943,  lat: 45.0293769},
        {lng: 38.7992477,  lat: 45.0339869},
        {lng: 38.79787450000001,  lat: 45.0352},
        {lng: 38.7977028,  lat: 45.03859649999999},
        {lng: 38.79804610000001,  lat: 45.0401128},
        {lng: 38.8012218,  lat: 45.0383539},
        {lng: 38.80508420000001,  lat: 45.0354426},
        {lng: 38.8127232,  lat: 45.0339869},
        {lng: 38.8159847,  lat: 45.03240990000001},
        {lng: 38.81838800000001,  lat: 45.0305901},
        {lng: 38.82568359999999,  lat: 45.0324705},
        {lng: 38.8256836,  lat: 45.0362918},
        {lng: 38.8251686,  lat: 45.0433877},
        {lng: 38.8283443,  lat: 45.04811789999999},
        {lng: 38.82946010000001,  lat: 45.0504828},
        {lng: 38.8367128,  lat: 45.05145300000001},
        {lng: 38.83628370000001,  lat: 45.05239290000001},
        {lng: 38.8385582,  lat: 45.05451510000001},
        {lng: 38.8402748,  lat: 45.05551560000001},
        {lng: 38.8404465,  lat: 45.0560006},
        {lng: 38.8421202,  lat: 45.0586077},
        {lng: 38.8398457,  lat: 45.059305},
        {lng: 38.8386869,  lat: 45.0578195},
        {lng: 38.83521080000001,  lat: 45.0593353},
        {lng: 38.8343096,  lat: 45.06036600000001},
        {lng: 38.83117679999999,  lat: 45.0618513},
        {lng: 38.8298464,  lat: 45.06082070000002},
        {lng: 38.8298464,  lat: 45.0594869},
        {lng: 38.82967470000001,  lat: 45.05797110000001},
        {lng: 38.8311338,  lat: 45.05739509999999},
        {lng: 38.8303185,  lat: 45.0561825},
        {lng: 38.8298464,  lat: 45.0561522},
        {lng: 38.8273573,  lat: 45.0511802},
        {lng: 38.8229799,  lat: 45.05260510000001},
        {lng: 38.8205767,  lat: 45.05254450000001},
        {lng: 38.8130236,  lat: 45.0537875},
        {lng: 38.81006240000001,  lat: 45.05399970000001},
        {lng: 38.80392549999999,  lat: 45.0544242},
        {lng: 38.7943983,  lat: 45.05512139999999},
        {lng: 38.7876606,  lat: 45.0558187},
        {lng: 38.78246780000001,  lat: 45.0563947},
        {lng: 38.7780476,  lat: 45.0569404},
        {lng: 38.7735415,  lat: 45.05791049999999},
        {lng: 38.7704086,  lat: 45.0591231},
        {lng: 38.7673187,  lat: 45.06036600000001},
    ];
    var lenin = [
        {lng: 39.1878033,  lat: 45.0137244},
        {lng: 39.19149399999999,  lat: 45.0139064},
        {lng: 39.1946697,  lat: 45.0126322},
        {lng: 39.20007709999999,  lat: 45.010205},
        {lng: 39.2110634,  lat: 45.01135799999999},
        {lng: 39.2175007,  lat: 45.01372439999999},
        {lng: 39.2276287,  lat: 45.02106580000001},
        {lng: 39.2363834,  lat: 45.02027709999999},
        {lng: 39.24119,  lat: 45.0171829},
        {lng: 39.2547512,  lat: 45.0156054},
        {lng: 39.2613602,  lat: 45.0173042},
        {lng: 39.2633343,  lat: 45.02082320000001},
        {lng: 39.26548,  lat: 45.0247665},
        {lng: 39.2655659,  lat: 45.02652579999999},
        {lng: 39.2615318,  lat: 45.03137870000001},
        {lng: 39.250803,  lat: 45.0271324},
        {lng: 39.2496014,  lat: 45.0287703},
        {lng: 39.24376490000001,  lat: 45.0265258},
        {lng: 39.2447948,  lat: 45.0251305},
        {lng: 39.23526760000001,  lat: 45.0211265},
        {lng: 39.2286587,  lat: 45.0217939},
        {lng: 39.22428130000001,  lat: 45.0280424},
        {lng: 39.20848850000001,  lat: 45.0230679},
        {lng: 39.19870379999999,  lat: 45.0197311},
        {lng: 39.1882324,  lat: 45.01942780000001},
        {lng: 39.1878033,  lat: 45.0137244},
    ];
    var indus = [
        {lng: 39.0915871,  lat: 45.074551},
        {lng: 39.1066074,  lat: 45.08455120000001},
        {lng: 39.1084099,  lat: 45.083521},
        {lng: 39.1248035,  lat: 45.08406640000001},
        {lng: 39.1246319,  lat: 45.0938225},
        {lng: 39.1333866,  lat: 45.0988514},
        {lng: 39.17145250000001,  lat: 45.12308090000001},
        {lng: 39.1708088,  lat: 45.1208402},
        {lng: 39.1754436,  lat: 45.1204162},
        {lng: 39.1758728,  lat: 45.11763019999999},
        {lng: 39.1786194,  lat: 45.1176908},
        {lng: 39.1789627,  lat: 45.122657},
        {lng: 39.1744995,  lat: 45.1224148},
        {lng: 39.1720963,  lat: 45.12356549999999},
        {lng: 39.1760445,  lat: 45.1267751},
        {lng: 39.1865158,  lat: 45.1268356},
        {lng: 39.18643,  lat: 45.12895509999999},
        {lng: 39.1995621,  lat: 45.1295606},
        {lng: 39.1993904,  lat: 45.13319380000001},
        {lng: 39.2072868,  lat: 45.1332543},
        {lng: 39.21149250000001,  lat: 45.1398539},
        {lng: 39.2139816,  lat: 45.1399144},
        {lng: 39.2149258,  lat: 45.1403382},
        {lng: 39.2241955,  lat: 45.14064090000001},
        {lng: 39.2246246,  lat: 45.14360740000001},
        {lng: 39.2111492,  lat: 45.1435469},
        {lng: 39.2102051,  lat: 45.14263880000001},
        {lng: 39.1987038,  lat: 45.14257830000001},
        {lng: 39.1974163,  lat: 45.15444289999999},
        {lng: 39.1797352,  lat: 45.133436},
        {lng: 39.1562176,  lat: 45.13355709999999},
        {lng: 39.1565609,  lat: 45.12356549999999},
        {lng: 39.1506386,  lat: 45.1236866},
        {lng: 39.1503811,  lat: 45.1155103},
        {lng: 39.1439438,  lat: 45.11544980000001},
        {lng: 39.1436005,  lat: 45.1108463},
        {lng: 39.1190529,  lat: 45.1104829},
        {lng: 39.110899,  lat: 45.1119367},
        {lng: 39.1085815,  lat: 45.1270173},
        {lng: 39.0799999,  lat: 45.12707790000001},
        {lng: 39.07982830000001,  lat: 45.0980638},
        {lng: 39.0842915,  lat: 45.0892174},
        {lng: 39.0915871,  lat: 45.074551},
    ];
    var dachi = [
        {lng: 38.9864445,  lat: 45.2009697},
        {lng: 38.9858437,  lat: 45.19582880000001},
        {lng: 38.98575780000001,  lat: 45.19074790000001},
        {lng: 38.9854145,  lat: 45.18463820000002},
        {lng: 38.9852428,  lat: 45.1817948},
        {lng: 38.9825821,  lat: 45.1817343},
        {lng: 38.9777756,  lat: 45.1832468},
        {lng: 38.973484,  lat: 45.18542459999999},
        {lng: 38.9729691,  lat: 45.17677320000001},
        {lng: 38.9777756,  lat: 45.1748976},
        {lng: 38.97777560000001,  lat: 45.1689677},
        {lng: 38.9982891,  lat: 45.1690887},
        {lng: 39.000864,  lat: 45.17072249999999},
        {lng: 39.0062714,  lat: 45.1695728},
        {lng: 39.0080738,  lat: 45.18306530000001},
        {lng: 39.0016365,  lat: 45.18953810000001},
        {lng: 38.9997482,  lat: 45.18978009999999},
        {lng: 39.0000057,  lat: 45.1969175},
        {lng: 38.9921093,  lat: 45.19969960000001},
        {lng: 38.9892769,  lat: 45.19994149999999},
        {lng: 38.9887619,  lat: 45.2009697},
        {lng: 38.9864445,  lat: 45.2009697},
    ];
    var enem = [
        {lng: 38.8917732,  lat: 44.93017209999999},
        {lng: 38.8886833,  lat: 44.927863},
        {lng: 38.8847351,  lat: 44.9198411},
        {lng: 38.8843918,  lat: 44.91145329999999},
        {lng: 38.89366149999999,  lat: 44.9152219},
        {lng: 38.9031029,  lat: 44.9116965},
        {lng: 38.897953,  lat: 44.90075409999999},
        {lng: 38.9012146,  lat: 44.89965980000001},
        {lng: 38.9115143,  lat: 44.899903},
        {lng: 38.9164925,  lat: 44.9000246},
        {lng: 38.9188957,  lat: 44.904037},
        {lng: 38.9139175,  lat: 44.9063471},
        {lng: 38.9182091,  lat: 44.91242590000001},
        {lng: 38.92198560000001,  lat: 44.9110886},
        {lng: 38.9274788,  lat: 44.91874709999999},
        {lng: 38.9233589,  lat: 44.92142120000001},
        {lng: 38.9255905,  lat: 44.9273768},
        {lng: 38.9300537,  lat: 44.934061},
        {lng: 38.91288759999999,  lat: 44.9383141},
        {lng: 38.90516280000001,  lat: 44.9414734},
        {lng: 38.897953,  lat: 44.9338179},
        {lng: 38.8917732,  lat: 44.93017209999999},
    ];

    var krasnodarFill = new google.maps.Polygon({
        paths: krasnodar,
        strokeColor: '#aeb6bf',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#aeb6bf',
        fillOpacity: 0.35,
    });
    var novoFill = new google.maps.Polygon({
        paths: novo,
        strokeColor: '#aeb6bf',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#aeb6bf',
        fillOpacity: 0.35,
    });
    var vodnikiFill = new google.maps.Polygon({
        paths: vodniki,
        strokeColor: '#aeb6bf',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#aeb6bf',
        fillOpacity: 0.35,
    });
    var progressFill = new google.maps.Polygon({
        paths: progress,
        strokeColor: '#aeb6bf',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#aeb6bf',
        fillOpacity: 0.35,
    });
    var kolosFill = new google.maps.Polygon({
        paths: kolos,
        strokeColor: '#aeb6bf',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#aeb6bf',
        fillOpacity: 0.35,
    });
    var elisFill = new google.maps.Polygon({
        paths: elis,
        strokeColor: '#aeb6bf',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#aeb6bf',
        fillOpacity: 0.35,
    });
    var leninFill = new google.maps.Polygon({
        paths: lenin,
        strokeColor: '#aeb6bf',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#aeb6bf',
        fillOpacity: 0.35,
    });
    var indusFill = new google.maps.Polygon({
        paths: indus,
        strokeColor: '#aeb6bf',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#aeb6bf',
        fillOpacity: 0.35,
    });
    var dachiFill = new google.maps.Polygon({
        paths: dachi,
        strokeColor: '#aeb6bf',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#aeb6bf',
        fillOpacity: 0.35,
    });
    var enemFill = new google.maps.Polygon({
        paths: enem,
        strokeColor: '#aeb6bf',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#aeb6bf',
        fillOpacity: 0.35,
    });

    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: {lat: 45.059088, lng: 38.879226},
        scrollwheel: false,
        // Apply the map style array to the map.
        styles: styleArray,
//            disableDefaultUI: true, //Отключение пользовательского интерфейса
        url: 'http://sankras/map/map.kml',
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        streetViewControl: false,
        mapTypeControl: false,
        zoom: 11
    });

    krasnodarFill.setMap(map);
    novoFill.setMap(map);
    vodnikiFill.setMap(map);
    progressFill.setMap(map);
    kolosFill.setMap(map);
    elisFill.setMap(map);
    leninFill.setMap(map);
    indusFill.setMap(map);
    dachiFill.setMap(map);
    enemFill.setMap(map);
}