"use strict";(self.webpackChunkcow_docs=self.webpackChunkcow_docs||[]).push([[5484],{13006:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>s,default:()=>p,frontMatter:()=>a,metadata:()=>i,toc:()=>c});var r=t(85893),o=t(11151);const a={},s="Permit, Swap & Bridge CoW Hook",i={id:"overview/cow-hooks/cow-hooks-example/permit-swap-and-bridge-cow-hook",title:"Permit, Swap & Bridge CoW Hook",description:"Now that we have the setup out of the way, lets make use of CoW Hooks to set up an order that, when executed will:",source:"@site/docs/overview/cow-hooks/cow-hooks-example/permit-swap-and-bridge-cow-hook.md",sourceDirName:"overview/cow-hooks/cow-hooks-example",slug:"/overview/cow-hooks/cow-hooks-example/permit-swap-and-bridge-cow-hook",permalink:"/docs-v2/docs/overview/cow-hooks/cow-hooks-example/permit-swap-and-bridge-cow-hook",draft:!1,unlisted:!1,editUrl:"https://github.com/cowprotocol/docs/tree/main/docs/overview/cow-hooks/cow-hooks-example/permit-swap-and-bridge-cow-hook.md",tags:[],version:"current",frontMatter:{}},d={},c=[{value:"EIP-2612 Permit",id:"eip-2612-permit",level:2},{value:"Token Bridging",id:"token-bridging",level:2},{value:"On-chain",id:"on-chain",level:3},{value:"Off-chain",id:"off-chain",level:3},{value:"Order Creation",id:"order-creation",level:2},{value:"Ready, Action",id:"ready-action",level:2}];function l(e){const n=Object.assign({h1:"h1",p:"p",ol:"ol",li:"li",h2:"h2",code:"code",pre:"pre",h3:"h3",blockquote:"blockquote",a:"a",img:"img",ul:"ul"},(0,o.ah)(),e.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"permit-swap--bridge-cow-hook",children:"Permit, Swap & Bridge CoW Hook"}),"\n",(0,r.jsx)(n.p,{children:"Now that we have the setup out of the way, lets make use of CoW Hooks to set up an order that, when executed will:"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"Set the required token approval to CoW Protocol - this allows the user to trade regardless of whether or not they have Ether to execute the approval transaction themselves and so that the approval is only set if the order were to execute (no reason to pay for an approval that doesn\u2019t get used amirite?). Note that this requires a token that has EIP-2612 permit support (such as COW, USDC, and DAI; many modern tokens support this)."}),"\n",(0,r.jsx)(n.li,{children:"Bridges the resulting trade proceeds to Gnosis Chain"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"eip-2612-permit",children:"EIP-2612 Permit"}),"\n",(0,r.jsx)(n.p,{children:"The next order of business is to compute the pre-hook for setting the required approval of the CoW Protocol Vault Relayer contract."}),"\n",(0,r.jsx)(n.p,{children:"For this, we make use of EIP-2612 permit. This EIP defines an extension for ERC-20 tokens that allows any account to set ERC-20 approvals on behalf of another with an off-chain signature. In other words, we can sign with an off-chain signature permission for anyone to set a single approval to CoW Protocol for us. This signature can be used in a pre-hook so that a solver can execute the approval on your behalf only if your order were to trade."}),"\n",(0,r.jsxs)(n.p,{children:["Let's compute the ",(0,r.jsx)(n.code,{children:"permit"})," parameters and sign them:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'const permit = {\n  owner: wallet.address,\n  spender: VAULT_RELAYER.address,\n  value: orderParams.sellAmount,\n  nonce: await USDC.nonces(wallet.address),\n  deadline: ethers.constants.MaxUint256,\n};\nconst permitSignature = ethers.utils.splitSignature(\n  await wallet._signTypedData(\n    {\n      name: await USDC.name(),\n      version: await USDC.version(),\n      chainId,\n      verifyingContract: USDC.address,\n    },\n    {\n      Permit: [\n        { name: "owner", type: "address" },\n        { name: "spender", type: "address" },\n        { name: "value", type: "uint256" },\n        { name: "nonce", type: "uint256" },\n        { name: "deadline", type: "uint256" },\n      ],\n    },\n    permit,\n  ),\n);\n'})}),"\n",(0,r.jsxs)(n.p,{children:["And finally, we can build our ",(0,r.jsx)(n.code,{children:"permit"})," pre-hook:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'const permitParams = [\n  permit.owner,\n  permit.spender,\n  permit.value,\n  permit.deadline,\n  permitSignature.v,\n  permitSignature.r,\n  permitSignature.s,\n];\nconst permitHook = {\n  target: USDC.address,\n  callData: USDC.interface.encodeFunctionData("permit", permitParams),\n  gasLimit: `${await USDC.estimateGas.permit(...permitParams)}`,\n};\n'})}),"\n",(0,r.jsx)(n.h2,{id:"token-bridging",children:"Token Bridging"}),"\n",(0,r.jsx)(n.p,{children:"\u26a0\ufe0f This example makes use of an unaudited contract, use at your own risk!."}),"\n",(0,r.jsx)(n.h3,{id:"on-chain",children:"On-chain"}),"\n",(0,r.jsx)(n.p,{children:"Now, we want to add a post-hook to bridge the funds that we receive from trading over to Gnosis Chain."}),"\n",(0,r.jsx)(n.p,{children:'Unfortunately, bridging contracts aren\'t designed with this use-case in mind. In particular, the hooks are called from an unprivileged context (specifically, the settlement will "trampoline" the user-specified hooks over an intermediary contract as a security measure):'}),"\n",(0,r.jsxs)("figure",{children:[(0,r.jsx)("img",{src:"../../../img/image.png",alt:""}),(0,r.jsx)("figcaption",{})]}),"\n",(0,r.jsxs)(n.p,{children:["The existing Gnosis Chain ",(0,r.jsx)(n.code,{children:"Omnibridge"})," contract takes tokens for bridging from ",(0,r.jsx)(n.code,{children:"msg.sender"}),", so we need to design an on-chain contract to temporarily hold the funds for the bridging process. Fortunately, this is very easy to do:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-solidity",children:"contract BridgeAccount {\n    address public immutable user;\n    address public immutable omnibridge;\n\n    constructor(address user_, address omnibridge_) {\n        user = user_;\n        omnibridge = omnibridge_;\n    }\n\n    function bridge(address token, uint256 amount) external {\n        IERC20(token).approve(omnibridge, amount);\n        IOmnibridge(omnibridge).relayTokens(token, user, amount);\n    }\n\n    function withdraw(address token, uint256 amount) external {\n        IERC20(token).transfer(user, amount);\n    }\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:'This contract works by deploying a per-user "bridging account", where funds deposited can only be bridged to the user, or withdrawn back to the user, keeping the funds safe!'}),"\n",(0,r.jsxs)(n.blockquote,{children:["\n",(0,r.jsx)(n.p,{children:"Note that there are no on-chain guarantees that order hooks will get executed as part of a settlement. These are guaranteed by off-chain protocol rules where damages will be taken from solver bonding pools (which sets an upper bound for how much in funds is protected). Keep this in mind as you design your hooks."}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["In addition to this contract, we also create a ",(0,r.jsx)(n.code,{children:"Bridger"})," factory contract that deploys accounts per user and makes bridging with hooks easier. For the full source code, see ",(0,r.jsx)(n.a,{href:"https://etherscan.io/address/0xe71ccc8d4e0a298e1300a702ad0ac93303dc8ae5#code",children:(0,r.jsx)(n.code,{children:"[contracts/Bridger.sol]"})}),"."]}),"\n",(0,r.jsx)(n.p,{children:"This can be extended to allow for bridging to different receivers, this is left as an exercise to the reader"}),"\n",(0,r.jsx)(n.h3,{id:"off-chain",children:"Off-chain"}),"\n",(0,r.jsx)(n.p,{children:"Now that we have our bridging intermediary contract, we can generate the hook for bridging the funds received from trading."}),"\n",(0,r.jsx)(n.p,{children:"This is a walk in the park, just compute the receiver address and generate data for the hook:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'orderConfig.receiver = await BRIDGER.getAccountAddress(wallet.address);\nconst bridgeHook = {\n  target: BRIDGER.address,\n  callData: BRIDGER.interface.encodeFunctionData("bridgeAll", [\n    wallet.address,\n    COW.address,\n  ]),\n  // Approximate gas limit determined with Tenderly.\n  gasLimit: "228533",\n};\n'})}),"\n",(0,r.jsx)(n.h2,{id:"order-creation",children:"Order Creation"}),"\n",(0,r.jsx)(n.p,{children:"Now that we have our hooks set up, it is time to create our order!"}),"\n",(0,r.jsxs)(n.p,{children:["First, we need to include our hooks in the order's ",(0,r.jsx)(n.code,{children:"appData"}),". Hooks are specified as part of ",(0,r.jsxs)(n.a,{href:"https://docs.cow.fi/front-end/creating-app-ids",children:[(0,r.jsx)(n.code,{children:"appData"})," documents"]}),(0,r.jsx)(n.a,{href:"https://docs.cow.fi/front-end/creating-app-ids/create-the-order-meta-data-file/additional-order-preferences",children:" "}),"in order to ensure that hook preferences are signed by the order:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"orderConfig.appData = JSON.stringify({\n  metadata: {\n    hooks: {\n      pre: [permitHook],\n      post: [bridgeHook],\n    },\n  },\n});\n"})}),"\n",(0,r.jsx)(n.p,{children:"Now, lets get a quote for our order:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'const { id: quoteId, quote } = await fetch(\n  "https://barn.api.cow.fi/mainnet/api/v1/quote",\n  {\n    method: "POST",\n    headers: {\n      "content-type": "application/json",\n    },\n    body: JSON.stringify({\n      from: wallet.address,\n      sellAmountBeforeFees: orderConfig.sellAmount,\n      ...orderConfig,\n    }),\n  },\n).then((response) => response.json());\nconsole.log("quote:", quoteId, quote);\n'})}),"\n",(0,r.jsxs)(n.p,{children:["Note that the API will compute a ",(0,r.jsx)(n.code,{children:"feeAmount"})," that takes the hook gas amounts into account. This means that gas for the ",(0,r.jsx)(n.code,{children:"permit"})," and bridging transactions are paid in the sell token only if (and when) the order executes! Account abstraction at its finest \ud83d\ude04."]}),"\n",(0,r.jsx)(n.p,{children:"Now all we need to do is sign the order:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'const orderData = {\n  ...orderConfig,\n  sellAmount: quote.sellAmount,\n  buyAmount: `${ethers.BigNumber.from(quote.buyAmount).mul(99).div(100)}`,\n  validTo: quote.validTo,\n  appData: ethers.utils.id(orderConfig.appData),\n  feeAmount: quote.feeAmount,\n};\nconst orderSignature = await wallet._signTypedData(\n  {\n    name: "Gnosis Protocol",\n    version: "v2",\n    chainId,\n    verifyingContract: SETTLEMENT.address,\n  },\n  {\n    Order: [\n      { name: "sellToken", type: "address" },\n      { name: "buyToken", type: "address" },\n      { name: "receiver", type: "address" },\n      { name: "sellAmount", type: "uint256" },\n      { name: "buyAmount", type: "uint256" },\n      { name: "validTo", type: "uint32" },\n      { name: "appData", type: "bytes32" },\n      { name: "feeAmount", type: "uint256" },\n      { name: "kind", type: "string" },\n      { name: "partiallyFillable", type: "bool" },\n      { name: "sellTokenBalance", type: "string" },\n      { name: "buyTokenBalance", type: "string" },\n    ],\n  },\n  orderData,\n);\n'})}),"\n",(0,r.jsx)(n.p,{children:"And submit it to the API:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'const orderUid = await fetch(\n  "https://barn.api.cow.fi/mainnet/api/v1/orders",\n  {\n    method: "POST",\n    headers: {\n      "content-type": "application/json",\n    },\n    body: JSON.stringify({\n      ...orderData,\n      from: wallet.address,\n      appData: orderConfig.appData,\n      appDataHash: orderData.appData,\n      signingScheme: "eip712",\n      signature: orderSignature,\n      quoteId,\n    }),\n  },\n).then((response) => response.json());\nconsole.log("order:", orderUid);\n'})}),"\n",(0,r.jsx)(n.h2,{id:"ready-action",children:"Ready, Action"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{src:"https://youtu.be/FT36lWtC1Oc",alt:""})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.a,{href:"https://explorer.cow.fi/orders/0xa4a6be09da793762bbeb8e55d1641c52c83e5a441388f5578f7038ab6c4073b4d0a3a35ddce358bfc4f706e6040c17a50a2e3ba564a7e172?tab=overview",children:"Here"})," is the demo executed order on Mainnet. As you can see from the ",(0,r.jsx)(n.a,{href:"https://etherscan.io/tx/0x5c7f61a9364efdc841d680be88c0bd33ab6609b518f9c62df04e26fa356c57ac#eventlog",children:"transaction"}),", the USDC approval to CoW Protocol was set just-in-time for the swap to happen, and the trade proceeds were sent to the Omnibridge so that the bridging of the COW tokens that were received was initiated."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.a,{href:"https://gnosisscan.io/tx/0x9979234fb3b5416c6413f75374cbe79354bcc212fa82fb5537506afcc1693f3c",children:"Here"})," are the relayed COW tokens to the same address on Gnosis Chain."]}),"\n",(0,r.jsx)(n.p,{children:"Here is the complete code listing for the script that was used for creating the order."}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"index.js"})}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:'import { ethers } from "https://unpkg.com/ethers@5.7.2/dist/ethers.esm.js";\n\n/*** Configuration ***/\n\nconst provider = new ethers.providers.JsonRpcProvider(Deno.env.get("NODE_URL"));\nconst wallet = new ethers.Wallet(Deno.env.get("PRIVATE_KEY"), provider);\n\nconst { chainId } = await provider.getNetwork();\nconsole.log(`connected to chain ${chainId} with account ${wallet.address}`);\n\n/*** Contracts ***/\n\nconst SETTLEMENT = new ethers.Contract(\n  "0x9008D19f58AAbD9eD0D60971565AA8510560ab41",\n  [],\n  provider,\n);\n\nconst VAULT_RELAYER = new ethers.Contract(\n  "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110",\n  [],\n  provider,\n);\n\nconst COW = new ethers.Contract(\n  "0xDEf1CA1fb7FBcDC777520aa7f396b4E015F497aB",\n  [],\n  provider,\n);\n\nconst USDC = new ethers.Contract(\n  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",\n  [\n    `\n      function decimals() view returns (uint8)\n    `,\n    `\n      function name() view returns (string)\n    `,\n    `\n      function version() view returns (string)\n    `,\n    `\n      function nonces(address owner) view returns (uint256)\n    `,\n    `\n      function permit(\n        address owner,\n        address spender,\n        uint256 value,\n        uint256 deadline,\n        uint8 v,\n        bytes32 r,\n        bytes32 s\n      )\n    `,\n  ],\n  provider,\n);\n\nconst BRIDGER = new ethers.Contract(\n  "0xE71CcC8d4e0a298E1300a702ad0Ac93303dc8Ae5",\n  [\n    `\n      function getAccountAddress(address user) view returns (address)\n    `,\n    `\n      function bridgeAll(address user, address token)\n    `,\n  ],\n  provider,\n);\n\n/*** Order Configuration ***/\n\nconst orderConfig = {\n  sellToken: USDC.address,\n  buyToken: COW.address,\n  sellAmount: `${ethers.utils.parseUnits("200.0", await USDC.decimals())}`,\n  kind: "sell",\n  partiallyFillable: false,\n  sellTokenBalance: "erc20",\n  buyTokenBalance: "erc20",\n};\n\n/*** EIP-2612 Permit ***/\n\nconst permit = {\n  owner: wallet.address,\n  spender: VAULT_RELAYER.address,\n  value: orderConfig.sellAmount,\n  nonce: await USDC.nonces(wallet.address),\n  deadline: ethers.constants.MaxUint256,\n};\nconst permitSignature = ethers.utils.splitSignature(\n  await wallet._signTypedData(\n    {\n      name: await USDC.name(),\n      version: await USDC.version(),\n      chainId,\n      verifyingContract: USDC.address,\n    },\n    {\n      Permit: [\n        { name: "owner", type: "address" },\n        { name: "spender", type: "address" },\n        { name: "value", type: "uint256" },\n        { name: "nonce", type: "uint256" },\n        { name: "deadline", type: "uint256" },\n      ],\n    },\n    permit,\n  ),\n);\nconst permitParams = [\n  permit.owner,\n  permit.spender,\n  permit.value,\n  permit.deadline,\n  permitSignature.v,\n  permitSignature.r,\n  permitSignature.s,\n];\nconst permitHook = {\n  target: USDC.address,\n  callData: USDC.interface.encodeFunctionData("permit", permitParams),\n  gasLimit: `${await USDC.estimateGas.permit(...permitParams)}`,\n};\nconsole.log("permit hook:", permitHook);\n\n/*** Bridging ***/\n\norderConfig.receiver = await BRIDGER.getAccountAddress(wallet.address);\nconst bridgeHook = {\n  target: BRIDGER.address,\n  callData: BRIDGER.interface.encodeFunctionData("bridgeAll", [\n    wallet.address,\n    COW.address,\n  ]),\n  // Approximate gas limit determined with Tenderly.\n  gasLimit: "228533",\n};\nconsole.log("bridge hook:", bridgeHook);\n\n/*** Order Creation ***/\n\norderConfig.appData = JSON.stringify({\n  metadata: {\n    hooks: {\n      pre: [permitHook],\n      post: [bridgeHook],\n    },\n  },\n});\nconst { id: quoteId, quote } = await fetch(\n  "https://barn.api.cow.fi/mainnet/api/v1/quote",\n  {\n    method: "POST",\n    headers: {\n      "content-type": "application/json",\n    },\n    body: JSON.stringify({\n      from: wallet.address,\n      sellAmountBeforeFee: orderConfig.sellAmount,\n      ...orderConfig,\n    }),\n  },\n).then((response) => response.json());\nconsole.log("quote:", quoteId, quote);\n\nconst orderData = {\n  ...orderConfig,\n  sellAmount: quote.sellAmount,\n  buyAmount: `${ethers.BigNumber.from(quote.buyAmount).mul(99).div(100)}`,\n  validTo: quote.validTo,\n  appData: ethers.utils.id(orderConfig.appData),\n  feeAmount: quote.feeAmount,\n};\nconst orderSignature = await wallet._signTypedData(\n  {\n    name: "Gnosis Protocol",\n    version: "v2",\n    chainId,\n    verifyingContract: SETTLEMENT.address,\n  },\n  {\n    Order: [\n      { name: "sellToken", type: "address" },\n      { name: "buyToken", type: "address" },\n      { name: "receiver", type: "address" },\n      { name: "sellAmount", type: "uint256" },\n      { name: "buyAmount", type: "uint256" },\n      { name: "validTo", type: "uint32" },\n      { name: "appData", type: "bytes32" },\n      { name: "feeAmount", type: "uint256" },\n      { name: "kind", type: "string" },\n      { name: "partiallyFillable", type: "bool" },\n      { name: "sellTokenBalance", type: "string" },\n      { name: "buyTokenBalance", type: "string" },\n    ],\n  },\n  orderData,\n);\n\nconst orderUid = await fetch(\n  "https://barn.api.cow.fi/mainnet/api/v1/orders",\n  {\n    method: "POST",\n    headers: {\n      "content-type": "application/json",\n    },\n    body: JSON.stringify({\n      ...orderData,\n      from: wallet.address,\n      appData: orderConfig.appData,\n      appDataHash: orderData.appData,\n      signingScheme: "eip712",\n      signature: orderSignature,\n      quoteId,\n    }),\n  },\n).then((response) => response.json());\nconsole.log("order:", orderUid);\n'})})]})}const p=function(e={}){const{wrapper:n}=Object.assign({},(0,o.ah)(),e.components);return n?(0,r.jsx)(n,Object.assign({},e,{children:(0,r.jsx)(l,e)})):l(e)}},11151:(e,n,t)=>{t.d(n,{Zo:()=>i,ah:()=>a});var r=t(67294);const o=r.createContext({});function a(e){const n=r.useContext(o);return r.useMemo((()=>"function"==typeof e?e(n):{...n,...e}),[n,e])}const s={};function i({components:e,children:n,disableParentContext:t}){let i;return i=t?"function"==typeof e?e({}):e||s:a(e),r.createElement(o.Provider,{value:i},n)}}}]);