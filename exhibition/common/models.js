module.exports = {
    user:{
        name: String,
        password:String,
        email: String,
        admin:{
            type:Boolean,default:false
        }
    },
    commodity:{
        name:String,
        price:Number,
        imgSrc:String,
        sumNum:Number,
        usedNum:Number,
        existNum:Number,
        address:String,
        phone:Number,
        type:String,
        detail:String,
        status : {
            type: Boolean, default: true
        }
    },
    cart:{
        uId:String,
        uName:String,
        uPhone:Number,
        uMsg:String,
        cId:String,
        cName:String,
        cPrice:Number,
        cImgSrc:String ,
        cQuantity:Number,
        cSumbitTime:Date,
        cUseTime:Date,
        cStatus : { type: Boolean, default: false  }
    }
};