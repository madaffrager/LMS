export const formatPrice = (price:number)=>{
    return new Intl.NumberFormat('fr-fr',{
        style:"currency",
        currency:'MAD'
    }).format(price)
}