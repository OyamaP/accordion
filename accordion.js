/**
 * polyfill
 * @link https://developer.mozilla.org/ja/docs/Web/API/Element/closest
 */
// matches
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
}
// closest  
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
   // constructor
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
    const $menus = [];
    // [...Array].map 代用
    for(let i=0; i<$btns.length; i++){
        $menus.push($btns[i].nextElementSibling);
    }


    /******************************
    * functions
    ******************************/

    // style設定(対象要素or配列,オブジェクト{propaty:value})
    // forEach 代用
    const setStyle = function(arg,obj){
        const set = function($ele){
            for(let propaty in obj){
                $ele.style[propaty] = obj[propaty];
            }
        };
        // 配列判定でループ処理
        if(Array.isArray(arg)){
            for(let i=0; i<arg.length; i++){set(arg[i])}
        }
        else{
            set(arg);
        }
  
    }

    // addToggleMenu
    // clickEvent 付与
    const addToggleMenu = function(){
        // forEach 代用 -> clickEvent 設定
        for(let i=0; i<$btns.length; i++){
            $btns[i].addEventListener('click',toggleMenu,false);
        }
    }

    // openMenu
    // メニューを開いた際のCSSやClass設定
    const openMenu = function($btn,$menu){
        // メニュー内部の高さを取得し反映
        const height = $menu.firstElementChild.offsetHeight;
        $menu.style.height = height + 'px';
        // openクラスを付与 -> trigger 判定
        $btn.classList.add(config.openClass);
    };

    // closeMenu
    // メニューを閉じた際のCSSやClass設定解除
    const closeMenu = function($btn,$menu){
        $btn.classList.remove(config.openClass);
        $menu.style.height = 0 + 'px';
    };

    // onlyMenu
    // 他のメニューを開いた際に今開いているメニューを閉じる
    const onlyMenu = function(){
        if(!config.only) return;
        const $btn = document.querySelector(config.$btn + '.'+ config.openClass);
        if(!$btn) return;
        const $menu = $btn.nextElementSibling;
        closeMenu($btn,$menu);
    };

    // firstMenu
    // 一つ目のメニューのみを予め開いておく設定
    const firstMenu = function(){
        if(!config.first) return;
        const $btn = document.querySelector(config.$btn);
        const $menu = $btn.nextElementSibling;
        openMenu($btn,$menu);
    };


    // メニュー開閉 ClickEvent
    const toggleMenu = function(e){
        // e.target補正
        const $target = e.target.closest(config.$btn);
        // クリックされた要素の次要素を取得
        const $openEle = $target.nextElementSibling;
        if(!$openEle) return;
        if(config.firstTime){
            //アニメーション設定
            setStyle($menus,{
                transitionDuration: config.duration,
                transitionTimingFunction: config.timing,
            });
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

    // Style初期設定
    setStyle($menus,{
        height: 0 + 'px',
        overflowY: 'hidden',
    });
    addToggleMenu();
    firstMenu();

}
