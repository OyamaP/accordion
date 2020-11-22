/******************************
* polyfill
******************************/
// matches
// https://developer.mozilla.org/ja/docs/Web/API/Element/closest
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
}
// closest  
// https://developer.mozilla.org/ja/docs/Web/API/Element/closest
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;

        do {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}


/******************************
* constructor / SetAccordion
******************************/

// アコーディオンメニュー設定
function SetAccordion($btn,argObj){

    /******************************
    * define
    ******************************/
    const config = {
        $btn: '', // 開閉ボタンselector
        firstTime: true, // 初回クリック判定
        openClass: 'open', // open時のボタンに付与されるclass
        duration: '0.5s', // css transition-duration
        timing: 'ease', // css transition-timing-function
        only: false, // openするmenuを一つだけにする
        first: false, // 一番最初のmenuを開けておく
    };
    // config -> 引数上書き
    if(!$btn) return;
    config.$btn = $btn;
    for(let key in argObj){
        if(!config.hasOwnProperty(key)) return;
        config[key] = argObj[key];
    }

    // アコーディオン開閉ボタン,アコーディオンメニュー
    const $btns = document.querySelectorAll(config.$btn);
    const $menus = new Array();
    for(let i=0; i<$btns.length; i++){
        $menus.push($btns[i].nextElementSibling);
    };


    /******************************
    * functions
    ******************************/

    // style設定(対象要素,オブジェクト{propaty:value})
    const setStyle = function($ele,obj){
        for(let propaty in obj){
            $ele.style[propaty] = obj[propaty];
        }
    }

    // openMenu
    const openMenu = function($btn,$menu){
        // メニュー内部の高さを取得し反映
        const height = $menu.firstElementChild.offsetHeight;
        $menu.style.height = height + 'px';
        // openクラスを付与 -> trigger 判定
        $btn.classList.add(config.openClass);
    };

    // closeMenu
    const closeMenu = function($btn,$menu){
        $btn.classList.remove(config.openClass);
        $menu.style.height = 0 + 'px';
    };

    // onlyMenu
    const onlyMenu = function(){
        if(!config.only) return;
        const $btn = document.querySelector(config.$btn + '.'+ config.openClass);
        if(!$btn) return;
        const $menu = $btn.nextElementSibling;
        closeMenu($btn,$menu);
    };

    // firstMenu
    const firstMenu = function(){
        if(!config.first) return;
        const $btn = document.querySelector(config.$btn);
        const $menu = $btn.nextElementSibling;
        openMenu($btn,$menu);
    };


    // メニュー開閉
    const toggleMenu = function(e){
        // e.target補正
        const $target = e.target.closest(config.$btn);
        // クリックされた要素の次要素を取得
        const $openEle = $target.nextElementSibling;
        if(!$openEle) return;
        if(config.firstTime){
            // forEach 代用
            //アニメーション設定 -> クリック前に定義する場合、ページ読み込み時にメニューの高さに合わせたアニメーションを行うため
            for(let i=0; i<$menus.length; i++){
                setStyle($menus[i],{
                    transitionDuration: config.duration,
                    transitionTimingFunction: config.timing,
                });
            }
            config.firstTime = false; // define 初回のみ
        }

        // openクラスの有無を真偽値反転で取得
        const trigger = !$target.classList.contains(config.openClass);
        // true -> open
        if(trigger){
            onlyMenu();
            openMenu($target,$openEle);
        }
        // false -> close 
        else {
            closeMenu($target,$openEle);
        }
    };


    /******************************
    * run
    ******************************/

    // forEach 代用 -> clickEvent 設定
    for(let i=0; i<$btns.length; i++){
        $btns[i].addEventListener('click',toggleMenu,false);
    }
    // forEach 代用 -> 初期Style 設定
    for(let i=0; i<$menus.length; i++){
        setStyle($menus[i],{
            height: 0 + 'px',
            overflowY: 'hidden',
        });
    }
    // config.first -> メニューの最初をデフォルトで開く設定がtrueの場合
    firstMenu();
}
