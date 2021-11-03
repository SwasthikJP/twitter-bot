
function caps(strg,cond){
    if(cond){
      return strg.toUpperCase();
    }else{
      return strg;
    }
  }

exports.apiparams=function (id,textar,caplist){
    textar.shift();
   textar=textar.map((ele,index) => caps(ele,caplist[index]) );
    var obj={
      status:true,
      id:id,
      textar
    };
      // obj[`text`+index]=ele||"";
    console.log(obj);
  return obj;
  }