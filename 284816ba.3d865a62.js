(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{148:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return s})),n.d(t,"default",(function(){return l}));var i=n(2),r=n(6),a=(n(0),n(287)),o={id:"exchange-getting-started",title:"Hosting Seed Nodes",keywords:["exchanges","ip whitelisting","hardware requirements","docker setup","zilliqa"],description:"Getting Started For Exchanges"},c={id:"exchanges/exchange-getting-started",isDocsHomePage:!1,title:"Hosting Seed Nodes",description:"Getting Started For Exchanges",source:"@site/docs/exchanges/exchange-introduction.mdx",permalink:"/docs/exchanges/exchange-getting-started",editUrl:"https://github.com/Zilliqa/dev-portal/tree/master/docs/exchanges/exchange-introduction.mdx",sidebar:"ExchangesSidebar",next:{title:"IP Whitelisting",permalink:"/docs/exchanges/exchange-ip-whitelisting"}},s=[{value:"Introduction",id:"introduction",children:[]},{value:"Modes",id:"modes",children:[{value:"IP Whitelisting Mode",id:"ip-whitelisting-mode",children:[]},{value:"Key Whitelisting Mode",id:"key-whitelisting-mode",children:[]}]},{value:"Minimum Hardware Requirements",id:"minimum-hardware-requirements",children:[]}],d={rightToc:s};function l(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(a.b)("wrapper",Object(i.a)({},d,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("hr",null),Object(a.b)("div",{className:"admonition admonition-danger alert alert--danger"},Object(a.b)("div",Object(i.a)({parentName:"div"},{className:"admonition-heading"}),Object(a.b)("h5",{parentName:"div"},Object(a.b)("span",Object(i.a)({parentName:"h5"},{className:"admonition-icon"}),Object(a.b)("svg",Object(i.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"}),Object(a.b)("path",Object(i.a)({parentName:"svg"},{fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"})))),"$ZIL Disclaimer")),Object(a.b)("div",Object(i.a)({parentName:"div"},{className:"admonition-content"}),Object(a.b)("p",{parentName:"div"},"Please read ",Object(a.b)("a",Object(i.a)({parentName:"p"},{href:"https://www.zilliqa.com/disclaimer"}),"$ZIL disclaimer")," before proceeding. "))),Object(a.b)("h2",{id:"introduction"},"Introduction"),Object(a.b)("p",null,"While it's possible to use the public endpoint provided by Zilliqa to interact\nwith the blockchain, we recommend that all exchanges that wish to support\ntrading on the mainnet set up seed nodes. This section walks you through the\nbasic steps needed to get the seed node up and running."),Object(a.b)("h2",{id:"modes"},"Modes"),Object(a.b)("p",null,"Running a seed node is possible through 3 different modes. Exchanges can use\nwhichever mode is feasible for their case."),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"IP whitelisting"),Object(a.b)("li",{parentName:"ul"},"Key whitelisting (with and without open inbound port)")),Object(a.b)("h3",{id:"ip-whitelisting-mode"},"IP Whitelisting Mode"),Object(a.b)("p",null,"In IP whitelisting mode, blockchain data is pushed directly to exchanges in\nperiodic intervals. As seed nodes using this mode receive data directly and do\nnot otherwise pull data from peers, exchanges must be whitelisted by Zilliqa to\nreceive these data broadcasts. This requires a static, public IP address with\nminimally two open ports (inbound and outbound) at which it can be reached.\nThe ",Object(a.b)("a",Object(i.a)({parentName:"p"},{href:"exchange-ip-whitelisting"}),"IP Whitelisting")," section contains information\nabout running a node in IP whitelisting mode."),Object(a.b)("h3",{id:"key-whitelisting-mode"},"Key Whitelisting Mode"),Object(a.b)("p",null,"In key whitelisting mode, blockchain data is pulled by the seed from Zilliqa\nResearch-hosted public seed nodes in periodic intervals. Exchanges using\nthis mode generate a public-private key pair and share their public key with\nZilliqa Research for whitelisting. At minimum, a port has to be opened for\noutbound traffic. Exchanges using this mode have the further option of\nconfiguring a second port for inbound traffic. The ",Object(a.b)("a",Object(i.a)({parentName:"p"},{href:"exchange-key-whitelisting-1"}),"Key Whitelisting"),"\nsection contains information about running a node in key whitelisting mode."),Object(a.b)("h2",{id:"minimum-hardware-requirements"},"Minimum Hardware Requirements"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"x64 Linux operating system (e.g Ubuntu 18.04.5)"),Object(a.b)("li",{parentName:"ul"},"Recent dual core processor @ 2.2 GHZ. Examples: Intel Xeon (Skylake)"),Object(a.b)("li",{parentName:"ul"},"8GB DRR3 RAM or higher"),Object(a.b)("li",{parentName:"ul"},"Public static IP address"),Object(a.b)("li",{parentName:"ul"},"500GB Solid State Drive"),Object(a.b)("li",{parentName:"ul"},"100MB/s upload and download bandwidth")))}l.isMDXComponent=!0},287:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return b}));var i=n(0),r=n.n(i);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,i,r=function(e,t){if(null==e)return{};var n,i,r={},a=Object.keys(e);for(i=0;i<a.length;i++)n=a[i],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(i=0;i<a.length;i++)n=a[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var d=r.a.createContext({}),l=function(e){var t=r.a.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=l(e.components);return r.a.createElement(d.Provider,{value:t},e.children)},h={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},p=r.a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,o=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),u=l(n),p=i,b=u["".concat(o,".").concat(p)]||u[p]||h[p]||a;return n?r.a.createElement(b,c(c({ref:t},d),{},{components:n})):r.a.createElement(b,c({ref:t},d))}));function b(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=p;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:i,o[1]=c;for(var d=2;d<a;d++)o[d]=n[d];return r.a.createElement.apply(null,o)}return r.a.createElement.apply(null,n)}p.displayName="MDXCreateElement"}}]);