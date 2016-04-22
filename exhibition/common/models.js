module.exports = {
    user:{
        name:{
            type:String,required:true
        },
        password:{
            type:String,required:true
        },
        email:{
            type:String,required:true
        },
        admin:{
            type:Boolean,default:false
        }
    },
    commodity:{
        name:String,
        address:String,
        imgSrc:String,
        detail:String,
        status : { type: Boolean, default: true  }
    },
    cart:{
        uId:{type:String},
        cId:{type:String},
        cName:{type:String},
        cPrice: { type: String },
        cImgSrc: { type:String } ,
        cQuantity: { type: Number },
        cStatus : { type: Boolean, default: false  }
    }
};