import {prerequisites,setupBlockers,hydrate} from './rules';
export type Lifecycle = 'Draft' | 'Needs setup' | 'Ready to activate' | 'Active';
export type Channel = 'Store chat' | 'Email' | 'WhatsApp' | 'Instagram';
export type Scenario = 'Normal' | 'OAuth error' | 'Empty catalogue' | 'Missing policies' | 'Slow sync' | 'API failure' | 'Widget blocker';
export type Employee = {
    id: string;
    name: string;
    role: string;
    description: string;
    status: Lifecycle;
    channels: Channel[];
    mode: 'guided' | 'full';
    step: number;
    reviewed: boolean;
    configured: boolean;
    paused: boolean;
    settings: Record<string,string>;
    previewed: boolean;
};
export type Event = {
    name: string;
    time: string;
    properties: Record<string, unknown>;
};
export type State = {
    version: 1;
    auth: boolean;
    store: string;
    connected: boolean;
    scan: number;
    running: boolean;
    scenario: Scenario;
    page: string;
    selected: string;
    employees: Employee[];
    integrations: Record<Channel, boolean>;
    knowledge: Record<string, {
        status: 'Ready' | 'Needs review' | 'Missing';
        text: string;
    }>;
    discovery: boolean;
    productHelp: boolean;
    proactive: boolean;
    welcome: string;
    productMessage: string;
    intents: string[];
    color: string;
    logo: string;
    events: Event[];
    activity: boolean;
    drafts: Record<string, string>;
    readConversations: Record<string, boolean>;
    internalNotes: Record<string, string[]>;
    replyStopped: Record<string, boolean>;
    assigned: Record<string, boolean>;
    replies: Record<string, string[]>;
    notes: Record<string, string>;
    questions: number;
    firstPreview: string | null;
    productActions: string[];
    widget: boolean;
    activeProducts:number;
    data:{carts:boolean;orders:boolean;consentSource:string};
    billing:{name:string;price:string;employees:string;conversations:string};
};
export const roles = [['maya', 'Maya', 'Storefront Sales Employee', 'Helps shoppers discover products, compare options and make buying decisions.'], ['emma', 'Emma', 'Cart Recovery Employee', 'Brings back shoppers who left items in their cart.'], ['leo', 'Leo', 'Order Care Employee', 'Helps customers track orders and understand delivery updates.'], ['alex', 'Alex', 'Customer Support Employee', 'Answers customer questions and escalates requests that need your team.']];
export const channels: Channel[] = ['Store chat', 'Email', 'WhatsApp', 'Instagram'];
export function initial(): State { return { version: 1, auth: false, store: '', connected: false, scan: 0, running: false, scenario: 'Normal', page: 'Home', selected: 'maya', employees: roles.map(([id, name, role, description]) => ({ id, name, role, description, status: 'Draft', channels: id === 'maya' ? ['Store chat'] : [], mode: 'guided', step: 0, reviewed: false, paused:false,settings:{}, configured: false, previewed: false })), integrations: { 'Store chat': false, Email: false, WhatsApp: false, Instagram: false }, knowledge: { 'Shipping & Delivery': { status: 'Ready', text: 'Sample policy: UK delivery in 3–5 working days.' }, 'Returns & Refunds': { status: 'Needs review', text: 'Sample policy mentions returns but does not specify the return window.' }, Exchanges: { status: 'Missing', text: '' }, Products: { status: 'Ready', text: '342 sample products across 8 collections.' }, 'Store Information': { status: 'Ready', text: 'Rang — sarees for everyday moments and celebrations.' }, FAQs: { status: 'Missing', text: '' } }, discovery: true, productHelp: true, proactive: true, welcome: 'Need help finding the perfect saree?', productMessage: 'Have a question about this saree?', productActions: ['Product details','Delivery','Returns','Similar products'], intents: ['Wedding', 'Festive', 'Everyday', 'Gift'], color: '#682539', logo: '', events: [], activity: false, drafts: {}, readConversations: {}, internalNotes: {}, replyStopped: {}, assigned: {}, replies: {}, notes: {}, questions: 0, firstPreview: null, widget: true, activeProducts:342,data:{carts:true,orders:true,consentSource:''},billing:{name:'Placeholder — replace with production pricing',price:'Not configured',employees:'Not configured',conversations:'Not configured'} }; }
export function event(s: State, name: string, properties: Record<string, unknown> = {}): State { return { ...s, events: [...s.events, { name, time: new Date().toISOString(), properties }] }; }
export const blockers=setupBlockers;
export function activate(s: State, id: string): State { const e = s.employees.find(x => x.id === id)!; if (blockers(s, e).length)
    return s; return event({ ...s, page: 'Home', employees: s.employees.map(x => x.id === id ? { ...x, status: 'Active' } : x) }, 'assistant_activated', { employee_id: id, launch_mode: e.mode }); }
export const people = [{ id: 'visitor-060x', name: 'Visitor · 060x', email: '', phone: 'Not provided', channel: 'Store chat', question: 'Can someone help me choose?', unread: false, attention: true, orders: 0, spend: 0, interest: 'Not enough activity', source: 'Unknown', cart: 0 }, { id: 'olivia', name: 'Olivia Martin', email: 'olivia@example.com', phone: 'Not provided', channel: 'Store chat', question: 'Is this saree suitable for a wedding?', unread: true, attention: false, orders: 2, spend: 178, interest: 'Wedding guest', source: 'Instagram', cart: 89 }, { id: 'ava', name: 'Ava Patel', email: 'ava@example.com', phone: 'Not provided', channel: 'Email', question: 'Can I exchange this after wearing it?', unread: false, attention: true, orders: 1, spend: 65, interest: 'Exchange policy', source: 'Direct', cart: 0 }, { id: 'ethan', name: 'Ethan Chen', email: 'ethan@example.com', phone: 'Not provided', channel: 'Instagram', question: 'Does the forest saree come in blue?', unread: false, attention: false, orders: 0, spend: 0, interest: 'Silk sarees', source: 'Instagram', cart: 110 }];
export function reconcile(input:State):State{const s=hydrate(input);return {...s,employees:s.employees.map(e=>({...e,status:e.status==='Active'?'Active':prerequisites(s,e).length?'Draft':setupBlockers(s,e).length?'Needs setup':'Ready to activate'}))}}
