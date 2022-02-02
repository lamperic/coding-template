/*

js function list:

*/

// メディアクエリ
var mediaFlg;
function media() {
  var width = $(window).width();
  if (width > 1024) {
    mediaFlg = "pc";
  } else if (width > 768) {
    mediaFlg = "tablet";
  } else if (width <= 768) {
    mediaFlg = "sp";
  }
}

function getHeaderHeight() {
  var hh = $("header").outerHeight();
  $("header").attr("data-hh", hh);
}

// スクロールで要素が表示された時にclassを付与する
function inview(target, timing) {
  if (target.length > 0) {
    var winScroll = $(window).scrollTop();
    var winHeight = $(window).height();
    var scrollPos = winScroll + winHeight * timing;

    if (target.offset().top < scrollPos) {
      target.addClass("is-show");
    } else {
      //target.removeClass('is-show');
    }
  }
}

// グローバルナビの処理
function gnav(toggleElm, contentElm, bgElm) {
  var bgElmClass = bgElm.split(".")[1];
  $(toggleElm).toggleClass("is-gnav-active");
  $("html").toggleClass("is-gnav-open");
  if ($(toggleElm).hasClass("is-gnav-active")) {
    $(contentElm).after('<div class="' + bgElmClass + '"></div>');
  } else {
    $(bgElm).remove();
  }
  $(contentElm).toggleClass("is-gnav-active");
  function gnavToggle() {
    $(contentElm).toggleClass("is-gnav-start");
  }
  setTimeout(gnavToggle, 100);
}

$(window).on("resize", function () {
  media();
  getHeaderHeight();
});

$(function () {
  media();
  getHeaderHeight();

  // グローバルナビのクリックイベント
  var gnavToggleClass = ".js-gnav-toggle"; //トグルボタン
  var gnavContentClass = ".l-gnav"; //ハンバーガーコンテンツ
  var gnavBgClass = ".l-gnav-bg"; //背景
  $(gnavToggleClass).on("click", function () {
    gnav(gnavToggleClass, gnavContentClass, gnavBgClass);
  });
  $("body").on("click", gnavBgClass, function () {
    gnav(gnavToggleClass, gnavContentClass, gnavBgClass);
  });

  // トグル処理
  $(".toggle-nav dt").on("click", function () {
    $(this).toggleClass("is-active");
    $(this).next().slideToggle();
  });

  // inviewトリガー
  $(window).on("load scroll", function () {
    $(".anm").each(function () {
      inview($(this), 0.7);
    });
  });

  // マウスホバー
  if (mediaFlg == "sp") {
  } else {
    $(document).on(
      {
        mouseenter: function () {
          $(this).addClass("is-active");
          $(this)
            .find(".js-pulldown-nav")
            .stop()
            .fadeIn(100)
            .addClass("is-show");
        },
        mouseleave: function () {
          $(this).removeClass("is-active");
          $(this)
            .find(".js-pulldown-nav")
            .stop()
            .fadeOut(100)
            .removeClass("is-show");
        },
      },
      ".js-pulldown-trigger"
    );
  }

  $(".l-pagetop span").on("click", function () {
    $("html,body").animate({ scrollTop: 0 }, "300");
  });

  // page scroll
  $("a[href*=\\#]:not([href=\\#])").on("click", function () {
    var hh = $("header").attr("data-hh");
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      // スクロール処理を無効にしたいアンカーをセット
      if (this.hash === "#law" || this.hash === "#pp") {
        return;
      }
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        if (mediaFlg == "sp") {
          $("html,body").animate(
            {
              scrollTop: target.offset().top - hh,
            },
            600
          );
        } else {
          $("html,body").animate(
            {
              scrollTop: target.offset().top - hh,
            },
            600
          );
        }
        return false;
      }
    }
  });

  // スライダー定義
  if ($(".js-kv-slider").length > 0) {
    var headerHeight = $(".l-header").outerHeight();
    var kvSliderHeight = $(window).outerHeight() - headerHeight;
    if (mediaFlg == "sp") {
      $(".js-kv-slider--set-height").css("height", kvSliderHeight * 0.7);
    } else {
      $(".js-kv-slider--set-height").css("height", kvSliderHeight);
    }

    $(".js-kv-slider").slick({
      speed: 1000,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      autoplay: false,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }
});

// 詳細ページ 画像切り替え
$(function () {
  var slider = ".js-pd-slide .slide-main"; // スライダー
  var thumbnailItem = ".js-pd-slide .slide-thumb .slide-each"; // サムネイル画像アイテム

  // サムネイル画像アイテムに data-index でindex番号を付与
  $(thumbnailItem).each(function () {
    var index = $(thumbnailItem).index(this);
    $(this).attr("data-index", index);
  });

  // スライダー初期化後、カレントのサムネイル画像にクラス「thumbnail-current」を付ける
  // 「slickスライダー作成」の前にこの記述は書いてください。
  $(slider).on("init", function (slick) {
    var index = $(".slide-item.slick-slide.slick-current").attr(
      "data-slick-index"
    );
    $(thumbnailItem + '[data-index="' + index + '"]').addClass(
      "thumbnail-current"
    );
  });

  //slickスライダー初期化
  $(slider).slick({
    autoplay: false,
    arrows: false,
    fade: false,
    infinite: true, //これはつけましょう。
  });
  //サムネイル画像アイテムをクリックしたときにスライダー切り替え
  $(thumbnailItem).on("click", function () {
    var index = $(this).attr("data-index");
    $(slider).slick("slickGoTo", index, false);
  });

  //サムネイル画像のカレントを切り替え
  $(slider).on(
    "beforeChange",
    function (event, slick, currentSlide, nextSlide) {
      $(thumbnailItem).each(function () {
        $(this).removeClass("thumbnail-current");
      });
      $(thumbnailItem + '[data-index="' + nextSlide + '"]').addClass(
        "thumbnail-current"
      );
    }
  );
});
