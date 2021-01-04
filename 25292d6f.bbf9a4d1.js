(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{137:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return o})),a.d(t,"metadata",(function(){return i})),a.d(t,"rightToc",(function(){return p})),a.d(t,"default",(function(){return u}));var n=a(2),r=a(6),c=(a(0),a(259)),l=a(263),b=a(264),o={id:"api-blockchain-get-tx-block",title:"GetTxBlock"},i={id:"apis/api-blockchain-get-tx-block",isDocsHomePage:!1,title:"GetTxBlock",description:"---",source:"@site/docs/apis/api-blockchain-get-tx-block.mdx",permalink:"/docs/apis/api-blockchain-get-tx-block",editUrl:"https://github.com/Zilliqa/dev-portal/tree/master/docs/apis/api-blockchain-get-tx-block.mdx",sidebar:"APIsSideBar",previous:{title:"GetTransactionRate",permalink:"/docs/apis/api-blockchain-get-tx-rate"},next:{title:"GetTxBlockRate",permalink:"/docs/apis/api-blockchain-get-tx-block-rate"}},p=[{value:"Example Request",id:"example-request",children:[]},{value:"Example Response",id:"example-response",children:[]},{value:"HTTP Request",id:"http-request",children:[]},{value:"Arguments",id:"arguments",children:[]}],s={rightToc:p};function u(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(c.b)("wrapper",Object(n.a)({},s,a,{components:t,mdxType:"MDXLayout"}),Object(c.b)("hr",null),Object(c.b)("p",null,"Returns the details of a specified Transaction block."),Object(c.b)("h3",{id:"example-request"},"Example Request"),Object(c.b)(l.a,{defaultValue:"cURL",values:[{label:"cURL",value:"cURL"},{label:"node.js",value:"node.js"},{label:"java",value:"java"},{label:"python",value:"python"},{label:"go",value:"go"}],mdxType:"Tabs"},Object(c.b)(b.a,{value:"cURL",mdxType:"TabItem"},Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-shell"}),'curl -d \'{\n    "id": "1",\n    "jsonrpc": "2.0",\n    "method": "GetTxBlock",\n    "params": ["40"]\n}\' -H "Content-Type: application/json" -X POST "https://api.zilliqa.com/"\n'))),Object(c.b)(b.a,{value:"node.js",mdxType:"TabItem"},Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),'const txBlock = await zilliqa.blockchain.getTxBlock("40");\nconsole.log(txBlock.result);\n'))),Object(c.b)(b.a,{value:"java",mdxType:"TabItem"},Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-java"}),'public class App {\n    public static void main(String[] args) throws IOException {\n        HttpProvider client = new HttpProvider("https://api.zilliqa.com/");\n        Rep<TxBlock> txBlock = client.getTxBlock("40");\n        System.out.println(new Gson().toJson(txBlock));\n    }\n}\n'))),Object(c.b)(b.a,{value:"python",mdxType:"TabItem"},Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-python"}),'from pyzil.zilliqa import chain\nchain.set_active_chain(chain.MainNet)\nprint(chain.active_chain.api.GetTxBlock("40"))\n'))),Object(c.b)(b.a,{value:"go",mdxType:"TabItem"},Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-go"}),'func GetTxBlock(t *testing.T) {\n    provider := NewProvider("https://api.zilliqa.com/")\n    response := provider.GetTxBlock("40")\n    result, _ := json.Marshal(response)\n    fmt.Println(string(result))\n}\n')))),Object(c.b)("h3",{id:"example-response"},"Example Response"),Object(c.b)("pre",null,Object(c.b)("code",Object(n.a)({parentName:"pre"},{className:"language-json"}),'{\n  "id": "1",\n  "jsonrpc": "2.0",\n  "result": {\n    "body": {\n      "BlockHash": "79fdf67632c9f793650955297c860d021c3241f2b448120747ee8fe502c03e54",\n      "HeaderSign": "CB8290232ECE38030EAD865859A77616BD10738D79D6335F003427C6118C1CBFEC94D33183A73D5E8877361582748D2EEC895722066D390E79119B8E2DC3411D",\n      "MicroBlockInfos": [\n        {\n          "MicroBlockHash": "97ab843bfd7a520f65c16667a8700ba11a886cc130254258e155d48be3ee3fb5",\n          "MicroBlockShardId": 0,\n          "MicroBlockTxnRootHash": "0000000000000000000000000000000000000000000000000000000000000000"\n        },\n        {\n          "MicroBlockHash": "120d3f2c76e1c55b6adb3e78aa3aa1c34e618fd3023069420dd1dcd79689cd50",\n          "MicroBlockShardId": 1,\n          "MicroBlockTxnRootHash": "0000000000000000000000000000000000000000000000000000000000000000"\n        },\n        {\n          "MicroBlockHash": "3fbae433e0e5c30ab89ec75cd32276dd49581941c7d0fc318503ca55693a9aed",\n          "MicroBlockShardId": 2,\n          "MicroBlockTxnRootHash": "0000000000000000000000000000000000000000000000000000000000000000"\n        }\n      ]\n    },\n    "header": {\n      "BlockNum": "40",\n      "DSBlockNum": "1",\n      "GasLimit": "1500000",\n      "GasUsed": "0",\n      "MbInfoHash": "dcb2c79d8fd7021634039e49578c1e7415f4a6aa9586043db3f488a34e6846ff",\n      "MinerPubKey": "0x020035B739426374C5327A1224B986005297102E01C29656B8B086BF4B352C6CA9",\n      "NumMicroBlocks": 3,\n      "NumTxns": 0,\n      "PrevBlockHash": "b87e9f526ffbaa653fcb9b2db731f53c65420f12ace6d88bd2753f816650bdb5",\n      "Rewards": "0",\n      "StateDeltaHash": "0000000000000000000000000000000000000000000000000000000000000000",\n      "StateRootHash": "77ebb9cce52b0e1bc8ce1c0e5669e88f5018bd986d01339960ba07882b63ed79",\n      "Timestamp": "1548930491181914",\n      "Version": 1\n    }\n  }\n}\n')),Object(c.b)("h3",{id:"http-request"},"HTTP Request"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Chain(s)"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"URL(s)"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("strong",{parentName:"td"},"Zilliqa mainnet")),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("a",Object(n.a)({parentName:"td"},{href:"https://api.zilliqa.com/"}),"https://api.zilliqa.com/"))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("strong",{parentName:"td"},"Developer testnet")),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("a",Object(n.a)({parentName:"td"},{href:"https://dev-api.zilliqa.com/"}),"https://dev-api.zilliqa.com/"))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("strong",{parentName:"td"},"Local testnet")),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"http://localhost:4201/")),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("strong",{parentName:"td"},"Isolated server")),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("a",Object(n.a)({parentName:"td"},{href:"https://zilliqa-isolated-server.zilliqa.com/"}),"https://zilliqa-isolated-server.zilliqa.com/"))))),Object(c.b)("h3",{id:"arguments"},"Arguments"),Object(c.b)("table",null,Object(c.b)("thead",{parentName:"table"},Object(c.b)("tr",{parentName:"thead"},Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Parameter"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Required"),Object(c.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(c.b)("tbody",{parentName:"table"},Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("inlineCode",{parentName:"td"},"id")),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Required"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("inlineCode",{parentName:"td"},'"1"'))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("inlineCode",{parentName:"td"},"jsonrpc")),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Required"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("inlineCode",{parentName:"td"},'"2.0"'))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("inlineCode",{parentName:"td"},"method")),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Required"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("inlineCode",{parentName:"td"},'"GetTxBlock"'))),Object(c.b)("tr",{parentName:"tbody"},Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(c.b)("inlineCode",{parentName:"td"},"params")),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Required"),Object(c.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Specifed TX block number to return. Example: ",Object(c.b)("inlineCode",{parentName:"td"},'"40"'))))))}u.isMDXComponent=!0},259:function(e,t,a){"use strict";a.d(t,"a",(function(){return s})),a.d(t,"b",(function(){return m}));var n=a(0),r=a.n(n);function c(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function b(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){c(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},c=Object.keys(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)a=c[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=r.a.createContext({}),p=function(e){var t=r.a.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):b(b({},t),e)),a},s=function(e){var t=p(e.components);return r.a.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},d=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,c=e.originalType,l=e.parentName,i=o(e,["components","mdxType","originalType","parentName"]),s=p(a),d=n,m=s["".concat(l,".").concat(d)]||s[d]||u[d]||c;return a?r.a.createElement(m,b(b({ref:t},i),{},{components:a})):r.a.createElement(m,b({ref:t},i))}));function m(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var c=a.length,l=new Array(c);l[0]=d;var b={};for(var o in t)hasOwnProperty.call(t,o)&&(b[o]=t[o]);b.originalType=e,b.mdxType="string"==typeof e?e:n,l[1]=b;for(var i=2;i<c;i++)l[i]=a[i];return r.a.createElement.apply(null,l)}return r.a.createElement.apply(null,a)}d.displayName="MDXCreateElement"},260:function(e,t,a){"use strict";function n(e){var t,a,r="";if("string"==typeof e||"number"==typeof e)r+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(a=n(e[t]))&&(r&&(r+=" "),r+=a);else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}t.a=function(){for(var e,t,a=0,r="";a<arguments.length;)(e=arguments[a++])&&(t=n(e))&&(r&&(r+=" "),r+=t);return r}},261:function(e,t,a){"use strict";var n=a(0);const r=Object(n.createContext)({tabGroupChoices:{},setTabGroupChoices:()=>{},isAnnouncementBarClosed:!1,closeAnnouncementBar:()=>{}});t.a=r},262:function(e,t,a){"use strict";var n=a(0),r=a(261);t.a=function(){return Object(n.useContext)(r.a)}},263:function(e,t,a){"use strict";var n=a(0),r=a.n(n),c=a(262),l=a(260),b=a(92),o=a.n(b);const i=37,p=39;t.a=function(e){const{block:t,children:a,defaultValue:b,values:s,groupId:u}=e,{tabGroupChoices:d,setTabGroupChoices:m}=Object(c.a)(),[j,O]=Object(n.useState)(b);if(null!=u){const e=d[u];null!=e&&e!==j&&s.some(t=>t.value===e)&&O(e)}const f=e=>{O(e),null!=u&&m(u,e)},g=[];return r.a.createElement("div",null,r.a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:Object(l.a)("tabs",{"tabs--block":t})},s.map(({value:e,label:t})=>r.a.createElement("li",{role:"tab",tabIndex:"0","aria-selected":j===e,className:Object(l.a)("tabs__item",o.a.tabItem,{"tabs__item--active":j===e}),key:e,ref:e=>g.push(e),onKeyDown:e=>((e,t,a)=>{switch(a.keyCode){case p:((e,t)=>{const a=e.indexOf(t)+1;e[a]?e[a].focus():e[0].focus()})(e,t);break;case i:((e,t)=>{const a=e.indexOf(t)-1;e[a]?e[a].focus():e[e.length-1].focus()})(e,t)}})(g,e.target,e),onFocus:()=>f(e),onClick:()=>f(e)},t))),r.a.createElement("div",{role:"tabpanel",className:"margin-vert--md"},n.Children.toArray(a).filter(e=>e.props.value===j)[0]))}},264:function(e,t,a){"use strict";var n=a(0),r=a.n(n);t.a=function(e){return r.a.createElement("div",null,e.children)}}}]);