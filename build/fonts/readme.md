`src/less/base/_fonts.less`

```css
@font-face {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("../../fonts/roboto-regular.woff2") format("woff2"),
       url("../../fonts/roboto-regular.woff") format("woff"),
       url("../../fonts/roboto-regular.ttf") format("truetype");
  unicode-range: U+000-5FF; /* Latin glyphs */
}

@font-face {
  font-family: "Quotes";
  src: local("Times New Roman");
  unicode-range: U+2019, U+201C, U+201D;
}
```