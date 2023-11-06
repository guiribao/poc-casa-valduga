import{a as T}from"/build/_shared/chunk-SEBZMTV4.js";import{a as I}from"/build/_shared/chunk-PGOH7JLP.js";import{a as O}from"/build/_shared/chunk-JSHTURAR.js";import{j as R}from"/build/_shared/chunk-F7YN42E7.js";import{a as C,b as A}from"/build/_shared/chunk-GDLBX7ER.js";import{c as v}from"/build/_shared/chunk-Q3IECNXJ.js";var c=v(C()),V=v(I());var u=class{constructor(e,t){this.p1=e,this.p2=t}equals(e){return this.includes(e.p1)&&this.includes(e.p2)}includes(e){return this.p1.equals(e)||this.p2.equals(e)}draw(e,{zoom:t,width:i=4,color:n="#FF4D80",dash:r=[]}={}){e.beginPath(),e.lineWidth=i,e.strokeStyle=n,e.setLineDash(r),e.moveTo(this.p1.x*t,this.p1.y*t),e.lineTo(this.p2.x*t,this.p2.y*t),e.stroke(),e.setLineDash([])}};var p=class{constructor(e,t){this.x=e,this.y=t}equals(e){return this.x===e.x&&this.y===e.y}draw(e,{zoom:t,size:i=18,color:n="#FF3E41",outline:r=!1,fill:d=!1}={}){let h=i/2;e.beginPath(),e.fillStyle=n,e.arc(this.x*t,this.y*t,h,0,Math.PI*2),e.fill(),r&&(e.beginPath(),e.lineWidth=2,e.strokeStyle="white",e.arc(this.x,this.y,h*.6,0,Math.PI*2),e.stroke()),d&&(e.beginPath(),e.arc(this.x,this.y,h*.4,0,Math.PI*2),e.fillStyle="white",e.fill())}};var a=class{constructor(e,t){this.x=e,this.y=t,this.name="Nome da referencia",this.label="T",this.description="Descri\xE7\xE3o padr\xE3o para uma refer\xEAncia"}equals(e){return this.x===e.x&&this.y===e.y}draw(e,{zoom:t,size:i=38,color:n="rgba(72, 213, 209, 0.5)",outline:r=!1,fill:d=!1,text:h=""}={}){let f=i/2;e.beginPath(),e.fillStyle=n,e.arc(this.x*t,this.y*t,f,0,Math.PI*2),e.fill(),r&&(e.beginPath(),e.lineWidth=2,e.strokeStyle="white",e.arc(this.x*t,this.y*t,f*.6,0,Math.PI*2),e.stroke()),d&&(e.beginPath(),e.arc(this.x*t,this.y*t,f*.4,0,Math.PI*2),e.fillStyle="white",e.fill())}};var g=class{constructor(e=[],t=[],i=[]){this.points=e,this.segments=t,this.references=i}static load(e,t,i){let n=[],r=[],d=[];for(let h of e)n.push(new p(h.x,h.y));for(let h of t)r.push(new u(n.find(f=>f.equals(h.p1)),n.find(f=>f.equals(h.p2))));for(let h of i)d.push(new a(h.x,h.y));return new g(n,r,d)}addPoint(e){this.points.push(e)}containsPoint(e){return this.points.find(t=>t.equals(e))}tryAddPoint(e){return this.containsPoint(e)?!1:(this.addPoint(e),!0)}removePoint(e){let t=this.getSegmentsWithPoint(e);for(let i of t)this.removeSegment(i);this.points.splice(this.points.indexOf(e),1)}addSegment(e){this.segments.push(e)}containsSegment(e){return this.segments.find(t=>t.equals(e))}tryAddSegment(e){return!this.containsSegment(e)&&!e.p1.equals(e.p2)?(this.addSegment(e),!0):!1}removeSegment(e){this.segments.splice(this.segments.indexOf(e),1)}getSegmentsWithPoint(e){let t=[];for(let i of this.segments)i.includes(e)&&t.push(i);return t}addReferencePoint(e){this.references.push(e)}containsReferencePoint(e){return this.references.find(t=>t.equals(e))}tryAddReferencePoint(e){return this.containsReferencePoint(e)?!1:(this.addReferencePoint(e),!0)}removeReferencePoint(e){this.references.splice(this.references.indexOf(e),1)}dispose(){this.points.length=0,this.segments.length=0}drawBg(e,t,i,n,r){e.drawImage(t,0,0,n*i,r*i)}draw(e,t){for(let i of this.segments)i.draw(e,{zoom:t});for(let i of this.points)i.draw(e,{zoom:t});for(let i of this.references)i.draw(e,{zoom:t,text:i.label})}};var j=v(O());var L="/build/_assets/editor-HGOWP25A.css";function q(o,e,t=Number.MAX_SAFE_INTEGER){let i=Number.MAX_SAFE_INTEGER,n=null;for(let r of e){let d=H(r,o);d<i&&d<t&&(i=d,n=r)}return n}function H(o,e){return Math.hypot(o.x-e.x,o.y-e.y)}function P(o,e){return new a(o.x+e.x,o.y+e.y)}function F(o,e){return new a(o.x-e.x,o.y-e.y)}var x=class{constructor(e,t){this.visao=e,this.canvas=e.canvas,this.ctx=e.ctx,this.mapa=t,this.tool="caminho",this.mouse=null,this.selected=null,this.hovered=null,this.dragging=!1,this.addEvents()}trocarFerramenta(e){this.tool=e}addEvents(){this.canvas.addEventListener("mousedown",this.handleMouseDown.bind(this)),this.canvas.addEventListener("mousemove",this.handleMouseMove.bind(this)),this.canvas.addEventListener("mouseup",e=>this.dragging=!1),this.canvas.addEventListener("contextmenu",e=>e.preventDefault())}handleMouseMove(e){this.mouse=this.visao.getMouse(e,this.tool);let t=this.mapa.points.concat(this.mapa.references);this.hovered=q(this.mouse,t,15*this.visao.zoom,this.visao.zoom),this.dragging===!0&&(this.selected.x=this.mouse.x,this.selected.y=this.mouse.y)}handleMouseDown(e){if(e.button==2&&(this.selected?this.selected=null:this.hovered&&this.removePoint(this.hovered)),e.button==0){if(this.hovered){this.selectPoint(this.hovered),this.dragging=!0;return}if(this.tool==="referencia"){this.mapa.tryAddReferencePoint(this.mouse),this.selectPoint(this.mouse),this.hovered=this.mouse;return}this.mapa.tryAddPoint(this.mouse),this.selectPoint(this.mouse),this.hovered=this.mouse}}removePoint(e){e.hasOwnProperty("name")?this.mapa.removeReferencePoint(e):this.mapa.removePoint(e),this.hovered=null,this.selected===e&&(this.selected=null)}selectPoint(e){this.selected&&this.tool==="caminho"&&this.mapa.tryAddSegment(new u(this.selected,e)),this.selected=e}display(e){if(this.mapa.draw(this.ctx,e),this.hovered&&this.hovered.draw(this.ctx,{fill:!0}),this.selected){if(this.tool==="caminho"){let t=this.hovered||this.mouse;new u(this.selected,t).draw(this.ctx,{dash:[6,4]})}this.selected.draw(this.ctx,{outline:!0})}}};var y=class{constructor(e,{mainWidth:t,mainHeight:i}){this.canvas=e,this.ctx=e.getContext("2d"),this.zoom=1,this.offset=new a(0,0),this.mainWidth=t,this.mainHeight=i,this.drag={start:new a(0,0),end:new a(0,0),offset:new a(0,0),active:!1},this.addEvents()}getMouse(e,t){return t==="caminho"?new p((e.offsetX-this.offset.x)*this.zoom,(e.offsetY-this.offset.y)*this.zoom):new a((e.offsetX-this.offset.x)*this.zoom,(e.offsetY-this.offset.y)*this.zoom)}getOffset(){return P(this.offset,this.drag.offset)}addEvents(){this.canvas.addEventListener("mousewheel",this.handleMouseWheel.bind(this)),this.canvas.addEventListener("mousedown",this.handleMouseDown.bind(this)),this.canvas.addEventListener("mousemove",this.handleMouseMove.bind(this)),this.canvas.addEventListener("mouseup",this.handleMouseUp.bind(this))}handleMouseDown(e){e.button==1&&(this.drag.start=this.getMouse(e),this.drag.active=!0)}handleMouseMove(e){this.drag.active&&(this.drag.end=this.getMouse(e),this.drag.offset=F(this.drag.end,this.drag.start))}handleMouseUp(e){if(this.drag.active){let t=P(this.offset,this.drag.offset),i=this.mainWidth+t.x*-1,n=this.mainHeight+t.y*-1;t.x>0&&(t.x=0),i>this.canvas.width*this.zoom&&(t.x=this.mainWidth-this.canvas.width*this.zoom),t.y>0&&(t.y=0),n>this.canvas.height*this.zoom&&(t.y=this.mainHeight-this.canvas.height*this.zoom),this.offset=new a(t.x,t.y),this.drag={start:new a(0,0),end:new a(0,0),offset:new a(0,0),active:!1}}}handleMouseWheel(e){let t=Math.sign(e.deltaY)*-1,i=.2;this.zoom+=t*i,this.zoom=Math.max(1,Math.min(3,this.zoom))}};var X=v(T()),l=v(A()),Y=()=>[{charset:"utf-8",title:"Editar mapa - SmartMap",viewport:"width=device-width, initial-scale=1"},{name:"description",content:"Plataforma SmartMap by SmartComposerVR"}],G=()=>[{rel:"stylesheet",href:L}];function z(){let o=(0,c.useRef)(null),{mapa:e}=R(),[t,i]=(0,c.useState)({points:"",segments:"",references:""}),[n,r]=(0,c.useState)(e==null?void 0:e.titulo),[d,h]=(0,c.useState)(e==null?void 0:e.slug),[f,N]=(0,c.useState)(e==null?void 0:e.mapa_privado);var m;let S=s=>{if(!o.current)return;s.ctx.clearRect(0,0,s.canvas.width,s.canvas.height),s.ctx.save(),s.ctx.scale(s.visao.zoom,s.visao.zoom);let b=s.visao.getOffset();s.ctx.translate(b.x,b.y),s.mapa.drawBg(s.visao.ctx,m,s.visao.zoom,s.visao.canvas.width,s.visao.canvas.height),s.display(s.visao.zoom),s.ctx.restore(),requestAnimationFrame(()=>{S(s)})};(0,c.useEffect)(()=>{let s=o.current;m=new Image,m.addEventListener("load",b=>{var M,k;s.width=m.width/2,s.height=m.height/2;let _=g.load((e==null?void 0:e.pontos)||[],(e==null?void 0:e.caminhos)||[],(e==null?void 0:e.referencias)||[]),D=new y(s,{mainWidth:(M=document.querySelector(".oil-on-canvas"))==null?void 0:M.clientWidth,mainHeight:(k=document.querySelector(".oil-on-canvas"))==null?void 0:k.clientHeight}),w=new x(D,_);window.addEventListener("message",E=>{E.data.action==="changeTool"&&w.trocarFerramenta(E.data.tool)}),i(w.mapa),requestAnimationFrame(()=>{S(w)})}),m.src=e.background},[]);async function W(){let s=await fetch("/salvar/12",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({titulo:n,slug:d,background:m,mapaPrivado:f,atributos:t})})}return(0,l.jsxs)("main",{className:"oil-on-canvas",children:[(0,l.jsx)("canvas",{id:"editor",ref:o}),(0,l.jsxs)("div",{className:"atributos",children:[(0,l.jsx)("input",{type:"text",name:"nome",placeholder:"Nome do mapa",defaultValue:n,onChange:s=>r(s.target.value)}),(0,l.jsx)("input",{type:"text",name:"slug",placeholder:"Slug",defaultValue:d,onChange:s=>h(s.target.value)}),(0,l.jsxs)("div",{className:"privado",children:[(0,l.jsx)("label",{htmlFor:"privado",children:"Privado"}),(0,l.jsx)("input",{type:"checkbox",name:"privado",id:"privado",defaultChecked:f,onChange:s=>N(s.target.checked)})]}),(0,l.jsx)("button",{onClick:W,id:"salvar",children:"Salvar mapa"})]})]})}export{z as default,G as links,Y as meta};
