export const getAccessToken = () => {
    return sessionStorage.getItem('acessToken');
}
export const addElipsis=(str , limit)=>{
    return str.length?str.substring(0 , limit)+'...':str;
};
export const getType=(value , body)=>{
    if(value.params){
        return {params:body}
    }
    else if(value.query){
        if(typeof body==='object'){
            return {query:body._id}
        }
        else{
            return {query:body}
        }
    }
    return {};

}