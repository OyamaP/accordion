# accordion.js

## Background
- Q.What is this?
- A.Set the accordion menu.
- Q.What is the programming language used in this tool?
- A.This tool uses JavaScript.<br>
　Native JS without jQuery.
- Q.Why did you decide to make it?
- A.Because…<br>
　CSS(checkbox): The height of the menu is fixed.<br>
　jQuery: There are requirements that cannot be used.

## How to use

1. Adjacent buttons and menus
2. Load JavaScript as shown below
- $btn -> clickBtn
- $menu -> openMenu(outer)
- $toggle -> Any element to toggle
- openClass -> Any class to use
- duration -> css transition-duration
- timing -> css transition-timing-function
- next -> Make the next element of the button a menu<br>
　※$menu is disabled
- only -> Open only one
- first -> Open first
```
<body>


<script src="accordion.js"></script>
<script>
        const faq = new SetAccordion({
            $btn: '.faq__question',
            next: true,
            only: true,
            first: true,
        });
        const news = new SetAccordion({
            $btn: '.news__btn',
            $menu: '.newsbox__detailtext',
            duration: '0.75s',
            timing: 'ease-in-out',
        });
</script>
</body>
```

## Browser
Compatible with IE11 and modern browsers

## Use PolyFill for IE11
- forEach
- matches
- closest
