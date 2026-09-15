import {prerequisites,runtime,supported} from './rules';
import { useState, type ReactNode } from 'react';
import { Check, ArrowRight, MessageCircle, ShoppingBag, Mail, Instagram, Phone, ShieldCheck } from 'lucide-react';
import { blockers, type State, type Employee, type Channel } from './model';
export function Card({ title, description, children, id }: {
    title: string;
    description?: string;
    children: ReactNode;
    id?: string;
}) { return <section className="gd-card" id={id}><h2>{title}</h2>{description && <p className="muted">{description}</p>}{children}</section>; }
export function Badge({ children }: {
    children: ReactNode;
}) { return <span className={'gd-badge ' + (children === 'Active' || children === 'Ready' || children === 'Complete'||String(children).includes('Healthy') ? 'good' : children === 'Missing' || children === 'Warning' || children === 'Needs review'||String(children).includes('Action required')||String(children).includes('Paused') ? 'warn' : '')}>{children}</span>; }
export function ChannelIcon({ channel }: {
    channel: Channel;
}) { const Icon = channel === 'Email' ? Mail : channel === 'Instagram' ? Instagram : channel === 'WhatsApp' ? Phone : MessageCircle; return <span className="channel"><Icon size={15}/>{channel}</span>; }
export function StorePreparationCard({ s, retry }: {
    s: State;
    retry: () => void;
}) { let rows = ['Shopify connected', '342 products found', '8 collections found', 'Shipping policy found', 'Returns policy needs review', 'Exchange policy missing', 'Store theme detected', 'Brand colours detected', 'Analysing where GoPrimy can help most']; if (s.scenario === 'Empty catalogue')
    rows[1] = 'No products found'; if (s.scenario === 'Missing policies') {
    rows[3] = 'Shipping policy missing';
    rows[4] = 'Returns policy missing';
    rows[5] = 'Exchange policy missing';
} return <Card title="Learning your store" description="Results appear as we scan. You can start setting up your employee while we work."><progress max={9} value={s.scan}/><p className="scan-summary">{s.scan>=9?"Store scan complete":`${s.scan} of 9 checks complete`}</p><details className="scan-details" open={s.running||undefined}><summary>{s.running?"Live scan findings":"View scan findings"}</summary><ul className="scan-list">{rows.map((r, i) => <li key={r}><span>{s.scan > i ? <Check size={16}/> : <span className="scan-dot"/>}{s.scan > i || i < 3 ? r : i === 4 || i === 5 ? 'Analysing store policies' : r}</span><Badge>{s.scan <= i ? 'Analysing' : (i === 4 || i === 5 || i === 3 && s.scenario === 'Missing policies') ? 'Warning' : i === 1 && s.scenario === 'Empty catalogue' ? 'Action required' : 'Complete'}</Badge></li>)}</ul></details>{s.scenario === 'API failure' && s.scan === 3 && <div className="gd-warning">Shopify is temporarily unavailable. Your products are saved. <button onClick={retry}>Retry sync</button></div>}{s.scenario === 'Empty catalogue' && <div className="gd-warning">Product discovery needs at least one product. Your other setup is saved. <button onClick={retry}>Simulate products added &amp; rescan</button></div>}{s.scenario === 'Slow sync' && <p className="muted">This store is taking longer to scan. Continue setup below.</p>}</Card>; }
export function EmployeeSelector({ s, select }: {
    s: State;
    select: (id: string) => void;
}) { return <div className="employee-grid">{s.employees.map(e => <Card key={e.id} title={e.name} description={e.role}><span className="avatar">{e.name[0]}</span><p>{e.description}</p><div className="channels">{e.channels.length ? e.channels.map(c => <ChannelIcon key={c} channel={c}/>) : <span className="muted">Choose channels during setup</span>}</div><div className="employee-readiness">{e.status==='Draft'&&<p>{prerequisites(s,e)[0]}</p>}<span>{e.status==="Active"?(runtime(s,e).issues.join(" · ")||"Live on connected channels"):e.status==="Ready to activate"?"Preview tested. Ready for your approval.":e.configured?"Setup saved. Test a conversation next.":"Not live yet. Review setup to get started."}</span></div><div className="card-bottom"><Badge>{e.status==='Active'?'Active · '+runtime(s,e).health:e.status}</Badge><button onClick={() => select(e.id)}>{e.status === 'Active' ? 'Manage' : e.status === 'Ready to activate' ? 'Review & activate' : e.status==='Draft'?'View prerequisites':'Set up'} <ArrowRight size={14}/></button></div></Card>)}</div>; }
export function SetupChecklist({ s, e, go }: {
    s: State;
    e: Employee;
    go: (n: number) => void;
}) { let steps = [['Connect Shopify', s.connected], ['Sync store data', s.scan >= 3], ['Choose ' + e.role, true], ['Review store knowledge', e.reviewed], ['Complete quick setup', e.configured], ['Preview AI Employee', e.previewed], ['Activate', e.status === 'Active']] as const; return <><strong>{steps.filter(x => x[1]).length} of 7 completed</strong><ol className="checklist">{steps.map(([label, done], i) => <li key={label}><span className={done ? 'check done' : 'check'}>{done ? <Check size={12}/> : i + 1}</span><span>{label}</span>{!done && i >= 3 && <button disabled={i === 3 && s.scan < 9} onClick={() => go(i === 3 ? 0 : i === 4 ? 1 : i === 5 ? 2 : 3)}>{i === 3 && s.scan < 9 ? 'Analysing…' : 'Open'}</button>}</li>)}</ol></>; }
export function StoreReadinessCard({ s, e, knowledge }: {
    s: State;
    e: Employee;
    knowledge: () => void;
}) { return <Card title="Readiness" description="Missing knowledge is a warning. Your employee will escalate questions it cannot verify."><ul className="scan-list">{[['Store connected', s.connected ? 'Ready' : 'Action required'], ['Products synced', s.scan < 3 ? 'Analysing' : s.scenario === 'Empty catalogue' ? 'Action required' : '342 products'], ['Store knowledge', s.scan < 9 ? 'Analysing' : Object.values(s.knowledge).filter(k => k.status !== 'Ready').length + ' items need attention'], ['Storefront widget', s.widget ? 'Ready' : 'Action required']].map(([a, b]) => <li key={a}>{a}<Badge>{b}</Badge></li>)}</ul>{!s.widget && e.id === 'maya' && <p className="gd-warning">The storefront widget is unavailable. Enable it before activation.</p>}<button disabled={s.scan < 9} onClick={knowledge}>{s.scan < 9 ? 'Still analysing your store…' : 'Review store knowledge'}</button></Card>; }
export function KnowledgeReviewState({ s, save }: {
    s: State;
    save: (key: string, text: string) => void;
}) { let [editing, setEditing] = useState(''); let [text, setText] = useState(''); return <div className="knowledge-list">{Object.entries(s.knowledge).map(([key, k]) => <Card key={key} title={key}><Badge>{s.scan < 9 ? 'Analysing' : k.status}</Badge>{s.scan >= 9 && <><p>{k.text || 'No verified information found. Add a source or let the employee escalate these questions.'}</p>{editing === key ? <><textarea aria-label={'Edit ' + key} value={text} onChange={e => setText(e.target.value)}/><button className="primary" disabled={!text.trim()} onClick={() => { save(key, text); setEditing(''); }}>Approve and save</button> <button onClick={() => setEditing('')}>Cancel</button></> : <button onClick={() => { setEditing(key); setText(k.text); }}>{k.text ? 'Review / edit' : 'Add information'}</button>}</>}</Card>)}</div>; }
function contrast(hex: string) { const c = hex.slice(1).match(/../g)!.map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2] > .179 ? '#000' : '#fff'; }
export function QuickSetupCard({ s, e, patch, update, save }: {
    s: State;
    e: Employee;
    patch: (p: Partial<State>) => void;
    update: (p: Partial<Employee>) => void;
    save: () => void;
}) { const contrast = (hex: string) => { let c = hex.slice(1).match(/../g)!.map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2] > .179 ? '#000' : '#fff'; }; if (e.id !== 'maya')
    return <Card title="Employee setup" description={e.description}><label>Display name<input value={e.name} onChange={x => update({ name: x.target.value })}/></label><p>Uses approved store knowledge. Questions without a verified answer go to your team.</p><p>Choose connected channels alongside this card, then test the conversation before activation.</p><button className="primary" disabled={!e.name.trim()} onClick={save}>Save and preview</button></Card>; return <Card title="Storefront experience" description="Start with sensible defaults. Make this feel like your store."><label>Display name<input value={e.name} onChange={x => update({ name: x.target.value })}/></label><label className="switch"><input type="checkbox" checked={s.discovery} onChange={x => patch({ discovery: x.target.checked })}/>Discovery experience</label><label>Discovery message<input value={s.welcome} onChange={x => patch({ welcome: x.target.value })}/></label><label>Discovery intents (comma separated)<input value={s.intents.join(',')} onChange={x => patch({ intents: x.target.value.split(',') })}/></label><label className="switch"><input type="checkbox" checked={s.productHelp} onChange={x => patch({ productHelp: x.target.checked })}/>Product Help</label><label>Product help message<input value={s.productMessage} onChange={x => patch({ productMessage: x.target.value })}/></label><p className="muted">Product quick actions — choose which shortcuts shoppers see.</p>{["Product details","Delivery","Returns","Similar products"].map(action=><label className="switch" key={action}><input type="checkbox" checked={s.productActions.includes(action)} onChange={x=>patch({productActions:x.target.checked?[...s.productActions,action]:s.productActions.filter(a=>a!==action)})}/>{action}</label>)}<label className="switch"><input type="checkbox" checked={s.proactive} onChange={x => patch({ proactive: x.target.checked })}/>Proactive engagement</label><p className="muted">When off, chat stays available and your Discovery and Product Help settings are retained.</p><div className="gd-two"><label>Brand colour<input type="color" value={s.color} onChange={x => patch({ color: x.target.value })}/></label><label>Store logo<input type="file" accept="image/*" onChange={x => { let f = x.target.files?.[0]; if (f && f.size < 2000000) {
    let r = new FileReader();
    r.onload = () => patch({ logo: String(r.result) });
    r.readAsDataURL(f);
} }}/></label></div><p className="muted">Logo up to 2 MB. Accessible button text is derived automatically.</p><span style={{ background: s.color, color: contrast(s.color), padding: '8px 16px', borderRadius: 8 }}>Button preview</span><p className="muted">GoPrimy automatically decides where to show the right experience based on page context.</p><button className="primary" disabled={!e.name.trim() || !s.welcome.trim() || !s.productMessage.trim()} onClick={save}>Save and preview <ArrowRight size={16}/></button></Card>; }
export function StorefrontPreview({s,test}:{s:State;test:()=>void}) {
    const [tab,setTab]=useState('Home');
    const [open,setOpen]=useState(false);
    const [messages,setMessages]=useState<string[]>([]);
    const [question,setQuestion]=useState('');
    const [recommend,setRecommend]=useState(false);
    const [product,setProduct]=useState('Kanchipuram Silk Saree · £89');
    const actions=tab==='Product'?(s.productHelp?s.productActions:[]):(s.discovery?s.intents.filter(Boolean):[]);
    function ask(q:string) {
        test();setOpen(true);
        let answer:string;
        if(/return|exchange/i.test(q)) {
            const policy=s.knowledge['Returns & Refunds'];
            answer=s.scan>=9&&policy.status==='Ready'?policy.text:'I can’t confirm the return conditions from the verified policy yet. I’ll flag this for the store team.';
        } else if(/delivery|shipping/i.test(q)) {
            const policy=s.knowledge['Shipping & Delivery'];
            answer=s.scan>=9&&policy.status==='Ready'?policy.text+' Is this delivery within the UK?':'The delivery policy needs the store’s review. I’ll ask the team to confirm rather than guess.';
        } else if(/^wedding$/i.test(q)) answer='Lovely. Are you shopping for the bride or attending as a guest?';
        else if(/^festive$/i.test(q)) answer='Something for a celebration — would you like a traditional silk or a lighter saree?';
        else if(/^gift$/i.test(q)) answer='I can help with that. What budget would you like to stay within?';
        else if(/^everyday$/i.test(q)) answer='Let’s find something comfortable. Do you prefer cotton or a lightweight silk?';
        else if(/product details/i.test(q)) answer='You’re viewing '+product+'. What occasion are you shopping for?';
        else {answer='Here are two options from the sample catalog. The Kanchipuram Silk Saree is a dressier choice; the Everyday Cotton Saree is lighter. You can open either to take a closer look.';setRecommend(true);}
        setMessages(m=>[...m,'You: '+q,'AI: '+answer]);
    }
    return <Card title="Storefront Preview" description="Preview only — no messages are sent and this does not activate your AI Employee.">
        <div className="gd-tabs">{['Home','Product'].map(t=><button aria-pressed={tab===t} key={t} onClick={()=>setTab(t)}>{t}</button>)}</div>
        <div className="store-preview">
            <div className="store-brand">{s.logo&&<img src={s.logo} alt="Store logo"/>}RANG</div>
            <h3>{tab==='Product'?product.split(' · ')[0]:'Made for your special moments.'}</h3>
            <div className="product-sample"><ShoppingBag size={52}/><div><strong>{product.split(" · ")[0]}</strong><p>Sample catalog · {product.split(" · ")[1]}</p></div></div>
            {!open&&s.proactive&&actions.length>0&&<div className="invitation"><p>{tab==='Product'?s.productMessage:s.welcome}</p><div className="chips">{actions.map(a=><button key={a} onClick={()=>ask(a)}>{a}</button>)}</div></div>}
            {open&&<div className="preview-chat"><div className="row"><strong>{s.employees.find(e=>e.id===s.selected)?.name} · AI assistant</strong><button aria-label="Close preview chat" onClick={()=>setOpen(false)}>×</button></div>
                <small>{tab==='Product'?'Helping with '+product.split(' · ')[0]:'Shopping across the store'}</small>
                {!messages.length&&<p>{tab==='Product'?s.productMessage:s.welcome}</p>}
                {messages.map((m,i)=><p className={m.startsWith('You:')?'user-message':'ai-message'} key={i}>{m}</p>)}
                <div className="chips">{actions.map(a=><button key={a} onClick={()=>ask(a)}>{a}</button>)}</div>
                {recommend&&['Kanchipuram Silk Saree · £89','Everyday Cotton Saree · £45'].map(product=><div className="recommendation" key={product}><ShoppingBag/><span>{product}<small>Sample recommendation</small></span><button onClick={()=>{setProduct(product);setTab('Product')}}>View product</button></div>)}
                <form onSubmit={x=>{x.preventDefault();if(question.trim()){ask(question);setQuestion('')}}}><input aria-label="Preview question" value={question} onChange={x=>setQuestion(x.target.value)} placeholder="Ask a shopping question…"/><button disabled={!question.trim()}>Send</button></form>
            </div>}
            <button className="preview-launcher" style={{background:s.color,color:contrast(s.color)}} aria-label="Open shopping assistant" onClick={()=>setOpen(!open)}>{s.logo?<img src={s.logo} alt="Store logo" style={{width:28,height:28,objectFit:'contain'}}/>:<MessageCircle size={20}/>}</button>
        </div>
    </Card>;
}
export function LaunchModeSelector({ s, e, update, launch }: {
    s: State;
    e: Employee;
    update: (p: Partial<Employee>) => void;
    launch: () => void;
}) { let issues = blockers(s, e); return <Card title="Choose how to launch" description="Activation is explicit. Provisioning an employee never turns it on.">{(['guided', 'full'] as const).map(mode => <label className="launch-option" key={mode}><input type="radio" name="launch" checked={e.mode === mode} onChange={() => update({ mode })}/><div><strong>{mode === 'guided' ? 'Guided · Recommended' : 'Full'}</strong><p>{mode === 'guided' ? 'Low-risk answers can run automatically. Financial or policy exceptions require human approval and configured authorization.' : 'Only permitted actions run automatically within explicit policies, consent and platform limits.'}</p></div></label>)}<div className="gd-notice"><ShieldCheck size={20}/>You can inspect conversations and stop AI replies in your inbox.</div>{issues.length > 0 ? <div className="gd-warning"><strong>Before activation</strong><ul>{issues.map(i => <li key={i}>{i}</li>)}</ul></div> : <p className="good-text">Ready to activate. Missing policy details will be escalated.</p>}<button className="primary" disabled={issues.length > 0 || e.status === 'Active'} onClick={launch}>{e.status === 'Active' ? 'Employee is active' : 'Activate ' + e.role}</button></Card>; }
export function ChannelPermissions({ s, e, toggle, connect }: {
    s: State;
    e: Employee;
    toggle: (c: Channel) => void;
    connect: (c: Channel) => void;
}) { return <Card title={'Channels for ' + e.name} description="Connections belong to the workspace. Permissions belong to each employee.">{supported(e).map(c => <div className="setting-row" key={c}><ChannelIcon channel={c}/>{s.integrations[c] ? <label className="switch">Connected<input aria-label={'Enable ' + c + ' for ' + e.name} type="checkbox" checked={e.channels.includes(c)} onChange={() => toggle(c)}/></label> : <button onClick={() => connect(c)}>Connect {c}</button>}</div>)}</Card>; }
