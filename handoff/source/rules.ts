import type {State,Employee,Channel} from './model';
export type Health='Healthy'|'Action required'|'Paused';
export const supported=(e:Employee):Channel[]=>e.id==='maya'?['Store chat']:e.id==='emma'?['Email','WhatsApp']:['Store chat','Email','WhatsApp','Instagram'];
export function channelReady(s:State,c:Channel){return s.integrations[c]&&(c!=='Store chat'||s.widget)}
export function commonIssues(s:State,e:Employee):string[]{
 const issues:string[]=[];
 if(!s.connected)issues.push('Reconnect Shopify');
 if(s.scan<3)issues.push('Finish core store sync');
 if(s.scan<9)issues.push('Complete store knowledge analysis');
 if(s.knowledge['Store Information'].status!=='Ready')issues.push('Approve required Store Information in Knowledge');
 if(e.id==='maya'){
  if(s.scenario==='Empty catalogue'||s.activeProducts<1)issues.push('Add an active product and rescan');
  if(s.knowledge.Products.status!=='Ready')issues.push('Approve product knowledge');
 }
 if(e.id==='emma'){
  if(!s.data.carts)issues.push('Restore checkout/cart data');
  if(!s.data.consentSource.trim())issues.push('Configure a reviewed consent/eligibility source');
 }
 if(e.id==='leo'){
  if(!s.data.orders)issues.push('Restore order data');
  if(s.knowledge['Shipping & Delivery'].status!=='Ready')issues.push('Approve Shipping & Delivery knowledge');
 }
 return issues;
}
export function prerequisites(s:State,e:Employee){return [...commonIssues(s,e),...(!supported(e).some(c=>channelReady(s,c))?[e.id==='maya'?'Enable the storefront widget and Store chat':'Connect a supported channel: '+supported(e).join(' or ')]:[])];}
export function setupBlockers(s:State,e:Employee){return [...prerequisites(s,e),...(!e.channels.some(c=>supported(e).includes(c)&&channelReady(s,c))?['Enable a connected channel for this employee']:[]),...(!e.configured?['Review and save employee setup']:[]),...(!e.previewed?['Test this employee’s preview']:[])];}
export function runtime(s:State,e:Employee){
 const valid=e.channels.filter(c=>supported(e).includes(c)&&channelReady(s,c));
 const failed=e.channels.filter(c=>!channelReady(s,c)||!supported(e).includes(c));
 const issues=[...commonIssues(s,e),...failed.map(c=>c==='Store chat'&&!s.widget?'Enable storefront widget':!supported(e).includes(c)?'Remove unsupported '+c+' permission':'Reconnect '+c)];
 if(!e.channels.length)issues.push('Enable a supported channel permission');
 if(e.paused)issues.unshift('Resume employee to allow actions');
 const usable=!e.paused&&!commonIssues(s,e).length?valid:[];
 const health:Health=e.paused||!usable.length?'Paused':issues.length?'Action required':'Healthy';
 return {health,issues,usable,failed};
}
export function onboardingComplete(s:State){return s.connected&&s.scan>=9&&s.employees.some(e=>e.status==='Active'&&e.configured&&prerequisites(s,e).length===0)}
export function recommendation(s:State){
 const eligible=s.employees.filter(e=>e.status!=='Active'&&prerequisites(s,e).length===0);
 const id=['maya','emma','leo','alex'].find(id=>eligible.some(e=>e.id===id));
 const employee=eligible.find(e=>e.id===id);
 const reason=employee?.id==='maya'?`${s.activeProducts} active products across 8 sample collections, approved product knowledge and an available storefront widget make product discovery a practical place to start.`:employee?.id==='emma'?'Checkout data, a recovery channel and a reviewed consent source are available. Cart Recovery can help with eligible unfinished checkouts.':employee?.id==='leo'?'Order data, a communication surface and approved delivery information are available for post-purchase questions.':employee?'A support surface and approved store information are available. Customer Support can answer basic questions even without products.':'';
 return {employee,reason};
}
export type Action='Answer a question'|'Recommend a product'|'Send recovery message'|'Look up an order'|'Exceptional discount'|'Discretionary refund';
export function authorize(s:State,e:Employee,c:Channel,action:Action,approved=false){
 if(e.status!=='Active')return {allowed:false,message:'Not active — explicitly activate this employee first.'};
 if(!runtime(s,e).usable.includes(c))return {allowed:false,message:'Action stopped. '+(runtime(s,e).issues.join('. ')||'Enable this channel permission.')};
 const roles:Record<Action,string[]>= {'Answer a question':['maya','leo','alex'],'Recommend a product':['maya'],'Send recovery message':['emma'],'Look up an order':['leo'],'Exceptional discount':['emma'],'Discretionary refund':['leo','alex']};
 if(!roles[action].includes(e.id))return {allowed:false,message:'This action is not permitted for this employee role.'};
 if(action==='Send recovery message'&&(!e.settings.timing||e.settings.recipientEligible!=='yes'))return {allowed:false,message:'Not configured / required before action: recovery timing and verified recipient eligibility.'};
 if(action==='Exceptional discount'||action==='Discretionary refund'){
  const limit=e.settings[action==='Exceptional discount'?'discountCap':'refundLimit'];
  if(!limit||!e.settings.policySource)return {allowed:false,message:'Not configured / required before action: explicit limit and policy source.'};
  // No exception executor exists in the prototype. A numeric cap alone is never authorization.
  return {allowed:false,message:e.mode==='guided'&&!approved?'Human approval required. No action executed.':'Policy eligibility and an authorized tool are required. Preview only; no financial action executed.'};
 }
 return {allowed:true,message:'Allowed in this local simulation. No customer message or external action is sent.'};
}
export function hydrate(saved:State):State{const s={...saved,activeProducts:saved.activeProducts??342,data:Object.assign({carts:true,orders:true,consentSource:''},saved.data),billing:Object.assign({name:'Placeholder — replace with production pricing',price:'Not configured',employees:'Not configured',conversations:'Not configured'},saved.billing)};s.employees=s.employees.map(e=>({...e,paused:e.paused??false,settings:e.settings??{}}));return s}
