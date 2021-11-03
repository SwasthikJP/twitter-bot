const {apiparams}=require("./apiparams.js");
const {memes}=require("../memes")

exports.sorttweet= function (tweet){
    console.log("hehe text" +tweet.text)
     const textar=tweet.text.split("-");
     // var st="@swasthikjp @respond -confuse,hello how you,iam fine";
 //   console.log(textar[2].slice(1,-1));
   const textar2=textar[1].split(",");
 console.log(textar2)
 
 // console.log(textar2.pop().slice(1,-1))
     if(textar.length>=2){
 
       var memeobj=memes.find(ele=>ele.cmd===textar2[0].trim());
      if(memeobj){
        return apiparams(memeobj.id,textar2,memeobj.caplist)
      }else{
        return {status:false,id:0,textar:[""]};
      }
     }
     return  {status:false,id:0,textar:[""]};
   }