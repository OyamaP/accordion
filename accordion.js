/**
 * polyfill / forEach
 * @link https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
 */
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

/**
 * polyfill / matches
 * @link https://developer.mozilla.org/ja/docs/Web/API/Element/matches
 */
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
}

/**
 * polyfill / closest
 * @link https://developer.mozilla.org/ja/docs/Web/API/Element/closest
 */
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
function SetAccordion(argObj){

    /******************************
    * define
    ******************************/
   // constructor
    const config = {
        $btn: '', // 開閉ボタンselector
        $menu: '', // 開閉メニューselector
        $toggle: '', // openClassをtoggleする任意要素
        openClass: 'open', // open時のボタンに付与されるclass
        duration: '0.5s', // css transition-duration
        timing: 'ease', // css transition-timing-function
        next: false, // $btn に隣接する次の要素をmenuとする
        only: false, // openするmenuを一つだけにする
        first: false, // 一番最初のmenuを開けておく
        firstTime: true, // 初回クリック判定
    };
    // config -> 引数上書き
    for(let key in argObj){
        if(!config.hasOwnProperty(key)) continue;
        config[key] = argObj[key];
    }

    // アコーディオン開閉ボタン
    const $btns = [].slice.call(document.querySelectorAll(config.$btn));

    // アコーディオンメニュー
    let $menus = [];
    if(config.next){
        // $btn の次要素を取得
        // [...Array].map 代用
        const length = $btns.length;
        for(let i=0; i<length; i++){
            $menus.push($btns[i].nextElementSibling);
        }
    }
    else if(config.$menu){
        // 指定した$menuを全取得
        $menus = [].slice.call(document.querySelectorAll(config.$menu));
    }
    else{return}

    // toggle対象
    let $toggles = [];
    if(config.$toggle){
        // 指定した$toggleを全取得
        $toggles = [].slice.call(document.querySelectorAll(config.$toggle));
    }
    // 指定がない場合は$btnと同一とする
    else{$toggles = $btns}



    /******************************
    * functions / common
    ******************************/

    // 共通化関数
    // 単一変数と配列を同等に扱い処理するコールバック関数
    // NodeListを判定できないためquerySelectorAllを[].slice.call()
    const standardized = function(arg,fn){
        if(Array.isArray(arg)){
            const length = arg.length;
            for(let i=0; i<length; i++){fn(arg[i])}
        }
        else{
            fn(arg);
        }
    };

    // style設定(対象要素or配列,オブジェクト{propaty:value})
    const setStyle = function(arg,obj){
        standardized(arg,function($ele){
            for(let propaty in obj){
                $ele.style[propaty] = obj[propaty];
            }
        });
    };

    /******************************
    * functions / accordion
    ******************************/

    // メニューを開いた際のCSSやClass設定
    const openMenu = function($btn,$menu){
        standardized($btn,function($ele){
            // config.openClass 付与
            $ele.classList.add(config.openClass);
        });
        standardized($menu,function($ele){
            // config.openClass 付与
            $ele.classList.add(config.openClass);
            // メニュー内部の高さを取得し反映
            const height = $ele.firstElementChild.offsetHeight;
            $ele.style.height = height + 'px';
        });
    };

    // メニューを閉じた際のCSSやClass設定解除
    const closeMenu = function($btn,$menu){
        standardized($btn,function($ele){
            $ele.classList.remove(config.openClass);
        });
        standardized($menu,function($ele){
            $ele.classList.remove(config.openClass);
            $ele.style.height = 0 + 'px';
        });
    };


    // 他のメニューを開いた際に今開いているメニューを閉じる
    const onlyMenu = function(){
        if(!config.only) return;
        const $btn = [].slice.call(document.querySelectorAll(config.$btn + '.'+ config.openClass));
        let $menu = [];
        const length = $menus.length;
        // array.map 代用
        for(let i=0; i<length; i++){
            if($menus[i].classList.contains(config.openClass)){
                $menu.push($menus[i]);
            }
        }
        if(!$btn.length || !$menu.length) return;
        closeMenu($btn,$menu);
    };

    // 一つ目のメニューのみを予め開いておく設定
    const firstMenu = function(){
        if(!config.first) return;
        openMenu($btns[0],$menus[0]);
    };

    // 初回動作設定
    const firstClick = function(){
        if(config.firstTime){
            //アニメーション設定
            setStyle($menus,{
                transitionDuration: config.duration,
                transitionTimingFunction: config.timing,
            });
            config.firstTime = false; // define 初回のみ
        }
    };


    /******************************
    * functions / clickEvent
    ******************************/

    // clickEvent 付与
    const addClickEvent = function(){
        for(let i=0; i<$btns.length; i++){
            $btns[i].addEventListener('click',toggleMenu,false);
        }
    };

    // メニュー開閉 ClickEvent
    const toggleMenu = function(e){
        // e.target補正
        const $target = e.target.closest(config.$btn);
        // targetの次要素を取得
        const $openEle = $target.nextElementSibling;
        // 初回動作設定
        firstClick();
        // openクラスの有無を真偽値反転で取得
        const trigger = !$target.classList.contains(config.openClass);
        const branch = function($btn,$menu){
            // true -> open
            if(trigger){
                onlyMenu();
                openMenu($btn,$menu);
            }
            // false -> close 
            else {
                closeMenu($btn,$menu);
            }
        };
        if(config.next){
            branch($target,$openEle);
        }
        else{
            branch($btns,$menus);
        }

    };


    /******************************
    * run
    ******************************/

    // Style初期設定
    setStyle($menus,{
        height: 0 + 'px',
        overflowY: 'hidden',
    });
    addClickEvent();
    firstMenu();

}
