
export function getParsedDate(date: Date){
    if (date == null) return;

    if (typeof date == 'string') date = new Date(date);
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    
    const day = dd < 10 ? '0' + dd : String(dd);
    const month = mm < 10 ? '0' + mm : String(mm);
    return `${day}/${month}/${yyyy}`;
}
