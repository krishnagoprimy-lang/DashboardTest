export type ShoppingContext={anonymous:boolean;product:string|null;views:number|null;recent:string[];cart:number|null;activity:string;recommendation:string|null;intent:string;source:string};
export const customerContext:Record<string,ShoppingContext>={
 olivia:{anonymous:false,product:'Kanchipuram Silk Saree',views:3,recent:['Forest Silk Saree'],cart:89,activity:'Now',recommendation:'Kanchipuram Silk Saree · £89',intent:'Wedding guest',source:'Instagram'},
 ava:{anonymous:false,product:null,views:null,recent:[],cart:null,activity:'Earlier today',recommendation:null,intent:'Exchange policy',source:'Direct'},
 ethan:{anonymous:false,product:'Forest Silk Saree',views:1,recent:[],cart:110,activity:'12 hours ago',recommendation:null,intent:'Silk sarees',source:'Instagram'},
 'visitor-060x':{anonymous:true,product:null,views:null,recent:[],cart:null,activity:'Now',recommendation:null,intent:'Not enough activity',source:'Unknown'}
};
