(window["webpackJsonpartefacts-app"]=window["webpackJsonpartefacts-app"]||[]).push([[0],{112:function(e,t,a){e.exports=a(126)},117:function(e,t,a){},126:function(e,t,a){"use strict";a.r(t);var n=a(13),r=a(0),o=a.n(r),c=a(12),l=a.n(c);a(117),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var i=a(44),u=a(104),s=a(101),m=a(103),p=a(19),d=a(15),f=a.n(d),g=a(29),h=a(11),b=a(23),E=a(24),v=a.n(E),O=a(21),y=Object(r.createContext)({authenticated:!1,user:{},authToken:"",initiateLogin:function(){},handleAuthentication:function(){},logout:function(){}}),j=y,w=y.Provider,x=(y.Consumer,"auth-token"),k="duplicate key",C="Please, enter valid credentials",S={uri:{API_URL:"/graphql/"}};function A(){var e=Object(b.a)(["\nmutation VerifyToken($token: String!) {\n    verifyToken(token: $token) {\n        payload\n    }\n}\n"]);return A=function(){return e},e}var T=v()(A());var N=a(49),P=a(36),I=a(62),W=a(63),$=a(69),L=a(22),D=a(43),F=a(2),R=a(97),B=a(171),q=a(168),U=a(169),M=a(105),z=a(167),Q=a(98),J=a.n(Q),V=a(165),_=a(102),G=a(184),H=a(96),Y=a.n(H),X=function(e){var t=o.a.useState(null),a=Object(h.a)(t,2),n=a[0],c=a[1],l=Object(r.useContext)(j),i=Boolean(n);function u(){c(null)}return o.a.createElement("div",null,o.a.createElement(V.a,{component:L.b,to:"/family/create",color:"inherit"},"Create Family"),o.a.createElement(V.a,{color:"inherit"},"Manage Artefacts"),o.a.createElement(z.a,{"aria-label":"account of current user","aria-controls":"menu-appbar","aria-haspopup":"true",onClick:function(e){c(e.currentTarget)},color:"inherit"},o.a.createElement(Y.a,null)),o.a.createElement(_.a,{id:"menu-appbar",anchorEl:n,anchorOrigin:{vertical:"top",horizontal:"right"},keepMounted:!0,transformOrigin:{vertical:"top",horizontal:"right"},open:i,onClose:u},o.a.createElement(G.a,{onClick:u},"Profile"),o.a.createElement(G.a,{onClick:u},"Settings"),o.a.createElement(G.a,{onClick:function(){l.logout()}},"Logout")))},Z=o.a.forwardRef(function(e,t){return o.a.createElement(L.b,Object.assign({innerRef:t,to:"/login"},e))}),K=o.a.forwardRef(function(e,t){return o.a.createElement(L.b,Object.assign({innerRef:t,to:"/signup"},e))}),ee=function(e){return o.a.createElement("div",null,o.a.createElement(V.a,{color:"inherit",underline:"none",component:K},"Sign up"),o.a.createElement(V.a,{color:"inherit",underline:"none",component:Z},"Login"))},te=a(170),ae=Object(R.a)(function(e){return{root:{flexGrow:1},menuButton:{marginRight:e.spacing(2)},title:{flexGrow:1}}});function ne(){var e=ae(),t=Object(r.useContext)(j).authenticated;return o.a.createElement("div",{className:e.root},o.a.createElement(q.a,{position:"static"},o.a.createElement(U.a,null,o.a.createElement(z.a,{edge:"start",className:e.menuButton,color:"inherit","aria-label":"menu"},o.a.createElement(J.a,null)),o.a.createElement(M.a,{variant:"h6",className:e.title},o.a.createElement(te.a,{component:L.b,to:"/",color:"inherit",variant:"inherit",underline:"none"},"Family AR")),t&&o.a.createElement(X,{username:null}),!t&&o.a.createElement(ee,null))))}var re=function(e){return o.a.createElement("div",null,o.a.createElement(ne,null),o.a.createElement(B.a,{style:{padding:"20px"}},e.children))},oe=a(172);var ce=function(){var e=Object(R.a)(function(e){return{progress:{margin:e.spacing(2)}}})();return o.a.createElement(re,null,o.a.createElement(oe.a,{className:e.progress}))};var le=function(e){return o.a.createElement(re,null,"This is some cool landing page yo. Welcome!",o.a.createElement("br",null),"Also, in the future, this page should not have a navigation bar, it'll have cooler design stuff. It only has the nav bar for easier linking to signup / login for now")},ie=function(e){function t(){var e,a;Object(N.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(I.a)(this,(e=Object(W.a)(t)).call.apply(e,[this].concat(r)))).state={checkAuthenticated:!1},a}return Object($.a)(t,e),Object(P.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.context.authenticated&&this.setState({checkAuthenticated:!0});var t=localStorage.getItem(x);!this.context.authenticated&&t?this.context.handleAuthentication(t,function(){console.log("Setting state"),e.setState({checkAuthenticated:!0})}):this.setState({checkAuthenticated:!0})}},{key:"render",value:function(){return this.props.children(this.state.checkAuthenticated)}}]),t}(r.Component);ie.contextType=j;var ue=function(e){var t=e.loggedIn,a=e.loggedOut,n=(e.path,e.landingPage),c=Object(F.a)(e,["loggedIn","loggedOut","path","landingPage"]),l=Object(r.useContext)(j).authenticated;return a||(a="/login"),console.log("Authenticated: ",l),o.a.createElement(ie,null,function(e){return!1===e?o.a.createElement(ce,null):o.a.createElement(D.b,Object.assign({},c,{render:function(e){return l?o.a.createElement(t,e):!l&&n?o.a.createElement(le,null):o.a.createElement(D.a,{to:a})}}))})};function se(){var e=Object(b.a)(["\nmutation ArtefactCreate($artefactInput:ArtefactInputType!) {\n  artefactCreate(input: $artefactInput) {\n    artefact {\n      name,\n      description\n    }\n  }\n}"]);return se=function(){return e},e}var me=v()(se());function pe(e){var t,a,n=Object(O.a)(me),r=Object(h.a)(n,2),c=r[0],l=r[1],i=(l.data,l.loading),u=l.errors;return i?o.a.createElement("div",null,"Loading..."):u?o.a.createElement("p",null,"ERROR!"):o.a.createElement("div",null,o.a.createElement("h1",null,"Create an Artefact"),o.a.createElement("form",{onSubmit:function(e){e.preventDefault(),c({variables:{artefactInput:{name:t.value,description:a.value}}}),t.value="",a.value=""}},o.a.createElement("label",null,"Name"),o.a.createElement("input",{ref:function(e){t=e}}),o.a.createElement("br",null),o.a.createElement("label",null,"Description"),o.a.createElement("input",{ref:function(e){a=e}}),o.a.createElement("br",null),o.a.createElement("button",{type:"submit"},"Create")))}function de(){var e=Object(b.a)(["\n    query DetailView($id: ID!) {\n        artefact(id: $id) {\n            id,\n            name,\n            description,\n            addedAt\n        }\n    }"]);return de=function(){return e},e}var fe=v()(de());function ge(e){var t=Object(O.b)(fe,{variables:{id:e.match.params.id}}),a=t.data,n=t.loading,r=t.errors;return n?o.a.createElement("p",null,"Loading..."):r?o.a.createElement("p",null,"ERROR!"):o.a.createElement("div",null,o.a.createElement("h1",null,a.artefact.name," - #",a.artefact.id),o.a.createElement("p",null,a.artefact.addedAt),o.a.createElement("p",null,a.artefact.description))}var he=a(173),be=a(181),Ee=a(175),ve=a(174);function Oe(){var e=Object(b.a)(["\nmutation TokenAuth($username: String!, $password: String!) {\n    tokenAuth(username: $username, password: $password) {\n        token\n    }\n}\n"]);return Oe=function(){return e},e}var ye=v()(Oe()),je=Object(R.a)(function(e){return{"@global":{body:{backgroundColor:e.palette.common.white}},paper:{marginTop:e.spacing(8),display:"flex",flexDirection:"column",alignItems:"center"},form:{width:"50%",marginTop:e.spacing(3)},submit:{margin:e.spacing(3,0,2)}}});var we=function(e){var t=Object(r.useContext)(j),a=je(),n=Object(r.useState)(""),c=Object(h.a)(n,2),l=c[0],i=c[1],u=Object(r.useState)(""),s=Object(h.a)(u,2),m=s[0],p=s[1],d=Object(r.useState)(!1),b=Object(h.a)(d,2),E=b[0],v=b[1],y=function(){var a=Object(g.a)(f.a.mark(function a(n){var r;return f.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:r=n.tokenAuth.token,console.log("getting token first in confirm mutation"),t.handleAuthentication(r),localStorage.setItem(x,r),e.history.push("/");case 5:case"end":return a.stop()}},a)}));return function(e){return a.apply(this,arguments)}}(),w=function(){var e=Object(g.a)(f.a.mark(function e(t){var a;return f.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:console.log("_handleError run"),t.graphQLErrors&&(a=t.graphQLErrors[0].message.substring(0,15),C.startsWith(a)?(v(!0),console.log("invalid credentials")):(console.log("unexpect error(s):"),console.log(t)));case 2:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),k=Object(O.a)(ye,{onCompleted:y,onError:w}),S=Object(h.a)(k,2),A=S[0],T=(S[1].data,function(){var e=Object(g.a)(f.a.mark(function e(t){return f.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:A({variables:{username:l,password:m}}),t.preventDefault();case 2:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}());return o.a.createElement(re,null,o.a.createElement(he.a,null),o.a.createElement("div",{className:a.paper},o.a.createElement("form",{className:a.form,onSubmit:T},o.a.createElement(ve.a,{container:!0,spacing:2},o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(M.a,{component:"h1",variant:"h5"},"Log In")),o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(be.a,{variant:"outlined",required:!0,fullWidth:!0,id:"username",label:"Username",autoFocus:!0,onChange:function(e){return i(e.target.value)},error:E})),o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(be.a,{variant:"outlined",required:!0,fullWidth:!0,label:"Password",type:"password",id:"password",onChange:function(e){return p(e.target.value)},error:E}),E&&o.a.createElement(Ee.a,{id:"password",error:E},"Please enter valid credentials")),o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(V.a,{name:"submit",label:"Submit",type:"submit",fullWidth:!0,variant:"contained",color:"primary"},"Log In")),o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(ve.a,{item:!0},o.a.createElement(te.a,{component:L.b,to:"/signup"},"Need an account? Sign up")))))))};function xe(){var e=Object(b.a)(["\nmutation SignupMutation($email: String!, $password: String!, $username: String!){\n    createUser(email: $email, username: $username, password: $password) {\n        user {\n            id\n            username\n            email\n        }\n    }\n}\n"]);return xe=function(){return e},e}var ke=v()(xe()),Ce=Object(R.a)(function(e){return{"@global":{body:{backgroundColor:e.palette.common.white}},paper:{marginTop:e.spacing(8),display:"flex",flexDirection:"column",alignItems:"center"},form:{width:"50%",marginTop:e.spacing(3)},submit:{margin:e.spacing(3,0,2)}}});var Se=function(e){var t=Object(r.useState)(""),a=Object(h.a)(t,2),n=a[0],c=a[1],l=Object(r.useState)(""),i=Object(h.a)(l,2),u=i[0],s=i[1],m=Object(r.useState)(""),p=Object(h.a)(m,2),d=p[0],b=p[1],E=Object(r.useState)(""),v=Object(h.a)(E,2),y=v[0],j=v[1],w=Object(r.useState)(!1),x=Object(h.a)(w,2),C=x[0],S=x[1],A=Object(r.useState)(!1),T=Object(h.a)(A,2),N=T[0],P=(T[1],Ce()),I=function(){var t=Object(g.a)(f.a.mark(function t(a){return f.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e.history.push("/login");case 1:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}(),W=function(){var e=Object(g.a)(f.a.mark(function e(t){var a;return f.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:console.log("_handleError run"),t.graphQLErrors&&(a=t.graphQLErrors[0].message.substring(0,10),k.startsWith(a)?S(!0):console.log(t));case 2:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),$=Object(O.a)(ke,{onCompleted:I,onError:W}),D=Object(h.a)($,2),F=D[0],R=(D[1].data,function(){var e=Object(g.a)(f.a.mark(function e(t){return f.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:console.log("form submitted"),F({variables:{username:n,email:u,password:d}}),t.preventDefault();case 3:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}());return o.a.createElement(re,null,o.a.createElement(he.a,null),o.a.createElement("div",{className:P.paper},o.a.createElement("form",{className:P.form,onSubmit:R},o.a.createElement(ve.a,{container:!0,spacing:2},o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(M.a,{component:"h1",variant:"h5"},"Sign up")),o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(be.a,{autoComplete:"username",name:"username",variant:"outlined",required:!0,fullWidth:!0,id:"username",label:"Username",autoFocus:!0,error:C,onChange:function(e){return c(e.target.value)}}),C&&o.a.createElement(Ee.a,{id:"username",error:C},"Username is taken")),o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(be.a,{variant:"outlined",required:!0,fullWidth:!0,id:"email",label:"Email Address",name:"email",autoComplete:"email",type:"email",error:N,onChange:function(e){return s(e.target.value)}}),N&&o.a.createElement(Ee.a,{id:"email",error:N},"Email is taken")),o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(be.a,{variant:"outlined",required:!0,fullWidth:!0,name:"password",label:"Password",type:"password",id:"password",autoComplete:"current-password",onChange:function(e){return b(e.target.value)}})),o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(be.a,{variant:"outlined",required:!0,fullWidth:!0,name:"confirmPassword",label:"Confirm Password",type:"password",id:"confirmPassword",autoComplete:"current-password",onChange:function(e){return j(e.target.value)},error:!(y===d)}),!(y===d)&&o.a.createElement(Ee.a,{id:"confirmPassword",error:!(y===d)},"Passwords must match")),o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(V.a,{name:"submit",label:"Submit",type:"submit",fullWidth:!0,variant:"contained",color:"primary",disabled:!(y===d)},"Sign Up")),o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(ve.a,{item:!0},o.a.createElement(te.a,{component:L.b,to:"/login"},"Already have an account? Log in")))))))};var Ae=function(){return Object(r.useContext)(j).logout(),o.a.createElement(D.a,{to:"/login"})},Te=a(6),Ne=a(183),Pe=a(176),Ie=a(177),We=a(99),$e=a.n(We);function Le(){var e=Object(b.a)(["\nmutation FamilyCreate($familyName: String!, $about: String) {\n  familyCreate(input: {\n    familyName: $familyName\n    about:$about\n  })\n  {\n    family {\n      familyName\n      joinCode\n    }\n  }\n}\n"]);return Le=function(){return e},e}var De=Object(R.a)(function(e){return{"@global":{body:{backgroundColor:e.palette.common.white}},paper:{marginTop:e.spacing(8),display:"flex",flexDirection:"column",alignItems:"center"},form:{width:"50%",marginTop:e.spacing(3)},submit:{margin:e.spacing(3,0,2)}}}),Fe=v()(Le()),Re=Object(Te.a)(function(e){return{root:{margin:0,padding:e.spacing(2)},closeButton:{position:"absolute",right:e.spacing(1),top:e.spacing(1),color:e.palette.grey[500]}}})(function(e){var t=e.children,a=e.classes,n=e.onClose;return o.a.createElement(Pe.a,{disableTypography:!0,className:a.root},o.a.createElement(M.a,{variant:"h6"},t),n?o.a.createElement(z.a,{"aria-label":"close",className:a.closeButton,onClick:n},o.a.createElement($e.a,null)):null)}),Be=Object(Te.a)(function(e){return{root:{padding:e.spacing(2)}}})(Ie.a);function qe(e){var t=De(),a=Object(r.useContext)(j).user.username,n=Object(r.useState)(""),c=Object(h.a)(n,2),l=c[0],i=c[1],u=Object(r.useState)(""),s=Object(h.a)(u,2),m=s[0],p=s[1],d=Object(r.useState)(""),b=Object(h.a)(d,2),E=b[0],v=b[1],y=Object(r.useState)(!1),w=Object(h.a)(y,2),x=w[0],k=w[1],C=function(){var e=Object(g.a)(f.a.mark(function e(t){var a;return f.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:console.log(t),a=t.familyCreate.family.joinCode,v(a),k(!0);case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),S=Object(O.a)(Fe,{onCompleted:C}),A=Object(h.a)(S,2),T=A[0],N=A[1].data,P=function(){var e=Object(g.a)(f.a.mark(function e(t){return f.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.preventDefault(),console.log("Family name: "+l),console.log("About: "+m),T({variables:{familyName:l,about:m}});case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),I=function(e){e.preventDefault(),k(!1)};return o.a.createElement(re,null,o.a.createElement("h1",null,"Create a Family"),o.a.createElement("p",null,"Families are how you manage your artefacts. We recognise there is often complex overlap between families. That's why you can create and be a part of several families, so you can separate which of the artefacts you manage belong to which family."),o.a.createElement(he.a,null),o.a.createElement("div",{className:t.paper},o.a.createElement("form",{className:t.form,onSubmit:P},o.a.createElement(ve.a,{container:!0,spacing:2},o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(M.a,{component:"h1",variant:"h5"},"Create Family")),o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(be.a,{variant:"outlined",required:!0,fullWidth:!0,id:"family-name",label:"Family name",autoFocus:!0,onChange:function(e){return i(e.target.value)}})),o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(be.a,{variant:"outlined",multiline:!0,rows:6,fullWidth:!0,id:"about",label:"Tell people about your family",onChange:function(e){return p(e.target.value)}})),o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(be.a,{variant:"outlined",disabled:!0,defaultValue:a,fullWidth:!0,id:"family-admin",label:"Family Admin",onChange:function(e){return console.log("hello")}})),o.a.createElement(ve.a,{item:!0,xs:12},o.a.createElement(V.a,{name:"create",label:"Create",type:"submit",fullWidth:!0,variant:"contained",color:"primary"},"Create")))),N&&o.a.createElement(Ne.a,{open:x,onClose:I},o.a.createElement(Re,{onClose:I},"Begin adding members to '",l,"'!"),o.a.createElement(Be,null,o.a.createElement(M.a,{align:"center"},"Begin getting members to join your family! Simply share the code below to your family members, get them to sign up and then they can join!",o.a.createElement("br",null),E)))))}var Ue=a(178),Me=a(179),ze=a(180),Qe=a(100),Je=a.n(Qe);function Ve(){var e=Object(b.a)(["\n        query {\n            me {\n                isMemberOf {\n                    id\n                    familyName\n                    joinCode\n                }\n            }\n        }"]);return Ve=function(){return e},e}var _e=Object(R.a)(function(e){return{root:{display:"flex",flexWrap:"wrap",justifyContent:"space-around",overflow:"hidden",backgroundColor:e.palette.background.paper},gridList:{width:"80%",height:450},icon:{color:"rgba(255, 255, 255, 0.54)"}}}),Ge=[{img:"https://assets.pernod-ricard.com/nz/media_images/test.jpg?hUV74FvXQrWUBk1P2.fBvzoBUmjZ1wct",title:"Title1",author:"Author 1"}],He=v()(Ve());var Ye=function(e){var t=_e(),a=Object(r.useContext)(j).user.username,n=Object(O.b)(He),c=n.data,l=n.loading;if(console.log("The data is: ",c),l)return o.a.createElement("p",null,"Loading...");var i=c.me.isMemberOf;return o.a.createElement(re,null,o.a.createElement("h1",null,"Family: ",i[0].familyName),o.a.createElement("h3",null,"Join code: ",i[0].joinCode),o.a.createElement("h4",null,"Your username is: ",a),o.a.createElement("h4",null,"Your families:"),c.me.isMemberOf.map(function(e){return o.a.createElement("p",{key:e.id,id:e.id},e.familyName)}),o.a.createElement("div",{className:t.root},o.a.createElement(Ue.a,{cellHeight:180,className:t.gridList},Ge.map(function(e){return o.a.createElement(Me.a,{key:e.img},o.a.createElement("img",{src:e.img,alt:e.title}),o.a.createElement(ze.a,{title:e.title,subtitle:o.a.createElement("span",null,"by: ",e.author),actionIcon:o.a.createElement(z.a,{"aria-label":"info about ".concat(e.title),className:t.icon},o.a.createElement(Je.a,null))}))}))))},Xe=function(e){function t(){return Object(N.a)(this,t),Object(I.a)(this,Object(W.a)(t).apply(this,arguments))}return Object($.a)(t,e),Object(P.a)(t,[{key:"render",value:function(){return o.a.createElement(L.a,null,o.a.createElement("div",null,o.a.createElement(D.d,null,o.a.createElement(ue,{exact:!0,path:"/",loggedIn:Ye,landingPage:!0}),o.a.createElement(D.b,{exact:!0,path:"/login/",component:we}),o.a.createElement(D.b,{exact:!0,path:"/signup/",component:Se}),o.a.createElement(D.b,{exact:!0,path:"/logout/",component:Ae}),o.a.createElement(ue,{exact:!0,path:"/artefacts/create/",component:pe}),o.a.createElement(ue,{exact:!0,path:"/artefacts/:id/",component:ge}),o.a.createElement(ue,{exact:!0,path:"/family/create",loggedIn:qe}))))}}]),t}(r.Component);function Ze(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,n)}return a}function Ke(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?Ze(a,!0).forEach(function(t){Object(n.a)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):Ze(a).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}console.log("The config is: "),console.log(S);var et=Object(u.a)({uri:"/graphql/"}),tt=Object(s.a)(function(e,t){var a=t.headers,n=localStorage.getItem(x);return{headers:Ke({},a,{authorization:n?"JWT ".concat(n):""})}}),at=new i.a({link:tt.concat(et),cache:new m.a});l.a.render(o.a.createElement(p.a,{client:at},o.a.createElement(function(e){var t=this,a=Object(r.useState)(!1),n=Object(h.a)(a,2),c=n[0],l=n[1],i=Object(r.useState)({}),u=Object(h.a)(i,2),s=u[0],m=u[1],p=Object(r.useState)(""),d=Object(h.a)(p,2),b=d[0],E=d[1],v=Object(O.a)(T),y=Object(h.a)(v,2),j=y[0],k=y[1],C=k.error,S=k.loading,A=function(){var e=Object(g.a)(f.a.mark(function e(t,a){return f.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t||(t=localStorage.getItem(x)),e.next=3,j({variables:{token:t}}).then(function(e){N(e),a&&a()}).catch(function(e){localStorage[x]="",a&&a()});case 3:if(!C){e.next=6;break}return console.log("[Error] handleAuthentication()"),e.abrupt("return");case 6:S&&console.log("Thing is loading");case 7:case"end":return e.stop()}},e)}));return function(t,a){return e.apply(this,arguments)}}(),N=function(e){if(C)console.log("Invalid data, please sign in again");else{var t=e.data.verifyToken.payload.username;console.log("Here's the user id: ",e.data.verifyToken.payload.id);var a={username:t};l(!0),E(e.verifyToken),m(a)}},P={authenticated:c,authToken:b,user:s,initiateLogin:function(){t.history.pushState(null,"login")},handleAuthentication:A,logout:function(){console.log("Logout called"),l(!1),m({}),E(""),localStorage[x]=""}};return o.a.createElement(w,{value:P},e.children)},null,o.a.createElement(Xe,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[112,1,2]]]);
//# sourceMappingURL=main.3f57ebcd.chunk.js.map