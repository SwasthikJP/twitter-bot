
function converttoCaps(strg,cond){
    if(cond){
      return strg.toUpperCase();
    }else{
      return strg;
    }
  }

module.exports=function (id,textar,caplist){
    textar.shift();
   textar=textar.map((ele,index) => converttoCaps(ele,caplist[index]) );
    var obj={
      status:true,
      id,
      textar
    };
      // obj[`text`+index]=ele||"";
    console.log(obj);
  return obj;
  }