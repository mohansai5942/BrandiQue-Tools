// Activate the custom domain only AFTER its DNS and HTTPS are working.
export const previousOrigin='https://brandique-toolss.saimohan5542.workers.dev';
export const futureOrigin='https://tools.brandique.in';
export function siteOrigin(value=process.env.SITE_URL||previousOrigin){
 const url=new URL(value);
 if(![previousOrigin,futureOrigin].includes(url.origin)||url.pathname!=='/'||url.search||url.hash||url.username||url.password)throw Error('SITE_URL must be the current Workers origin or https://tools.brandique.in');
 return url.origin;
}
