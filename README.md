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
3. setAccordion(btn's selector,｛openClass,duration,timingfunction,only(true or false), first(true or false)｝)
4. only: Open only one
5. first: Open first
```
<body>


<script src="accordion.js"></script>
<script>
    const accordion = new SetAccordion('.faq__question',{
        only: true,
        first: true,
    });
</script>
</body>
```

## Browser
Compatible with IE11 and modern browsers
